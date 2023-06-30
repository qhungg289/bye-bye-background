/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.vue"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["IBM Plex Sans", "sans-serif"],
            },
        },
    },
    plugins: [],
};
