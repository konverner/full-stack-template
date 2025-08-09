import type { Body_login_for_access_token_auth_token_post } from '../models/Body_login_for_access_token_auth_token_post';
import type { Message } from '../models/Message';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { Token } from '../models/Token';
import type { UserCreate } from '../models/UserCreate';
import type { UserPasswordUpdate } from '../models/UserPasswordUpdate';
import type { UserRead } from '../models/UserRead';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type TDataRegisterUserAuthRegisterPost = {
                requestBody: UserCreate
            }
export type TDataLoginForAccessTokenAuthTokenPost = {
                requestBody: Body_login_for_access_token_auth_token_post
            }
export type TDataRefreshAccessTokenAuthRefreshPost = {
                requestBody: RefreshTokenRequest
            }
export type TDataUpdateUsersMeAuthMePatch = {
                requestBody: UserUpdate
            }
export type TDataUpdateUsersPasswordAuthPasswordPut = {
                requestBody: UserPasswordUpdate
            }

export class AuthorizationProfileService {

	/**
	 * Register User
	 * Register a new user.
	 * @returns UserRead Successful Response
	 * @throws ApiError
	 */
	public static registerUserAuthRegisterPost(data: TDataRegisterUserAuthRegisterPost): CancelablePromise<UserRead> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/auth/register',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Login For Access Token
	 * Authenticate user and return access and refresh tokens.
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static loginForAccessTokenAuthTokenPost(data: TDataLoginForAccessTokenAuthTokenPost): CancelablePromise<Token> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/auth/token',
			body: requestBody,
			mediaType: 'application/x-www-form-urlencoded',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Refresh Access Token
	 * Get a new access token using a refresh token.
	 * @returns Token Successful Response
	 * @throws ApiError
	 */
	public static refreshAccessTokenAuthRefreshPost(data: TDataRefreshAccessTokenAuthRefreshPost): CancelablePromise<Token> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'POST',
			url: '/auth/refresh',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Read Users Me
	 * Get current logged-in user's profile.
	 * @returns UserRead Successful Response
	 * @throws ApiError
	 */
	public static readUsersMeAuthMeGet(): CancelablePromise<UserRead> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/auth/me',
		});
	}

	/**
	 * Update Users Me
	 * Update current logged-in user's profile.
	 * @returns UserRead Successful Response
	 * @throws ApiError
	 */
	public static updateUsersMeAuthMePatch(data: TDataUpdateUsersMeAuthMePatch): CancelablePromise<UserRead> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/auth/me',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

	/**
	 * Update Users Password
	 * Update current logged-in user's password.
	 * @returns Message Successful Response
	 * @throws ApiError
	 */
	public static updateUsersPasswordAuthPasswordPut(data: TDataUpdateUsersPasswordAuthPasswordPut): CancelablePromise<Message> {
		const {
requestBody,
} = data;
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/auth/password',
			body: requestBody,
			mediaType: 'application/json',
			errors: {
				422: `Validation Error`,
			},
		});
	}

}