import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TableSortLabel, TablePagination, CircularProgress, Typography, Box, Link as MuiLink, Avatar,
  useMediaQuery, useTheme
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import DescriptionIcon from '@mui/icons-material/Description'; // <-- Added import
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ItemsService } from '@/client';
import { ItemRead } from '@/client';

interface ItemsResponse {
  items: ItemRead[];
  total: number;
}

interface HeadCell {
  id: string;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
  sortable: boolean;
  align: 'left' | 'center' | 'right';
}

type SortDirection = 'asc' | 'desc';

const DEFAULT_ROWS_PER_PAGE = 20;

const headCells: HeadCell[] = [
  { id: 'index', numeric: true, disablePadding: false, label: '#', sortable: false, align: 'center' },
  { id: 'image', numeric: false, disablePadding: false, label: '', sortable: false, align: 'center' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name', sortable: true, align: 'center' },
  { id: 'rating', numeric: false, disablePadding: false, label: 'Rating', sortable: true, align: 'center' },
  { id: 'available', numeric: false, disablePadding: false, label: 'Available', sortable: true, align: 'center' },
  { id: 'creator', numeric: true, disablePadding: false, label: 'Creator', sortable: true, align: 'center' },
];

const ItemsTable: React.FC = () => {
  const [items, setItems] = useState<ItemRead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<SortDirection>('desc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_ROWS_PER_PAGE);
  const [totalRows, setTotalRows] = useState<number>(0);
  const navigate = useNavigate();

  // We do not display index and image on small screens
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const visibleHeadCells = useMemo<HeadCell[]>(
    () => headCells.filter((h) => !(isSmDown && (h.id === 'index' || h.id === 'image' || h.id === 'creator'))),
    [isSmDown]
  );

  const fetchItems = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data: ItemsResponse = await ItemsService.listItemsApiV1ItemsGet({
        sortField: orderBy,
        sortDirection: order,
        limit: rowsPerPage,
        skip: page * rowsPerPage,
      });
      setItems(data.items || []);
      setTotalRows(data.total || 0);
    } catch (err: any) {
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

  const handleRowClick = (event: React.MouseEvent, slug: string): void => {
    // Prevent navigation if the click was on a link or button inside the row
    if ((event.target as HTMLElement).closest('a, button')) {
      return;
    }
    navigate(`/items/${slug}`);
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
              {visibleHeadCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || (headCell.numeric ? 'right' : 'left')}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{
                    fontWeight: 'bold',
                    ...(headCell.id === 'image' && { width: '80px' }),
                    ...(headCell.id === 'index' && { width: '60px' })
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
                <TableCell colSpan={visibleHeadCells.length} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No items found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const startIndex = page * rowsPerPage;

                return (
                  <TableRow
                    hover
                    key={item.id}
                    onClick={(event) => handleRowClick(event, item.slug)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* Index */}
                    {!isSmDown && (
                      <TableCell align="center">
                        {startIndex + index + 1}
                      </TableCell>
                    )}

                    {/* Image */}
                    {!isSmDown && (
                      <TableCell align="center">
                        {item.image_url ? (
                          <Avatar
                            src={item.image_url}
                            alt={item.name || 'Item'}
                            variant="rounded"
                            sx={{
                              width: 90,
                              height: 90,
                              mx: 'auto',
                              bgcolor: 'grey.200'
                            }}
                          />
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 90,
                              height: 90,
                              mx: 'auto',
                              bgcolor: 'grey.200',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <DescriptionIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                          </Avatar>
                        )}
                      </TableCell>
                    )}

                    {/* Name */}
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {item.name || 'N/A'}
                      </Typography>
                    </TableCell>

                    {/* Rating */}
                    <TableCell align="center">
                      <Box component="span">
                        {(item.rating ?? 0)} / 5
                      </Box>
                    </TableCell>

                    {/* Available */}
                    <TableCell align="center">
                      <Box component="span">
                        {item.available ? <DoneIcon color="primary" /> : <CancelIcon />}
                      </Box>
                    </TableCell>

                    {/* Creator */}
                    {!isSmDown && (
                      <TableCell align="center">
                        <MuiLink
                          color="text.secondary"
                          component={RouterLink}
                          to={`/users/${item.owner?.username}`}
                          onClick={(e) => e.stopPropagation()}
                      >
                        {item.owner?.username || 'N/A'}
                      </MuiLink>
                    </TableCell>
                    )
                  }
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
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count !== -1 ? count : `more then ${to}`}`}
      />
    </Paper>
  );
};

export default ItemsTable;
