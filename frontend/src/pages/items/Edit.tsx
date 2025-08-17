import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import EditForm from '../../components/items/EditForm';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { ItemsService } from '@/client';
import { ItemRead } from '@/client';

const EditItemPage: React.FC = () => {
    const { itemSlug } = useParams<{ itemSlug: string }>();
    const [initialValues, setInitialValues] = useState<ItemRead | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async (): Promise<void> => {
            if (!itemSlug) return;

            try {
                setLoading(true);
                setError(null);
                const data = await ItemsService.getItemBySlugApiV1ItemsItemSlugGet({ itemSlug });
                setInitialValues(data);
            } catch (err) {
                setError('Failed to load item data.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [itemSlug]);

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

    if (!initialValues) {
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
                    itemSlug={itemSlug}
                />
            </Container>
            <Footer />
        </Box>
    );
};

export default EditItemPage;
