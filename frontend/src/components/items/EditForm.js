import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { createItem, updateItem } from '../../api/items';

const EditForm = ({ initialValues = {}, itemSlug }) => {
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

    // Pre-fill form with initialValues
    useEffect(() => {
        setItemData(prev => ({
            ...prev,
            ...initialValues,
        }));
    }, [initialValues]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setItemData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
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
        // Trim data before validation and submission
        const trimmedData = trimItemData(itemData);
        setError(null);

        // Validate fields before submitting
        if (!validateFields()) {
            return;
        }
        setLoading(true);

        // Filter out empty optional fields and 'id' but keep boolean values
        const dataToSubmit = { ...trimmedData };
        delete dataToSubmit.id; // Remove id if present
        for (const key in dataToSubmit) {
            if (key === 'available') {
                // Always include available as boolean
                dataToSubmit[key] = Boolean(dataToSubmit[key]);
            } else if (dataToSubmit[key] === '') {
                delete dataToSubmit[key];
            }
        }

        try {
            let updatedItem;
            if (itemSlug) {
                updatedItem = await updateItem(itemSlug, dataToSubmit);
            } else {
                updatedItem = await createItem(dataToSubmit);
            }
            navigate(`/items/${updatedItem.slug}`);
        } catch (err) {
            setError(err.message || `An error occurred while ${itemSlug ? 'updating' : 'creating'} the item.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {itemSlug ? 'Edit Item' : 'Create Item'}
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
                error={!!fieldErrors.slug}
                helperText={fieldErrors.slug || "Optional. Use lowercase letters, numbers, and hyphens."}
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
                        checked={!!itemData.available}
                        onChange={handleChange}
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
                error={!!fieldErrors.image_url}
                helperText={fieldErrors.image_url}
            />
            <TextField
                margin="normal"
                fullWidth
                name="website_url"
                label="Website URL"
                id="website_url"
                value={itemData.website_url}
                onChange={handleChange}
                error={!!fieldErrors.website_url}
                helperText={fieldErrors.website_url}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : (itemSlug ? 'Save Changes' : 'Save Item')}
            </Button>
        </Box>
    );
};
export default EditForm;