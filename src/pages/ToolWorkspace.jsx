import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Button, Input, Slider, Select, Card, Space, Progress,
  Row, Col, message, Spin, Divider, Tabs, Tooltip, Image, Collapse,
  Tag, Alert, Badge,
} from 'antd';
import {
  ArrowLeftOutlined, DownloadOutlined, ReloadOutlined,
  ThunderboltOutlined, ShareAltOutlined, HeartOutlined,
  SendOutlined, RobotOutlined, UserOutlined,
  SafetyCertificateOutlined, BulbOutlined, WarningOutlined,
  CheckCircleOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { getToolById } from '../tools/registry';
import { interiorStyles } from '../tools/categories';
import ImageUploader from '../components/ImageUploader';
import StyleSelector from '../components/StyleSelector';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { generateImage, modifyImage, chatWithAgent } from '../services/mockAI';
import useAppStore from '../stores/useAppStore';
import './ToolWorkspace.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const elderAgeOptions = [
  { value: '60-70岁', label: '60-70岁（活力老人）' },
  { value: '70-80岁', label: '70-80岁（轻度照护）' },
  { value: '80-90岁', label: '80-90岁（中度照护）' },
  { value: '90岁以上', label: '90岁以上（重度照护）' },
];

const mobilityOptions = [
  { value: '独立行走', label: '独立行走', icon: '🚶' },
  { value: '可扶行', label: '可扶行', icon: '🦯' },
  { value: '轮椅辅助', label: '轮椅辅助', icon: '♿' },
  { value: '卧床', label: '卧床', icon: '🛏️' },
];

const healthConditions = [
  { value: '高血压', label: '高血压' },
  { value: '糖尿病', label: '糖尿病' },
  { value: '心脏病', label: '心脏病' },
  { value: '关节炎', label: '关节炎' },
  { value: '骨质疏松', label: '骨质疏松' },
  { value: '视力障碍', label: '视力障碍' },
  { value: '听力障碍', label: '听力障碍' },
  { value: '认知障碍', label: '认知障碍' },
];

const aiSuggestions = [
  { icon: <WarningOutlined />, type: 'warning', title: '安全隐患', content: '检测到卫生间地面湿滑风险，建议安装防滑地砖和排水系统。' },
  { icon: <SafetyCertificateOutlined />, type: 'success', title: '改造建议', content: '建议在马桶旁安装L型安全扶手，高度距地面70-80cm为宜。' },
  { icon: <BulbOutlined />, type: 'info', title: '照明优化', content: '走廊建议安装感应夜灯，色温选择3000K暖光，避免眩光刺激。' },
  { icon: <CheckCircleOutlined />, type: 'success', title: '通行安全', content: '门宽建议扩至90cm以上，确保轮椅通行无障碍。' },
];

