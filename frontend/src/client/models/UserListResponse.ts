import type { UserRead } from './UserRead';

export type UserListResponse = {
	/**
	 * List of users
	 */
	users: Array<UserRead>;
	/**
	 * Total number of users
	 */
	total: number;
	/**
	 * Number of users skipped
	 */
	skip: number;
	/**
	 * Maximum number of users returned
	 */
	limit: number;
};

