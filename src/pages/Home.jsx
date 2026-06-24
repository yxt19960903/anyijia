import { Typography, Button, Row, Col, Card, Space } from 'antd';
import {
  RocketOutlined, SafetyCertificateOutlined, HomeOutlined,
  DashboardOutlined, ArrowRightOutlined, HeartOutlined,
  EyeOutlined, ThunderboltOutlined, CheckCircleOutlined,
  PhoneOutlined, TeamOutlined, ToolOutlined,
  SearchOutlined, FileProtectOutlined, BulbOutlined,
  StarOutlined, ShoppingCartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { tools } from '../tools/registry';
import ToolCard from '../components/ToolCard';
import './Home.css';

const { Title, Text, Paragraph } = Typography;

const quickEntries = [
  { key: 'quick', icon: <ThunderboltOutlined />, label: '一键改造', desc: '上传照片快速出图', color: '#A0845C', path: '/tools' },
  { key: 'chat', icon: <HeartOutlined />, label: 'AI顾问', desc: '对话式适老方案', color: '#C4A882', path: '/agent' },
  { key: 'canvas', icon: <DashboardOutlined />, label: '画布设计', desc: '一站式创作画布', color: '#8B7355', path: '/canvas' },
  { key: 'shop', icon: <ShoppingCartOutlined />, label: '适老商城', desc: '精选适老家具', color: '#D4A574', path: '/shop' },
];

const processSteps = [
  { icon: <SearchOutlined />, title: '安全评估', desc: 'AI识别居家安全隐患', step: 1 },
  { icon: <FileProtectOutlined />, title: '方案生成', desc: '一键生成适老化改造方案', step: 2 },
  { icon: <BulbOutlined />, title: '效果预览', desc: 'AI渲染改造效果图', step: 3 },
  { icon: <CheckCircleOutlined />, title: '施工落地', desc: '专业团队施工保障', step: 4 },
];

const scenarios = [
  { img: '/assets/elderly-care-1.jpg', title: '安全扶手安装', desc: '走廊、卫浴、楼梯全覆盖' },
  { img: '/assets/elderly-care-2.jpg', title: '无障碍卫浴', desc: '防滑地面、坐式淋浴、紧急呼叫' },
  { img: '/assets/elderly-care-3.jpg', title: '防滑地面改造', desc: '全屋防滑，守护每一步' },
  { img: '/assets/elderly-care-4.jpg', title: '智能照明系统', desc: '感应夜灯、无眩光、色温调节' },
  { img: '/assets/elderly-care-5.jpg', title: '适老厨房设计', desc: '降低台面、防滑地面、易取收纳' },
  { img: '/assets/elderly-care-6.jpg', title: '紧急呼叫系统', desc: '卧室、卫浴、走廊一键呼叫' },
];

const testimonials = [
  { name: '张女士', role: '为父母改造', avatar: '张', content: '用了安颐家的AI评估，才发现父母家卫生间有这么多安全隐患。改造后老人特别满意，洗澡再也不怕滑了！', rating: 5 },
  { name: '李先生', role: '旧房适老改造', avatar: '李', content: '一键生成了好几种改造方案，效果很直观。最终选了原木温馨风格，父母说比以前安全多了也好看多了。', rating: 5 },
  { name: '王阿姨', role: '自住房改造', avatar: '王', content: '年纪大了腿脚不便，AI帮我规划了全屋扶手和防滑地面，现在走路踏实多了。科技真的能温暖生活！', rating: 5 },
];

export default function Home() {
  const navigate = useNavigate();

  // 合并核心+热门，去重，最多展示8个
  const featuredTools = tools
    .filter((t) => t.tags?.includes('核心') || t.tags?.includes('Hot'))
    .reduce((acc, t) => {
      if (!acc.find((x) => x.id === t.id)) acc.push(t);
      return acc;
    }, [])
    .slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <HeartOutlined /> 专注旧房适老化改造
          </div>
          <Title level={2} style={{ marginBottom: 8, color: '#fff' }}>
            安颐家 · 适老化改造AI平台
          </Title>
          <Paragraph style={{ fontSize: 16, maxWidth: 600, color: 'rgba(255,255,255,0.9)' }}>
            以AI科技守护银发生活，让每一位长者安居无忧。从安全评估到改造出图，全流程AI赋能适老化改造。
          </Paragraph>
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <Button
              size="large"
              style={{ height: 48, paddingInline: 32, borderRadius: 24, background: '#fff', color: '#A0845C', border: 'none', fontWeight: 600 }}
              icon={<RocketOutlined />}
              onClick={() => navigate('/tools')}
            >
              开始改造设计
            </Button>
            <Button
              size="large"
              ghost
              style={{ height: 48, paddingInline: 24, borderRadius: 24, color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
              icon={<PhoneOutlined />}
            >
              咨询热线
            </Button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/hero-elderly.webp" alt="适老化改造" />
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="section">
        <Row gutter={16}>
          {quickEntries.map((entry) => (
            <Col key={entry.key} xs={12} sm={6}>
              <Card
                hoverable
                className="quick-entry-card"
                onClick={() => navigate(entry.path)}
              >
                <div className="quick-entry-icon" style={{ backgroundColor: entry.color + '20', color: entry.color }}>
                  {entry.icon}
                </div>
                <Title level={5}>{entry.label}</Title>
                <Text type="secondary">{entry.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 精选工具（核心+热门合并去重） */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>精选工具</Title>
          <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/tools')}>
            查看全部 {tools.length} 个工具
          </Button>
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {featuredTools.map((tool) => (
            <Col key={tool.id} xs={24} sm={12} md={6}>
              <ToolCard tool={tool} />
            </Col>
          ))}
        </Row>
      </div>

      {/* 改造流程 */}
      <div className="section">
        <Title level={4} style={{ textAlign: 'center' }}>改造流程</Title>
        <div className="process-flow">
          {processSteps.map((step, i) => (
            <div key={i} className="process-step">
              <div className="process-step-number">{step.step}</div>
              <div className="process-step-icon">{step.icon}</div>
              <Title level={5} style={{ margin: '8px 0 4px' }}>{step.title}</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>{step.desc}</Text>
              {i < processSteps.length - 1 && <div className="process-arrow"><ArrowRightOutlined /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* 改造场景 */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>改造场景</Title>
          <Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/tools')}>
            查看全部工具
          </Button>
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {scenarios.map((s, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={4}>
              <Card
                hoverable
                className="scenario-card"
                cover={<img src={s.img} alt={s.title} style={{ height: 140, objectFit: 'cover' }} />}
                onClick={() => navigate('/tools')}
              >
                <Card.Meta title={s.title} description={s.desc} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 客户评价 */}
      <div className="section">
        <Title level={4} style={{ textAlign: 'center' }}>客户评价</Title>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {testimonials.map((t, i) => (
            <Col key={i} xs={24} sm={8}>
              <Card className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <StarOutlined key={j} style={{ color: '#D4A574', fontSize: 14 }} />
                  ))}
                </div>
                <Paragraph style={{ fontSize: 14, lineHeight: 1.8, color: '#5C4A32', margin: '12px 0' }}>
                  "{t.content}"
                </Paragraph>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <Text strong style={{ color: '#5C4A32' }}>{t.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{t.role}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 养老关怀横幅 */}
      <div className="care-banner">
        <div className="care-banner-content">
          <HeartOutlined style={{ fontSize: 32, color: '#A0845C' }} />
          <Title level={4} style={{ margin: '8px 0 4px' }}>让每一位长者安居无忧</Title>
          <Paragraph type="secondary" style={{ maxWidth: 500, textAlign: 'center' }}>
            安颐家致力于用AI技术推动居家适老化改造，让科技温暖银发生活。我们相信，每一个细节的改善，都是对父母最深的爱。
          </Paragraph>
          <Button type="primary" size="large" icon={<TeamOutlined />} style={{ borderRadius: 24, marginTop: 8 }}>
            了解适老化改造方案
          </Button>
        </div>
      </div>
    </div>
  );
}
