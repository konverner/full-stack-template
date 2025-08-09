

export type Token = {
	/**
	 * JWT access token
	 */
	access_token: string;
	/**
	 * JWT refresh token
	 */
	refresh_token: string;
	/**
	 * Type of the token, typically 'bearer'
	 */
	token_type?: string;
};

