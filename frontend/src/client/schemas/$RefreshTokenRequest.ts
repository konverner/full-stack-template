export const $RefreshTokenRequest = {
	properties: {
		refresh_token: {
	type: 'string',
	description: `Refresh token to obtain a new access token`,
	isRequired: true,
},
	},
} as const;