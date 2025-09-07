import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Link, Alert, Box, Breadcrumbs } from '@mui/material';
import ItemDetails from '../../components/items/Details';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { ItemsService } from '@/client';
import { getUserProfileData } from '../../utils/auth';

interface Owner {
    id: number;
    username: string;
}

interface Item {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    available: boolean;
    image_url?: string | null;
    website_url?: string | null;
    owner: Owner;
    created_at?: string | null;
    updated_at?: string | null;
    tags?: string[] | null;
}

interface User {
    id: number;
    email?: string;
    is_superuser: boolean;
    username?: string;
    // Add other user properties as needed
}

const ItemsDetailsPage: React.FC = () => {
    const { itemSlug } = useParams<{ itemSlug: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const user = getUserProfileData();
        setCurrentUser(user as User | null);
    }, []);

    useEffect(() => {
        const fetchItemDetails = async (): Promise<void> => {
            if (!itemSlug) return;

            try {
                setLoading(true);
                setError(null);
                const data = await ItemsService.getItemBySlugApiV1ItemsItemSlugGet({ itemSlug });
                setItem({
                    ...data,
                    id: Number(data.id),
                    available: typeof data.available === 'boolean' ? data.available : false,
                    owner: data.owner
                        ? data.owner
                        : { id: 0, username: 'unknown' }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch item details.');
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
    // const handleDelete = async (): Promise<void> => {
    //     if (!item || !window.confirm('Are you sure you want to delete this item?')) return;
    //     try {
    //         await ItemsService.deleteItemApiV1ItemsItemIdDelete({ itemId: Number(item.id) });
    //         navigate('/items');
    //     } catch (err) {
    //         alert('Failed to delete item.');
    //     }
    // };

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



    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="md" >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
                        <Link underline="hover" component="button" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                            Home
                        </Link>
                        <Link underline="hover" component="button" onClick={() => navigate('/items')} sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                            Items
                        </Link>
                        <Typography color="text.primary">{item.name}</Typography>
                    </Breadcrumbs>
                </Box>
                <ItemDetails
                    item={item}
                    currentUser={currentUser}

                />
            </Container>
            <Footer />
        </Box>
    );
};

export default ItemsDetailsPage;
