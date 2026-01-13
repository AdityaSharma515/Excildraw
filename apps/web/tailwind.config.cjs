const sharedConfig = require("@excildraw/config/tailwind.config.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
};
