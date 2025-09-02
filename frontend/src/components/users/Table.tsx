import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TablePagination, CircularProgress, Typography, Box, Button,
  useTheme, useMediaQuery
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UsersService, UserRead, UserListResponse } from '@/client';

const DEFAULT_ROWS_PER_PAGE = 20;

interface HeadCell {
  id: string;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
  sortable: boolean;
  align: 'left' | 'center' | 'right' | 'inherit' | 'justify';
}

const headCells: HeadCell[] = [
  { id: 'index', numeric: true, disablePadding: false, label: '#', sortable: false, align: 'center' },
  { id: 'avatar', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
  { id: 'username', numeric: false, disablePadding: false, label: 'Username', sortable: true, align: 'center' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email', sortable: true, align: 'center' },
  { id: 'is_active', numeric: false, disablePadding: false, label: 'Active', sortable: true, align: 'center' },
  { id: 'is_superuser', numeric: false, disablePadding: false, label: 'Superuser', sortable: true, align: 'center' },
];

type SortDirection = 'asc' | 'desc';

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<UserRead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<SortDirection>('asc');
  const [orderBy, setOrderBy] = useState<string>('username');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [totalRows, setTotalRows] = useState<number>(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const HIDDEN_FIELDS_SM = useMemo(
    () => new Set(['index', 'avatar', 'active', 'is_active', 'superuser', 'is_superuser']),
    []
  );

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const params: { [key: string]: string | number | boolean | null | undefined } = {
        sort_field: orderBy,
        sort_direction: order,
        limit: rowsPerPage,
        skip: page * rowsPerPage,
      };
      // Remove undefined or null params
      Object.keys(params).forEach(key => (params[key] == null) && delete params[key]);
      const data: UserListResponse = await UsersService.listUsersApiV1UsersGet({
        sortField: orderBy,
        sortDirection: order,
        limit: rowsPerPage,
        skip: page * rowsPerPage,
      });
      setUsers(data.users || []);
      setTotalRows(data.total || 0);
    } catch (err: any) {
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

  const handleRequestSort = (property: string): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const handleRowClick = (event: React.MouseEvent, username: string): void => {
    if ((event.target as HTMLElement).closest('a, button')) {
      return;
    }
    navigate(`/users/${username}`);
  };

  const responsiveHeadCells = useMemo(() => {
    return isSmallScreen
      ? headCells.filter(headCell => !HIDDEN_FIELDS_SM.has(headCell.id))
      : headCells;
  }, [isSmallScreen, HIDDEN_FIELDS_SM]);

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
              {responsiveHeadCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align}
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
                <TableCell colSpan={responsiveHeadCells.length} align="center" sx={{ py: 3, color: 'text.secondary' }}>
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
                    {!isSmallScreen && (
                      <TableCell align="center">
                        {startIndex + index + 1}
                      </TableCell>
                    )}

                    {/* Avatar */}
                    {!isSmallScreen && (
                      <TableCell align="center">
                        <Avatar
                          src={user.avatar_url || undefined}
                          alt={user.username}
                          sx={{
                            width: 48,
                            height: 48,
                            mx: 'auto',
                            bgcolor: 'grey.200'
                          }}
                        />
                      </TableCell>
                    )}

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
                    {!isSmallScreen && (
                      <TableCell align="center">
                        <Box component="span">
                          {user.is_active ? <DoneIcon color="primary" /> : <CancelIcon color="error" />}
                        </Box>
                      </TableCell>
                    )}

                    {/* Superuser */}
                    {!isSmallScreen && (
                      <TableCell align="center">
                        <Box component="span">
                          {user.is_superuser ? <DoneIcon color="primary" /> : <CancelIcon color="disabled" />}
                        </Box>
                      </TableCell>
                    )}

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
