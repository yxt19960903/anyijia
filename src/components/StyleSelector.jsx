import { Card, Typography, Row, Col } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { interiorStyles } from '../tools/categories';
import './StyleSelector.css';

const { Text } = Typography;

export default function StyleSelector({ value, onChange }) {
  return (
    <div className="style-selector">
      <Text strong style={{ marginBottom: 12, display: 'block' }}>选择风格</Text>
      <Row gutter={[8, 8]}>
        {interiorStyles.map((style) => (
          <Col key={style.key} xs={8} sm={6} md={4}>
            <Card
              hoverable
              className={`style-card ${value === style.key ? 'style-card-active' : ''}`}
              onClick={() => onChange?.(style.key)}
              bodyStyle={{ padding: 8, textAlign: 'center' }}
            >
              <div
                className="style-color-dot"
                style={{ backgroundColor: style.color }}
              />
              <Text className="style-label" ellipsis>{style.label}</Text>
              {value === style.key && (
                <div className="style-check">
                  <CheckOutlined />
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
