import { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Container, Typography, Box, TextField, Button, Alert, Link } from '@mui/material';
import { AuthorizationProfileService } from '@/client';
import { saveTokens, saveUserProfile } from '../../utils/auth';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send as form data to match OAuth2PasswordRequestForm
      const response = await AuthorizationProfileService.loginForAccessTokenAuthTokenPost({
        formData: {
          username: username.trim(),
          password: password,
          // grant_type, scope, client_id, client_secret are optional
        },
      });

      // Save tokens first
      saveTokens(response.access_token, response.refresh_token);

      const userProfile = await AuthorizationProfileService.readUsersMeAuthMeGet();
      saveUserProfile(userProfile);
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.detail || 'Login failed. Please check your username and password.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: 'secondary' }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
              No account? <Link href="/register" color="primary">Sign Up</Link>
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default LoginPage;
