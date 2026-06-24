import { useState, useMemo } from 'react';
import { Typography, Card, Row, Col, Tag, Segmented, Input, Space, Button, Badge, Image } from 'antd';
import {
  ShoppingCartOutlined, SearchOutlined, FireOutlined,
  HeartOutlined, SafetyCertificateOutlined, TagOutlined,
} from '@ant-design/icons';
import { shopCategories, products } from '../shop/shopProducts';
import './Shop.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const tagColors = {
  '热销': '#C4A882',
  '新品': '#A0845C',
  '包邮': '#8B7355',
  '推荐': '#D4A574',
  '上门安装': '#6B5B45',
  '多规格': '#A0845C',
  '多买优惠': '#C4A882',
  '套装优惠': '#8B7355',
  '实用小物': '#D4A574',
};

// 为每个分类生成渐变色
const categoryGradients = {
  bathroom: 'linear-gradient(135deg, #C4A882 0%, #A0845C 100%)',
  bedroom: 'linear-gradient(135deg, #8B7355 0%, #6B5B45 100%)',
  living: 'linear-gradient(135deg, #D4A574 0%, #A0845C 100%)',
  kitchen: 'linear-gradient(135deg, #BE9B6F 0%, #8B7355 100%)',
  lighting: 'linear-gradient(135deg, #D4C4A8 0%, #C4A882 100%)',
  assist: 'linear-gradient(135deg, #A0845C 0%, #6B5B45 100%)',
};

const categoryLabels = {
  bathroom: '卫浴安全',
  bedroom: '卧室适老',
  living: '客厅安全',
  kitchen: '厨房适老',
  lighting: '智能照明',
  assist: '辅助器具',
};

export default function Shop() {
  const [category, setCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    let result = products;
    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }
    if (searchText.trim()) {
      const kw = searchText.trim().toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw)
      );
    }
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'hot') {
      result = [...result].sort((a, b) => {
        const aHot = a.tags?.includes('热销') ? 1 : 0;
        const bHot = b.tags?.includes('热销') ? 1 : 0;
        return bHot - aHot;
      });
    }
    return result;
  }, [category, searchText, sortBy]);

  return (
    <div className="shop-page">
      {/* 顶部横幅 */}
      <div className="shop-banner">
        <div className="shop-banner-content">
          <SafetyCertificateOutlined style={{ fontSize: 36, color: '#fff' }} />
          <Title level={3} style={{ color: '#fff', margin: '8px 0 4px' }}>安颐家商城</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, maxWidth: 500, textAlign: 'center' }}>
            精选适老化家具与安全辅具，每一件都为长者安心设计
          </Paragraph>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="shop-filter">
        <div className="shop-categories">
          {shopCategories.map((c) => (
            <Tag
              key={c.key}
              color={category === c.key ? '#A0845C' : undefined}
              className="shop-category-tag"
              onClick={() => setCategory(c.key)}
              style={{ cursor: 'pointer', borderRadius: 16, padding: '4px 14px', fontSize: 13 }}
            >
              {c.label}
            </Tag>
          ))}
        </div>
        <div className="shop-search-sort">
          <Search
            placeholder="搜索适老家具..."
            allowClear
            onSearch={setSearchText}
            onChange={(e) => !e.target.value && setSearchText('')}
            style={{ width: 240 }}
          />
          <Segmented
            value={sortBy}
            onChange={setSortBy}
            options={[
              { label: '默认', value: 'default' },
              { label: '价格↑', value: 'price-asc' },
              { label: '价格↓', value: 'price-desc' },
              { label: '热销', value: 'hot' },
            ]}
          />
        </div>
      </div>

      {/* 商品统计 */}
      <div className="shop-result-info">
        <Text type="secondary">共 {filteredProducts.length} 件商品</Text>
      </div>

      {/* 商品网格 */}
      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="product-card"
              cover={
                <div
                  className="product-cover"
                  style={{ background: categoryGradients[product.category] || 'linear-gradient(135deg, #C4A882 0%, #A0845C 100%)' }}
                >
                  <div className="product-cover-icon">
                    <SafetyCertificateOutlined />
                  </div>
                  <div className="product-cover-label">{categoryLabels[product.category]}</div>
                  {product.tags?.includes('热销') && (
                    <div className="product-hot-badge"><FireOutlined /> 热销</div>
                  )}
                </div>
              }
            >
              <div className="product-info">
                <div className="product-tags">
                  {product.tags?.map((tag) => (
                    <Tag key={tag} color={tagColors[tag] || '#A0845C'} style={{ fontSize: 11, borderRadius: 4, border: 'none' }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Title level={5} style={{ margin: '6px 0 4px', fontSize: 14, color: '#5C4A32' }} ellipsis={{ rows: 1 }}>
                  {product.name}
                </Title>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>
                  {product.desc}
                </Paragraph>
                <div className="product-price-row">
                  <span className="product-price">¥{product.price}</span>
                  {product.originalPrice && (
                    <span className="product-original-price">¥{product.originalPrice}</span>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: 11 }}>{product.specs}</Text>
                <div className="product-actions">
                  <Button
                    type="primary"
                    size="small"
                    icon={<ShoppingCartOutlined />}
                    style={{ borderRadius: 16, background: '#A0845C', borderColor: '#A0845C', fontSize: 12 }}
                  >
                    加入购物车
                  </Button>
                  <Button
                    size="small"
                    icon={<HeartOutlined />}
                    style={{ borderRadius: 16, fontSize: 12 }}
                  >
                    收藏
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <SearchOutlined style={{ fontSize: 48, color: '#C4A882' }} />
          <Paragraph type="secondary" style={{ marginTop: 16 }}>未找到匹配的商品</Paragraph>
        </div>
      )}
    </div>
  );
}
