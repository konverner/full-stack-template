export const $UserPasswordUpdate = {
	properties: {
		current_password: {
	type: 'string',
	description: `Current password of the user`,
	isRequired: true,
},
		new_password: {
	type: 'string',
	description: `New password for the user account, at least 8 characters`,
	isRequired: true,
	minLength: 8,
},
	},
} as const;