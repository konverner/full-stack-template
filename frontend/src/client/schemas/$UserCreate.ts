export const $UserCreate = {
	properties: {
		username: {
	type: 'string',
	description: `Unique username following Google Workspace guidelines`,
	isRequired: true,
	maxLength: 64,
	minLength: 1,
},
		email: {
	type: 'any-of',
	description: `User's email address (optional)`,
	contains: [{
	type: 'string',
	format: 'email',
}, {
	type: 'null',
}],
},
		avatar_url: {
	type: 'any-of',
	description: `URL to the user's avatar image`,
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
		is_active: {
	type: 'boolean',
	description: `Indicates if the user account is active`,
},
		password: {
	type: 'string',
	description: `Password for the user account, at least 8 characters`,
	isRequired: true,
	minLength: 8,
},
	},
} as const;