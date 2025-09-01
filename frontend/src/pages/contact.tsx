
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Container, Box, Breadcrumbs, Link, Typography } from '@mui/material';


const ContactPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
            <Link href="/" sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                Home
            </Link>
            <Typography color="text.primary">Contact</Typography>
        </Breadcrumbs>
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <h1>Contact</h1>
          <p>You can contact us at contact@example.com</p>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default ContactPage;
