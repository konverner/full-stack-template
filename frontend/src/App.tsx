
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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

// Basic theme for Material UI
const theme = createTheme({
    palette: {
        primary: {
            main: '#272727', // Example primary color
        },
        secondary: {
            main: '#295e7c', // Example secondary color
        },
        background: {
            default: '#f5f5f5', // Light background color
            paper: '#ffffff', // Paper background color
        },
        text: {
            primary: '#242424', // Primary text color
            secondary: '#a0a0a0', // Secondary text color
        },
        mode: 'light', // Light mode by default
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Normalize CSS and apply background color from theme */}
            <main>
                <Routes>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/items" element={<ItemsTablePage />} />
                    <Route path="/items/create" element={<CreateItemPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/items/:itemSlug" element={< ItemsDetailsPage />} />
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
