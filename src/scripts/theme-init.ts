// Early theme initialization to prevent flash of unstyled content
// Depends on theme-shared.js being loaded first

const T = window.ThemeUtils;

// Redirect HN referrers to ?theme=geocities so the URL reflects the theme
const isFromHN = document.referrer.includes("news.ycombinator.com");
if (isFromHN && !new URLSearchParams(window.location.search).has("theme")) {
	window.location.search = "?theme=geocities";
}

// All valid theme values (standard + hotdog variants + meta themes)
const VALID_THEMES = [
	"system",
	"light",
	"dark",
	"oled",
	"terminal",
	"gameboy",
	"halflife",
	"vaporwave",
	"synthwave",
	"hotdog-ketchup",
	"hotdog-mustard",
	"shuffle",
	"chaos",
	"shifting",
	"cursed",
	"geocities",
];

function urlTheme(): string | null {
	const param = new URLSearchParams(window.location.search).get("theme");
	if (param && VALID_THEMES.includes(param)) {
		return param;
	}
	return null;
}

const theme = urlTheme() || localStorage.getItem("theme") || "system";
let activeTheme = theme;
const themes = "__CHAOS_THEMES__".split(",");

if (theme === "shuffle") {
	activeTheme = themes[Math.floor(Math.random() * themes.length)] ?? "system";
}

if (theme === "shifting" || theme === "geocities") {
	// Don't set data-theme, these use inline styles
} else if (activeTheme === "dark") {
	document.documentElement.setAttribute("data-theme", "dark");
} else if (activeTheme === "light") {
	document.documentElement.setAttribute("data-theme", "light");
} else if (
	activeTheme === "system" &&
	window.matchMedia("(prefers-color-scheme: dark)").matches
) {
	document.documentElement.setAttribute("data-theme", "dark");
} else if (activeTheme !== "system") {
	document.documentElement.setAttribute("data-theme", activeTheme);
}

if (theme === "shifting") {
	T.startShifting();
} else if (theme === "cursed") {
	T.applyCursedStyles(null); // body not available yet
} else if (theme === "chaos") {
	T.applyChaosColors();
} else if (theme === "geocities") {
	T.applyGeocitiesPlaceholder();
}

// Expose resolved theme for theme.ts (avoids duplicating referrer logic)
window.__initialTheme = theme;
