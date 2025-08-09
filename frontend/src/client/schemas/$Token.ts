export const $Token = {
	properties: {
		access_token: {
	type: 'string',
	description: `JWT access token`,
	isRequired: true,
},
		refresh_token: {
	type: 'string',
	description: `JWT refresh token`,
	isRequired: true,
},
		token_type: {
	type: 'string',
	description: `Type of the token, typically 'bearer'`,
},
	},
} as const;