import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Container, Box, Link } from '@mui/material';


const IndexPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <h1>Welcome to the Full Stack Template</h1>
          <p>This is a basic template for a full stack application using React and Material UI.</p>
          <p>GitHub Repo: <Link href="https://github.com/konverner/full-stack-template" color="primary" target="_blank" rel="noopener noreferrer">https://github.com/konverner/full-stack-template</Link></p>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default IndexPage;
