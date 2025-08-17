import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Box, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { AuthorizationProfileService, UserRead } from '@/client/index.ts';

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const UserProfilePage = () => {
    const [userProfile, setUserProfile] = useState<UserRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // 1. Get user profile
                const profile = await AuthorizationProfileService.readUsersMeAuthMeGet();
                if (profile) {
                    setUserProfile(profile);
                } else {
                    setError('User profile not found. Please ensure you are logged in.');
                }

            } catch (err) {
                console.error("Failed to fetch user data:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Failed to load user data. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Profile
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {/* Section 1: General info about user account */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Info</Typography>
                        {userProfile ? (
                            <>
                                <Typography><strong>Username:</strong> {userProfile.username}</Typography>
                                <Typography><strong>Email:</strong> {userProfile.email}</Typography>
                                <Typography><strong>Role:</strong> {userProfile.is_superuser ? "Superuser" : "User"}</Typography>
                                <Typography><strong>Joined:</strong> {formatDate(userProfile.created_at)}</Typography>
                            </>
                        ) : (
                            <Typography>An error occurred while fetching user profile data.</Typography>
                        )}
                    </Paper>
                </Container>
            </Container>
            <Footer />
        </Box>
    );
};

export default UserProfilePage;
