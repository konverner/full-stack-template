import type { ItemRead } from './ItemRead';

export type ItemListResponse = {
	items: Array<ItemRead>;
	total: number;
};

