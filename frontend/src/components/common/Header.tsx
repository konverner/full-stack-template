import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Link as MuiLink, Container } from '@mui/material';
import Button from '@mui/material/Button';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUserProfileData, clearAuthData } from '../../utils/auth';

interface UserProfile {
  id: number;
  username: string;
  is_superuser?: boolean;
}

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus: boolean = isLoggedIn();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      const userProfile: UserProfile | null = getUserProfileData();
      setIsAdmin(userProfile?.is_superuser === true);
      setUserProfile(userProfile);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const onLogoutClick = (): void => {
    clearAuthData();
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const activeLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <AppBar position="static" className="main-header">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <MuiLink
            component={RouterLink}
            to="/"
            className="logo"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              component="img"
              src="../../assets/images/logo.png"
              alt="Full-stack Template Logo"
              sx={{ height: 40, mr: 1 }}
            />
            <Typography variant="h6" component="div" className="logo-text">
              Full-Stack Template
            </Typography>
          </MuiLink>
          <Box component="nav" className="site-nav" sx={{ display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'left', ml: 2 }}>
            <NavLink
              to="/items"
              style={({ isActive }) => activeLinkStyle({ isActive })}
            >
              {({ isActive }) => (
                <Button
                  color="inherit"
                  className="nav-link"
                  sx={activeLinkStyle({ isActive })}
                >
                  Items
                </Button>
              )}
            </NavLink>
            <NavLink
              to="/users"
              style={({ isActive }) => activeLinkStyle({ isActive })}
            >
              {({ isActive }) => (
                <Button
                  color="inherit"
                  className="nav-link"
                  sx={activeLinkStyle({ isActive })}
                >
                  Users
                </Button>
              )}
            </NavLink>
          </Box>
          <Box component="nav" id="main-nav" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  size="small"
                  id="nav-login-btn"
                  sx={{ color: 'white' }}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/items/create"
                  color="inherit"
                  className="nav-link"
                  id="nav-add-item-btn"
                >
                  Create Item
                </Button>
                <Button
                  component={RouterLink}
                  to={`/users/${userProfile?.username}`}
                  color="inherit"
                  className="nav-link"
                  id="nav-profile-link"
                >
                  My Profile
                </Button>
                {isAdmin && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    color="inherit"
                    className="nav-link"
                    id="nav-admin-link"
                  >
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  id="nav-logout-btn"
                  onClick={onLogoutClick}
                >
                  Sign Out
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;