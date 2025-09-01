import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import IndexPage from './pages/index.tsx';
import ItemsTablePage from './pages/items/Table.tsx';
import LoginPage from './pages/auth/login.tsx';
import RegisterPage from './pages/auth/register.tsx';
import ProfilePage from './pages/auth/profile.tsx';
import ItemsDetailsPage from './pages/items/Details.tsx';
import CreateItemPage from './pages/items/Create.tsx';
import EditItemPage from './pages/items/Edit.tsx';
import UsersTablePage from './pages/users/Table.tsx';
import CreateUserPage from './pages/users/Create.tsx';
import EditUserPage from './pages/users/Edit.tsx';
import UserDetails from './pages/users/Details.tsx';

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
                </Routes>
            </main>
        </ThemeProvider>
    );
}

export default App;
