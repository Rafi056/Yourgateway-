/**
 * Palette derived exactly from the gateway-services web artifact's
 * index.css CSS custom properties (HSL → hex conversion).
 *
 * CSS variable → hex
 *  --background:  210 20% 98%  → #f8f9fb
 *  --foreground:  222 47% 11%  → #0d1829  (dark navy, used as gradient end)
 *  --primary:     222 47% 20%  → #1b294b  (deep Oxford blue)
 *  --secondary:   38 92% 50%   → #f49f0a  (gold/amber)
 *  --muted:       210 40% 96%  → #eff4fb
 *  --muted-fg:    215 16% 47%  → #6b7a97
 *  --border:      214 32% 91%  → #d8e3f0
 *  --card:        0   0%  100% → #ffffff
 */

const colors = {
  light: {
    text: "#0d1829",
    tint: "#1b294b",

    background: "#f8f9fb",
    foreground: "#0d1829",

    card: "#ffffff",
    cardForeground: "#0d1829",

    primary: "#1b294b",
    primaryForeground: "#f8f9fb",

    gold: "#f49f0a",
    goldForeground: "#0d1829",

    secondary: "#eff4fb",
    secondaryForeground: "#0d1829",

    muted: "#eff4fb",
    mutedForeground: "#6b7a97",

    accent: "#eff4fb",
    accentForeground: "#0d1829",

    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    border: "#d8e3f0",
    input: "#d8e3f0",

    whatsapp: "#25D366",
  },

  radius: 12,
};

export default colors;
