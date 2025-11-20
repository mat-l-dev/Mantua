import type { Config } from 'tailwindcss'
import { themeConfig } from '@mantua/shared/theme'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: themeConfig.typography.fontFamily.sans,
      },
      spacing: themeConfig.spacing,
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        xs: themeConfig.shadows.xs,
        sm: themeConfig.shadows.sm,
        md: themeConfig.shadows.md,
        lg: themeConfig.shadows.lg,
        xl: themeConfig.shadows.xl,
      },
      animation: {
        'fade-in': 'fade-in 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-up': 'slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-in': 'scale-in 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        'fade-in': themeConfig.animations.keyframes.fadeIn,
        'slide-up': themeConfig.animations.keyframes.slideInUp,
        'scale-in': themeConfig.animations.keyframes.scaleIn,
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        quick: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
