import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Navbar from './components/Navbar'; import PrivateRoute from './routes/PrivateRoute'; import RoleRoute from './routes/RoleRoute';
import { AdminUserManagementPage, DashboardPage, HackathonDetailPage, HackathonFormPage, HackathonListPage, LandingPage, LeaderboardPage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ScoringPage, SubmissionFormPage, TeamDetailPage, TeamListPage, UnauthorizedPage, UserDashboardPage } from './pages/pages';
import { useTheme } from './context/ThemeContext';

export default function App(){
  const { isDark } = useTheme();
  return (
    <ConfigProvider theme={{ 
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: { 
        colorPrimary: '#FF1E00', 
        colorSuccess: '#59CE8F', 
        colorBgBase: isDark ? '#000000' : '#ffffff', 
        colorTextBase: isDark ? '#E8F9FD' : '#000000', 
        borderRadius: 2, 
        fontFamily: 'JetBrains Mono, IBM Plex Mono, monospace' 
      } 
    }}>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
          <Route path="/hackathons" element={<HackathonListPage/>}/>
          <Route path="/hackathons/:id" element={<HackathonDetailPage/>}/>
          <Route element={<PrivateRoute/>}>
            <Route path="/teams" element={<TeamListPage/>}/>
            <Route path="/teams/:id" element={<TeamDetailPage/>}/>
            <Route path="/teams/:id/submission" element={<SubmissionFormPage/>}/>
            <Route path="/leaderboard" element={<LeaderboardPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/user-dashboard" element={<UserDashboardPage/>}/>
            <Route element={<RoleRoute roles={['ROLE_MANAGER','ROLE_ADMIN']}/> }>
              <Route path="/dashboard" element={<DashboardPage/>}/>
              <Route path="/hackathons/new" element={<HackathonFormPage/>}/>
              <Route path="/hackathons/:id/score" element={<ScoringPage/>}/>
            </Route>
            <Route element={<RoleRoute roles={['ROLE_ADMIN']}/> }>
              <Route path="/admin/users" element={<AdminUserManagementPage/>}/>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
