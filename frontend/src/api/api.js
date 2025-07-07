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
    const url = `http://localhost:8000/api/v1${endpoint}`;
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
            // Enhance error message if possible
            const errorMessage = errorData?.detail?.[0]?.msg || errorData?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
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
    const url = `http://localhost:8000/auth${endpoint}`;
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
            // Enhance error message if possible
            const errorMessage = errorData?.detail?.[0]?.msg || errorData?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
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
