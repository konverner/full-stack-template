import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Checkbox, FormControlLabel, Paper, Stack } from '@mui/material';
import { UsersService } from '@/client';

interface UserData {
  username: string;
  email: string;
  avatar_url: string;
  is_active: boolean;
  is_superuser: boolean;
}

interface CurrentUser {
  username: string;
  is_superuser: boolean;
}

interface FieldErrors {
  username: string;
  email: string;
  avatar_url: string;
}

interface EditFormProps {
  initialValues?: Partial<UserData>;
  username: string;
  currentUser: CurrentUser | null;
}

const EditForm: React.FC<EditFormProps> = ({ initialValues = {}, username, currentUser }) => {
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    avatar_url: '',
    is_active: true,
    is_superuser: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    username: '',
    email: '',
    avatar_url: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log('EditForm currentUser:', currentUser);
    console.log('EditForm username:', username);
    setUserData(prev => ({
      ...prev,
      ...initialValues,
    }));
  }, [initialValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const trimUserData = (data: UserData): UserData => {
    const trimmed = { ...data };
    for (const key in trimmed) {
      if (typeof trimmed[key as keyof UserData] === 'string') {
        (trimmed as any)[key] = (trimmed[key as keyof UserData] as string).trim();
      }
    }
    return trimmed;
  };

  const validateFields = (): boolean => {
    const trimmedData = trimUserData(userData);
    const errors = { username: '', email: '', avatar_url: '' };

    if (trimmedData.username && !/^[a-zA-Z0-9_-]{3,50}$/.test(trimmedData.username)) {
      errors.username = 'Username must be 3-50 characters, letters, numbers, underscores or hyphens.';
    }
    if (trimmedData.email && !/^[^@]+@[^@]+\.[^@]+$/.test(trimmedData.email)) {
      errors.email = 'Email must be valid.';
    }
    if (trimmedData.avatar_url && !/^https?:\/\/.+\..+/.test(trimmedData.avatar_url)) {
      errors.avatar_url = 'Avatar URL must be a valid URL.';
    }

    setFieldErrors(errors);

    return !errors.username && !errors.email && !errors.avatar_url;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);

    if (!validateFields()) {
      return;
    }
    setLoading(true);

    const dataToSubmit: any = { ...trimUserData(userData) };

    // Only superusers can change these fields
    if (!currentUser?.is_superuser) {
      delete dataToSubmit.is_active;
      delete dataToSubmit.is_superuser;
    }

    for (const key in dataToSubmit) {
      if (dataToSubmit[key] === '' && key !== 'email' && key !== 'avatar_url') {
        delete dataToSubmit[key];
      }
    }

    try {
      const updatedUser = await UsersService.updateUserByUsernameApiV1UsersUsernamePut({
        username,
        requestBody: dataToSubmit
      });
      navigate(`/users/${updatedUser.username}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 640, mx: 'auto' }}>
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit User
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={userData.username}
            onChange={handleChange}
            error={!!fieldErrors.username}
            helperText={fieldErrors.username || "3-50 chars, letters, numbers, _ or -"}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />
          <TextField
            margin="normal"
            fullWidth
            name="avatar_url"
            label="Avatar URL"
            id="avatar_url"
            value={userData.avatar_url}
            onChange={handleChange}
            error={!!fieldErrors.avatar_url}
            helperText={fieldErrors.avatar_url}
          />

          {currentUser?.is_superuser && currentUser.username !== username && (
            <Stack direction="row" spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!userData.is_active}
                    onChange={handleChange}
                    color="primary"
                    name="is_active"
                    id="is_active"
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!userData.is_superuser}
                    onChange={handleChange}
                    color="primary"
                    name="is_superuser"
                    id="is_superuser"
                  />
                }
                label="Superuser"
              />
            </Stack>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditForm;
