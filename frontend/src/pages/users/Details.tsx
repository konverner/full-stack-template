import { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, CircularProgress, Link, Alert, Box, Breadcrumbs } from '@mui/material';
import UserDetails from '../../components/users/Details';
import { UsersService } from '@/client';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { getUserProfileData } from '../../utils/auth';
import { UserRead } from '@/client';

const UserDetailsPage = () => {
    const { username } = useParams();
    const [user, setUser] = useState<UserRead | null>(null);
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

    const fetchUserDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await UsersService.getUserByUsernameApiV1UsersUsernameGet({ username: username as string });
            setUser(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch user details.');
            }
            console.error("Error fetching user details:", err);
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        if (typeof username === 'string') {
            fetchUserDetails();
        }
    }, [username, fetchUserDetails]);

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

    if (!user) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography variant="h6">User not found.</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="md">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2, mb: 2 }}>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/">
                        Home
                    </Link>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/users">
                        Users
                    </Link>
                    <Typography color="text.primary">{user.username}</Typography>
                </Breadcrumbs>
                <UserDetails user={user} currentUser={currentUser} refetchUser={fetchUserDetails} />
            </Container>
            <Footer />
        </Box>
    );
};

export default UserDetailsPage;
