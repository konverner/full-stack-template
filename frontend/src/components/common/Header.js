import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Link as MuiLink, Container } from '@mui/material';
import { Link as RouterLink, NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import { isLoggedIn, getUserProfileData, handleLogout as authHandleLogout } from '../../api/auth';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = isLoggedIn();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      const userProfile = getUserProfileData();
      setIsAdmin(userProfile?.is_admin === true); 
    } else {
      setIsAdmin(false);
    }
  }, []);

  const onLogoutClick = () => {
    authHandleLogout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const activeLinkStyle = ({ isActive }) => ({
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
            <Button
              component={NavLink}
              to="/items"
              color="inherit"
              className="nav-link"
              style={activeLinkStyle}
            >
              Items
            </Button>
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
                  to="/profile"
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
