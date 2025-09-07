import { Box, Typography, Grid, Paper, Avatar, Link, Chip, Button, Stack, Rating } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { ItemsService } from '@/client';

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
    rating?: number | null;
}

interface CurrentUser {
    id: number;
    is_superuser: boolean;
}

interface ItemDetailsProps {
    item: Item | null;
    currentUser: CurrentUser | null;
    onDelete?: () => void;
}

const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, currentUser, onDelete }) => {
    if (!item) return null;

    // Determine if user is owner or admin
    const canEditOrDelete =
        currentUser &&
        (currentUser.is_superuser || (item.owner && currentUser.id === item.owner.id));

    const handleDelete = async (): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await ItemsService.deleteItemApiV1ItemsItemIdDelete({ itemId: item.id });
                if (onDelete) {
                    onDelete();
                }
                // Redirect to items list or show success message
                window.location.href = '/items';
            } catch (error: any) {
                console.error('Delete failed:', error);
                alert('Failed to delete item. Please try again.');
            }
        }
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: 2 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid >
                        <Avatar
                            src={item.image_url || '/assets/images/image-placeholder.png'}
                            alt={`${item.name} Image`}
                            sx={{ width: 90, height: 90, borderRadius: 2, bgcolor: 'grey.100', boxShadow: 1 }}
                            variant="rounded"
                        />
                    </Grid>
                    <Grid >
                        <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: 26, sm: 32 } }}>
                            {item.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {item.description && (
                <Box sx={{ mb: 4, mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                        Description
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: 15, sm: 16 } }} dangerouslySetInnerHTML={{ __html: item.description }} />
                </Box>
            )}

            <Grid container spacing={3} sx={{ mt: item.description ? 0 : 4 }}>
                <Grid size={12} >
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            Content Details
                        </Typography>
                        {item.website_url && (
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                Website:{' '}
                                <Link href={item.website_url} target="_blank" rel="noopener noreferrer" color="primary" underline="hover">
                                    {item.website_url.length > 40 ? `${item.website_url.substring(0, 40)}...` : item.website_url}
                                </Link>
                            </Typography>
                        )}
                        {typeof item.available === 'boolean' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                    Availability:
                                </Typography>
                                {item.available ? <DoneIcon color="primary" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                            </Box>
                        )}
                        {item.rating !== undefined && item.rating !== null && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                    Rating:
                                </Typography>
                                <Rating value={item.rating} precision={0.5} readOnly size="small" />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    {item.rating.toFixed(1)}/5
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid size={12}>
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            Meta Details
                        </Typography>
                        {item.owner && item.owner.username && (
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                Created by:{' '}
                                <Link href={`/users/${item.owner.username}`} underline="hover" color="primary">
                                    <Box component="span" sx={{ fontWeight: 500 }}>{item.owner.username}</Box>
                                </Link>
                            </Typography>
                        )}
                        {item.created_at && (
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                Created on: <Box component="span" sx={{ fontWeight: 400 }}>{formatDate(item.created_at)}</Box>
                            </Typography>
                        )}
                        {item.updated_at && (
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                Last Updated: <Box component="span" sx={{ fontWeight: 400 }}>{formatDate(item.updated_at)}</Box>
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {item.tags && item.tags.length > 0 && (
                    <Grid size={12}>
                        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                                Tags
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                                {item.tags.map((tag, index) => (
                                    <Chip key={index} label={tag} size="small" sx={{ fontSize: 13, fontWeight: 400 }} />
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Buttons at the bottom */}
            {canEditOrDelete && (
                <Stack direction="row" spacing={2} sx={{ mt: 4, mb: 4 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        href={`/items/${item.slug}/edit`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Stack>
            )}
        </Box>
    );
};

export default ItemDetails;
