import { useState, useEffect } from 'react';
import Header from '../../components/common/Header.js';
import Footer from '../../components/common/Footer.js';
import { Box, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { getUserProfileData } from '../../api/auth.js';

const UserProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // 1. Get user profile
                const profile = getUserProfileData();
                if (profile) {
                    setUserProfile(profile);
                } else {
                    setError('User profile not found. Please ensure you are logged in.');
                }

            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError(err.message || 'Failed to load user data. Please try again.');
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
                                <Typography><strong>Name:</strong> {userProfile.name}</Typography>
                                <Typography><strong>Email:</strong> {userProfile.email}</Typography>
                                <Typography><strong>Role:</strong> {userProfile.role || "User"}</Typography>
                                <Typography><strong>Joined:</strong> {new Date(userProfile.created_at).toLocaleDateString()}</Typography>
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