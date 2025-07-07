// API Interaction Logic
import { getAccessToken } from './auth.js'; // Import the auth function
import { fetchApi } from './api.js'; // Import the fetchApi function


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
    return fetchApi(`/admin/users/?${query}`, { method: 'GET' }, true); // Requires admin auth
}


/**
 * Fetches a paginated, sorted list of items.
 * @param {object} params - { sort_field, sort_direction, limit, skip, page }
 * @returns {Promise<object>} - { items: [], total: number }
 */
export async function fetchItems(params = {}) {
    // Convert frontend parameters to backend format
    const backendParams = {
        skip: params.skip || 0,
        limit: params.limit || 100,
        sort_field: params.sort_field || params.field || 'id',
        sort_direction: params.sort_direction || params.direction || 'asc',
        ...Object.fromEntries(
            Object.entries(params).filter(([key]) => 
                !['field', 'direction', 'page'].includes(key)
            )
        )
    };
    
    const query = new URLSearchParams(backendParams).toString();
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