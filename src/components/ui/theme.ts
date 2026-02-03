/**
 * Life@Dev v2.0 Design System
 * "Cyberpunk Command Center" - Dark Mode, Terminal, Neon Accents
 */

export const theme = {
  colors: {
    // Backgrounds
    canvas: '#0D1117',
    surface: '#161B22',
    glass: 'rgba(13, 17, 23, 0.8)',

    // Text
    textPrimary: '#C9D1D9',
    textSecondary: '#8B949E',
    textMuted: '#484F58',

    // Functional Accents
    skill: '#39D353', // Neon Green - Potential/Coding Skill
    xp: '#A371F7', // Vercel Purple - Proof/Career XP
    stress: '#FF7B72', // Error Red - Burnout/Risk
    money: '#D2A8FF', // Gold/Light Purple - Wealth
    energy: '#58A6FF', // Blue - Action Points

    // Corporate vs Freelance
    corporate: '#A371F7',
    freelance: '#F0883E',

    // Borders
    border: '#30363D',
    borderActive: '#39D353',

    // Status indicators
    success: '#39D353',
    warning: '#F0883E',
    error: '#FF7B72',
    info: '#58A6FF',
  },

  fonts: {
    mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif',
  },

  // Stress level thresholds
  stressLevels: {
    safe: { max: 50, color: '#39D353' },
    high: { max: 80, color: '#F0883E' },
    danger: { max: 100, color: '#FF7B72' },
  },

  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
} as const;

// CSS class utilities
export const themeClasses = {
  // Card styles
  card: 'bg-surface border border-border rounded-lg',
  cardHover: 'hover:border-skill hover:shadow-[0_0_20px_rgba(57,211,83,0.2)]',
  cardGlass: 'bg-glass backdrop-blur-md border border-border rounded-lg',

  // Text styles
  textPrimary: 'text-[#C9D1D9]',
  textSecondary: 'text-[#8B949E]',
  textMuted: 'text-[#484F58]',

  // Accent text
  textSkill: 'text-[#39D353]',
  textXp: 'text-[#A371F7]',
  textStress: 'text-[#FF7B72]',
  textMoney: 'text-[#D2A8FF]',
  textEnergy: 'text-[#58A6FF]',

  // Glow effects
  glowSkill: 'shadow-[0_0_20px_rgba(57,211,83,0.3)]',
  glowXp: 'shadow-[0_0_20px_rgba(163,113,247,0.3)]',
  glowStress: 'shadow-[0_0_20px_rgba(255,123,114,0.3)]',
} as const;

export type Theme = typeof theme;
