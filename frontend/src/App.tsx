import {
	CssBaseline,
	ThemeProvider,
	createTheme,
	useMediaQuery,
} from "@mui/material";
import { enUS } from "@mui/material/locale";
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
import CreateUserPage from "./pages/users/Create";
import UserDetails from "./pages/users/Details";
import EditUserPage from "./pages/users/Edit";
import UsersTablePage from "./pages/users/Table";

const createAppTheme = (mode: "light" | "dark") =>
	createTheme(
		{
			palette:
				mode === "dark"
					? {
							primary: { main: "#56c4be" },
							secondary: { main: "#272727" },
							background: { default: "#1f1f1f", paper: "#272727" },
							text: { primary: "#e6e6e6", secondary: "#bebebe" },
							success: { main: "#6dca70" },
							mode,
						}
					: {
							primary: { main: "#272727" },
							secondary: { main: "#56c4be" },
							background: { default: "#f5f5f5", paper: "#ffffff" },
							text: { primary: "#242424", secondary: "#a0a0a0" },
							mode,
						},
		},
		enUS,
	);

const lightTheme = createAppTheme("light");
const darkTheme = createAppTheme("dark");

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
