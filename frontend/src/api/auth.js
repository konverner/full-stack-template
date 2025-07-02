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
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - User profile if login successful.
 * @throws {Error} - If login fails or encounters an issue.
 */
export async function handleLogin(email, password) {
    try {
        console.log(`Attempting login for ${email}...`);
        const data = await loginUser(email, password);
        console.log("Login API success:", data);

        if (data.access_token && data.refresh_token) {
            saveTokens(data.access_token, data.refresh_token);
            console.log("Tokens received and saved.");

            let profile;
            try {
                 profile = await getUserProfile();
                 saveUserProfile(profile);
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
            throw new Error('Invalid email or password.');
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // Extract specific error message from backend response
        let message = ' ';
        
        // Check if it's a structured error response from the backend
        if (error && typeof error === 'object') {
            // Backend returns { detail: "Incorrect email or password" } for auth failures
            if (error.detail) {
                message = error.detail;
            } 
            // Handle validation errors or other structured errors
            else if (error.message && typeof error.message === 'string') {
                // Don't show generic HTTP error messages, use our specific ones
                if (!error.message.startsWith('HTTP error!') && 
                    !error.message.includes('fetch')) {
                    message = error.message;
                }
            }
            // Handle case where error might have nested error info
            else if (error.error && typeof error.error === 'string') {
                message = error.error;
            }
        }
        
        // For 401 specifically, ensure we show a user-friendly message
        if (error.status === 401) {
            message = 'Incorrect email or password. Please try again.';
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
 * @param {string} name
 * @param {string} password
 * @returns {Promise<object>} - Registered user profile if successful.
 * @throws {Error} - If registration fails.
 */
export async function handleRegister(email, name, password) {
    // clearErrorMessage(errorElementId); // Removed
    // clearErrorMessage(successElementId); // Removed

    try {
        console.log(`Attempting registration for ${email}...`);
        const userProfile = await registerUser(email, name, password);
        console.log("Registration API success:", userProfile);

        // displaySuccessMessage(successElementId, `Registration successful for ${userProfile.name}! Please check your email for verification (if applicable) and log in.`); // Removed

        return userProfile; // Return user profile on success

    } catch (error) {
        console.error('Registration failed:', error);
        // const message = error.message || 'Registration failed. Please try again.'; // Component will handle message
        // displayErrorMessage(errorElementId, message); // Removed
        throw error; // Re-throw error for component to handle
    }
}