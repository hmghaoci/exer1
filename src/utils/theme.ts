import { THEMES, ThemeConfig, ThemeStyle } from '../types/theme';

const THEME_KEY = 'gymlog.themeStyle_v4';

export function getSavedTheme(): ThemeStyle {
  try {
    const saved = localStorage.getItem(THEME_KEY) as ThemeStyle;
    if (saved && THEMES[saved]) return saved;
  } catch {
    // fallback
  }
  return 'clean'; // 默认主题为极简净白 (Frosted Studio)
}

export function saveTheme(theme: ThemeStyle) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}
