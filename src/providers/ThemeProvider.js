"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "mentor",
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "mentorlagbe-theme";
const DARK = "mentordark";
const LIGHT = "mentor";

function readStoredTheme() {
  if (typeof window === "undefined") return LIGHT;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || LIGHT;
  } catch {
    return LIGHT;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(LIGHT);

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const applyTheme = useCallback((next) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === LIGHT ? DARK : LIGHT);
  }, [applyTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
