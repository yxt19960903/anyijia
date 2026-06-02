import { useState, useCallback, useRef, useEffect } from 'react';
import { Typography, Card, Input, Button, Space, Tag, Row, Col, Divider, Image, Spin } from 'antd';
import {
  RobotOutlined, UserOutlined, SendOutlined,
  SafetyCertificateOutlined, HomeOutlined, BulbOutlined,
  HeartOutlined, ToolOutlined, QuestionCircleOutlined,
  ThunderboltOutlined, EyeOutlined,
} from '@ant-design/icons';
import { chatWithAgent } from '../services/mockAI';
import './AgentPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const quickQuestions = [
  { icon: <SafetyCertificateOutlined />, text: '评估父母家安全风险', color: '#A0845C' },
  { icon: <HomeOutlined />, text: '旧房适老化改造方案', color: '#8B7355' },
  { icon: <BulbOutlined />, text: '卫浴防滑改造建议', color: '#C4A882' },
  { icon: <HeartOutlined />, text: '80岁老人居家安全', color: '#D4A574' },
  { icon: <ToolOutlined />, text: '安全扶手安装指南', color: '#A0845C' },
  { icon: <EyeOutlined />, text: '无障碍通行设计', color: '#8B7355' },
];

const knowledgeTopics = [
  { title: '防滑改造', desc: '地面防滑处理方案与材质选择', icon: <SafetyCertificateOutlined /> },
  { title: '扶手安装', desc: '安全扶手位置、高度、材质规范', icon: <ToolOutlined /> },
  { title: '卫浴适老', desc: '坐式淋浴、智能马桶、紧急呼叫', icon: <HomeOutlined /> },
  { title: '照明优化', desc: '感应夜灯、无眩光、色温选择', icon: <BulbOutlined /> },
  { title: '无障碍设计', desc: '门槛消除、门宽扩宽、轮椅动线', icon: <EyeOutlined /> },
  { title: '智能家居', desc: '语音控制、跌倒检测、紧急呼叫', icon: <ThunderboltOutlined /> },
];

export default function AgentPage() {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatStreaming, setChatStreaming] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, chatStreaming]);

  const handleSend = useCallback(async (text) => {
    const input = text || chatInput;
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatStreaming('');
    setLoading(true);

    try {
      const resp = await chatWithAgent({
        messages: [...chatMessages, userMsg],
        onChunk: setChatStreaming,
      });
      setChatMessages((prev) => [...prev, resp]);
      setChatStreaming('');
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  }, [chatInput, chatMessages, loading]);

  return (
    <div className="agent-page">
      <Row gutter={16} style={{ height: 'calc(100vh - 112px)' }}>
        {/* 左侧知识库 */}
        <Col xs={0} md={6}>
          <Card className="knowledge-panel" title={<><BulbOutlined style={{ color: '#A0845C', marginRight: 6 }} />适老知识库</>} bordered={false}>
            {knowledgeTopics.map((topic, i) => (
              <div
                key={i}
                className="knowledge-item"
                onClick={() => handleSend(`请详细介绍${topic.title}方面的适老化改造知识`)}
              >
                <div className="knowledge-item-icon">{topic.icon}</div>
                <div>
                  <Text strong style={{ color: '#5C4A32', fontSize: 13 }}>{topic.title}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{topic.desc}</Text>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* 中间对话区 */}
        <Col xs={24} md={12}>
          <Card className="chat-panel" bordered={false}>
            <div className="chat-header">
              <RobotOutlined style={{ fontSize: 24, color: '#A0845C' }} />
              <Title level={5} style={{ margin: 0 }}>AI适老改造顾问</Title>
              <Tag color="#A0845C" style={{ borderRadius: 12 }}>在线</Tag>
            </div>

            <div className="chat-messages-area">
              {chatMessages.length === 0 && (
                <div className="chat-welcome">
                  <div className="chat-welcome-icon">
                    <RobotOutlined />
                  </div>
                  <Title level={4}>您好，我是AI适老改造顾问</Title>
                  <Paragraph type="secondary" style={{ maxWidth: 400, textAlign: 'center' }}>
                    我可以帮您评估居家安全风险、设计适老化改造方案、推荐改造材料和设备。请告诉我您的需求。
                  </Paragraph>
                  <div className="quick-questions">
                    {quickQuestions.map((q, i) => (
                      <Tag
                        key={i}
                        className="quick-question-tag"
                        onClick={() => handleSend(q.text)}
                      >
                        {q.icon} {q.text}
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
                  <div className="chat-bubble">
                    <Text style={{ whiteSpace: 'pre-wrap' }}>{chatStreaming}</Text>
                    <span className="typing-cursor">|</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <TextArea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="描述您的适老化改造需求..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSend()}
                loading={loading}
                style={{ background: '#A0845C', borderColor: '#A0845C' }}
              />
            </div>
          </Card>
        </Col>

        {/* 右侧方案模板 */}
        <Col xs={0} md={6}>
          <Card className="template-panel" title={<><HeartOutlined style={{ color: '#A0845C', marginRight: 6 }} />改造方案模板</>} bordered={false}>
            {[
              { title: '经济型卫浴改造', budget: '1-3万', items: '防滑地砖+安全扶手+感应夜灯' },
              { title: '标准型全屋改造', budget: '3-8万', items: '防滑地面+扶手+照明+紧急呼叫' },
              { title: '舒适型适老翻新', budget: '8-15万', items: '全屋翻新+智能设备+无障碍设计' },
              { title: '高端型适老定制', budget: '15万+', items: '全屋定制+智能家居+专业护理空间' },
            ].map((tpl, i) => (
              <div
                key={i}
                className="template-item"
                onClick={() => handleSend(`我想了解${tpl.title}方案，预算${tpl.budget}，包含${tpl.items}，请给出详细建议`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ color: '#5C4A32', fontSize: 13 }}>{tpl.title}</Text>
                  <Tag color="#A0845C" style={{ borderRadius: 12, fontSize: 11 }}>{tpl.budget}</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{tpl.items}</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