export default function ToolWorkspace() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = getToolById(toolId);
  const addHistory = useAppStore((s) => s.addHistory);

  const [image, setImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [style, setStyle] = useState('warm-wood');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [strength, setStrength] = useState(0.7);
  const [renderMode, setRenderMode] = useState('精细模型');
  const [colorMode, setColorMode] = useState('2D彩平');
  const [scale, setScale] = useState(2);
  const [lightMode, setLightMode] = useState('感应夜灯');
  const [viewAngle, setViewAngle] = useState('正面');
  const [elderAge, setElderAge] = useState('70-80岁');
  const [mobility, setMobility] = useState('可扶行');
  const [detectType, setDetectType] = useState('全部');
  const [renovateScope, setRenovateScope] = useState('全屋');
  const [bathType, setBathType] = useState('坐式淋浴');
  const [floorMaterial, setFloorMaterial] = useState('防滑木地板');
  const [railLocation, setRailLocation] = useState('走廊+卫浴');
  const [smartType, setSmartType] = useState('语音控制');
  const [healthConditions2, setHealthConditions2] = useState([]);
  const [budget, setBudget] = useState('中等');

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [result, setResult] = useState(null);
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Agent chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatStreaming, setChatStreaming] = useState('');

  const progressTexts = [
    '正在分析空间结构...',
    '识别适老化风险点...',
    '生成改造方案...',
    '渲染效果图...',
    '优化细节...',
    '完成生成！',
  ];

  const handleGenerate = useCallback(async () => {
    if (!tool) return;
    if (tool.params?.includes('image') && !image) {
      message.warning('请先上传图片');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setResult(null);
    setShowSuggestions(false);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 15;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const textIndex = Math.floor(next / 20);
        setProgressText(progressTexts[textIndex] || progressTexts[0]);
        return next;
      });
    }, 400);

    try {
      const params = {
        style, prompt, negativePrompt, strength, renderMode, colorMode, scale, lightMode, viewAngle,
        elderAge, mobility, detectType, renovateScope, bathType, floorMaterial, railLocation, smartType,
        healthConditions: healthConditions2, budget,
      };
      const gen = tool.type === 'modify'
        ? await modifyImage({ toolId: tool.id, params, onProgress: () => {} })
        : await generateImage({ toolId: tool.id, params, onProgress: () => {} });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText('完成生成！');

      setTimeout(() => {
        setResult(gen);
        setResults((prev) => [gen, ...prev]);
        addHistory(gen);
        setShowSuggestions(true);
        message.success('生成完成！');
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      message.error('生成失败，请重试');
    } finally {
      setTimeout(() => {
        setGenerating(false);
        setProgress(0);
        setProgressText('');
      }, 500);
    }
  }, [tool, image, style, prompt, negativePrompt, strength, renderMode, colorMode, scale, lightMode, viewAngle, elderAge, mobility, detectType, renovateScope, bathType, floorMaterial, railLocation, smartType, healthConditions2, budget, addHistory]);

  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatStreaming('');

    try {
      const resp = await chatWithAgent({
        messages: [...chatMessages, userMsg],
        onChunk: setChatStreaming,
      });
      setChatMessages((prev) => [...prev, resp]);
      setResult(resp);
      setChatStreaming('');
    } catch {
      message.error('对话失败');
    }
  }, [chatInput, chatMessages]);

  if (!tool) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Text>工具不存在</Text></div>;
  }

  const isAgent = tool.isAgent;

  return (
    <div className="tool-workspace">
      {/* 顶栏 */}
      <div className="workspace-topbar">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tools')}>返回</Button>
        <Title level={4} style={{ margin: 0 }}>{tool.name}</Title>
        <Text type="secondary">{tool.desc}</Text>
      </div>

      <Row gutter={16}>
        {/* 左侧参数面板 */}
        <Col xs={24} md={8}>
          <Card className="params-panel">
            <Collapse
              defaultActiveKey={['basic', 'elderly']}
              bordered={false}
              items={[
                {
                  key: 'basic',
                  label: <Text strong>基础参数</Text>,
                  children: (
                    <>
                      {/* 图片上传 */}
                      {tool.params?.includes('image') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>上传图片</Text>
                          <ImageUploader value={image} onChange={setImage} style={{ marginTop: 8 }} />
                        </div>
                      )}

                      {/* 参考图上传 */}
                      {tool.params?.includes('referenceImage') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>参考图</Text>
                          <ImageUploader value={referenceImage} onChange={setReferenceImage} label="上传风格参考图" style={{ marginTop: 8 }} />
                        </div>
                      )}

                      {/* 风格选择 */}
                      {tool.params?.includes('style') && (
                        <StyleSelector value={style} onChange={setStyle} />
                      )}

                      {/* 目标风格（风格转换专用） */}
                      {tool.params?.includes('targetStyle') && (
                        <StyleSelector value={style} onChange={setStyle} />
                      )}

                      {/* 提示词 */}
                      {tool.params?.includes('prompt') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>提示词</Text>
                          <TextArea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="描述你想要的效果，如：现代简约客厅，大面积落地窗，暖色调..."
                            rows={3}
                            style={{ marginTop: 4 }}
                          />
                        </div>
                      )}

                      {/* 反向提示词 */}
                      {tool.params?.includes('negativePrompt') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>反向提示词</Text>
                          <TextArea
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="描述你不想出现的内容..."
                            rows={2}
                            style={{ marginTop: 4 }}
                          />
                        </div>
                      )}

                      {/* 强度滑块 */}
                      {tool.params?.includes('strength') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>风格强度: {strength}</Text>
                          <Slider min={0} max={1} step={0.05} value={strength} onChange={setStrength} />
                        </div>
                      )}

                      {/* 渲染模式 */}
                      {tool.params?.includes('renderMode') && tool.subTools && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>渲染模式</Text>
                          <Select value={renderMode} onChange={setRenderMode} style={{ width: '100%', marginTop: 4 }}>
                            {tool.subTools.map((m) => <Select.Option key={m} value={m}>{m}</Select.Option>)}
                          </Select>
                        </div>
                      )}

                      {/* 色彩模式 */}
                      {tool.params?.includes('colorMode') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>色彩模式</Text>
                          <Select value={colorMode} onChange={setColorMode} style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="2D彩平">2D彩平</Select.Option>
                            <Select.Option value="3D立体">3D立体</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 放大倍数 */}
                      {tool.params?.includes('scale') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>放大倍数: {scale}x</Text>
                          <Slider min={2} max={8} step={1} value={scale} onChange={setScale} />
                        </div>
                      )}

                      {/* 灯光模式 */}
                      {tool.params?.includes('lightMode') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>灯光模式</Text>
                          <Select value={lightMode} onChange={setLightMode} style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="暖光">暖光</Select.Option>
                            <Select.Option value="冷光">冷光</Select.Option>
                            <Select.Option value="自然光">自然光</Select.Option>
                            <Select.Option value="氛围灯">氛围灯</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 视角 */}
                      {tool.params?.includes('viewAngle') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>目标视角</Text>
                          <Select value={viewAngle} onChange={setViewAngle} style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="正面">正面</Select.Option>
                            <Select.Option value="侧面">侧面</Select.Option>
                            <Select.Option value="俯视">俯视</Select.Option>
                            <Select.Option value="45度角">45度角</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 材质选择 */}
                      {tool.params?.includes('material') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>目标材质</Text>
                          <Select mode="multiple" placeholder="选择材质" style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="wood">木纹</Select.Option>
                            <Select.Option value="marble">大理石</Select.Option>
                            <Select.Option value="concrete">混凝土</Select.Option>
                            <Select.Option value="metal">金属</Select.Option>
                            <Select.Option value="glass">玻璃</Select.Option>
                            <Select.Option value="fabric">布艺</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 家具选择 */}
                      {tool.params?.includes('furniture') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>家具类型</Text>
                          <Select mode="multiple" placeholder="选择家具" style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="sofa">沙发</Select.Option>
                            <Select.Option value="table">茶几</Select.Option>
                            <Select.Option value="bed">床</Select.Option>
                            <Select.Option value="cabinet">柜子</Select.Option>
                            <Select.Option value="chair">椅子</Select.Option>
                            <Select.Option value="lamp">灯具</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 房间类型 */}
                      {tool.params?.includes('roomType') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>房间类型</Text>
                          <Select style={{ width: '100%', marginTop: 4 }} defaultValue="living">
                            <Select.Option value="living">客厅</Select.Option>
                            <Select.Option value="bedroom">卧室</Select.Option>
                            <Select.Option value="kitchen">厨房</Select.Option>
                            <Select.Option value="bathroom">卫生间</Select.Option>
                            <Select.Option value="study">书房</Select.Option>
                            <Select.Option value="dining">餐厅</Select.Option>
                          </Select>
                        </div>
                      )}
                    </>
                  ),
                },
                {
                  key: 'elderly',
                  label: <Text strong><SafetyCertificateOutlined style={{ marginRight: 6, color: '#A0845C' }} />适老化专项</Text>,
                  children: (
                    <>
                      {/* 长者年龄 */}
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>长者年龄</Text>
                        <Select value={elderAge} onChange={setElderAge} style={{ width: '100%', marginTop: 4 }}>
                          {elderAgeOptions.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
                        </Select>
                      </div>

                      {/* 行动能力 */}
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>行动能力</Text>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                          {mobilityOptions.map((o) => (
                            <Tag
                              key={o.value}
                              color={mobility === o.value ? '#A0845C' : undefined}
                              style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: 16 }}
                              onClick={() => setMobility(o.value)}
                            >
                              {o.icon} {o.label}
                            </Tag>
                          ))}
                        </div>
                      </div>

                      {/* 健康状况 */}
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>健康状况</Text>
                        <Select
                          mode="multiple"
                          placeholder="选择长者健康状况"
                          value={healthConditions2}
                          onChange={setHealthConditions2}
                          style={{ width: '100%', marginTop: 4 }}
                        >
                          {healthConditions.map((o) => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
                        </Select>
                      </div>

                      {/* 预算范围 */}
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>预算范围</Text>
                        <Select value={budget} onChange={setBudget} style={{ width: '100%', marginTop: 4 }}>
                          <Select.Option value="经济">经济型（1-3万）</Select.Option>
                          <Select.Option value="中等">中等型（3-8万）</Select.Option>
                          <Select.Option value="舒适">舒适型（8-15万）</Select.Option>
                          <Select.Option value="高端">高端型（15万以上）</Select.Option>
                        </Select>
                      </div>

                      {/* 改造范围 */}
                      {tool.params?.includes('renovateScope') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>改造范围</Text>
                          <Select value={renovateScope} onChange={setRenovateScope} style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="全屋">全屋改造</Select.Option>
                            <Select.Option value="卫浴">仅卫浴</Select.Option>
                            <Select.Option value="厨房">仅厨房</Select.Option>
                            <Select.Option value="卧室">仅卧室</Select.Option>
                            <Select.Option value="客厅">仅客厅</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 卫浴类型 */}
                      {tool.params?.includes('bathType') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>卫浴改造类型</Text>
                          <Select value={bathType} onChange={setBathType} style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="坐式淋浴">坐式淋浴</Select.Option>
                            <Select.Option value="步入式浴缸">步入式浴缸</Select.Option>
                            <Select.Option value="智能马桶">智能马桶</Select.Option>
                            <Select.Option value="整体卫浴">整体卫浴改造</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 地面材质 */}
                      {tool.params?.includes('floorMaterial') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>地面材质</Text>
                          <Select value={floorMaterial} onChange={setFloorMaterial} style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="防滑木地板">防滑木地板</Select.Option>
                            <Select.Option value="防滑地砖">防滑地砖</Select.Option>
                            <Select.Option value="PVC防滑地板">PVC防滑地板</Select.Option>
                            <Select.Option value="防滑石材">防滑石材</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 扶手位置 */}
                      {tool.params?.includes('railLocation') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>扶手安装位置</Text>
                          <Select mode="multiple" value={railLocation.split('+')} onChange={(v) => setRailLocation(v.join('+'))} style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="走廊">走廊</Select.Option>
                            <Select.Option value="卫浴">卫浴</Select.Option>
                            <Select.Option value="楼梯">楼梯</Select.Option>
                            <Select.Option value="卧室">卧室</Select.Option>
                            <Select.Option value="入口">入口</Select.Option>
                          </Select>
                        </div>
                      )}

                      {/* 智能设备 */}
                      {tool.params?.includes('smartType') && (
                        <div style={{ marginBottom: 16 }}>
                          <Text strong>智能设备</Text>
                          <Select mode="multiple" placeholder="选择智能设备" style={{ width: '100%', marginTop: 4 }}>
                            <Select.Option value="语音控制">语音控制</Select.Option>
                            <Select.Option value="紧急呼叫">紧急呼叫</Select.Option>
                            <Select.Option value="跌倒检测">跌倒检测</Select.Option>
                            <Select.Option value="智能门锁">智能门锁</Select.Option>
                            <Select.Option value="智能窗帘">智能窗帘</Select.Option>
                          </Select>
                        </div>
                      )}
                    </>
                  ),
                },
              ]}
            />

            {/* 生成按钮 */}
            {!isAgent && (
              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<ThunderboltOutlined />}
                  loading={generating}
                  onClick={handleGenerate}
                  style={{ height: 48, borderRadius: 8 }}
                >
                  {generating ? progressText || '生成中...' : '开始生成'}
                </Button>
                {generating && (
                  <Progress
                    percent={Math.round(progress)}
                    showInfo={false}
                    style={{ marginTop: 8 }}
                    strokeColor="#A0845C"
                    trailColor="#E8DDD0"
                  />
                )}
              </div>
            )}
          </Card>
        </Col>

        {/* 右侧结果区 */}
        <Col xs={24} md={16}>
          {isAgent ? (
            /* 智能体对话模式 */
            <Card className="agent-chat">
              <div className="chat-messages">
                {chatMessages.length === 0 && (
                  <div className="chat-empty">
                    <RobotOutlined style={{ fontSize: 48, color: '#A0845C' }} />
                    <Title level={4}>AI适老改造顾问</Title>
                    <Text type="secondary">告诉我您想要改造的空间和需求，我来帮您设计适老化方案</Text>
                    <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                      {['评估父母家安全风险', '卫浴适老化改造方案', '全屋防滑地面设计', '安全扶手安装建议'].map((q) => (
                        <Tag
                          key={q}
                          style={{ cursor: 'pointer', borderRadius: 16, padding: '4px 12px' }}
                          onClick={() => setChatInput(q)}
                        >
                          {q}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                    <div className="chat-avatar">
                      {msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    </div>
                    <div className="chat-bubble">
                      <Text style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Text>
                      {msg.imageUrl && (
                        <Image src={msg.imageUrl} style={{ marginTop: 8, borderRadius: 8, maxWidth: '100%' }} />
                      )}
                    </div>
                  </div>
                ))}
                {chatStreaming && (
                  <div className="chat-msg chat-msg-assistant">
                    <div className="chat-avatar"><RobotOutlined /></div>
                    <div className="chat-bubble"><Text style={{ whiteSpace: 'pre-wrap' }}>{chatStreaming}</Text></div>
                  </div>
                )}
              </div>
              <div className="chat-input-area">
                <TextArea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="描述您想要改造的空间和需求..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
                />
                <Button type="primary" icon={<SendOutlined />} onClick={handleChatSend} style={{ background: '#A0845C', borderColor: '#A0845C' }} />
              </div>
            </Card>
          ) : (
            /* 普通工具结果区 */
            <div className="result-area">
              {result ? (
                <Card className="result-card">
                  <div className="result-compare">
                    {image && result.imageUrl ? (
                      <BeforeAfterSlider before={image} after={result.imageUrl} />
                    ) : (
                      <Image src={result.imageUrl} style={{ width: '100%', borderRadius: 8 }} />
                    )}
                  </div>
                  <div className="result-actions">
                    <Space>
                      <Button icon={<DownloadOutlined />}>下载</Button>
                      <Button icon={<ReloadOutlined />} onClick={handleGenerate}>重新生成</Button>
                      <Button icon={<HeartOutlined />}>收藏</Button>
                      <Button icon={<ShareAltOutlined />}>分享</Button>
                    </Space>
                  </div>
                </Card>
              ) : (
                <Card className="result-empty">
                  <div style={{ textAlign: 'center', padding: 48 }}>
                    <ThunderboltOutlined style={{ fontSize: 48, color: '#C4A882' }} />
                    <Paragraph type="secondary" style={{ marginTop: 16 }}>
                      设置参数后点击「开始生成」，AI将为您创建适老化改造效果图
                    </Paragraph>
                  </div>
                </Card>
              )}

              {/* AI建议面板 */}
              {showSuggestions && (
                <Card className="ai-suggestions" title={<><BulbOutlined style={{ color: '#A0845C', marginRight: 6 }} />AI改造建议</>} style={{ marginTop: 16 }}>
                  <Row gutter={[12, 12]}>
                    {aiSuggestions.map((s, i) => (
                      <Col key={i} xs={24} sm={12}>
                        <Alert
                          icon={s.icon}
                          message={s.title}
                          description={s.content}
                          type={s.type}
                          showIcon
                          style={{ borderRadius: 8 }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Card>
              )}

              {/* 历史结果 */}
              {results.length > 1 && (
                <Card title="生成历史" style={{ marginTop: 16 }}>
                  <Row gutter={[8, 8]}>
                    {results.slice(1, 9).map((r) => (
                      <Col key={r.id} xs={12} sm={8} md={6}>
                        <Image
                          src={r.imageUrl}
                          style={{ borderRadius: 8, cursor: 'pointer' }}
                          preview={{ mask: '查看大图' }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Card>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
