export default class CachedItem<T> {
	value: T;
	cachedAt: Date;

	constructor(value: T) {
		this.value = value;
		this.cachedAt = new Date();
	}
}
