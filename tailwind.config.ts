import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        offBlack: "var(--offBlack)",
        casperWhite: "var(--casperWhite)",
        shadowGrey: "var(--shadowGrey)",
        crimsonRed: "var(--crimsonRed)",
      },
      fontFamily: {
        neueMontreal: ["var(--font-neueMontreal)"],
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  darkMode: "class",
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"),
    heroui()
  ],
} satisfies Config;
