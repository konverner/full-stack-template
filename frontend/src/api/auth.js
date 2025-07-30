import { loginUser, getUserProfile, registerUser } from './users.js'; // Add registerUser import

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_PROFILE_KEY = 'userProfile';

// Token handling functions
export function saveTokens(accessToken, refreshToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    console.log("Tokens saved to localStorage"); // Debug log
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuthData() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
}

export function isLoggedIn() {
    return !!getAccessToken();
}

// Profile handling functions
function saveUserProfile(profile) {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function getUserProfileData() {
    const profileData = localStorage.getItem(USER_PROFILE_KEY);
    return profileData ? JSON.parse(profileData) : null;
}

/**
 * Handles the login process triggered by the form submission.
 * Calls the API, saves tokens, fetches profile, updates UI, and redirects.
 * @param {URLSearchParams} formData - Form data with username, password, etc.
 * @returns {Promise<object>} - User profile if login successful.
 * @throws {Error} - If login fails or encounters an issue.
 */
export async function handleLogin(formData) {
    try {
        // Extract username for logging/debugging
        const username = formData.get('username');
        console.log(`Attempting login for ${username}...`);
        const data = await loginUser(formData);
        console.log("Login API success:", data);

        if (data.access_token && data.refresh_token) {
            saveTokens(data.access_token, data.refresh_token);
            console.log("Tokens received and saved.");

            let profile;
            try {
                 profile = await getUserProfile();
                 saveUserProfile(profile);
                 // Store user in window for session-wide access
                 window.currentUser = profile;
                 console.log("User profile fetched and saved:", profile);
            } catch (profileError) {
                console.error("Failed to fetch profile after login:", profileError);
                clearAuthData();
                throw new Error('Login succeeded but failed to fetch profile. Please try again.');
            }

            window.location.href = '/';
            return profile;
        } else {
            console.error("Login response missing tokens:", data);
            throw new Error('Invalid username or password.');
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // Extract specific error message from backend response
        let message = 'Invalid username or password. Please try again.';
        
        // Check if it's a structured error response from the backend
        if (error && typeof error === 'object') {
            // Backend returns { detail: "Incorrect username or password" } for auth failures
            if (error.detail) {
                message = error.detail;
            } 
            // Handle validation errors or other structured errors
            else if (error.message && typeof error.message === 'string') {
                // Show specific error messages but default to user-friendly for generic ones
                if (!error.message.startsWith('HTTP error!') && 
                    !error.message.includes('fetch') &&
                    !error.message.includes('Failed to fetch')) {
                    message = error.message;
                }
            }
        }
        
        // For 401 specifically, ensure we show a user-friendly message
        if (error.status === 401) {
            message = 'Incorrect username or password. Please try again.';
        }
        
        throw new Error(message);
    }
}

/**
 * Fetches and caches the user profile if logged in and not already cached.
 * Also updates the header navigation based on the final login state.
 * Should be called on page load for all pages.
 */
export async function checkAndCacheUserProfile() {
    if (isLoggedIn() && !getUserProfileData()) {
        try {
            const profile = await getUserProfile();
            saveUserProfile(profile);
            console.log("User profile fetched and cached on load:", profile);
        } catch (error) {
            console.error("Failed to fetch user profile on load:", error);
             // Check error status or message for unauthorized indication
             if (error.status === 401 || (error.message && (error.message.includes('401') || error.message.includes('Unauthorized')))) {
                 // Token might be invalid/expired - Clean up
                 console.log("Token likely invalid, logging out.");
                 clearAuthData(); // Use clearAuthData instead of handleLogout to avoid redirect loop
             }
             // Note: No 'else' block needed here, we proceed to updateHeaderNav regardless
        }
    }

}

/**
 * Handles the logout process.
 */
export function handleLogout() {
    clearAuthData();
    console.log("User logged out.");
}

/**
 * Handles the registration process.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} - Registered user profile if successful.
 * @throws {Error} - If registration fails.
 */
export async function handleRegister(email, username, password) {
    try {
        console.log(`Attempting registration for ${username} with email ${email}...`);
        const userProfile = await registerUser(username, password, email);
        console.log("Registration API success:", userProfile);
        return userProfile;
    } catch (error) {
        console.error('Registration failed:', error);
        
        // Check for direct validation error message
        if (error && error.message) {
            console.log('Error message in handleRegister:', error.message);
            
            // Check for specific validation error patterns
            if (error.message.includes('Username can only contain')) {
                throw new Error(error.message);
            }
            
            // Pass through any other error message
            throw new Error(error.message);
        }
        
        // Default error if we couldn't extract a message
        throw new Error('Registration failed. Please try again.');
    }
}