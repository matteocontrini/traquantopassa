import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();

const apiBaseUrl = config.apiBaseUrl;
const apiAuthHeader = 'Basic ' + Buffer.from(`${config.apiUsername}:${config.apiPassword}`).toString('base64');
const goatcounterToken = config.goatcounterToken;

export { apiBaseUrl, apiAuthHeader, goatcounterToken };
