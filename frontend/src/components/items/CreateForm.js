import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Box, Checkbox, TextField, Button, Typography, CircularProgress, FormControlLabel } from '@mui/material';
import { createItem } from '../../api/items';

const CreateForm = () => {
    const [itemData, setItemData] = useState({
        name: '',
        slug: '',
        description: '',
        available: true,
        image_url: '',
        website_url: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        slug: '',
        image_url: '',
        website_url: '',
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setItemData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const trimItemData = (data) => {
        const trimmed = { ...data };
        for (const key in trimmed) {
            if (typeof trimmed[key] === 'string') {
                trimmed[key] = trimmed[key].trim();
            }
        }
        return trimmed;
    };

    const validateFields = () => {
        const trimmedData = trimItemData(itemData);
        const errors = { slug: '', image_url: '', website_url: '' };

        // Slug: lowercase letters, numbers, hyphens only
        if (trimmedData.slug && !/^[a-z0-9-]+$/.test(trimmedData.slug)) {
            errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens.';
        }

        // Image URL: must be a valid URL if not empty
        if (trimmedData.image_url && !/^https?:\/\/.+\..+/.test(trimmedData.image_url)) {
            errors.image_url = 'Image URL must be a valid URL.';
        }

        // Website URL: must be a valid URL if not empty
        if (trimmedData.website_url && !/^https?:\/\/.+\..+/.test(trimmedData.website_url)) {
            errors.website_url = 'Website URL must be a valid URL.';
        }

        setFieldErrors(errors);

        // Return true if no errors
        return !errors.slug && !errors.image_url && !errors.website_url;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        // Trim data before validation and submission
        const trimmedData = trimItemData(itemData);

        // Validate fields before submitting
        if (!validateFields()) {
            return;
        }

        setLoading(true);
        // Filter out empty optional fields but keep boolean values
        const dataToSubmit = { ...trimmedData };
        for (const key in dataToSubmit) {
            if (key === 'available') {
                // Always include available as boolean
                dataToSubmit[key] = Boolean(dataToSubmit[key]);
            } else if (dataToSubmit[key] === '') {
                delete dataToSubmit[key];
            }
        }

        try {
            const newItem = await createItem(dataToSubmit);
            navigate(`/items/${newItem.slug}`);
        } catch (err) {
            setError(err.message || 'An error occurred while creating the item.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create Item
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Item Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={itemData.name}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="slug"
                label="Slug (URL-friendly name)"
                name="slug"
                value={itemData.slug}
                onChange={handleChange}
                helperText={fieldErrors.slug || "Optional. Use lowercase letters, numbers, and hyphens."}
                error={!!fieldErrors.slug}
            />
            <TextField
                margin="normal"
                fullWidth
                name="description"
                label="Description"
                id="description"
                multiline
                rows={4}
                value={itemData.description}
                onChange={handleChange}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={itemData.available}
                        onChange={(event) => setItemData({ ...itemData, available: event.target.checked })}
                        color="primary"
                        name="available"
                        id="available"
                    />
                }
                label="Available"
                sx={{ mt: 2, mb: 1 }}
            />
            <TextField
                margin="normal"
                fullWidth
                name="image_url"
                label="Image URL"
                id="image_url"
                value={itemData.image_url}
                onChange={handleChange}
                helperText={fieldErrors.image_url}
                error={!!fieldErrors.image_url}
            />
            <TextField
                margin="normal"
                fullWidth
                name="website_url"
                label="Website URL"
                id="website_url"
                value={itemData.website_url}
                onChange={handleChange}
                helperText={fieldErrors.website_url}
                error={!!fieldErrors.website_url}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Create Item'}
            </Button>
        </Box>
    );
};

export default CreateForm;
