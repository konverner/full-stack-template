import { fetchAuth } from './api.js';

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
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} - The registered user profile object
 * @throws {Error} - Throws error with specific message for validation failures
 */
export async function registerUser(email, username, password) {
    const payload = {
        username,
        password,
    };
    if (email) {
        payload.email = email;
    }

    try {
        return await fetchAuth('/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    } catch (error) {
        // Try to extract backend error message from response body
        let errorMessage = 'Registration failed. Please try again.';
        if (error.response) {
            try {
                const data = await error.response.json();
                if (data && data.detail) {
                    errorMessage = data.detail;
                }
            } catch {
                // ignore JSON parse errors
            }
            if (error.response.status === 409) {
                throw new Error(errorMessage);
            } else if (error.response.status === 422) {
                // Validation error
                try {
                    const data = await error.response.json();
                    const validationErrors = data.detail?.map(err => err.msg).join(', ') || 'Invalid input data';
                    throw new Error(validationErrors);
                } catch {
                    throw new Error('Invalid input data');
                }
            }
        } else if (error.message && error.message.includes('409')) {
            // fallback for generic fetch errors
            errorMessage = 'Username or email already exists';
        }
        throw new Error(errorMessage);
    }
}

/**
 * Attempts to log in a user by calling the backend endpoint.
 * @param {URLSearchParams} formData - Form data with username, password, etc.
 * @returns {Promise<object>} - The token object { access_token, refresh_token, token_type } from the API.
 */
export async function loginUser(formData) {
    return fetchAuth('/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });
}

/**
 * Logs out the current user.
 * @returns {Promise<object>} - Response from the logout endpoint.
 */
export async function logoutUser() {
    return fetchAuth('/logout', { method: 'POST' }, true);
}
