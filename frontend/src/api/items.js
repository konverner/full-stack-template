// API Interaction Logic
import { getAccessToken } from './auth.js';
import { fetchApi } from './api.js';


// --- Specific API Functions ---

/**
 * Gets details for a specific item by its slug.
 * @param {string} itemSlug - The slug of the item.
 * @returns {Promise<object>} - The item details object.
 */
export async function getItemDetails(itemSlug) {
    return fetchApi(`/items/${itemSlug}`, { method: 'GET' }); // Assuming public endpoint
}

/**
 * Lists all users (admin function)
 * @param {object} params - Pagination and filtering parameters
 * @returns {Promise<object>} - The paginated response with user items
 */
export async function adminListUsers(params = { skip: 0, limit: 50 }) {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/admin/users/?${query}`, { method: 'GET' }, true);
}


/**
 * Fetches a paginated, sorted list of items.
 * @param {object} params - { field, direction, limit, page }
 * @returns {Promise<object>} - { items: [], total: number }
 */
export async function fetchItems(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/items/?${query}`, { method: 'GET' });
}

/**
 * Creates a new item.
 * @param {object} itemData - The data for the new item.
 * @returns {Promise<object>} - The created item object.
 */
export async function createItem(itemData) {
    return fetchApi('/items/', {
        method: 'POST',
        body: JSON.stringify(itemData),
    }, true); // Requires authentication
}

/**
 * Updates an existing item by slug.
 * @param {string} itemSlug - The slug of the item.
 * @param {object} itemData - The updated data for the item.
 * @returns {Promise<object>} - The updated item object.
 */
export async function updateItem(itemSlug, itemData) {
    return fetchApi(`/items/${itemSlug}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
    }, true); // Requires authentication
}

/**
 * Deletes an item by ID.
 * @param {number} itemId - The ID of the item to delete.
 * @returns {Promise<void>}
 */
export async function deleteItem(itemId) {
    console.log("Deleting item with ID:", itemId);
    return fetchApi(`/items/${itemId}`, {
        method: 'DELETE',
    }, true); // Requires authentication
}


/** addLogoutHandler
 * 
 */
export function addLogoutHandler(logoutButton, redirectUrl) {
    if (!logoutButton) return;

    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            await fetchApi('/auth/logout', { method: 'POST' }, true); // Requires auth
            window.location.href = redirectUrl || '/'; // Redirect to home or specified URL
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    });
}