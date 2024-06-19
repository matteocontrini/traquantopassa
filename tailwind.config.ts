import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter Variable', ...defaultTheme.fontFamily.sans]
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
