export const appDateLocale = "en-US";

interface FormatDateOptions {
	fallback?: string;
}

export const formatDate = (
	dateString?: string | null,
	options: FormatDateOptions = {},
): string => {
	const { fallback = "" } = options;

	if (!dateString) {
		return fallback;
	}

	const date = new Date(dateString);

	if (Number.isNaN(date.getTime())) {
		return fallback;
	}

	return date.toLocaleDateString(appDateLocale, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};
