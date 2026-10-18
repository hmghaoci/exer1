import { THEMES, ThemeConfig, ThemeStyle } from '../types/theme';

const THEME_KEY = 'gymlog.themeStyle';

export function getSavedTheme(): ThemeStyle {
  try {
    const saved = localStorage.getItem(THEME_KEY) as ThemeStyle;
    if (saved && THEMES[saved]) return saved;
  } catch {
    // fallback
  }
  return 'eclipse'; // Default to gorgeous Eclipse Amber matching reference image 1
}

export function saveTheme(theme: ThemeStyle) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}
