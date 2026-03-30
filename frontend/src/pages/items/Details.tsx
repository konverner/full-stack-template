import { ItemsService } from "@/client";
import {
	Alert,
	Box,
	Breadcrumbs,
	CircularProgress,
	Container,
	Link,
	Typography,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import ItemDetails from "../../components/items/Details";
import { getUserProfileData } from "../../utils/auth";

interface Owner {
	id: number;
	username: string;
}

interface Item {
	id: number;
	name: string;
	slug: string;
	description?: string | null;
	available: boolean;
	image_url?: string | null;
	website_url?: string | null;
	owner: Owner;
	created_at?: string | null;
	updated_at?: string | null;
	tags?: string[] | null;
}

interface User {
	id: number;
	email?: string;
	is_superuser: boolean;
	username?: string;
	// Add other user properties as needed
}

const ItemsDetailsPage: React.FC = () => {
	const { itemSlug } = useParams<{ itemSlug: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const [item, setItem] = useState<Item | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		const user = getUserProfileData();
		setCurrentUser(user as User | null);
	}, []);

	useEffect(() => {
		const fetchItemDetails = async (): Promise<void> => {
			if (!itemSlug) return;

			try {
				setLoading(true);
				setError(null);

				let itemId = (location.state as any)?.itemId;

				if (!itemId) {
					// Fallback: find itemId by slug if not in state (direct link/refresh)
					const data = await ItemsService.listItemsApiV1ItemsGet({
						slug: itemSlug,
					});
					if (data.items && data.items.length > 0) {
						itemId = data.items[0].id;
					} else {
						throw new Error("Item not found");
					}
				}

				// Use itemId to get full info from backend as requested
				const data = await ItemsService.getItemByIdApiV1ItemsItemIdGet({
					itemId: Number(itemId),
				});
				setItem({
					...data,
					id: Number(data.id),
					available:
						typeof data.available === "boolean" ? data.available : false,
					owner: data.owner ? data.owner : { id: 0, username: "unknown" },
				});
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch item details.",
				);
				console.error("Error fetching item details:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchItemDetails();
	}, [itemSlug, location.state]);

	if (loading) {
		return (
			<Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
				<CircularProgress />
			</Container>
		);
	}

	if (error) {
		return (
			<Container sx={{ mt: 5 }}>
				<Alert severity="error">{error}</Alert>
			</Container>
		);
	}

	if (!item) {
		return (
			<Container sx={{ mt: 5 }}>
				<Typography variant="h6">Item not found.</Typography>
			</Container>
		);
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<Header />
			<Container maxWidth="md">
				<Box
					sx={{
						mb: 2,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
						<Link
							underline="hover"
							component="button"
							onClick={() => navigate("/")}
							sx={{ display: "flex", alignItems: "center" }}
							color="inherit"
						>
							Home
						</Link>
						<Link
							underline="hover"
							component="button"
							onClick={() => navigate("/items")}
							sx={{ display: "flex", alignItems: "center" }}
							color="inherit"
						>
							Items
						</Link>
						<Typography color="text.primary">{item.name}</Typography>
					</Breadcrumbs>
				</Box>
				<ItemDetails item={item} currentUser={currentUser} />
			</Container>
			<Footer />
		</Box>
	);
};

export default ItemsDetailsPage;
