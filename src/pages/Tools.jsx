import { useState, useMemo } from 'react';
import { Typography, Row, Col, Segmented, Tabs, Empty, Tag } from 'antd';
import { tools } from '../tools/registry';
import { categories } from '../tools/categories';
import ToolCard from '../components/ToolCard';
import './Tools.css';

const { Title, Text } = Typography;

export default function Tools() {
  const [domain, setDomain] = useState('all');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('hot');

  const filteredTools = useMemo(() => {
    let result = tools;
    if (domain !== 'all') {
      if (domain === 'enterprise') {
        result = result.filter((t) => t.tags?.includes('企业版'));
      } else {
        result = result.filter((t) => t.domain === domain);
      }
    }
    if (type !== 'all') {
      result = result.filter((t) => t.type === type);
    }
    if (sort === 'hot') {
      result = [...result].sort((a, b) => {
        const aScore = (a.tags?.includes('核心') ? 2 : 0) + (a.tags?.includes('Hot') ? 1 : 0);
        const bScore = (b.tags?.includes('核心') ? 2 : 0) + (b.tags?.includes('Hot') ? 1 : 0);
        return bScore - aScore;
      });
    }
    return result;
  }, [domain, type, sort]);

  return (
    <div className="tools-page">
      <div className="tools-header">
        <Title level={3} style={{ margin: 0, color: '#5C4A32' }}>适老化改造工具</Title>
        <Text type="secondary">已更新 {tools.length} 个AI工具</Text>
      </div>

      <Tabs
        activeKey={domain}
        onChange={setDomain}
        items={categories.domain.map((c) => ({
          key: c.key,
          label: c.label,
        }))}
        style={{ marginBottom: 16 }}
      />

      <div className="tools-filter">
        <div className="type-filter">
          {categories.type.map((c) => (
            <Tag
              key={c.key}
              color={type === c.key ? '#A0845C' : undefined}
              className="type-tag"
              onClick={() => setType(c.key)}
              style={{ cursor: 'pointer' }}
            >
              {c.label}
            </Tag>
          ))}
        </div>
        <Segmented
          value={sort}
          onChange={setSort}
          options={[
            { label: '最新', value: 'new' },
            { label: '热门', value: 'hot' },
          ]}
        />
      </div>

      {filteredTools.length > 0 ? (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {filteredTools.map((tool) => (
            <Col key={tool.id} xs={24} sm={12} md={8} lg={6}>
              <ToolCard tool={tool} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="暂无该分类工具" style={{ marginTop: 48 }} />
      )}
    </div>
  );
}
