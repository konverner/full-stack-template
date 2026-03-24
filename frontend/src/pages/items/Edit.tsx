import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import EditForm from '../../components/items/EditForm';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { ItemsService } from '@/client';
import { ItemRead } from '@/client';

const EditItemPage: React.FC = () => {
    const { itemSlug } = useParams<{ itemSlug: string }>();
    const location = useLocation();
    const [initialValues, setInitialValues] = useState<ItemRead | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [itemId, setItemId] = useState<number | null>((location.state as any)?.itemId || null);

    useEffect(() => {
        const fetchItem = async (): Promise<void> => {
            if (!itemSlug) return;

            try {
                setLoading(true);
                setError(null);
                
                let currentItemId = itemId;

                if (!currentItemId) {
                    // Fallback: find itemId by slug if not in state
                    const data = await ItemsService.listItemsApiV1ItemsGet({ slug: itemSlug });
                    if (data.items && data.items.length > 0) {
                        currentItemId = data.items[0].id;
                        setItemId(currentItemId);
                    } else {
                        throw new Error('Item not found');
                    }
                }

                // Use currentItemId to get info from backend as requested
                const data = await ItemsService.getItemByIdApiV1ItemsItemIdGet({ itemId: Number(currentItemId) });
                setInitialValues(data);
            } catch (err) {
                setError('Failed to load item data.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [itemSlug, location.state]);

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

    if (!initialValues || !itemId) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography variant="h6">Item not found.</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/">
                        Home
                    </Link>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/items">
                        Items
                    </Link>
                    <Link component={RouterLink} underline="hover" color="inherit" to={`/items/${itemSlug}`}>
                        {initialValues.name}
                    </Link>
                    <Typography color="text.primary">Edit</Typography>
                </Breadcrumbs>
                <EditForm
                    initialValues={
                        initialValues
                            ? {
                                  ...initialValues,
                                  description: initialValues.description ?? undefined,
                                  image_url: initialValues.image_url ?? undefined,
                                  website_url: initialValues.website_url ?? undefined,
                              }
                            : undefined
                    }
                    itemId={itemId}
                />
            </Container>
            <Footer />
        </Box>
    );
};

export default EditItemPage;
