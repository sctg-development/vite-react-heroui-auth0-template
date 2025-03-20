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

			if (token) {
				const { access, payload } = await checkPermissions(token, env.READ_PERMISSION, env);

				return new Response(JSON.stringify({ ...fakePayload, query: request.url, authenticatedUser: payload.sub }), {
					headers: { ...corsHeaders(env) },
				});
			}
		}

		return new Response('Not allowed', { status: 403, headers: { ...corsHeaders(env) } });
	},
} satisfies ExportedHandler<Env>;
