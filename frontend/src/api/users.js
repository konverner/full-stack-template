import { fetchApi, fetchAuth } from './api.js';

/**
 * Fetches the current user's profile.
 * @returns {Promise<object>} - The user profile object.
 */
export async function getUserProfile() {
    return fetchAuth('/me', { method: 'GET' }, true); // Requires authentication
}

/**
 * Registers a new user.
 * @param {string} email
 * @param {string} name
 * @param {string} password
 * @returns {Promise<object>} - The registered user profile object (adjust based on your API response)
 */
export async function registerUser(email, name, password) {
    const payload = {
        email,
        name,
        password,
    };
    return fetchAuth('/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

/**
 * Attempts to log in a user by calling the backend endpoint.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - The token object { access_token, refresh_token, token_type } from the API.
 */
export async function loginUser(email, password) {
    return fetchAuth('/token', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

/**
 * Logs out the current user.
 * @returns {Promise<object>} - Response from the logout endpoint.
 */
export async function logoutUser() {
    return fetchAuth('/logout', { method: 'POST' }, true);
}
