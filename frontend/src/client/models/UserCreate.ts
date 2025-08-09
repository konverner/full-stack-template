

export type UserCreate = {
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
	 * Password for the user account, at least 8 characters
	 */
	password: string;
};

