export const $UserUpdate = {
	properties: {
		username: {
	type: 'any-of',
	description: `New username following Google Workspace guidelines`,
	contains: [{
	type: 'string',
	maxLength: 64,
	minLength: 1,
}, {
	type: 'null',
}],
},
		avatar_url: {
	type: 'any-of',
	description: `New URL to the user's avatar image`,
	contains: [{
	type: 'string',
}, {
	type: 'null',
}],
},
	},
} as const;