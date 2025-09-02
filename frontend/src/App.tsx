import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import IndexPage from './pages';
import ItemsTablePage from './pages/items/Table';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import ProfilePage from './pages/auth/profile';
import ItemsDetailsPage from './pages/items/Details';
import CreateItemPage from './pages/items/Create';
import EditItemPage from './pages/items/Edit';
import UsersTablePage from './pages/users/Table';
import CreateUserPage from './pages/users/Create';
import EditUserPage from './pages/users/Edit';
import UserDetails from './pages/users/Details';
import ContactPage from './pages/contact';
import PrivacyPage from './pages/privacy';
import FaqPage from './pages/faq';
import TermsOfServicePage from './pages/terms';
import AboutPage from './pages/about';

// Light theme
const lightTheme = createTheme({
    palette: {
        primary: { main: '#272727' },
        secondary: { main: '#56c4be' },
        background: { default: '#f5f5f5', paper: '#ffffff' },
        text: { primary: '#242424', secondary: '#a0a0a0' },
        mode: 'light',
    },
});

// Dark theme
const darkTheme = createTheme({
    palette: {
        primary: { main: '#56c4be' },
        secondary: { main: '#272727' },
        background: { default: '#1f1f1f', paper: '#272727' },
        text: { primary: '#e6e6e6', secondary: '#bebebe' },
        success: { main: '#6dca70' },
        mode: 'dark',
    },
});

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Routes>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/items" element={<ItemsTablePage />} />
                    <Route path="/items/create" element={<CreateItemPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/items/:itemSlug" element={<ItemsDetailsPage />} />
                    <Route path="/items/:itemSlug/edit" element={<EditItemPage />} />
                    <Route path="/users" element={<UsersTablePage />} />
                    <Route path="/users/:username" element={<UserDetails />} />
                    <Route path="/users/create" element={<CreateUserPage />} />
                    <Route path="/users/:username/edit" element={<EditUserPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </main>
        </ThemeProvider>
    );
}

export default App;
