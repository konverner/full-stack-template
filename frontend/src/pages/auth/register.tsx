import { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { AuthorizationProfileService } from '@/client';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    if (password.length > 0 && password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Client-side validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting registration form with username:', username);

      // Only include email in request body if it has a value
      const requestBody: { username: string; password: string; email?: string } = {
        username,
        password
      };

      if (email.trim()) {
        requestBody.email = email.trim();
      }

      const userProfile = await AuthorizationProfileService.registerUserAuthRegisterPost({ requestBody });
      setSuccessMessage(`Registration successful for ${userProfile.username}! Redirecting to login...`);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Display the specific error message from the backend
      console.log('Error in registration UI layer:', err);
      // Ensure we always get a string error message
      const apiError = err as any;
      const errorMessage = apiError.body?.detail || apiError.message || 'Registration failed. Please try again.';
      console.log('Setting error message to:', errorMessage);
      setError(errorMessage);

      // Focus on relevant field based on error type
      if (errorMessage.toLowerCase().includes('username')) {
        setTimeout(() => {
          document.getElementById('username')?.focus();
        }, 100);
      } else if (errorMessage.toLowerCase().includes('email')) {
        setTimeout(() => {
          document.getElementById('email')?.focus();
        }, 100);
      } else if (errorMessage.toLowerCase().includes('password')) {
        setTimeout(() => {
          document.getElementById('password')?.focus();
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
              onChange={handlePasswordChange}
              disabled={isSubmitting}
              error={!!passwordError}
              helperText={passwordError || 'Password must be at least 8 characters long'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || !username.trim() || !password.trim() || password.length < 8}
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
