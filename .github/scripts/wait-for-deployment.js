const { BUNNY_APP_ID: appId, BUNNYNET_API_KEY: apiKey, IMAGE_TAG: imageTag } = process.env;

if (!appId || !apiKey || !imageTag) {
	throw new Error('BUNNY_APP_ID, BUNNYNET_API_KEY, and IMAGE_TAG are required');
}

const deadline = Date.now() + 15 * 60_000;
let ready = false;

while (Date.now() < deadline) {
	const response = await fetch(
		`https://api.bunny.net/mc/apps/${encodeURIComponent(appId)}/overview`,
		{ headers: { AccessKey: apiKey }, signal: AbortSignal.timeout(30_000) },
	);
	if (!response.ok) throw new Error(`Bunny API returned HTTP ${response.status}`);
	const overview = await response.json();
	const regions = (overview.regions ?? []).filter(
		(region) => region.isRequired || region.pods?.length,
	);
	if (
		['failing', 'inactive', 'suspended'].includes(overview.status) ||
		regions.some((region) => region.status === 'failing')
	) {
		throw new Error(`Bunny deployment failed (status: ${overview.status})`);
	}
	const pods = regions.flatMap((region) => region.pods ?? []);
	ready =
		overview.status === 'active' &&
		regions.length > 0 &&
		regions.every((region) => region.status === 'active') &&
		pods.length > 0 &&
		pods.length >= overview.desiredInstances &&
		pods.every((pod) => {
			const container = pod.containers?.find((container) => container.name === 'app');
			return (
				pod.status === 'ready' &&
				container?.status === 'ready' &&
				[container.image, container.imageDisplay].some(
					(image) => typeof image === 'string' && image.split('@')[0].endsWith(`:${imageTag}`),
				)
			);
		});
	if (ready) break;
	console.log(`Waiting for ${imageTag}: ${overview.status ?? 'unknown'}`);
	await new Promise((resolve) => setTimeout(resolve, 10_000));
}

if (!ready) throw new Error(`Timed out waiting for Bunny deployment ${imageTag}`);
console.log(`Bunny deployment ${imageTag} is ready`);
