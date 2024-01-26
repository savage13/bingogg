import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#8c091b',
                'primary-content': '#f99ba8',
                'primary-dark': '#5c0612',
                'primary-light': '#bc0c24',

                secondary: '#38098c',
                'secondary-content': '#bd9bf9',
                'secondary-dark': '#25065c',
                'secondary-light': '#4b0cbc',

                background: '#1b1819',
                foreground: '#282425',
                border: '#433d3d',

                text: '#fbfbfb',
                'text-light': '#dbd7d7',
                'text-lighter': '#aaa1a3',

                success: '#098c09',
                warning: '#8c8c09',
                error: '#8c0909',

                'success-content': '#9bf99b',
                'warning-content': '#f9f99b',
                'error-content': '#f99b9b',
            },
        },
    },
    plugins: [],
};
export default config;
