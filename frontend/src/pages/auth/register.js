import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { handleRegister } from '../../api/auth';
import { useNavigate } from 'react-router';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    
    try {
      const userProfile = await handleRegister(email, username, password);
      setSuccessMessage(`Registration successful for ${userProfile.username}! Redirecting to login...`);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Display the specific error message from the backend
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // If it's a username conflict, focus on the username field
      if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('taken')) {
        setTimeout(() => {
          document.getElementById('username')?.focus();
        }, 100);
      }
      // If it's an email conflict, focus on the email field
      else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('registered')) {
        setTimeout(() => {
          document.getElementById('email')?.focus();
        }, 100);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address (optional)"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || !username.trim() || !password.trim()}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default RegisterPage;