import { type UserRead, UsersService } from "@/client";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import SearchIcon from "@mui/icons-material/Search";
import {
	Avatar,
	Box,
	InputAdornment,
	Paper,
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
	getGridStringOperators,
} from "@mui/x-data-grid";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const UsersTable: React.FC = () => {
	const [users, setUsers] = useState<UserRead[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [totalRows, setTotalRows] = useState<number>(0);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		pageSize: DEFAULT_PAGE_SIZE,
		page: 0,
	});
	const [sortModel, setSortModel] = useState<GridSortModel>([
		{ field: "username", sort: "asc" },
	]);
	const [filterModel, setFilterModel] = useState<GridFilterModel>({
		items: [],
	});
	const [searchQuery, setSearchQuery] = useState<string>("");

	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const fetchUsers = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const sortField = sortModel.length > 0 ? sortModel[0].field : undefined;
			const sortDirection =
				sortModel.length > 0 ? (sortModel[0].sort as string) : undefined;

			// Initialize filter parameters
			let username = searchQuery || undefined;
			let email = undefined;
			let isActive = undefined;
			let createdAtFrom = undefined;
			let createdAtTo = undefined;

			// Override or add filters from DataGrid filterModel
			filterModel.items.forEach((item) => {
				if (
					!item.value &&
					item.operator !== "isEmpty" &&
					item.operator !== "isNotEmpty"
				)
					return;

				const value =
					item.value instanceof Date ? item.value.toISOString() : item.value;

				switch (item.field) {
					case "username":
						username = value;
						break;
					case "email":
						email = value;
						break;
					case "is_active":
						isActive = value === "true" || value === true;
						break;
					case "created_at":
						if (item.operator === "after" || item.operator === "onOrAfter")
							createdAtFrom = value;
						if (item.operator === "before" || item.operator === "onOrBefore")
							createdAtTo = value;
						break;
				}
			});

			const data = await UsersService.listUsersApiV1UsersGet({
				sortField,
				sortDirection,
				limit: paginationModel.pageSize,
				skip: paginationModel.page * paginationModel.pageSize,
				username,
				email,
				isActive,
				createdAtFrom,
				createdAtTo,
			});
			setUsers(data.users || []);
			setTotalRows(data.total || 0);
		} catch (err: any) {
			setError(err.message);
			setUsers([]);
			setTotalRows(0);
		} finally {
			setLoading(false);
		}
	}, [paginationModel, sortModel, filterModel, searchQuery]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			fetchUsers();
		}, 500); // Debounce search
		return () => clearTimeout(timeoutId);
	}, [fetchUsers]);

	const columns: GridColDef[] = useMemo(() => {
		const allColumns: GridColDef[] = [
			{
				field: "avatar_url",
				headerName: "",
				width: 60,
				sortable: false,
				filterable: false,
				renderCell: (params: GridRenderCellParams) => (
					<Avatar
						src={params.value as string}
						alt={params.row.username || "User"}
						sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
					>
						{(params.row.username as string)?.charAt(0).toUpperCase()}
					</Avatar>
				),
			},
			{
				field: "username",
				headerName: "Username",
				flex: 1,
				minWidth: 150,
				filterOperators: getGridStringOperators(),
			},
			{
				field: "email",
				headerName: "Email",
				flex: 1,
				minWidth: 200,
				filterOperators: getGridStringOperators(),
			},
			{
				field: "is_active",
				headerName: "Status",
				type: "boolean",
				width: 120,
				headerAlign: "center",
				align: "center",
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
							<CancelIcon color="disabled" />
						)}
					</Box>
				),
			},
			{
				field: "created_at",
				headerName: "Joined",
				type: "date",
				width: 180,
				filterOperators: getGridDateOperators(),
				valueFormatter: (value?: string) =>
					formatDate(value, { fallback: "N/A" }),
			},
		];

		if (isMobile) {
			return allColumns.filter((col) =>
				["avatar_url", "username", "is_active"].includes(col.field),
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
							p: 1,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Box sx={{ display: "flex", gap: 1 }}>
							<GridToolbarFilterButton />
							<GridToolbarExport />
							<TextField
								variant="outlined"
								size="small"
								placeholder="Search users..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								sx={{ ml: 1, width: 200 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon fontSize="small" />
										</InputAdornment>
									),
								}}
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
				Error loading users: {error}
			</Typography>
		);
	}

	return (
		<Paper sx={{ width: "100%", mb: 2 }}>
			<DataGrid
				rows={users}
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
				onRowClick={(params) => navigate(`/users/${params.row.username}`)}
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

export default UsersTable;
