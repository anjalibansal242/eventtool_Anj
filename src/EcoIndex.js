import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faCalendarAlt, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import sprout from './assets/sprout.png';
import sprout_icon from './assets/sprout_icon.png';
import './EcoIndex.css';
import { useAuth } from './AuthProvider';

const EcoIndex = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);
  const [givenName, setGivenName] = useState('');
  const { user, signoutRedirect } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  const handleLogout = () => {
    signoutRedirect();
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleResize = () => {
    setIsCollapsed(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      try {
        setGivenName(user.profile.given_name);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [user]);

  return (
    <div className="ecoindex">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="collapse-button" onClick={handleCollapseToggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <span>
          <img
            src={isCollapsed ? sprout_icon : sprout}
            alt="Sprout"
            className={`sprout ${isCollapsed ? 'collapsed' : ''}`}
          />
        </span>
        <br /><br /><br />
        <div className={`profile ${isCollapsed ? 'collapsed' : ''}`}>
          <div className={`profile-img ${isCollapsed ? 'collapsed' : ''}`}></div>
          {!isCollapsed && (
            <>
              <p>{givenName}</p>
            </>
          )}
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                <FontAwesomeIcon icon={faTachometerAlt} className={isCollapsed ? 'icon-collapsed' : ''} /> {!isCollapsed && 'Dashboard'}
              </Link>
            </li>
            <li>
              <Link to="/events" className={isActive('/events') ? 'active' : ''}>
                <FontAwesomeIcon icon={faCalendarAlt} className={isCollapsed ? 'icon-collapsed' : ''} /> {!isCollapsed && 'Events'}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="logout">
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className={isCollapsed ? 'icon-collapsed' : ''} /> {!isCollapsed && 'Logout'}
          </button>
        </div>
      </div>
      <div className="content"></div>
    </div>
  );
};

export default EcoIndex;
