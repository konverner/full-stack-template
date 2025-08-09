import type { ItemCreate } from '../models/ItemCreate';
import type { ItemListResponse } from '../models/ItemListResponse';
import type { ItemRead } from '../models/ItemRead';
import type { ItemUpdate } from '../models/ItemUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type TDataListItemsApiV1ItemsGet = {
                description?: string
limit?: number
name?: string
ownerId?: number
skip?: number
sortDirection?: string
sortField?: string
            }
export type TDataCreateItemApiV1ItemsPost = {
                requestBody: ItemCreate
            }
export type TDataGetItemBySlugApiV1ItemsItemSlugGet = {
                itemSlug: string
            }
export type TDataUpdateItemBySlugApiV1ItemsItemSlugPut = {
                itemSlug: string
requestBody: ItemUpdate
            }
export type TDataDeleteItemApiV1ItemsItemIdDelete = {
                itemId: number
            }

export class ItemsService {

	/**
	 * List Items
	 * List items with filtering, sorting, and pagination.
	 * @returns ItemListResponse Successful Response
	 * @throws ApiError
	 */
	public static listItemsApiV1ItemsGet(data: TDataListItemsApiV1ItemsGet = {}): CancelablePromise<ItemListResponse> {
		const {
description,
limit = 100,
name,
ownerId,
skip = 0,
sortDirection = 'asc',
sortField = 'id',
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/items/',
			query: {
				skip, limit, name, description, owner_id: ownerId, sort_field: sortField, sort_direction: sortDirection
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create Item
	 * Create a new item.
	 * @returns ItemRead Successful Response
	 * @throws ApiError
	 */
	public static createItemApiV1ItemsPost(data: TDataCreateItemApiV1ItemsPost): CancelablePromise<ItemRead> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/items/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get Item By Slug
	 * Get a specific item by its slug.
	 * @returns ItemRead Successful Response
	 * @throws ApiError
	 */
	public static getItemBySlugApiV1ItemsItemSlugGet(data: TDataGetItemBySlugApiV1ItemsItemSlugGet): CancelablePromise<ItemRead> {
		const {
itemSlug,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/items/{item_slug}',
			path: {
				item_slug: itemSlug
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Item By Slug
	 * Update an item by slug.
	 * @returns ItemRead Successful Response
	 * @throws ApiError
	 */
	public static updateItemBySlugApiV1ItemsItemSlugPut(data: TDataUpdateItemBySlugApiV1ItemsItemSlugPut): CancelablePromise<ItemRead> {
		const {
itemSlug,
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/items/{item_slug}',
			path: {
				item_slug: itemSlug
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete Item
	 * Delete an item.
	 * @returns void Successful Response
	 * @throws ApiError
	 */
	public static deleteItemApiV1ItemsItemIdDelete(data: TDataDeleteItemApiV1ItemsItemIdDelete): CancelablePromise<void> {
		const {
itemId,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/items/{item_id}',
			path: {
				item_id: itemId
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}