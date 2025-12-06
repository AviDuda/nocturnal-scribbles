import { geocitiesBorders, geocitiesReadableFonts } from "./data";

const T = window.ThemeUtils;

/** Nostalgic tooltip messages reminiscent of 90s web pages. */
export const geocitiesTooltips = [
	"Welcome to my homepage!!!",
	"Under construction!!!",
	"Best viewed in 800x600",
	"Sign my guestbook!",
	"Made with Notepad",
	"This page is Y2K compliant!",
	"Netscape Navigator 4.0+ recommended",
	"Get Internet Explorer FREE!",
	"AOL Keyword: awesome",
	"Add me to your bookmarks!",
	"Click here for MIDI music!",
	"No right-click allowed!!!",
	"This site is frames-free!",
	"Optimized for 56k modem",
	"Java-enhanced experience!",
	"Created with Microsoft FrontPage",
	"Best viewed with eyes closed",
	"Powered by GeoCities!",
	"Member of the Raccoon WebRing",
	"FREE hit counter!",
	"Download Netscape NOW!",
	"This page uses DHTML!",
	"Enhanced for IE 4.0",
	"JavaScript required",
	"Shockwave Flash inside!",
];

/** Available cursor styles for random assignment. */
export const cursors = [
	"crosshair",
	"help",
	"wait",
	"cell",
	"move",
	"not-allowed",
	"grab",
	"zoom-in",
	"zoom-out",
	"pointer",
	"progress",
	"text",
	"vertical-text",
	"alias",
	"copy",
	"no-drop",
	"all-scroll",
	"col-resize",
	"row-resize",
	"n-resize",
	"e-resize",
	"s-resize",
	"w-resize",
	"ne-resize",
	"nw-resize",
	"se-resize",
	"sw-resize",
];

/** CSS filter effects including blur, saturation, contrast, and color manipulation. */
export const filters = [
	"blur(0.5px)",
	"blur(1px)",
	"saturate(200%)",
	"saturate(50%)",
	"contrast(150%)",
	"contrast(75%)",
	"brightness(120%)",
	"brightness(80%)",
	"sepia(50%)",
	"sepia(100%)",
	"hue-rotate(90deg)",
	"hue-rotate(180deg)",
	"hue-rotate(270deg)",
	"invert(100%)",
	"grayscale(100%)",
];

/** Filters safe for large containers (no blur that would impact readability). */
export const safeFilters = [
	"saturate(200%)",
	"saturate(50%)",
	"contrast(120%)",
	"contrast(85%)",
	"brightness(110%)",
	"brightness(90%)",
	"sepia(30%)",
	"hue-rotate(30deg)",
	"hue-rotate(60deg)",
];

/** CSS mix-blend-mode values for visual chaos. */
export const blendModes = [
	"multiply",
	"screen",
	"overlay",
	"darken",
	"lighten",
	"color-dodge",
	"color-burn",
	"hard-light",
	"soft-light",
	"difference",
	"exclusion",
	"hue",
	"saturation",
	"color",
	"luminosity",
];

