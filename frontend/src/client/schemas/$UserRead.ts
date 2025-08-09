export const $UserRead = {
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
		id: {
	type: 'number',
	description: `Unique identifier for the user`,
	isRequired: true,
},
		is_superuser: {
	type: 'boolean',
	description: `Indicates if the user has superuser privileges`,
	isRequired: true,
},
		created_at: {
	type: 'string',
	description: `Timestamp when the user account was created`,
	isRequired: true,
	format: 'date-time',
},
	},
} as const;