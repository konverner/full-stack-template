
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';



export class HealthCheckService {

	/**
	 * Head Root
	 * Root endpoint providing health check via HEAD request.
 * This endpoint can be used to check if the API is up and running.
	 * @returns unknown Successful Response
	 * @throws ApiError
	 */
	public static headRootHealthHead(): CancelablePromise<unknown> {
				return __request(OpenAPI, {
			method: 'HEAD',
			url: '/health',
		});
	}

}