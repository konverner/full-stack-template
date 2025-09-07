import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Link, CircularProgress, Alert } from '@mui/material';
import EditForm from '../../components/users/EditForm';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { UsersService, UserRead } from '@/client';
import { getUserProfileData } from '../../utils/auth';

const EditUserPage = () => {
    const { username } = useParams();
    const [initialValues, setInitialValues] = useState<UserRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getStoredUser = (): { username: string; is_superuser: boolean } | null => {
        const data = getUserProfileData();
        if (data && typeof data.username === 'string' && typeof data.is_superuser === 'boolean') {
            return {
                username: data.username,
                is_superuser: data.is_superuser,
            };
        }
        return null;
    };
    const [currentUser] = useState(getStoredUser());

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await UsersService.getUserByUsernameApiV1UsersUsernameGet({ username: username || '' });
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
                <EditForm
                    initialValues={{
                        ...initialValues,
                        email: initialValues.email ?? undefined,
                        avatar_url: initialValues.avatar_url ?? undefined,
                    }}
                    username={username as string}
                    currentUser={currentUser}
                />
            </Container>
            <Footer />
        </Box>
    );
};

export default EditUserPage;
