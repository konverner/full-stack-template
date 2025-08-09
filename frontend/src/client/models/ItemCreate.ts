

export type ItemCreate = {
	name: string;
	slug?: string | null;
	description?: string | null;
	available?: boolean | null;
	image_url?: string | null;
	website_url?: string | null;
};

