import { createTheme } from "@mui/material";
import { enUS } from "@mui/material/locale";

export const colors = {
	charcoal: "#272727",
	teal: "#56c4be",
	lightBackground: "#f5f5f5",
	white: "#ffffff",
	darkBackground: "#1f1f1f",
	lightText: "#e6e6e6",
	mutedLightText: "#bebebe",
	darkText: "#242424",
	mutedDarkText: "#a0a0a0",
	success: "#6dca70",
} as const;

const createAppTheme = (mode: "light" | "dark") =>
	createTheme(
		{
			palette:
				mode === "dark"
					? {
							primary: { main: colors.teal },
							secondary: { main: colors.charcoal },
							background: {
								default: colors.darkBackground,
								paper: colors.charcoal,
							},
							text: {
								primary: colors.lightText,
								secondary: colors.mutedLightText,
							},
							success: { main: colors.success },
							mode,
						}
					: {
							primary: { main: colors.charcoal },
							secondary: { main: colors.teal },
							background: {
								default: colors.lightBackground,
								paper: colors.white,
							},
							text: {
								primary: colors.darkText,
								secondary: colors.mutedDarkText,
							},
							mode,
						},
			components: {
				MuiAppBar: {
					styleOverrides: {
						root: ({ theme }) => ({
							...(theme.palette.mode === "light"
								? {
									"&.main-header": {
										backgroundColor: colors.charcoal,
										color: colors.white,
									},
								}
								: {}),
						}),
					},
				},
			},
		},
		enUS,
	);

export const lightTheme = createAppTheme("light");
export const darkTheme = createAppTheme("dark");
