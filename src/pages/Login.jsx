import { Form, Input, Button, Card, Typography, Divider, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyCertificateOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../stores/useAppStore';
import './Login.css';

const { Title, Text, Paragraph } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);

  const onFinish = (values) => {
    login({ name: values.phone || values.email, phone: values.phone });
    message.success('登录成功！');
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-icon">
          <HeartOutlined />
        </div>
        <Title level={3} style={{ color: '#5C4A32', margin: 0 }}>安颐家</Title>
        <Text style={{ color: '#A0845C', fontSize: 14 }}>适老化改造AI平台</Text>
        <Paragraph type="secondary" style={{ maxWidth: 300, textAlign: 'center', marginTop: 8, fontSize: 13 }}>
          以AI科技守护银发生活，让每一位长者安居无忧
        </Paragraph>
      </div>
      <Card className="login-card">
        <Title level={4} style={{ textAlign: 'center', color: '#5C4A32', marginBottom: 24 }}>登录</Title>
        <Form onFinish={onFinish} size="large">
          <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input prefix={<MobileOutlined />} placeholder="手机号" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Checkbox><Text style={{ fontSize: 13 }}>记住登录</Text></Checkbox>
              <a><Text style={{ fontSize: 13 }}>忘记密码？</Text></a>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ height: 44, borderRadius: 8, background: '#A0845C', borderColor: '#A0845C' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <Divider plain style={{ borderColor: '#E8DDD0' }}>
          <Text type="secondary">其他登录方式</Text>
        </Divider>
        <Button block style={{ height: 44, borderRadius: 8, borderColor: '#D4C4A8' }}>
          邮箱登录
        </Button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            还没有账号？<a style={{ color: '#A0845C' }}>立即注册</a>
          </Text>
        </div>
      </Card>
      <div className="login-footer">
        <SafetyCertificateOutlined style={{ color: '#A0845C' }} />
        <Text type="secondary" style={{ fontSize: 12 }}>您的数据安全由安颐家守护</Text>
      </div>
    </div>
  );
}