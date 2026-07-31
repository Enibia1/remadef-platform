/* ==========================================================
   REMADEF PLATFORM
   DESIGN SYSTEM
   File: src/config/design-system.ts

   PURPOSE
   ----------------------------------------------------------
   Global design tokens used across the platform.

   RULES
   ----------------------------------------------------------
   • Never hardcode colors.
   • Never hardcode spacing.
   • Never hardcode border radius.
   • Never hardcode shadows.
   • Never hardcode animation duration.

   Everything references this file.
========================================================== */

/* ==========================================================
   COLORS
========================================================== */

export const COLORS = {

    primary: "#071A3D",

    primaryLight: "#0D2A5C",

    secondary: "#2563EB",

    accent: "#38BDF8",

    success: "#16A34A",

    warning: "#F59E0B",

    danger: "#DC2626",

    info: "#0284C7",

    white: "#FFFFFF",

    black: "#000000",

    background: "#F5F7FB",

    surface: "#FFFFFF",

    border: "#E5E7EB",

    divider: "#EDF2F7",

    text: "#152238",

    textMuted: "#6B7280",

    disabled: "#BFC7D4"

} as const;


/* ==========================================================
   TYPOGRAPHY
========================================================== */

export const TYPOGRAPHY = {

    fontFamily:

        `'Inter',
         'Segoe UI',
         Roboto,
         Arial,
         sans-serif`,

    h1: 36,

    h2: 30,

    h3: 24,

    h4: 20,

    h5: 18,

    h6: 16,

    body: 15,

    small: 13,

    tiny: 11,

    weightLight: 300,

    weightRegular: 400,

    weightMedium: 500,

    weightBold: 700

} as const;


/* ==========================================================
   SPACING
========================================================== */

export const SPACING = {

    xs: 4,

    sm: 8,

    md: 16,

    lg: 24,

    xl: 32,

    xxl: 48,

    section: 64

} as const;


/* ==========================================================
   BORDER RADIUS
========================================================== */

export const RADIUS = {

    xs: 4,

    sm: 8,

    md: 12,

    lg: 16,

    xl: 24,

    pill: 999,

    circle: "50%"

} as const;


/* ==========================================================
   ICONS
========================================================== */

export const ICONS = {

    xs: 14,

    sm: 16,

    md: 20,

    lg: 24,

    xl: 32,

    xxl: 48

} as const;


/* ==========================================================
   SHADOWS
========================================================== */

export const SHADOWS = {

    small:

        "0 2px 6px rgba(0,0,0,.08)",

    medium:

        "0 6px 18px rgba(0,0,0,.12)",

    large:

        "0 12px 36px rgba(0,0,0,.16)"

} as const;


/* ==========================================================
   ANIMATION
========================================================== */

export const ANIMATION = {

    fast: 150,

    normal: 250,

    slow: 400,

    sidebar: 250,

    modal: 220

} as const;


/* ==========================================================
   BREAKPOINTS
========================================================== */

export const BREAKPOINTS = {

    mobile: 768,

    tablet: 1024,

    desktop: 1280,

    wide: 1600

} as const;


/* ==========================================================
   Z INDEX
========================================================== */

export const ZINDEX = {

    dropdown: 1000,

    sticky: 1100,

    sidebar: 1200,

    modal: 1300,

    notification: 1400,

    tooltip: 1500,

    loading: 9999

} as const;


/* ==========================================================
   EXPORT
========================================================== */

const DESIGN_SYSTEM = {

    COLORS,

    TYPOGRAPHY,

    SPACING,

    RADIUS,

    ICONS,

    SHADOWS,

    ANIMATION,

    BREAKPOINTS,

    ZINDEX

};

export default DESIGN_SYSTEM;
