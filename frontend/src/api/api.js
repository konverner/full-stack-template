import { getAccessToken } from '../api/auth';

/**
 * Performs a fetch request to the API.
 * Handles adding Authorization header and basic error handling.
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {boolean} requiresAuth - Whether to include the Authorization header
 * @returns {Promise<any>} - Resolves with the JSON response data or rejects with an error.
 */
export async function fetchApi(endpoint, options = {}, requiresAuth = false) {
    const url = `/api/v1${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    if (requiresAuth) {
        const token = getAccessToken(); // Use auth module's function
        if (token) {
            console.log("Using token for authenticated request"); // Debug log
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('Attempted authenticated request without token.');
            // Optionally redirect to login or reject immediately
            return Promise.reject(new Error('Authentication required'));
        }
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json(); // Try to parse error details
            } catch (e) {
                errorData = { message: `HTTP error! status: ${response.status}` };
            }
            throw buildError(response, errorData);
        }

        // Handle cases with no content (e.g., 204 No Content)
        if (response.status === 204) {
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

/**
 * Perfoms a fetch request to authorisation server /auth
 * Handles adding Authorization header and basic error handling.
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Resolves with the JSON response data or rejects with an error.
 */
export async function fetchAuth(endpoint, options = {}, requiresAuth = false) {
    const url = `/auth${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    if (requiresAuth) {
        const token = getAccessToken(); // Use auth module's function
        if (token) {
            console.log("Using token for authenticated request"); // Debug log
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('Attempted authenticated request without token.');
            // Optionally redirect to login or reject immediately
            return Promise.reject(new Error('Authentication required'));
        }
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json(); // Try to parse error details
            } catch (e) {
                errorData = { message: `HTTP error! status: ${response.status}` };
            }
            throw buildError(response, errorData);
        }

        // Handle cases with no content (e.g., 204 No Content)
        if (response.status === 204) {
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

function parseErrorResponse(response, errorData) {
    // Try to extract the most specific error message
    if (errorData?.detail?.[0]?.msg) return errorData.detail[0].msg;
    if (errorData?.detail) return errorData.detail;
    if (errorData?.message) return errorData.message;
    return `HTTP error! status: ${response.status}`;
}

function buildError(response, errorData) {
    const errorMessage = parseErrorResponse(response, errorData);
    const error = new Error(errorMessage);
    error.response = response;
    error.data = errorData;
    return error;
}
