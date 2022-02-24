module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        "(screen-1)": "calc(100vh - 1)",
        "(screen-80)": "calc(100vh - 5rem)",
        "(screen-320)": "calc(100vh - 20rem - 5rem)",
        "(screen-432)": "calc(100vh - 30rem)",
        "(timeline-first)": "calc(100% + 2rem)",
        "(timeline)": "calc(100% + 1rem)",
        "(timeline-end)": "calc(100% - 0.75rem + 0.5rem)", //margin abziehen und padding dazu addieren
      },
    },
  },
  plugins: [],
};
