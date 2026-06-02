import { Typography, Card, Row, Col } from 'antd';
import { DashboardOutlined, HeartOutlined, ToolOutlined, BulbOutlined } from '@ant-design/icons';
import './CanvasAgent.css';

const { Title, Text, Paragraph } = Typography;

export default function CanvasAgent() {
  return (
    <div className="canvas-page">
      <div className="canvas-hero">
        <DashboardOutlined style={{ fontSize: 48, color: '#A0845C' }} />
        <Title level={3}>AI适老画布</Title>
        <Paragraph type="secondary" style={{ maxWidth: 500, textAlign: 'center' }}>
          集适老化评估、改造设计、素材拼贴为一体的一站式智能创作画布。在画布上自由创作，AI实时辅助适老化设计。
        </Paragraph>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card hoverable className="canvas-feature">
            <div className="canvas-feature-icon" style={{ background: '#F5EDE3', color: '#A0845C' }}>
              <ToolOutlined />
            </div>
            <Title level={5}>安全标注</Title>
            <Text type="secondary">AI自动标注适老化风险点和改造建议</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card hoverable className="canvas-feature">
            <div className="canvas-feature-icon" style={{ background: '#E8DDD0', color: '#8B7355' }}>
              <HeartOutlined />
            </div>
            <Title level={5}>设施拼贴</Title>
            <Text type="secondary">拖拽扶手、坡道、呼叫器等适老设施到画布</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card hoverable className="canvas-feature">
            <div className="canvas-feature-icon" style={{ background: '#C4A88220', color: '#C4A882' }}>
              <BulbOutlined />
            </div>
            <Title level={5}>智能生成</Title>
            <Text type="secondary">AI根据标注和拼贴自动生成改造效果图</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card hoverable className="canvas-feature">
            <div className="canvas-feature-icon" style={{ background: '#D4A57420', color: '#D4A574' }}>
              <DashboardOutlined />
            </div>
            <Title level={5}>方案对比</Title>
            <Text type="secondary">多方案并排对比，选择最优适老方案</Text>
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 24, borderRadius: 12, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <DashboardOutlined style={{ fontSize: 64, color: '#C4A882' }} />
          <Paragraph type="secondary" style={{ marginTop: 16 }}>画布功能开发中，敬请期待</Paragraph>
        </div>
      </Card>
    </div>
  );
}
