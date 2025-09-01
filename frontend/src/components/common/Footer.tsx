import React from 'react';
import { Container, Typography, Link as MuiLink, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface NavItem {
  to: string;
  text: string;
}

const Footer: React.FC = () => {
  const navItems: NavItem[] = [
    { to: '/privacy', text: 'Privacy Policy' },
    { to: '/terms', text: 'Terms of Service' },
    { to: '/about', text: 'About Us' },
    { to: '/faq', text: 'FAQ' },
    { to: '/contact', text: 'Contact' },
  ];

  return (
    <Box
      bgcolor="background.default"
      component="footer"
      className="main-footer"
      sx={{
        py: 6,
        mt: 'auto',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg" className="container">
        <Typography variant="body2" align="center" color="text.secondary">
          © {new Date().getFullYear()} Full-Stack Template. All rights reserved.
        </Typography>
        <Box
          component="nav"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 1,
          }}
        >
          {navItems.map((item: NavItem, index: number) => (
            <React.Fragment key={item.to}>
              <MuiLink
                component={RouterLink}
                to={item.to}
                variant="body2"
                color="text.secondary"
                sx={{ mx: 1 }}
              >
                {item.text}
              </MuiLink>
              {index < navItems.length - 1 && (
                <Typography variant="body2" component="span" color="text.secondary">
                  |
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
