import { describe, it, expect, vi } from 'vitest';
import { capitalize, getTrains } from './trains-service';
import * as api from './rfi-api';

vi.mock('./rfi-api', () => ({ getTrains: vi.fn() }));

describe('getTrains', () => {
	it('counts occurrences per train and resets the counters for each response', async () => {
		const cancelled: api.ApiTrain = {
			carrier: 'TRENITALIA',
			category: 'Categoria REG',
			number: '16124',
			destination: 'TRENTO',
			time: '22:22',
			platform: '',
			delay: 'Cancellato',
			isBlinking: false,
			notes: 'SOPPRESSO -',
			stopTimes: [],
		};
		const running = { ...cancelled, platform: '1', delay: '' };
		const unrelated = { ...running, number: '16126' };
		vi.mocked(api.getTrains)
			.mockResolvedValueOnce([cancelled, unrelated, running])
			.mockResolvedValueOnce([unrelated, cancelled, running]);

		const first = await getTrains('duplicate-test-first');
		const second = await getTrains('duplicate-test-second');

		expect(first.value.map((train) => train.id)).toEqual([
			'Trenitalia-16124-22:22-0',
			'Trenitalia-16126-22:22-0',
			'Trenitalia-16124-22:22-1',
		]);
		expect(second.value.map((train) => train.id)).toEqual([
			'Trenitalia-16126-22:22-0',
			'Trenitalia-16124-22:22-0',
			'Trenitalia-16124-22:22-1',
		]);
	});
});

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
	it("preserves apostrophes in names like Ponte d'Adige", () => {
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
