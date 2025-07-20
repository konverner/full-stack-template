import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { Container, Typography, CircularProgress, Link, Alert, Box, Button, Breadcrumbs } from '@mui/material';
import ItemDetails from '../../components/items/Details.js';
// Assuming you have an API service for items
import { getItemDetails } from '../../api/items.js'; // Adjust the path as necessary
import Header from '../../components/common/Header.js';
import Footer from '../../components/common/Footer.js';
// Add import for delete API
import { fetchApi } from '../../api/api.js';

const ItemsDetailsPage = () => {
    const { itemSlug } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use localStorage to get the current user data
    const getStoredUser = () => {
        const user = localStorage.getItem('userProfile');
        return user ? JSON.parse(user) : null;
    };
    const [currentUser, setCurrentUser] = useState(getStoredUser());

    useEffect(() => {
        setCurrentUser(getStoredUser());
    }, []);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getItemDetails(itemSlug); // Updated function call
                setItem(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch item details.');
                console.error("Error fetching item details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (itemSlug) {
            fetchItemDetails();
        }
    }, [itemSlug]);

    // Delete handler
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await fetchApi(`/items/${itemSlug}`, { method: 'DELETE' }, true);
            navigate('/items');
        } catch (err) {
            alert('Failed to delete item.');
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!item) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography variant="h6">Item not found.</Typography>
            </Container>
        );
    }

    const breadcrumbLinks = [
        { name: 'Home', href: '/' },
        { name: 'Items', href: '/items' },
        { name: item.name || 'Details' }, // Use item name if available, otherwise 'Details'
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="md" >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
                        <Link component="button" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                            Home
                        </Link>
                        <Link component="button" onClick={() => navigate('/items')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                            Items
                        </Link>
                        <Typography color="text.primary">{item.name}</Typography>
                    </Breadcrumbs>
                </Box>
                <ItemDetails
                    item={item}
                    currentUser={currentUser}
                    onDelete={handleDelete}
                />
            </Container>
            <Footer />
        </Box>
    );
};

export default ItemsDetailsPage;
