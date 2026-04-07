import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages";
import AboutPage from "./pages/about";
import LoginPage from "./pages/auth/login";
import ProfilePage from "./pages/auth/profile";
import RegisterPage from "./pages/auth/register";
import ContactPage from "./pages/contact";
import FaqPage from "./pages/faq";
import CreateItemPage from "./pages/items/Create";
import ItemsDetailsPage from "./pages/items/Details";
import EditItemPage from "./pages/items/Edit";
import ItemsTablePage from "./pages/items/Table";
import PrivacyPage from "./pages/privacy";
import TermsOfServicePage from "./pages/terms";
import { darkTheme, lightTheme } from "./theme";
import CreateUserPage from "./pages/users/Create";
import UserDetails from "./pages/users/Details";
import EditUserPage from "./pages/users/Edit";
import UsersTablePage from "./pages/users/Table";

function App() {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
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
