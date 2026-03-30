import { ItemsService } from "@/client";
import type { ItemCreate } from "@/client";
import {
	Alert,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	Rating,
	TextField,
	Typography,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ItemData {
	name: string;
	slug: string;
	description: string;
	available: boolean;
	image_url: string;
	website_url: string;
	rating: number | null;
}

interface FieldErrors {
	slug: string;
	image_url: string;
	website_url: string;
}

const CreateForm: React.FC = () => {
	const [itemData, setItemData] = useState<ItemData>({
		name: "",
		slug: "",
		description: "",
		available: true,
		image_url: "",
		website_url: "",
		rating: null,
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
		slug: "",
		image_url: "",
		website_url: "",
	});
	const navigate = useNavigate();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		setItemData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleRatingChange = (_: unknown, value: number | null): void => {
		setItemData((prev) => ({ ...prev, rating: value }));
	};

	const trimItemData = (data: ItemData): ItemData => {
		const trimmed = { ...data };
		for (const key of Object.keys(trimmed) as (keyof ItemData)[]) {
			const value = trimmed[key];
			if (typeof value === "string") {
				(trimmed[key] as string) = value.trim();
			}
		}
		return trimmed;
	};

	const validateFields = (): boolean => {
		const trimmedData = trimItemData(itemData);
		const errors = { slug: "", image_url: "", website_url: "" };

		// Slug: lowercase letters, numbers, hyphens only
		if (trimmedData.slug && !/^[a-z0-9-]+$/.test(trimmedData.slug)) {
			errors.slug =
				"Slug must contain only lowercase letters, numbers, and hyphens.";
		}

		// Image URL: must be a valid URL if not empty
		if (
			trimmedData.image_url &&
			!/^https?:\/\/.+\..+/.test(trimmedData.image_url)
		) {
			errors.image_url = "Image URL must be a valid URL.";
		}

		// Website URL: must be a valid URL if not empty
		if (
			trimmedData.website_url &&
			!/^https?:\/\/.+\..+/.test(trimmedData.website_url)
		) {
			errors.website_url = "Website URL must be a valid URL.";
		}

		setFieldErrors(errors);

		// Return true if no errors
		return !errors.slug && !errors.image_url && !errors.website_url;
	};

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		event.preventDefault();
		setError(null);

		// Trim data before validation and submission
		const trimmedData = trimItemData(itemData);

		// Validate fields before submitting
		if (!validateFields()) {
			return;
		}

		setLoading(true);
		// Filter out empty optional fields but keep boolean values
		const dataToSubmit: Record<string, unknown> = {
			...trimmedData,
			name: trimmedData.name || "",
		};

		for (const key of Object.keys(dataToSubmit)) {
			if (key === "available") {
				dataToSubmit[key] = Boolean(dataToSubmit[key]);
			} else if (dataToSubmit[key] === "" || dataToSubmit[key] === null) {
				delete dataToSubmit[key];
			}
		}

		try {
			const newItem = await ItemsService.createItemApiV1ItemsPost({
				requestBody: dataToSubmit as unknown as ItemCreate,
			});
			navigate(`/items/${newItem.slug}`);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: (err as any)?.message ||
						"An error occurred while creating the item.";
			setError(errorMessage);
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Create Item
			</Typography>
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			<TextField
				margin="normal"
				required
				fullWidth
				id="name"
				label="Item Name"
				name="name"
				autoComplete="name"
				autoFocus
				value={itemData.name}
				onChange={handleChange}
			/>
			<TextField
				margin="normal"
				fullWidth
				id="slug"
				label="Slug (URL-friendly name)"
				name="slug"
				value={itemData.slug}
				onChange={handleChange}
				helperText={
					fieldErrors.slug ||
					"Optional. Use lowercase letters, numbers, and hyphens."
				}
				error={!!fieldErrors.slug}
			/>
			<TextField
				margin="normal"
				fullWidth
				name="description"
				label="Description"
				id="description"
				multiline
				rows={4}
				value={itemData.description}
				onChange={handleChange}
			/>
			<FormControlLabel
				control={
					<Checkbox
						checked={itemData.available}
						onChange={(event) =>
							setItemData({ ...itemData, available: event.target.checked })
						}
						color="primary"
						name="available"
						id="available"
					/>
				}
				label="Available"
				sx={{ mt: 2, mb: 1 }}
			/>
			<TextField
				margin="normal"
				fullWidth
				name="image_url"
				label="Image URL"
				id="image_url"
				value={itemData.image_url}
				onChange={handleChange}
				helperText={fieldErrors.image_url}
				error={!!fieldErrors.image_url}
			/>
			<TextField
				margin="normal"
				fullWidth
				name="website_url"
				label="Website URL"
				id="website_url"
				value={itemData.website_url}
				onChange={handleChange}
				helperText={fieldErrors.website_url}
				error={!!fieldErrors.website_url}
			/>

			<Box sx={{ mt: 2, mb: 1 }}>
				<Typography variant="subtitle1" sx={{ mb: 0.5 }}>
					Rating
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Rating
						name="rating"
						precision={0.5}
						value={itemData.rating}
						onChange={handleRatingChange}
					/>
				</Box>
			</Box>

			<Button
				type="submit"
				variant="contained"
				sx={{ mt: 2, mb: 2 }}
				disabled={loading}
			>
				{loading ? <CircularProgress size={24} /> : "Create Item"}
			</Button>
		</Box>
	);
};

export default CreateForm;
