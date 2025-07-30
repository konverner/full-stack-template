import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { updateUser } from '../../api/users';

const EditForm = ({ initialValues = {}, username }) => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        avatar_url: '',
        is_active: true,
        is_superuser: false,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        username: '',
        email: '',
        avatar_url: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        setUserData(prev => ({
            ...prev,
            ...initialValues,
        }));
    }, [initialValues]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const trimUserData = (data) => {
        const trimmed = { ...data };
        for (const key in trimmed) {
            if (typeof trimmed[key] === 'string') {
                trimmed[key] = trimmed[key].trim();
            }
        }
        return trimmed;
    };

    const validateFields = () => {
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!validateFields()) {
            return;
        }
        setLoading(true);

        const dataToSubmit = { ...trimUserData(userData) };
        for (const key in dataToSubmit) {
            if (dataToSubmit[key] === '') {
                delete dataToSubmit[key];
            }
        }

        try {
            const updatedUser = await updateUser(username, dataToSubmit);
            navigate(`/users/${updatedUser.username}`);
        } catch (err) {
            setError(err.message || 'An error occurred while updating the user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit User
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
                sx={{ mt: 2, mb: 1 }}
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
                sx={{ mb: 2 }}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
        </Box>
    );
};
export default EditForm;