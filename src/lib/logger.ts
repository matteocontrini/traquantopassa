function log(level: string, message: string, ...args: unknown[]) {
	// @ts-expect-error
	const fn = console[level.toLowerCase()];
	fn(`${new Date().toISOString()} [${level}] ${message}`, ...args);
}

function info(message: string) {
	log('INFO', message);
}

function warn(message: string) {
	log('WARN', message);
}

function error(message: string, e?: unknown) {
	log('ERROR', message, e);
}

function debug(message: string) {
	log('DEBUG', message);
}

export {
	info,
	warn,
	error,
	debug
};
