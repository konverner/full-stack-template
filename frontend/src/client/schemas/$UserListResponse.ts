export const $UserListResponse = {
	properties: {
		users: {
	type: 'array',
	contains: {
		type: 'UserRead',
	},
	isRequired: true,
},
		total: {
	type: 'number',
	description: `Total number of users`,
	isRequired: true,
},
		skip: {
	type: 'number',
	description: `Number of users skipped`,
	isRequired: true,
},
		limit: {
	type: 'number',
	description: `Maximum number of users returned`,
	isRequired: true,
},
	},
} as const;