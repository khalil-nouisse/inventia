import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#FF1E00', colorSuccess: '#59CE8F', colorBgBase: '#000000', colorTextBase: '#E8F9FD', borderRadius: 2, fontFamily: 'JetBrains Mono, IBM Plex Mono, monospace' } }}>
      <AuthProvider><App /></AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);
