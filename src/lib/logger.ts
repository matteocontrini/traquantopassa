function log(level: string, message: string) {
	// @ts-expect-error
	const fn = console[level.toLowerCase()];
	fn(`${new Date().toISOString()} [${level}] ${message}`);
}

function info(message: string) {
	log('INFO', message);
}

function warn(message: string) {
	log('WARN', message);
}

function error(message: string) {
	log('ERROR', message);
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
