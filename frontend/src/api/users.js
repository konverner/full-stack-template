import { fetchApi, fetchAuth } from './api.js';

// Helper for extracting error messages
function extractErrorMessage(error, fallback = 'Operation failed') {
    if (error?.message) return error.message;
    if (error?.data?.detail) {
        if (Array.isArray(error.data.detail)) {
            return error.data.detail[0]?.msg || fallback;
        }
        return error.data.detail;
    }
    if (error?.data?.message) return error.data.message;
    return fallback;
}

/**
 * Fetches the current user's profile.
 * @returns {Promise<object>}
 */
export async function getUserProfile() {
    return fetchAuth('/me', { method: 'GET' }, true);
}

/**
 * Registers a new user.
 */
export async function registerUser(username, password, email = null, avatar_url = null) {
    const payload = { username, password };
    if (email) payload.email = email;
    if (avatar_url) payload.avatar_url = avatar_url;

    try {
        return await fetchAuth('/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Registration failed'));
    }
}

/**
 * Attempts to log in a user by calling the backend endpoint.
 */
export async function loginUser(formData) {
    return fetchAuth('/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });
}

/**
 * Logs out the current user.
 */
export async function logoutUser() {
    return fetchAuth('/logout', { method: 'POST' }, true);
}

/**
 * Lists users with filtering, sorting, and pagination (admin only).
 */
export async function listUsers(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) searchParams.append(key, value);
    });
    const queryString = searchParams.toString();
    const url = queryString ? `/users/?${queryString}` : '/users/';
    return fetchApi(url, { method: 'GET' }, false);
}

/**
 * Creates a new user (admin only).
 */
export async function createUser(userData) {
    try {
        return await fetchApi('/users/', {
            method: 'POST',
            body: JSON.stringify(userData),
        }, true);
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'User creation failed'));
    }
}

/**
 * Gets a user by username.
 */
export async function getUserByUsername(username) {
    return fetchApi(`/users/${username}`, { method: 'GET' }, false);
}

/**
 * Updates a user's profile (admin or self).
 */
export async function updateUser(username, updateData) {
    try {
        return await fetchApi(`/users/${username}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        }, true);
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'User update failed'));
    }
}

/**
 * Updates a user's password.
 */
export async function updateUserPassword(username, currentPassword, newPassword) {
    try {
        return await fetchApi(`/users/${username}/password`, {
            method: 'PUT',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            }),
        }, true);
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Password update failed'));
    }
}

/**
 * Deletes a user (admin only).
 */
export async function deleteUser(username) {
    try {
        return await fetchApi(`/users/${username}`, { method: 'DELETE' }, true);
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'User deletion failed'));
    }
}

/**
 * Promotes or demotes a user's superuser status (admin only).
 */
export async function updateUserSuperuserStatus(username, is_superuser) {
    try {
        return await fetchApi(`/users/${username}/superuser`, {
            method: 'PUT',
            body: JSON.stringify({ is_superuser }),
        }, true);
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Failed to update superuser status'));
    }

/**
 * Gets a user by username.
 * @param {string} username - The username to look up
 * @returns {Promise<object>} - The user object with UserRead schema
 */
export async function getUserByUsername(username) {
    return fetchApi(`/users/${username}`, { method: 'GET' }, false);
}

/**
 * Updates a user's profile (admin or self).
 * @param {string} username - The username of the user to update
 * @param {object} updateData - Updated user data following UserBase schema
 * @param {string} [updateData.username] - New username (3-50 characters, optional)
 * @param {string} [updateData.email] - New email address (optional)
 * @param {string} [updateData.avatar_url] - New avatar URL (optional)
 * @returns {Promise<object>} - The updated user object with UserRead schema
 */
export async function updateUser(username, updateData) {
    try {
        return await fetchApi(`/users/${username}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        }, true);
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            try {
                const data = await error.response.json();
                
                if (status === 400 || status === 409) {
                    if (data.detail === 'Username already exists') {
                        throw new Error('Username already exists');
                    }
                    if (data.detail === 'Email already exists') {
                        throw new Error('Email already exists');
                    }
                    throw new Error(data.detail || 'User update failed');
                }
                
                if (status === 403) {
                    throw new Error('Insufficient permissions to update this user');
                }
                
                if (status === 404) {
                    throw new Error('User not found');
                }
            } catch (parseError) {
                if (parseError instanceof Error && parseError.message !== 'User update failed') {
                    throw parseError;
                }
            }
        }
        throw error;
    }
}

/**
 * Updates a user's password.
 * @param {string} username - The username of the user
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password (at least 8 characters)
 * @returns {Promise<object>} - The updated user object
 */
export async function updateUserPassword(username, currentPassword, newPassword) {
    try {
        return await fetchApi(`/users/${username}/password`, {
            method: 'PUT',
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            }),
        }, true);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            const data = await error.response.json();
            if (data.detail === 'Current password is incorrect') {
                throw new Error('Current password is incorrect');
            }
        }
        throw error;
    }
}

/**
 * Deletes a user (admin only).
 * @param {string} username - The username of the user to delete
 * @returns {Promise<void>} - Empty response on success
 */
export async function deleteUser(username) {
    try {
        return await fetchApi(`/users/${username}`, { method: 'DELETE' }, true);
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            try {
                const data = await error.response.json();
                
                if (status === 400) {
                    if (data.detail === 'Cannot delete your own account') {
                        throw new Error('Cannot delete your own account');
                    }
                    throw new Error(data.detail || 'User deletion failed');
                }
                
                if (status === 403) {
                    throw new Error('Insufficient permissions to delete users');
                }
                
                if (status === 404) {
                    throw new Error('User not found');
                }
            } catch (parseError) {
                if (parseError instanceof Error && parseError.message !== 'User deletion failed') {
                    throw parseError;
                }
            }
        }
        throw error;
    }
}

/**
 * Promotes or demotes a user's superuser status (admin only).
 * @param {string} username - The username of the user to modify
 * @param {boolean} is_superuser - Whether the user should be a superuser
 * @returns {Promise<object>} - The updated user object with UserRead schema
 */
export async function updateUserSuperuserStatus(username, is_superuser) {
    try {
        return await fetchApi(`/users/${username}/superuser`, {
            method: 'PUT',
            body: JSON.stringify({ is_superuser }),
        }, true);
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            try {
                const data = await error.response.json();
                
                if (status === 400) {
                    throw new Error(data.detail || 'Failed to update superuser status');
                }
                
                if (status === 403) {
                    throw new Error('Insufficient permissions to modify superuser status');
                }
                
                if (status === 404) {
                    throw new Error('User not found');
                }
            } catch (parseError) {
                if (parseError instanceof Error && parseError.message !== 'Failed to update superuser status') {
                    throw parseError;
                }
            }
        }
        throw error;
    }
}
