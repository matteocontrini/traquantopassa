// Polyfill for Array.prototype.toSorted (ES2023)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
if (!Array.prototype.toSorted) {
	Array.prototype.toSorted = function <T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
		return [...this].sort(compareFn);
	};
}
