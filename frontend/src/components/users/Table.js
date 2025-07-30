import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TablePagination, CircularProgress, Typography, Box, Button, Link as MuiLink, Avatar
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { Link as RouterLink, useNavigate } from 'react-router';
import { listUsers } from '../../api/users'; // <-- Use users API

const DEFAULT_ROWS_PER_PAGE = 20;

const headCells = [
  { id: 'index', numeric: true, disablePadding: false, label: '#', sortable: false, align: 'center' },
  { id: 'avatar', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
  { id: 'username', numeric: false, disablePadding: false, label: 'Username', sortable: true, align: 'center' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email', sortable: true, align: 'center' },
  { id: 'is_active', numeric: false, disablePadding: false, label: 'Active', sortable: true, align: 'center' },
  { id: 'is_superuser', numeric: false, disablePadding: false, label: 'Superuser', sortable: true, align: 'center' },
  { id: 'actions', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
];

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('username');
  const [page, setPage] = useState(0); // 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        sort_field: orderBy,
        sort_direction: order,
        limit: rowsPerPage,
        skip: page * rowsPerPage,
      };
      // Remove undefined or null params
      Object.keys(params).forEach(key => (params[key] == null) && delete params[key]);
      const data = await listUsers(params); // Use imported API function
      setUsers(data.items || data.users || []);
      setTotalRows(data.total || data.count || 0);
    } catch (err) {
      setError(err.message);
      setUsers([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [order, orderBy, page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const handleRowClick = (event, username) => {
    if (event.target.closest('a, button')) {
      return;
    }
    navigate(`/users/${username}`);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 3 }}>Error loading users: {error}</Typography>;
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table stickyHeader aria-label="users table">
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
                    ...(headCell.id === 'avatar' && { width: '80px' }),
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => {
                const startIndex = page * rowsPerPage;
                return (
                  <TableRow
                    hover
                    key={user.username}
                    onClick={(event) => handleRowClick(event, user.username)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* Index */}
                    <TableCell align="center">
                      {startIndex + index + 1}
                    </TableCell>

                    {/* Avatar */}
                    <TableCell align="center">
                      <Avatar
                        src={user.avatar_url}
                        alt={user.username}
                        sx={{
                          width: 48,
                          height: 48,
                          mx: 'auto',
                          bgcolor: 'grey.200'
                        }}
                      />
                    </TableCell>

                    {/* Username */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {user.username}
                      </Typography>
                    </TableCell>

                    {/* Email */}
                    <TableCell align="center">
                      {user.email || 'N/A'}
                    </TableCell>

                    {/* Active */}
                    <TableCell align="center">
                      <Box component="span">
                        {user.is_active ? <DoneIcon color="success" /> : <CancelIcon color="error" />}
                      </Box>
                    </TableCell>

                    {/* Superuser */}
                    <TableCell align="center">
                      <Box component="span">
                        {user.is_superuser ? <DoneIcon color="primary" /> : <CancelIcon color="disabled" />}
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Button
                        component={RouterLink}
                        to={`/users/${user.username}`}
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

export default UsersTable;