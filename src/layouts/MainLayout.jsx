import { Layout, Menu, Input, Button, Avatar, Typography } from 'antd';
import {
  HomeOutlined, AppstoreOutlined, PictureOutlined,
  RobotOutlined, DashboardOutlined, UserOutlined,
  HeartOutlined, HistoryOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAppStore from '../stores/useAppStore';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore((s) => s.user);

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/tools', icon: <AppstoreOutlined />, label: '改造工具' },
    { key: '/canvas', icon: <DashboardOutlined />, label: 'AI画布' },
    { key: '/agent', icon: <RobotOutlined />, label: 'AI顾问' },
  ];

  const selectedKey = menuItems.find((m) => location.pathname.startsWith(m.key) && m.key !== '/')?.key || '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={200}
        className="main-sider"
      >
        <div className="sider-logo" onClick={() => navigate('/')}>
          <img src="/assets/logo.jfif" alt="安颐家" className="logo-img" />
          <div className="logo-text">
            <Text strong style={{ fontSize: 15, color: '#5C4A32' }}>安颐家</Text>
            <Text style={{ fontSize: 10, color: '#A0845C' }}>适老化改造AI平台</Text>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="sider-menu"
        />
        <div className="sider-bottom">
          <Menu
            mode="inline"
            selectedKeys={[]}
            items={[
              { key: 'favorites', icon: <HeartOutlined />, label: '我的收藏' },
              { key: 'history', icon: <HistoryOutlined />, label: '改造记录' },
            ]}
            className="sider-menu"
          />
        </div>
      </Sider>

      <Layout className="main-layout">
        <Header className="main-header">
          <Search
            placeholder="搜索适老化改造工具..."
            allowClear
            style={{ width: 400 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="primary"
              icon={<SafetyCertificateOutlined />}
              style={{ borderRadius: 20, background: '#A0845C', borderColor: '#A0845C' }}
            >
              免费评估
            </Button>
            {user ? (
              <Avatar style={{ backgroundColor: '#A0845C' }}>{user.name?.[0] || 'U'}</Avatar>
            ) : (
              <Button icon={<UserOutlined />} onClick={() => navigate('/login')}>
                登录
              </Button>
            )}
          </div>
        </Header>

        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
