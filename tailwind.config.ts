import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    
    themes: [
      {
        mytheme: {

          "primary": "#eab308",

          "secondary": "#b91c1c",

          "accent": "#3b82f6",

          "neutral": "#18182f",

          "base-100": "#ffffff",

          "info": "#3abff8",

          "success": "#22c55e",

          "warning": "#fbbd23",

          "error": "#e11d48",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/forms'),
    
  ],
}
export default config
