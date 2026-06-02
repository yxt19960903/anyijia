import { Typography, Card, Row, Col, Tag, Avatar, Space } from 'antd';
import {
  PictureOutlined, HeartOutlined, EyeOutlined,
  SafetyCertificateOutlined, HomeOutlined, TeamOutlined,
} from '@ant-design/icons';
import './Community.css';

const { Title, Text, Paragraph } = Typography;

const showcaseProjects = [
  { title: '70平老房适老化全屋改造', author: '张工', tags: ['全屋改造', '原木温馨'], likes: 328, views: 1280 },
  { title: '无障碍卫浴改造案例', author: '李设计', tags: ['卫浴改造', '北欧适老'], likes: 256, views: 980 },
  { title: '三代同堂适老安全升级', author: '王工', tags: ['安全改造', '中式雅居'], likes: 189, views: 720 },
  { title: '独居老人智能家居适配', author: '赵设计', tags: ['智能家居', '现代适老'], likes: 215, views: 860 },
  { title: '轮椅通行无障碍设计', author: '刘工', tags: ['无障碍', '极简安全'], likes: 178, views: 640 },
  { title: '防滑地面+扶手一体化方案', author: '陈设计', tags: ['防滑改造', '日式和风'], likes: 142, views: 520 },
];

export default function Community() {
  return (
    <div className="community-page">
      <div className="community-header">
        <Title level={3} style={{ color: '#5C4A32' }}>改造案例社区</Title>
        <Paragraph type="secondary">浏览适老化改造案例，获取改造灵感</Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {showcaseProjects.map((project, i) => (
          <Col key={i} xs={24} sm={12} md={8}>
            <Card
              hoverable
              className="project-card"
              cover={
                <div className="project-cover" style={{ background: `linear-gradient(135deg, #${['C4A882', 'A0845C', '8B7355', 'D4A574', 'BE9B6F', 'C0B090'][i]} 0%, #${['A0845C', '8B7355', '6B5B45', 'A0845C', '8B7355', 'A0845C'][i]} 100%)` }}>
                  <SafetyCertificateOutlined style={{ fontSize: 36, color: 'rgba(255,255,255,0.6)' }} />
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{project.title}</Text>
                </div>
              }
            >
              <Card.Meta
                avatar={<Avatar style={{ backgroundColor: '#A0845C' }}>{project.author[0]}</Avatar>}
                title={<Text style={{ fontSize: 13 }}>{project.author}</Text>}
                description={
                  <div className="project-meta">
                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <Tag key={tag} style={{ borderRadius: 12, fontSize: 11 }}>{tag}</Tag>
                      ))}
                    </div>
                    <Space style={{ marginTop: 8 }}>
                      <span className="project-stat"><HeartOutlined /> {project.likes}</span>
                      <span className="project-stat"><EyeOutlined /> {project.views}</span>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 24, borderRadius: 12, textAlign: 'center', padding: 32 }}>
        <TeamOutlined style={{ fontSize: 48, color: '#C4A882' }} />
        <Paragraph type="secondary" style={{ marginTop: 16 }}>更多改造案例正在整理中，敬请期待</Paragraph>
      </Card>
    </div>
  );
}
