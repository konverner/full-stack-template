export const $ItemListResponse = {
	properties: {
		items: {
	type: 'array',
	contains: {
		type: 'ItemRead',
	},
	isRequired: true,
},
		total: {
	type: 'number',
	isRequired: true,
},
	},
} as const;