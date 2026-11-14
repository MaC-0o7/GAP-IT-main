export type Theme = "light" | "dark";

export function getSavedTheme(): Theme {
  try {
    return window.localStorage.getItem("gap-it-theme") === "dark" ? "dark" : "light";
  } catch (error) {
    console.warn("Unable to read the saved theme from browser storage.", error);
    return "light";
  }
}

export function setSavedTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  try {
    window.localStorage.setItem("gap-it-theme", theme);
  } catch (error) {
    console.warn("Unable to save the theme to browser storage.", error);
  }
  window.dispatchEvent(new Event("gap-it-theme-change"));
}
