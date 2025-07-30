import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router';
import { Container, Typography, CircularProgress, Link, Alert, Box, Breadcrumbs } from '@mui/material';
import UserDetails from '../../components/users/Details.js';
import { getUserByUsername } from '../../api/users.js';
import Header from '../../components/common/Header.js';
import Footer from '../../components/common/Footer.js';

const UserDetailsPage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStoredUser = () => {
        const userProfile = localStorage.getItem('userProfile');
        return userProfile ? JSON.parse(userProfile) : null;
    };
    const [currentUser, setCurrentUser] = useState(getStoredUser());

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getUserByUsername(username);
                setUser(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch user details.');
                console.error("Error fetching user details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserDetails();
        }
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
                <UserDetails
                    user={user}
                    currentUser={currentUser}
                />
            </Container>
            <Footer />
        </Box>
    );
};

export default UserDetailsPage;