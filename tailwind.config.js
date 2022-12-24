/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	mode: "jit",
	purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
	theme: {
		extend: {},
	},
	plugins: [],
};
