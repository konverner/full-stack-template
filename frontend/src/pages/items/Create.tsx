import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import CreateForm from "../../components/items/CreateForm";

const CreateItemPage: React.FC = () => {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<Header />
			<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Link component={RouterLink} underline="hover" color="inherit" to="/">
						Home
					</Link>
					<Link
						component={RouterLink}
						underline="hover"
						color="inherit"
						to="/items"
					>
						Items
					</Link>
					<Typography color="text.primary">Create</Typography>
				</Breadcrumbs>
				<CreateForm />
			</Container>
			<Footer />
		</Box>
	);
};

export default CreateItemPage;
