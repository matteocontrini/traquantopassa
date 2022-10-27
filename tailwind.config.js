/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: [],
    theme: {
        extend: {
            fontFamily: {
                sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                'blink': '1s blink infinite step-end',
            },
            keyframes: {
                blink: {
                    '0%': { 'margin-left': '0' },
                    '50%': { 'margin-left': '5px' },
                    '100%': { 'margin-left': '0' },
                }
            }
        },
    },
};
