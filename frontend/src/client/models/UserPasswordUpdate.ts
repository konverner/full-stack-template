

export type UserPasswordUpdate = {
	/**
	 * Current password of the user
	 */
	current_password: string;
	/**
	 * New password for the user account, at least 8 characters
	 */
	new_password: string;
};