/** Injects global CSS for geocities animations, scrollbars, selection colors, and tooltips. */
export function injectGeocitiesStyles() {
	const style = document.createElement("style");
	style.id = "geocities-styles";
	style.textContent = `
			@keyframes geocities-blink {
				0%, 49% { opacity: 1; }
				50%, 100% { opacity: 0; }
			}
			@keyframes geocities-spin {
				to { transform: rotate(360deg); }
			}
			@keyframes geocities-bounce {
				0%, 100% { transform: translateY(0); }
				50% { transform: translateY(-10px); }
			}
			@keyframes geocities-rainbow {
				0% { color: red; }
				14% { color: orange; }
				28% { color: yellow; }
				42% { color: green; }
				57% { color: blue; }
				71% { color: indigo; }
				85% { color: violet; }
				100% { color: red; }
			}
			@keyframes geocities-glow {
				0%, 100% { text-shadow: 0 0 5px currentColor; }
				50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
			}
			@keyframes geocities-pulse {
				0%, 100% { transform: scale(1); }
				50% { transform: scale(1.05); }
			}
			@keyframes geocities-shake {
				0%, 100% { transform: translateX(0); }
				25% { transform: translateX(-3px) rotate(-1deg); }
				75% { transform: translateX(3px) rotate(1deg); }
			}
			@keyframes geocities-wiggle {
				0%, 100% { transform: rotate(-3deg); }
				50% { transform: rotate(3deg); }
			}
			@keyframes geocities-color-cycle {
				0% { background-color: red; }
				16% { background-color: orange; }
				33% { background-color: yellow; }
				50% { background-color: green; }
				66% { background-color: blue; }
				83% { background-color: purple; }
				100% { background-color: red; }
			}
			@keyframes geocities-gradient-shift {
				0% { background-position: ${T.rand(0, 50)}% ${T.rand(0, 50)}%; }
				50% { background-position: ${T.rand(50, 100)}% ${T.rand(50, 100)}%; }
				100% { background-position: ${T.rand(0, 50)}% ${T.rand(0, 50)}%; }
			}
			.geocities-blink { animation: geocities-blink 1s step-end infinite; }
			.geocities-spin { animation: geocities-spin 2s linear infinite; display: inline-block; }
			.geocities-bounce { animation: geocities-bounce 0.5s ease-in-out infinite; display: inline-block; }
			.geocities-rainbow { animation: geocities-rainbow 3s linear infinite; }
			.geocities-glow { animation: geocities-glow 1.5s ease-in-out infinite; }
			.geocities-pulse { animation: geocities-pulse 1s ease-in-out infinite; }
			.geocities-shake { animation: geocities-shake 0.3s ease-in-out infinite; }
			.geocities-wiggle { animation: geocities-wiggle 0.5s ease-in-out infinite; display: inline-block; }
			.geocities-color-cycle { animation: geocities-color-cycle 5s linear infinite; }
			.geocities-gradient-shift {
				background-size: 200% 200%;
				animation: geocities-gradient-shift 8s ease infinite;
			}
			.geocities-lens-flare {
				position: fixed;
				pointer-events: none;
				z-index: 9998;
				border-radius: 50%;
				mix-blend-mode: screen;
				transition: transform 0.1s ease-out;
			}
			.geocities-entry {
				animation: geocities-entry 0.8s ease-out forwards;
			}
			@keyframes geocities-entry {
				from {
					opacity: 0;
					transform: var(--entry-transform);
				}
				to {
					opacity: 1;
					transform: none;
				}
			}
			.geocities-status-bar {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				font-family: "MS Sans Serif", "Segoe UI", Tahoma, sans-serif;
				font-size: 12px;
				padding: 2px 4px;
				z-index: 9999;
			}
			.geocities-status-bar marquee {
				display: block;
			}
			/* Styled scrollbars - random every reload */
			::-webkit-scrollbar {
				width: ${T.rand(12, 25)}px;
				height: ${T.rand(12, 25)}px;
			}
			::-webkit-scrollbar-track {
				background: ${T.pick([
					`linear-gradient(${T.rand(0, 360)}deg, ${T.randomColor()}, ${T.randomColor()})`,
					`repeating-linear-gradient(${T.rand(0, 90)}deg, ${T.randomColor()} 0px, ${T.randomColor()} 5px, ${T.randomColor()} 5px, ${T.randomColor()} 10px)`,
					T.randomColor(),
					`radial-gradient(${T.randomColor()}, ${T.randomColor()})`,
				])};
			}
			::-webkit-scrollbar-thumb {
				background: ${T.pick([
					`linear-gradient(${T.rand(0, 360)}deg, ${T.randomColor()}, ${T.randomColor()}, ${T.randomColor()})`,
					T.randomColor(),
					`repeating-linear-gradient(45deg, ${T.randomColor()} 0px, ${T.randomColor()} 3px, ${T.randomColor()} 3px, ${T.randomColor()} 6px)`,
				])};
				border: ${T.rand(2, 5)}px ${T.pick(geocitiesBorders)} ${T.randomColor()};
				border-radius: ${T.rand(0, 10)}px;
			}
			::-webkit-scrollbar-thumb:hover {
				background: ${T.randomColor()};
			}
			::-webkit-scrollbar-corner {
				background: ${T.randomColor()};
			}
			/* Firefox scrollbar */
			* {
				scrollbar-width: auto;
				scrollbar-color: ${T.randomColor()} ${T.randomColor()};
			}
			/* Random selection colors per refresh */
			::selection {
				background: ${T.randomColor()};
				color: ${T.randomColor()};
			}
			/* Cursed tooltips */
			.tooltip {
				background: ${T.randomBackground()} !important;
				color: ${T.randomColor()} !important;
				border: ${T.rand(2, 5)}px ${T.pick(geocitiesBorders)} ${T.randomColor()} !important;
				border-radius: ${T.rand(0, 30)}px !important;
				font-family: ${T.pick(geocitiesReadableFonts)} !important;
				box-shadow: ${T.rand(-5, 5)}px ${T.rand(-5, 5)}px ${T.rand(5, 15)}px ${T.randomColor()},
					${T.rand(-5, 5)}px ${T.rand(-5, 5)}px ${T.rand(5, 15)}px ${T.randomColor()} !important;
				transform: rotate(${T.randFloat(-5, 5)}deg);
				animation: ${T.pick(["geocities-pulse", "geocities-shake", "geocities-wiggle", "none", "none"])} 0.5s ease-in-out infinite;
			}
			.tooltip a {
				color: ${T.randomColor()} !important;
				text-decoration: ${T.pick(["underline wavy", "underline dotted", "underline dashed", "none"])} ${T.randomColor()} !important;
			}
		`;
	document.head.appendChild(style);
}
