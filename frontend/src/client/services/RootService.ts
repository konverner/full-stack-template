
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';



export class RootService {

	/**
	 * Read Root
	 * Root endpoint providing basic API information.
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static readRootGet(): CancelablePromise<unknown> {
				return __request(OpenAPI, {
			method: 'GET',
			url: '/',
		});
	}

}