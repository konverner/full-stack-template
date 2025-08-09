

export type UserRead = {
	/**
	 * Unique username following Google Workspace guidelines
	 */
	username: string;
	/**
	 * User's email address (optional)
	 */
	email?: string | null;
	/**
	 * URL to the user's avatar image
	 */
	avatar_url?: string | null;
	/**
	 * Indicates if the user account is active
	 */
	is_active?: boolean;
	/**
	 * Unique identifier for the user
	 */
	id: number;
	/**
	 * Indicates if the user has superuser privileges
	 */
	is_superuser: boolean;
	/**
	 * Timestamp when the user account was created
	 */
	created_at: string;
};

