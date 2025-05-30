/**@type {import('tailwindcss').Config} */

export default {
    content : [
        "./index.html",
        "./src/**/*.{.js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors : {
                "primary" : "#4A90E2",
                "secondary" : "#7ED321"
            }
        }
    }
}

