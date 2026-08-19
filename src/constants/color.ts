/**
 * Brand color palette — based on university logo (maroon + gold).
 *
 * Usage (direct):
 *   import { colors } from "./colors";
 *   <View style={{ backgroundColor: colors.maroon[600] }} />
 *
 * Usage (NativeWind / Tailwind):
 *   1. In tailwind.config.js:
 *        const { colors } = require("./colors");
 *        module.exports = {
 *          theme: {
 *            extend: { colors },
 *          },
 *        };
 *   2. In components:
 *        <View className="bg-maroon-600 border-gold-500" />
 */

export const colors = {
  maroon: {
    50: "#FBEAEE",
    100: "#F3CCD6",
    200: "#E39BAD",
    300: "#CC6883",
    400: "#A83A57",
    500: "#8A1F3B",
    600: "#6E0E23", // primary brand maroon
    700: "#5C0C1E",
    800: "#470917",
    900: "#330610",
    950: "#1F030A",
  },
  gold: {
    50: "#FDF9EC",
    100: "#FAF0C9",
    200: "#F3DF8F",
    300: "#EACB56",
    400: "#DEBA3F",
    500: "#D4AF37", // primary brand gold
    600: "#B3922B",
    700: "#8C7220",
    800: "#655217",
    900: "#40340E",
    950: "#241C07",
  },

  // Neutral scale for text, backgrounds, borders — kept warm-gray to
  // complement maroon/gold rather than clashing with cool grays.
  neutral: {
    0: "#FFFFFF",
    50: "#FAF9F7",
    100: "#F2F0EC",
    200: "#E4E0D9",
    300: "#CFC9BE",
    400: "#A69E8F",
    500: "#7D7566",
    600: "#5C5548",
    700: "#433D33",
    800: "#2B2722",
    900: "#181613",
    1000: "#000000",
  },

  // Semantic aliases — reference these in UI code instead of raw
  // maroon/gold shades so re-theming later only touches this block.
  semantic: {
    primary: "#6E0E23", // maroon.600
    primaryLight: "#8A1F3B", // maroon.500
    primaryDark: "#470917", // maroon.800
    accent: "#D4AF37", // gold.500
    accentLight: "#EACB56", // gold.300
    accentDark: "#8C7220", // gold.700
    background: "#FAF9F7", // neutral.50
    surface: "#FFFFFF",
    border: "#E4E0D9", // neutral.200
    textPrimary: "#181613", // neutral.900
    textSecondary: "#5C5548", // neutral.600
    textOnPrimary: "#FFFFFF",
    textOnAccent: "#2B2722", // dark text reads better on gold than white
    success: "#3E7D4C",
    danger: "#B3261E",
    warning: "#D4AF37", // reuse gold for warning, avoid introducing new hue
  },
} as const;

export type ColorScale = typeof colors.maroon;
export type SemanticColors = typeof colors.semantic;

export default colors;
