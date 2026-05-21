export const COLORS = {
  primary: '#094B1F',         // Premium gourmet Emerald Green
  primaryLight: '#EBF6EF',    // Light mint green background highlights
  accent: '#FFB800',         // Amber gold for review stars, price tags, and highlights
  dark: '#111E15',            // Forest green-black for primary headers & text
  secondary: '#5A6E60',       // Soft grayish sage for description/subtitles
  background: '#F4F8F5',      // Creamy, organic light green-grey background (gentle on eyes)
  surface: '#FFFFFF',         // Cards, inputs, and sheet backgrounds
  success: '#2E7D32',         // Rich forest success state
  error: '#D32F2F',           // Gourmet berry-red for error & delete states
  border: '#E2ECE5',          // Fine lines and thin borders
  placeholder: '#A2B5A8',     // Muted grey-green placeholder
  white: '#FFFFFF',
  shadowColor: '#094B1F',     // Tinted shadow color for high-end organic style
  overlay: 'rgba(17, 30, 21, 0.45)', // Overlay background
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: COLORS.dark,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.dark,
  },
  body: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: '#7D9284',
    letterSpacing: 0.1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5,
  },
  heavy: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
};
