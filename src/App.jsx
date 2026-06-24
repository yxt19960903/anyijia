import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import ToolWorkspace from './pages/ToolWorkspace';
import CanvasAgent from './pages/CanvasAgent';
import AgentPage from './pages/AgentPage';
import Community from './pages/Community';
import Shop from './pages/Shop';
import Login from './pages/Login';

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#A0845C',
          colorBgContainer: '#FFFAF5',
          colorBgLayout: '#F5EDE3',
          colorBorder: '#D4C4A8',
          borderRadius: 8,
        },
      }}
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:toolId" element={<ToolWorkspace />} />
          <Route path="/canvas" element={<CanvasAgent />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/community" element={<Community />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </ConfigProvider>
  );
}
