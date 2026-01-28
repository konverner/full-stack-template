import { Box, Typography, Paper, Avatar, Link, Button, Stack, Grid } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { UsersService } from '@/client';
import { useNavigate } from 'react-router-dom';
import { UserRead } from '@/client';



interface CurrentUser {
    username: string;
    is_superuser: boolean;
}

interface UserDetailsProps {
    user: UserRead | null;
    currentUser: CurrentUser | null;
    refetchUser: () => void;
}

const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const UserDetails: React.FC<UserDetailsProps> = ({ user, currentUser, refetchUser }) => {
    const navigate = useNavigate();

    if (!user) return null;

    // Allow edit/delete if current user is superuser or is the user themselves
    const canEditOrDelete: boolean =
        currentUser !== null &&
        (currentUser.is_superuser || currentUser.username === user.username);

    const handleDelete = async (): Promise<void> => {
        if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
            try {
                await UsersService.deleteUserByUsernameApiV1UsersUsernameDelete({ username: user.username });
                navigate('/users');
            } catch (error: any) {
                console.error('Delete failed:', error);
                alert(`Failed to delete user: ${error.message}`);
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
            {/* Header Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                        src={user.avatar_url || ''}
                        alt={user.username}
                        sx={{
                            width: { xs: 64, sm: 80 },
                            height: { xs: 64, sm: 80 },
                            bgcolor: 'grey.200'
                        }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                                mb: 0.5,
                                wordBreak: 'break-word'
                            }}
                        >
                            {user.username}
                        </Typography>
                        {user.email && (
                            <Link
                                href={`mailto:${user.email}`}
                                underline="hover"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '1rem',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {user.email}
                            </Link>
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Content Grid */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={12}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography
                            variant="h6"
                            component="h2"
                            gutterBottom
                            sx={{ fontWeight: 600, mb: 2 }}
                        >
                            Account Status
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Active
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {user.is_active ? (
                                        <>
                                            <DoneIcon color="primary" fontSize="small" />
                                        </>
                                    ) : (
                                        <>
                                            <CancelIcon color="primary" fontSize="small" />
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Superuser
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {user.is_superuser ? (
                                        <>
                                            <DoneIcon color="primary" fontSize="small" />
                                        </>
                                    ) : (
                                        <>
                                            <CancelIcon color="disabled" fontSize="small" />
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={12}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                        <Typography
                            variant="h6"
                            component="h2"
                            gutterBottom
                            sx={{ fontWeight: 600, mb: 2 }}
                        >
                            Account Information
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Created
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formatDate(user.created_at)}
                                </Typography>
                            </Box>
                            {/* <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Last Updated
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formatDate(user.updated_at)}
                                </Typography>
                            </Box> */}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            {canEditOrDelete && (
                <Paper elevation={1} sx={{ p: 2}}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, flexWrap: 'wrap', gap: 1 }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            href={`/users/${user.username}/edit`}
                            sx={{ minWidth: 100 }}
                        >
                            Edit User
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={!!currentUser && currentUser.username === user.username}
                            sx={{ minWidth: 100 }}
                        >
                            Delete User
                        </Button>
                        {currentUser && currentUser.username === user.username && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                You cannot delete your own account
                            </Typography>
                        )}
                    </Stack>
                </Paper>
            )}
        </Box>
    );
};

export default UserDetails;
