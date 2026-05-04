/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#818cf8",
                "primary-dark": "#a78bfa",
                "secondary": "#a78bfa",
                "background-light": "#f0f2ff",
                "background-dark": "#16182c",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "sans": ["Lexend", "sans-serif"]
            },
            animation: {
                'shimmer': 'shimmer 2s infinite',
                'float-soft': 'floatSoft 4s ease-in-out infinite alternate',
                'fadeIn': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'spring-up': 'springUp 0.7s cubic-bezier(0.3, 1.5, 0.7, 1) forwards',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                floatSoft: {
                    'from': { transform: 'translateY(0)' },
                    'to': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    'from': { opacity: '0', transform: 'translateY(15px) scale(0.97)' },
                    'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                springUp: {
                    'from': { opacity: '0', transform: 'translateY(30px) scale(0.9)' },
                    'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
            }
        },
    },
    plugins: [],
}
