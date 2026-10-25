import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_BASE_URL: { public: true, static: true },
	GOATCOUNTER_API_KEY: { schema: (input) => input ?? '' },
	API_BASE_URL: {},
	API_USERNAME: {},
	API_PASSWORD: {},
});
