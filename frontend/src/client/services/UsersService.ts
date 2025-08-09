import type { UserCreate } from '../models/UserCreate';
import type { UserListResponse } from '../models/UserListResponse';
import type { UserRead } from '../models/UserRead';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type TDataListUsersApiV1UsersGet = {
                email?: string
isActive?: boolean
limit?: number
skip?: number
sortDirection?: string
sortField?: string
username?: string
            }
export type TDataCreateUserApiV1UsersPost = {
                requestBody: UserCreate
            }
export type TDataGetUserByUsernameApiV1UsersUsernameGet = {
                username: string
            }
export type TDataUpdateUserByUsernameApiV1UsersUsernamePut = {
                requestBody: UserUpdate
username: string
            }
export type TDataDeleteUserByUsernameApiV1UsersUsernameDelete = {
                username: string
            }

export class UsersService {

	/**
	 * List Users
	 * List users with filtering, sorting, and pagination.
	 * @returns UserListResponse Successful Response
	 * @throws ApiError
	 */
	public static listUsersApiV1UsersGet(data: TDataListUsersApiV1UsersGet = {}): CancelablePromise<UserListResponse> {
		const {
email,
isActive,
limit = 100,
skip = 0,
sortDirection = 'asc',
sortField = 'id',
username,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/',
			query: {
				skip, limit, username, email, is_active: isActive, sort_field: sortField, sort_direction: sortDirection
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Create User
	 * Create a new user.
	 * @returns UserRead Successful Response
	 * @throws ApiError
	 */
	public static createUserApiV1UsersPost(data: TDataCreateUserApiV1UsersPost): CancelablePromise<UserRead> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/v1/users/',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Get User By Username
	 * Get a specific user by username.
	 * @returns UserRead Successful Response
	 * @throws ApiError
	 */
	public static getUserByUsernameApiV1UsersUsernameGet(data: TDataGetUserByUsernameApiV1UsersUsernameGet): CancelablePromise<UserRead> {
		const {
username,
} = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/v1/users/{username}',
			path: {
				username
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update User By Username
	 * Update a user by username.
	 * @returns UserRead Successful Response
	 * @throws ApiError
	 */
	public static updateUserByUsernameApiV1UsersUsernamePut(data: TDataUpdateUserByUsernameApiV1UsersUsernamePut): CancelablePromise<UserRead> {
		const {
requestBody,
username,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/v1/users/{username}',
			path: {
				username
			},
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Delete User By Username
	 * Delete a user by username.
	 * @returns void Successful Response
	 * @throws ApiError
	 */
	public static deleteUserByUsernameApiV1UsersUsernameDelete(data: TDataDeleteUserByUsernameApiV1UsersUsernameDelete): CancelablePromise<void> {
		const {
username,
} = data;
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/v1/users/{username}',
			path: {
				username
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}

}