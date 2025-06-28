import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Link as MuiLink, Container } from '@mui/material';
import { Link as RouterLink, NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import { isLoggedIn, getUserProfileData, handleLogout as authHandleLogout } from '../../api/auth'; // Added for auth

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = isLoggedIn();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      const userProfile = getUserProfileData();
      // Assuming userProfile has an 'is_admin' boolean field or similar
      // e.g., userProfile.role === 'admin' or userProfile.roles.includes('admin')
      setIsAdmin(userProfile?.is_admin === true); 
    } else {
      setIsAdmin(false);
    }
  }, []); // Runs on component mount. Re-run if dependencies change or via global state.

  const onLogoutClick = () => {
    authHandleLogout(); // Calls the original logout logic from auth.js
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login'); // Navigate to login page using React Router
  };

  const activeLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      // Add other active styles if needed, e.g., textDecoration: 'underline'
    };
  };

  return (
    <AppBar position="static" className="main-header"> {/* Preserving original class */}
      <Container maxWidth="lg"> {/* Mimics <div class="container"> behavior */}
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}> {/* disableGutters is recommended when Toolbar is a direct child of Container */}
          
          {/* Logo Title (left) */}
          <MuiLink
            component={RouterLink}
            to="/"
            className="logo"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
            >
            <Box
              component="img"
              // Ensure this path is correct for your React project (e.g., in public folder or imported)
              src="../../assets/images/logo.png" 
              alt="Full-stack Template Logo"
              sx={{ height: 40, mr: 1 }} // mr is margin-right
            />
            <Typography variant="h6" component="div" className="logo-text"> {/* Preserving original class */}
              Full-Stack Template
            </Typography>
          </MuiLink>

          {/* Site Navigation (center) */}
          <Box component="nav" className="site-nav" sx={{ display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
            <Button
              component={NavLink}
              to="/items"
              color="inherit"
              className="nav-link"
              style={activeLinkStyle}
            >
              Items
            </Button>
            {isAuthenticated && (
              <Button
                component={RouterLink}
                to="/items/create"
                color="primary"
                variant="outlined"
                className="nav-link"
                id="nav-add-item-btn"
                sx={{ ml: 2 }}
              >
                Add Item
              </Button>
            )}
          </Box>

          {/* Auth Navigation (right) */}
          <Box component="nav" id="main-nav" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Preserving original id */}
            {!isAuthenticated ? (
              <>
                {/* The "Sign Up" button was commented out in the original HTML */}
                {/* <Button component={RouterLink} to="/register" variant="contained" color="primary" size="small" id="nav-register-btn">Sign Up</Button> */}
                
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