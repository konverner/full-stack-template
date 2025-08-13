
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Container, Box } from '@mui/material';
import ItemsTable from '../../components/items/Table';

const ItemsTablePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <ItemsTable />
      </Container>
      <Footer />
    </Box>
  );
};

export default ItemsTablePage;
