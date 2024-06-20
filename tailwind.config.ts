import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter Variable', ...defaultTheme.fontFamily.sans]
			},
			animation: {
				blink: '1s blink infinite step-end', // train departing
				'spin-forward': '1s spin-forward 1',
				'spin-backward': '1s spin-backward 1'
			},
			keyframes: {
				blink: {
					'0%': { 'margin-left': '0' },
					'50%': { 'margin-left': '5px' },
					'100%': { 'margin-left': '0' }
				},
				'spin-forward': {
					'0%': { 'rotate': '0deg' },
					'100%': { 'rotate': '360deg' }
				},
				'spin-backward': {
					'0%': { 'rotate': '0deg' },
					'100%': { 'rotate': '-360deg' }
				}
			},
			fontSize: {
				mid: '0.9375rem'
			},
			screens: {
				xs: '420px'
			}
		}
	},

	plugins: []
} as Config;
