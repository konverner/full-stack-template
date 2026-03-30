import { ItemsService } from "@/client";
import type { ItemRead } from "@/client";
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from "@mui/icons-material/Description";
import DoneIcon from "@mui/icons-material/Done";
import SearchIcon from "@mui/icons-material/Search";
import {
	Avatar,
	Box,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Link as MuiLink,
	Paper,
	Select,
	TextField,
	Typography,
	styled,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {
	DataGrid,
	type GridColDef,
	type GridFilterModel,
	type GridPaginationModel,
	type GridRenderCellParams,
	type GridSortModel,
	GridToolbarContainer,
	GridToolbarExport,
	GridToolbarFilterButton,
	QuickFilter,
	QuickFilterClear,
	QuickFilterControl,
	QuickFilterTrigger,
	Toolbar,
	ToolbarButton,
	getGridBooleanOperators,
	getGridDateOperators,
	getGridNumericOperators,
	getGridStringOperators,
} from "@mui/x-data-grid";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/locale";

const DEFAULT_PAGE_SIZE = 20;

type OwnerState = {
	expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
	display: "grid",
	alignItems: "center",
	marginLeft: "auto",
});

const StyledToolbarButton = styled(ToolbarButton as any)<{
	ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
	gridArea: "1 / 1",
	width: "min-content",
	height: "min-content",
	zIndex: 1,
	opacity: ownerState.expanded ? 0 : 1,
	pointerEvents: ownerState.expanded ? "none" : "auto",
	transition: theme.transitions.create(["opacity"]),
}));

const StyledTextField = styled(TextField)<{ ownerState: OwnerState }>(
	({ theme, ownerState }) => ({
		gridArea: "1 / 1",
		overflowX: "clip",
		width: ownerState.expanded ? 260 : "var(--trigger-width)",
		opacity: ownerState.expanded ? 1 : 0,
		transition: theme.transitions.create(["width", "opacity"]),
	}),
);

