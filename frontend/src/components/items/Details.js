import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, Link, Chip, Button, Stack } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { deleteItem } from '../../api/items.js';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const ItemDetails = ({ item, currentUser, onDelete }) => {
    if (!item) return null;

    // Determine if user is owner or admin
    const canEditOrDelete =
        currentUser &&
        (currentUser.is_superuser || (item.owner && currentUser.id === item.owner.id));

    const handleDelete = async () => {
        console.log("Attempting to delete item:", item.id);
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteItem(item.id);
                window.location.href = '/items';
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete item. Please try again.');
            }
        }
    };

    console.log("Item Details:", item, "Current User:", currentUser, "Can Edit/Delete:", canEditOrDelete);

    return (
        <Box>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: 2 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item sx={{ mr: 2 }}>
                        <Avatar
                            src={item.image_url || '/assets/images/image-placeholder.png'}
                            alt={`${item.name} Image`}
                            sx={{ width: 72, height: 72, borderRadius: 2, bgcolor: 'grey.100' }}
                            variant="rounded"
                        />
                    </Grid>
                    <Grid item xs={10} sm md={4}>
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

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            Details A
                        </Typography>
                        {item.website_url && (
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                Website:{' '}
                                <Link href={item.website_url} target="_blank" rel="noopener noreferrer" underline="hover">
                                    {item.website_url}
                                </Link>
                            </Typography>
                        )}
                        {typeof item.available === 'boolean' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                    Availability:
                                </Typography>
                                {item.available ? <DoneIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            Details B
                        </Typography>
                        {item.owner && item.owner.username && (
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                Created by: <Box component="span" sx={{ fontWeight: 500 }}>{item.owner.username}</Box>
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
                    <Grid item xs={12}>
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
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
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