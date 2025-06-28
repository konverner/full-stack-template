import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TablePagination, CircularProgress, Typography, Box, Button, Link as MuiLink, Avatar
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { fetchItems as fetchItemsAPI } from '../../api/items'; // <-- Use API module

const DEFAULT_ROWS_PER_PAGE = 20;

const headCells = [
  { id: 'index', numeric: true, disablePadding: false, label: '#', sortable: false, align: 'center' },
  { id: 'image', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', sortable: true, align: 'center' },
  { id: 'rating', numeric: true, disablePadding: false, label: 'Rating', sortable: true, align: 'center' },
  { id: 'creator', numeric: true, disablePadding: false, label: 'Creator', sortable: true, align: 'center' },
  { id: 'actions', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
];


const ItemsTable = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0); // 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        field: orderBy,
        direction: order,
        limit: rowsPerPage,
        page: page + 1, // API is 1-indexed
      };
      // Remove undefined or null params
      Object.keys(params).forEach(key => (params[key] == null) && delete params[key]);
      
      const data = await fetchItemsAPI(params); // Use imported API function
      setItems(data.items || []);
      setTotalRows(data.total || 0);
    } catch (err) {
      setError(err.message);
      setItems([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [order, orderBy, page, rowsPerPage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); // Reset to first page on sort
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const handleRowClick = (event, id) => {
    // Prevent navigation if the click was on a link or button inside the row
    if (event.target.closest('a, button')) {
      return;
    }
    navigate(`/items/${id}`);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 3 }}>Error loading items: {error}</Typography>;
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table stickyHeader aria-label="items table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || (headCell.numeric ? 'right' : 'left')}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ 
                    fontWeight: 'bold',
                    ...(headCell.id === 'image' && { width: '80px' }), // Changed 'cover' to 'image' to match headCell id
                    ...(headCell.id === 'index' && { width: '60px' }),
                    ...(headCell.id === 'actions' && { width: '120px' })
                  }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No items found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const startIndex = page * rowsPerPage;
                const ratingValue = parseFloat(item.overall_average_rating);
                const formattedRating = isNaN(ratingValue) ? 'N/A' : ratingValue.toFixed(1);
                const reviewCount = item.total_review_count?.toLocaleString() ?? 'N/A';

                return (
                  <TableRow
                    hover
                    key={item.id}
                    onClick={(event) => handleRowClick(event, item.slug)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* Index */}
                    <TableCell align="center">
                      {startIndex + index + 1}
                    </TableCell>

                    {/* Cover */}
                    <TableCell align="center">
                      <Avatar
                        src={item.image_url}
                        alt={`${item.name || 'Book'} Cover`}
                        variant="square"
                        sx={{ 
                          width: 50, 
                          height: 75, 
                          mx: 'auto',
                          bgcolor: 'grey.200'
                        }}
                      >
                      </Avatar>
                    </TableCell>

                    {/* Title */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {item.name || 'N/A'}
                      </Typography>
                    </TableCell>

                    {/* Rating */}
                    <TableCell align="center">
                        <Box component="span" sx={{ fontWeight: 'bold', color: 'goldenrod' }}>
                        ★ {formattedRating}
                        </Box>
                    </TableCell>

                    {/* Owner */}
                    <TableCell align="center">
                        <MuiLink color='secondary' component={RouterLink} to={`/items/${item.slug}`} onClick={(e) => e.stopPropagation()}>
                        {item.owner.name || 'N/A'}
                        </MuiLink>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Button
                        component={RouterLink}
                        to={`/items/${item.slug}`}
                        variant="outlined"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{ minWidth: 'auto', px: 2 }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows on the page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count !== -1 ? count : `больше чем ${to}`}`}
      />
    </Paper>
  );
};

export default ItemsTable;