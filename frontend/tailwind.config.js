/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // utile si tu veux ajouter un toggle mode sombre
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      colors: {
        // Couleurs personnalisées
        'brand-blue': '#3b82f6',
        'brand-indigo': '#5c6ac4',
        'sky-glow': '#e0f2ff', // ciel doux
        'cloud-gray': '#dbeafe', // nuage léger
      },
      backgroundImage: {
        // Tu peux utiliser ça dans className: bg-sunny, etc.
        'sunny': "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')",
        'rainy': "url('/rain.jpg')", // tu peux ajouter rain.jpg si besoin
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        weather: ['"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
