import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { createItem } from '../../api/items';

const CreateForm = () => {
    const [itemData, setItemData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        website_url: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setItemData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        // Filter out empty optional fields
        const dataToSubmit = { ...itemData };
        for (const key in dataToSubmit) {
            if (dataToSubmit[key] === '') {
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
                Create New Item
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
                helperText="Optional. Use lowercase letters, numbers, and hyphens."
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
            <TextField
                margin="normal"
                fullWidth
                name="image_url"
                label="Image URL"
                id="image_url"
                value={itemData.image_url}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                name="website_url"
                label="Website URL"
                id="website_url"
                value={itemData.website_url}
                onChange={handleChange}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Create Item'}
            </Button>
        </Box>
    );
};

export default CreateForm;
