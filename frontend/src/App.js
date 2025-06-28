import React from 'react';
import { Routes, Route } from 'react-router';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import IndexPage from './pages/index.js';
import ItemsTablePage from './pages/items/ItemsTablePage.js';
import LoginPage from './pages/auth/login.js';
import RegisterPage from './pages/auth/register.js';
import ProfilePage from './pages/auth/profile.js';
import ItemsDetailsPage from './pages/items/ItemsDetailsPage.js';
import CreateItemPage from './pages/items/Create.js';

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
        sucess: {
            main: '#4caf50', // Success color
        },
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
                </Routes>
            </main>
        </ThemeProvider>
    );
}

export default App;