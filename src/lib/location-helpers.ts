import type { StopCoordinates } from '$lib/StopCoordinates';

export function distance(userCoordinates: GeolocationCoordinates | null, stopCoordinates: StopCoordinates) {
	if (userCoordinates == null) {
		return Infinity;
	}

	return Math.sqrt(
		Math.pow(userCoordinates.latitude - stopCoordinates.lat, 2) +
		Math.pow(userCoordinates.longitude - stopCoordinates.lon, 2)
	);
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

export function handleGeolocationError(err: unknown) {
	if (err instanceof GeolocationPositionError && err.code == err.PERMISSION_DENIED) {
		alert(
			'La richiesta di accesso alla posizione è stata negata. Verifica le autorizzazioni al sito nelle impostazioni del tuo browser.'
		);
	} else {
		alert('Si è verificato un errore durante l\'ottenimento della posizione');
	}
}

export async function isGeolocationGranted() {
	// Safari doesn't support permissions API, so we can't check if the permission was granted
	if (!navigator.permissions) {
		return false;
	}

	const permission = await navigator.permissions.query({ name: 'geolocation' });
	// other values are 'prompt' and 'denied'
	return permission.state === 'granted';
}
