import type { UserRead } from './UserRead';

export type ItemRead = {
	name: string;
	slug: string;
	description?: string | null;
	available?: boolean;
	image_url?: string | null;
	website_url?: string | null;
	id: number;
	average_rating?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
	owner?: UserRead | null;
};

