import { checkPermissions } from './auth0';

const corsHeaders = (env: Env) => {
	return {
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Origin': env.CORS_ORIGIN,
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	};
};

const fakePayload = {
	message: 'Hello World!',
};

export default {
	async fetch(request: Request, env: Env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);

		const { success } = await env.RATE_LIMITER.limit({ key: pathname });

		if (!success) {
			return new Response(JSON.stringify(`429 Failure – rate limit exceeded for ${pathname}`), {
				status: 429,
				headers: { contentType: 'application/json' },
			});
		}

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					...corsHeaders(env),
					'Access-Control-Allow-Credentials': 'true',
				},
			});
		}
		if (request.headers.has('Authorization')) {
			const token = request.headers.get('Authorization')?.split(' ')[1];

			// Check if the Authorization header is present and has a string at the second index
			if (token) {
				const { access, payload } = await checkPermissions(token, env.READ_PERMISSION, env);

				// Query the API if the user has the required permission
				if (access) {
					const date = new Date();

					return new Response(
						JSON.stringify({ ...fakePayload, query: request.url, authenticatedUser: payload.sub, date: date.toISOString() }),
						{
							headers: { ...corsHeaders(env), contentType: 'application/json' },
						},
					);
				}
			}
		}

		return new Response(JSON.stringify('403 Failure - Not allowed'), {
			status: 403,
			headers: { ...corsHeaders(env), contentType: 'application/json' },
		});
	},
} satisfies ExportedHandler<Env>;
