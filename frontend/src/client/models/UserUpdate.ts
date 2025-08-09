

export type UserUpdate = {
	/**
	 * New username following Google Workspace guidelines
	 */
	username?: string | null;
	/**
	 * New URL to the user's avatar image
	 */
	avatar_url?: string | null;
};

