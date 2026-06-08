import { Link, NavLink } from 'react-router-dom';
import { Button } from 'antd';
import { LogOut, Moon, Shield, Sun, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navClass = ({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link';

export default function Navbar(){
  const { user, logout, hasRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="InventIA home">
        <img src={isDark ? '/assets/logo-dark.png' : '/assets/logo-light.png'} alt="InventIA" className="logo" />
      </Link>

      <nav className="main-nav" aria-label="Primary navigation">
        <div className="nav-pill">
          <Button
            className="theme-toggle"
            type="text"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            icon={isDark ? <Sun size={16}/> : <Moon size={16}/>}
            onClick={toggleTheme}
          />
          <NavLink to="/hackathons" className={navClass}>Hackathons</NavLink>
          {hasRole?.(['ROLE_MANAGER','ROLE_ADMIN']) && (
            <NavLink to="/dashboard" className={navClass}><Trophy size={16}/>Dashboard</NavLink>
          )}
          {hasRole?.(['ROLE_ADMIN']) && (
            <NavLink to="/admin/users" className={navClass}><Shield size={16}/>Users</NavLink>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <Button className="logout-button" icon={<LogOut size={16}/>} onClick={logout}>Logout</Button>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <Link to="/register" className="register-button">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
