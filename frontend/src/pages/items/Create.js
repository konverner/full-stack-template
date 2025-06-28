import { Link as RouterLink } from 'react-router';
import { Container, Typography, Breadcrumbs, Link } from '@mui/material';
import CreateForm from '../../components/items/CreateForm';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const CreateItemPage = () => {
    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/">
                        Home
                    </Link>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/items">
                        Items
                    </Link>
                    <Typography color="text.primary">Create</Typography>
                </Breadcrumbs>
                <CreateForm />
            </Container>
            <Footer />
        </>
    );
};

export default CreateItemPage;
