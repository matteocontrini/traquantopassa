import { describe, it, expect } from 'vitest';
import { capitalize } from './trains-service';

describe('capitalize', () => {
	it('lowercases all-uppercase input', () => {
		expect(capitalize('BOLOGNA')).toBe('Bologna');
	});

	it('handles multi-word station names', () => {
		expect(capitalize('MILANO CENTRALE')).toBe('Milano Centrale');
	});

	it('adds a space after a dot in abbreviated names', () => {
		expect(capitalize('VENEZIA S.LUCIA')).toBe('Venezia S. Lucia');
	});

	it('adds spaces around slashes in bilingual names', () => {
		expect(capitalize('MERANO/MERAN')).toBe('Merano / Meran');
	});

	// @formatter:off
	it('preserves apostrophes in names like Ponte d\'Adige', () => {
		expect(capitalize("PONTE D'ADIGE")).toBe("Ponte d'Adige");
	});
	// @formatter:on

	// @formatter:off
	it('normalizes repeated apostrophes', () => {
		expect(capitalize("PONTE D''''ADIGE")).toBe("Ponte d'Adige");
	});
	// @formatter:on

	it('handles hyphenated names', () => {
		expect(capitalize('REGGIO-EMILIA')).toBe('Reggio-Emilia');
	});
});
