export type Theme = "light" | "dark" | "system";

let systemQuery: MediaQueryList | undefined;
let systemChangeHandler: (() => void) | undefined;
let themeTransitionTimeout = 0;

export function getSavedTheme(): Theme {
  try {
    const savedTheme = window.localStorage.getItem("gap-it-theme");
    return savedTheme === "dark" || savedTheme === "system" ? savedTheme : "light";
  } catch (error) {
    console.warn("Unable to read the saved theme from browser storage.", error);
    return "light";
  }
}

export function setSavedTheme(theme: Theme): void {
  if (systemQuery && systemChangeHandler) {
    systemQuery.removeEventListener("change", systemChangeHandler);
    systemQuery = undefined;
    systemChangeHandler = undefined;
  }
  if (theme === "system") {
    systemQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemChangeHandler = () => applyTheme(resolveTheme("system"));
    systemQuery.addEventListener("change", systemChangeHandler);
  }
  const activeTheme = resolveTheme(theme);
  applyTheme(activeTheme);
  try {
    window.localStorage.setItem("gap-it-theme", theme);
  } catch (error) {
    console.warn("Unable to save the theme to browser storage.", error);
  }
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function applyTheme(theme: "light" | "dark"): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  document.documentElement.classList.add("theme-switching");
  window.clearTimeout(themeTransitionTimeout);
  themeTransitionTimeout = window.setTimeout(
    () => document.documentElement.classList.remove("theme-switching"),
    250,
  );
  window.dispatchEvent(new Event("gap-it-theme-change"));
}
