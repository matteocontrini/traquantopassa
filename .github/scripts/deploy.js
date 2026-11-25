// Deploys an image tag to the Bunny Magic Containers app, then waits until every
// pod runs it. Reads BUNNY_APP_ID, BUNNYNET_API_KEY, and IMAGE_TAG.
//
// API: https://api-mc.opsbunny.net/docs/public/swagger.json

const { BUNNY_APP_ID: appId, BUNNYNET_API_KEY: apiKey, IMAGE_TAG: tag } = process.env;
if (!appId || !apiKey || !tag) {
	throw new Error('BUNNY_APP_ID, BUNNYNET_API_KEY, and IMAGE_TAG are required');
}

// The container that runs the server, as named in the app
const containerName = 'app';
const timeoutMs = 15 * 60_000;
const pollMs = 10_000;

const appURL = `https://api.bunny.net/mc/apps/${encodeURIComponent(appId)}`;

async function request(method, path, body) {
	const response = await fetch(appURL + path, {
		method,
		headers: { AccessKey: apiKey, 'Content-Type': 'application/json' },
		body: body && JSON.stringify(body),
		signal: AbortSignal.timeout(30_000),
	});
	if (!response.ok) {
		throw new Error(`${method} ${path || '/'}: HTTP ${response.status} ${await response.text()}`);
	}
	const text = await response.text();
	return text ? JSON.parse(text) : null;
}

// runsTag reports whether a pod's server container is ready with the new image.
// Images look like ghcr.io/owner/repo:tag, maybe followed by @sha256:digest.
function runsTag(pod) {
	const container = pod.containers?.find((c) => c.name === containerName);
	const images = [container?.image, container?.imageDisplay];
	return (
		pod.status === 'ready' &&
		container?.status === 'ready' &&
		images.some((image) => image?.split('@')[0].endsWith(`:${tag}`))
	);
}

const app = await request('GET', '');
const container = app.containerTemplates.find((c) => c.name === containerName);
if (!container) throw new Error(`The app has no container named ${containerName}`);

await request('PATCH', `/containers/${encodeURIComponent(container.id)}`, { imageTag: tag });
console.log(`Deploying ${tag}`);

const deadline = Date.now() + timeoutMs;
for (;;) {
	await new Promise((resolve) => setTimeout(resolve, pollMs));

	const overview = await request('GET', '/overview');
	const regions = overview.regions ?? [];
	const pods = regions.flatMap((region) => region.pods ?? []);
	for (const pod of pods) {
		const messages = [pod.message, ...(pod.containers ?? []).map((c) => c.message)].filter(Boolean);
		console.log(`${pod.name}: ${pod.status}${messages.length ? ` (${messages.join('; ')})` : ''}`);
	}

	if (
		['failing', 'inactive', 'suspended'].includes(overview.status) ||
		regions.some((region) => region.status === 'failing')
	) {
		throw new Error(`The deployment failed: the app is ${overview.status}`);
	}
	if (
		overview.status === 'active' &&
		pods.length > 0 &&
		pods.length >= overview.desiredInstances &&
		pods.every(runsTag)
	) {
		break;
	}
	if (Date.now() > deadline) throw new Error(`${tag} wasn't running after 15 minutes`);
}
console.log(`${tag} is running`);
