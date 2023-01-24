/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bckg: '#151515',
        brdr: '#4c4c4c'
      }
    }
  },
  plugins: [require('tailwind-scrollbar-hide')]
}