const ItemsTable: React.FC = () => {
	const [items, setItems] = useState<ItemRead[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [totalRows, setTotalRows] = useState<number>(0);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		pageSize: DEFAULT_PAGE_SIZE,
		page: 0,
	});
	const [sortModel, setSortModel] = useState<GridSortModel>([
		{ field: "name", sort: "asc" },
	]);
	const [filterModel, setFilterModel] = useState<GridFilterModel>({
		items: [],
	});

	// Toolbar Filter states
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [ratingFilter, setRatingFilter] = useState<number | "">("");
	const [availabilityFilter, setAvailabilityFilter] = useState<
		"all" | "true" | "false"
	>("all");
	const [createdFrom, setCreatedFrom] = useState<string>("");
	const [createdTo, setCreatedTo] = useState<string>("");

	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const fetchItems = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const sortField = sortModel.length > 0 ? sortModel[0].field : undefined;
			const sortDirection =
				sortModel.length > 0 ? (sortModel[0].sort as string) : undefined;

			// Initialize filter parameters with toolbar values
			let name = searchQuery || undefined;
			let rating = ratingFilter !== "" ? Number(ratingFilter) : undefined;
			let available =
				availabilityFilter === "all"
					? undefined
					: availabilityFilter === "true";
			let createdFromVal = createdFrom || undefined;
			let createdToVal = createdTo || undefined;
			let description = undefined;
			let ownerId = undefined;
			let slug = undefined;

			// Override or add filters from DataGrid filterModel
			filterModel.items.forEach((item) => {
				if (
					!item.value &&
					item.operator !== "isEmpty" &&
					item.operator !== "isNotEmpty"
				)
					return;

				const value =
					item.value instanceof Date
						? item.value.toISOString().split("T")[0]
						: item.value;

				switch (item.field) {
					case "name":
						name = value;
						break;
					case "rating":
						rating = Number(value);
						break;
					case "available":
						available = value === "true" || value === true;
						break;
					case "created_at":
						if (item.operator === "after" || item.operator === "onOrAfter")
							createdFromVal = value;
						if (item.operator === "before" || item.operator === "onOrBefore")
							createdToVal = value;
						break;
					case "description":
						description = value;
						break;
					case "owner":
						if (!Number.isNaN(Number(value))) ownerId = Number(value);
						break;
					case "slug":
						slug = value;
						break;
				}
			});

			const data = await ItemsService.listItemsApiV1ItemsGet({
				sortField,
				sortDirection,
				limit: paginationModel.pageSize,
				skip: paginationModel.page * paginationModel.pageSize,
				name,
				slug,
				description,
				ownerId,
				rating,
				available,
				createdFrom: createdFromVal,
				createdTo: createdToVal,
			});
			setItems(data.items || []);
			setTotalRows(data.total || 0);
		} catch (err: any) {
			setError(err.message);
			setItems([]);
			setTotalRows(0);
		} finally {
			setLoading(false);
		}
	}, [
		paginationModel,
		sortModel,
		filterModel,
		searchQuery,
		ratingFilter,
		availabilityFilter,
		createdFrom,
		createdTo,
	]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			fetchItems();
		}, 500); // Debounce search and filters
		return () => clearTimeout(timeoutId);
	}, [fetchItems]);

	const columns: GridColDef[] = useMemo(() => {
		const allColumns: GridColDef[] = [
			{
				field: "image_url",
				headerName: "",
				width: 100,
				sortable: false,
				filterable: false,
				hideable: false,
				renderCell: (params: GridRenderCellParams) => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
						}}
					>
						{params.value ? (
							<Avatar
								src={params.value as string}
								alt={params.row.name || "Item"}
								variant="rounded"
								sx={{ width: 40, height: 40, bgcolor: "grey.200" }}
							/>
						) : (
							<Avatar
								variant="rounded"
								sx={{ width: 40, height: 40, bgcolor: "grey.200" }}
							>
								<DescriptionIcon sx={{ fontSize: 20, color: "grey.500" }} />
							</Avatar>
						)}
					</Box>
				),
			},
			{
				field: "name",
				headerName: "Name",
				flex: 1,
				minWidth: 150,
				hideable: false,
				filterOperators: getGridStringOperators(),
			},
			{
				field: "rating",
				headerName: "Rating",
				type: "number",
				width: 100,
				headerAlign: "center",
				align: "center",
				hideable: false,
				filterOperators: getGridNumericOperators(),
				renderCell: (params: GridRenderCellParams) => (
					<Box>{params.value ?? 0} / 5</Box>
				),
			},
			{
				field: "available",
				headerName: "Available",
				type: "boolean",
				width: 120,
				headerAlign: "center",
				align: "center",
				hideable: false,
				filterOperators: getGridBooleanOperators(),
				renderCell: (params: GridRenderCellParams) => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
						}}
					>
						{params.value ? (
							<DoneIcon color="primary" />
						) : (
							<CancelIcon color="error" />
						)}
					</Box>
				),
			},
			{
				field: "owner",
				headerName: "Creator",
				width: 150,
				sortable: false,
				hideable: false,
				filterOperators: getGridStringOperators(),
				renderCell: (params: GridRenderCellParams) => {
					const owner = params.value as any;
					return (
						<MuiLink
							color="primary"
							component={RouterLink}
							to={`/users/${owner?.username}`}
							onClick={(e) => e.stopPropagation()}
						>
							{owner?.username || "N/A"}
						</MuiLink>
					);
				},
			},
			{
				field: "created_at",
				headerName: "Created At",
				type: "date",
				width: 180,
				hideable: false,
				filterOperators: getGridDateOperators(),
				valueFormatter: (value?: string) =>
					formatDate(value, { fallback: "N/A" }),
			},
		];

		if (isMobile) {
			return allColumns.filter((col) =>
				["name", "rating", "available"].includes(col.field),
			);
		}
		return allColumns;
	}, [isMobile]);

	const CustomToolbar = () => {
		return (
			<Toolbar
				render={(toolbarProps) => (
					<GridToolbarContainer
						{...toolbarProps}
						sx={{
							p: 2,
							display: "flex",
							flexWrap: "wrap",
							gap: 2,
							alignItems: "center",
							borderBottom: 1,
							borderColor: "divider",
						}}
					>
						<Box sx={{ display: "flex", gap: 1 }}>
							<GridToolbarFilterButton />
							<GridToolbarExport />
						</Box>

						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 2,
								alignItems: "flex-end",
							}}
						>
							<TextField
								variant="outlined"
								size="small"
								placeholder="Search by name..."
								label="Name"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								sx={{ width: 200 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon fontSize="small" />
										</InputAdornment>
									),
								}}
							/>

							<TextField
								label="Min Rating"
								type="number"
								size="small"
								value={ratingFilter}
								onChange={(e) =>
									setRatingFilter(
										e.target.value === "" ? "" : Number(e.target.value),
									)
								}
								inputProps={{ min: 0, max: 5, step: 0.1 }}
								sx={{ width: 100 }}
							/>

							<FormControl size="small" sx={{ minWidth: 120 }}>
								<InputLabel>Availability</InputLabel>
								<Select
									label="Availability"
									value={availabilityFilter}
									onChange={(e) => setAvailabilityFilter(e.target.value as any)}
								>
									<MenuItem value="all">All</MenuItem>
									<MenuItem value="true">Available</MenuItem>
									<MenuItem value="false">Unavailable</MenuItem>
								</Select>
							</FormControl>

							<TextField
								label="Created From"
								type="date"
								size="small"
								value={createdFrom}
								onChange={(e) => setCreatedFrom(e.target.value)}
								InputLabelProps={{ shrink: true }}
								sx={{ width: 150 }}
							/>

							<TextField
								label="Created To"
								type="date"
								size="small"
								value={createdTo}
								onChange={(e) => setCreatedTo(e.target.value)}
								InputLabelProps={{ shrink: true }}
								sx={{ width: 150 }}
							/>
						</Box>

						<StyledQuickFilter>
							<QuickFilterTrigger
								render={(triggerProps, state) => (
									<Tooltip title="Search" enterDelay={0}>
										<StyledToolbarButton
											{...triggerProps}
											ownerState={{ expanded: state.expanded }}
											color="default"
											aria-disabled={state.expanded}
										>
											<SearchIcon fontSize="small" />
										</StyledToolbarButton>
									</Tooltip>
								)}
							/>
							<QuickFilterControl
								render={({ ref, ...controlProps }, state) => (
									<StyledTextField
										{...controlProps}
										ownerState={{ expanded: state.expanded }}
										inputRef={ref}
										aria-label="Search"
										placeholder="Search..."
										size="small"
										slotProps={{
											input: {
												startAdornment: (
													<InputAdornment position="start">
														<SearchIcon fontSize="small" />
													</InputAdornment>
												),
												endAdornment: state.value ? (
													<InputAdornment position="end">
														<QuickFilterClear
															edge="end"
															size="small"
															aria-label="Clear search"
															material={{ sx: { marginRight: -0.75 } }}
														>
															<CancelIcon fontSize="small" />
														</QuickFilterClear>
													</InputAdornment>
												) : null,
												...controlProps.slotProps?.input,
											},
											...controlProps.slotProps,
										}}
									/>
								)}
							/>
						</StyledQuickFilter>
					</GridToolbarContainer>
				)}
			/>
		);
	};

	if (error) {
		return (
			<Typography color="error" sx={{ p: 3 }}>
				Error loading items: {error}
			</Typography>
		);
	}

	return (
		<Paper sx={{ width: "100%", mb: 2 }}>
			<DataGrid
				rows={items}
				columns={columns}
				rowCount={totalRows}
				loading={loading}
				paginationMode="server"
				sortingMode="server"
				filterMode="server"
				paginationModel={paginationModel}
				onPaginationModelChange={setPaginationModel}
				sortModel={sortModel}
				onSortModelChange={setSortModel}
				filterModel={filterModel}
				onFilterModelChange={setFilterModel}
				pageSizeOptions={[10, 20, 50]}
				onRowClick={(params) =>
					navigate(`/items/${params.row.slug}`, {
						state: { itemId: params.row.id },
					})
				}
				getRowId={(row) => row.id}
				autoHeight
				slots={{
					toolbar: CustomToolbar,
				}}
				disableColumnSelector
				sx={{
					border: "none",
					"& .MuiDataGrid-row": {
						cursor: "pointer",
					},
					"& .MuiDataGrid-cell:focus": {
						outline: "none",
					},
					"& .MuiDataGrid-columnHeaders": {
						borderBottom: 1,
						borderColor: "divider",
					},
				}}
				disableRowSelectionOnClick
			/>
		</Paper>
	);
};

export default ItemsTable;
