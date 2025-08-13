
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Container, Box } from '@mui/material';
import UsersTable from '../../components/users/Table';

const UsersTablePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <UsersTable />
      </Container>
      <Footer />
    </Box>
  );
};

export default UsersTablePage;
