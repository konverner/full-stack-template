import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { Box, Container, Typography, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import EditForm from '../../components/users/EditForm';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { getUserByUsername } from '../../api/users';

const EditUserPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getUserByUsername(username);
                setInitialValues(data);
            } catch (err) {
                setError('Failed to load user data.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [username]);

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
                <Typography variant="h6">User not found.</Typography>
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
                    <Link component={RouterLink} underline="hover" color="inherit" to="/users">
                        Users
                    </Link>
                    <Typography color="text.primary">Edit</Typography>
                </Breadcrumbs>
                <EditForm initialValues={initialValues} username={username} />
            </Container>
            <Footer />
        </Box>
    );
};

export default EditUserPage;