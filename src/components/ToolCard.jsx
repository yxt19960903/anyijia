import { Card, Tag, Typography, Space } from 'antd';
import {
  FireOutlined, StarOutlined, SafetyCertificateOutlined,
  UserOutlined, EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ToolCard.css';

const { Text, Paragraph } = Typography;

const tagConfig = {
  Hot: { color: '#C4A882', icon: <FireOutlined /> },
  New: { color: '#A0845C', icon: <StarOutlined /> },
  核心: { color: '#8B7355', icon: <SafetyCertificateOutlined /> },
  企业版: { color: '#D4A574', icon: <SafetyCertificateOutlined /> },
};

const toolMeta = {
  'aging-assessment': { users: 3280, rating: 4.9, views: 12800 },
  'hazard-detect': { users: 2150, rating: 4.8, views: 8900 },
  'ai-old-house': { users: 5620, rating: 4.9, views: 24500 },
  'ai-style-convert': { users: 1890, rating: 4.7, views: 7200 },
  'ai-room-renovate': { users: 4100, rating: 4.8, views: 18600 },
  'bathroom-barrier-free': { users: 3800, rating: 4.9, views: 15200 },
  'bathroom-shower': { users: 1950, rating: 4.7, views: 6800 },
  'bathroom-toilet': { users: 1680, rating: 4.6, views: 5400 },
  'anti-slip-floor': { users: 4250, rating: 4.8, views: 19800 },
  'threshold-remove': { users: 1420, rating: 4.5, views: 4600 },
  'handrail-design': { users: 3560, rating: 4.9, views: 14200 },
  'stair-safety': { users: 1280, rating: 4.6, views: 4200 },
  'ai-lighting': { users: 2100, rating: 4.7, views: 8600 },
  'smart-home': { users: 1650, rating: 4.6, views: 5800 },
  'emergency-call': { users: 2890, rating: 4.8, views: 11200 },
  'kitchen-elderly': { users: 1920, rating: 4.7, views: 7400 },
  'bedroom-elderly': { users: 1560, rating: 4.6, views: 5200 },
  'ai-floorplan-color': { users: 1380, rating: 4.5, views: 4800 },
  'ai-interior-plan': { users: 1120, rating: 4.4, views: 3600 },
  'plan-to-3d': { users: 980, rating: 4.3, views: 3200 },
  'wheelchair-path': { users: 2680, rating: 4.8, views: 10500 },
  'ai-draw': { users: 3200, rating: 4.7, views: 13800 },
  'ai-hand-draw': { users: 1480, rating: 4.5, views: 5200 },
  'ai-model-render': { users: 1250, rating: 4.4, views: 4000 },
  'ai-inpaint': { users: 2100, rating: 4.6, views: 8200 },
  'ai-material-replace': { users: 1860, rating: 4.5, views: 6800 },
  'ai-furniture-replace': { users: 1640, rating: 4.5, views: 5600 },
  'ai-collage': { users: 1180, rating: 4.4, views: 3800 },
  'ai-detail-enhance': { users: 920, rating: 4.3, views: 3000 },
  'ai-atmosphere': { users: 1560, rating: 4.5, views: 5800 },
  'ai-shadow': { users: 1120, rating: 4.4, views: 4200 },
  'ai-color-palette': { users: 1340, rating: 4.5, views: 4600 },
  'ai-to-cad': { users: 1680, rating: 4.6, views: 6200 },
  'cad-to-render': { users: 1420, rating: 4.5, views: 4800 },
  'ai-erase': { users: 2050, rating: 4.6, views: 7800 },
  'ai-hd': { users: 2680, rating: 4.7, views: 10200 },
  'ai-upscale': { users: 1920, rating: 4.6, views: 6400 },
  'ai-design-agent': { users: 4850, rating: 4.9, views: 22600 },
  'ai-canvas-agent': { users: 3680, rating: 4.8, views: 16400 },
  'ai-modify-agent': { users: 2140, rating: 4.7, views: 8800 },
};

function formatNumber(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
}

export default function ToolCard({ tool }) {
  const navigate = useNavigate();
  const meta = toolMeta[tool.id] || { users: 500, rating: 4.5, views: 2000 };

  return (
    <Card
      hoverable
      className="tool-card"
      cover={
        <div
          className="tool-card-cover"
          style={{ backgroundImage: `url(${tool.cover})` }}
        >
          {tool.tags?.map((tag) => (
            <Tag
              key={tag}
              color={tagConfig[tag]?.color || '#A0845C'}
              className="tool-card-tag"
            >
              {tagConfig[tag]?.icon} {tag}
            </Tag>
          ))}
        </div>
      }
      onClick={() => navigate(`/tools/${tool.id}`)}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text strong ellipsis>{tool.name}</Text>
          </div>
        }
        description={
          <>
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 8, fontSize: 13 }}
            >
              {tool.desc}
            </Paragraph>
            <div className="tool-card-meta">
              <span className="tool-card-stat">
                <StarOutlined style={{ color: '#D4A574' }} />
                <Text style={{ fontSize: 12, color: '#8B7355' }}>{meta.rating}</Text>
              </span>
              <span className="tool-card-stat">
                <UserOutlined style={{ color: '#A0845C' }} />
                <Text style={{ fontSize: 12, color: '#8B7355' }}>{formatNumber(meta.users)}人使用</Text>
              </span>
            </div>
          </>
        }
      />
    </Card>
  );
}
