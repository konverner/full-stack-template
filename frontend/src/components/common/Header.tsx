import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Link as MuiLink, Container } from '@mui/material';
import Button from '@mui/material/Button';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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
    setUserProfile(null);
    navigate('/login');
  };

  const activeLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
  });

  const isItemsActive = location.pathname.startsWith('/items');
  const isUsersActive = location.pathname.startsWith('/users');

  return (
    <AppBar position="static" className="main-header" color="default">
      <Container maxWidth="md">
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
              color="inherit"
              className="nav-link"
              component={RouterLink}
              to="/items"
              sx={{ fontWeight: isItemsActive ? 'bold' : 'normal' }}
            >
              Items
            </Button>
            <Button
              color="inherit"
              className="nav-link"
              component={RouterLink}
              to="/users"
              sx={{ fontWeight: isUsersActive ? 'bold' : 'normal' }}
            >
              Users
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
