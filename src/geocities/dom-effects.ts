import {
	blendModes,
	cursors,
	filters,
	geocitiesTooltips,
	safeFilters,
} from "./styles";

const T = window.ThemeUtils;

/** Wraps random text nodes in marquee elements with varying scroll directions. ~15% of candidates. */
export function marqueeifyText() {
	const directions = ["left", "right", "up", "down"];
	const behaviors = ["scroll", "alternate", "slide"];

	const candidates = document.querySelectorAll("p, li, h1, h2, h3, span");
	candidates.forEach((el) => {
		const firstChild = el.childNodes[0];
		if (
			Math.random() > 0.85 &&
			el.childNodes.length === 1 &&
			firstChild?.nodeType === Node.TEXT_NODE
		) {
			const marquee = document.createElement("marquee");
			marquee.setAttribute("scrollamount", String(T.rand(2, 10)));
			marquee.setAttribute("direction", T.pick(directions));
			marquee.setAttribute("behavior", T.pick(behaviors));
			marquee.textContent = el.textContent;
			el.textContent = "";
			el.appendChild(marquee);
		}
	});
}

/** Splits heading text into individually colored spans creating a rainbow effect. 50% of headings. */
export function rainbowifyHeadings() {
	document.querySelectorAll("h1, h2").forEach((h) => {
		if (Math.random() > 0.5) {
			const text = h.textContent;
			h.innerHTML = text
				.split("")
				.map(
					(char, i) =>
						`<span style="color: hsl(${(i * 25) % 360}, 100%, 50%)">${char}</span>`,
				)
				.join("");
		}
	});
}

/** Assigns random cursor styles to body and various elements. 50% of elements affected. */
export function addCursors() {
	document.body.style.cursor = T.pick(cursors);
	document
		.querySelectorAll<HTMLElement>("a, button, h1, h2, h3, p, li")
		.forEach((el) => {
			if (Math.random() > 0.5) {
				el.style.cursor = T.pick(cursors);
			}
		});
}

/** Adds nostalgic geocities-era tooltips to various elements. 50% of elements. */
export function addTooltips() {
	const elements = document.querySelectorAll<HTMLElement>(
		"a, button, h1, h2, h3, img, p, li, pre, code",
	);
	elements.forEach((el) => {
		if (Math.random() > 0.5) {
			el.title = T.pick(geocitiesTooltips);
		}
	});
}

/** Applies random letter-spacing, word-spacing, text-transform, and text-stroke to elements. */
export function addTypographyChaos() {
	const elements = document.querySelectorAll<HTMLElement>(
		"h1, h2, h3, p, li, a, strong, em, span",
	);
	elements.forEach((el) => {
		// Letter spacing
		if (Math.random() > 0.7) {
			el.style.letterSpacing = `${T.rand(-2, 5)}px`;
		}
		// Word spacing
		if (Math.random() > 0.8) {
			el.style.wordSpacing = `${T.rand(-3, 10)}px`;
		}
		// Text transform
		if (Math.random() > 0.85) {
			el.style.textTransform = T.pick(["uppercase", "lowercase", "capitalize"]);
		}
		// Text stroke (outline text)
		if (Math.random() > 0.9) {
			el.style.webkitTextStroke = `1px ${T.randomColor()}`;
		}
	});
}

/** Adds CSS animations (blink, rainbow, glow, etc) and random text-shadow/decoration to elements. */
export function addTextEffects() {
	const elements = document.querySelectorAll<HTMLElement>(
		"h1, h2, h3, a, strong, em",
	);
	const animations = [
		"geocities-blink",
		"geocities-rainbow",
		"geocities-glow",
		"geocities-pulse",
		"geocities-shake",
		"geocities-wiggle",
	];

	elements.forEach((el) => {
		// Random animation
		if (Math.random() > 0.7) {
			el.classList.add(T.pick(animations));
		}

		// Random text shadows (multiple!)
		if (Math.random() > 0.6) {
			const numShadows = T.rand(1, 4);
			const shadows = [];
			for (let i = 0; i < numShadows; i++) {
				const x = T.rand(-5, 5);
				const y = T.rand(-5, 5);
				const blur = T.rand(0, 10);
				shadows.push(`${x}px ${y}px ${blur}px ${T.randomColor()}`);
			}
			el.style.textShadow = shadows.join(", ");
		}

		// Random text decorations
		if (Math.random() > 0.75) {
			const decorations = [
				"underline",
				"overline",
				"line-through",
				"underline overline",
				"underline line-through",
			];
			const styles = ["wavy", "dotted", "dashed", "double", "solid"];
			el.style.textDecoration = `${T.pick(decorations)} ${T.pick(styles)} ${T.randomColor()}`;
		}
	});
}

/** Applies random transforms, filters, blend modes, shadows, outlines, and border-radius to elements. */
export function addVisualChaos() {
	const largeContainers = [
		"HEADER",
		"MAIN",
		"FOOTER",
		"NAV",
		"ARTICLE",
		"SECTION",
	];
	const elements = document.querySelectorAll<HTMLElement>(
		"header, main, footer, nav, article, section, h1, h2, h3, p, pre, code, .post-list, .tags, .theme-switcher, img",
	);

	elements.forEach((el) => {
		const isLarge = largeContainers.includes(el.tagName);

		// Random rotation
		if (Math.random() > 0.85) {
			const rotate = T.randFloat(-5, 5);
			el.style.transform = `rotate(${rotate}deg)`;
		}

		// Random skew
		if (Math.random() > 0.9) {
			const skewX = T.randFloat(-5, 5);
			const skewY = T.randFloat(-3, 3);
			el.style.transform = `skew(${skewX}deg, ${skewY}deg)`;
		}

		// Random filter (use safe filters for large containers)
		if (Math.random() > 0.85) {
			el.style.filter = T.pick(isLarge ? safeFilters : filters);
		}

		// Random blend mode (skip large containers - breaks visibility)
		if (!isLarge && Math.random() > 0.9) {
			el.style.mixBlendMode = T.pick(blendModes);
		}

		// Random box shadow (multiple!)
		if (Math.random() > 0.6) {
			const numShadows = T.rand(1, 3);
			const shadows = [];
			for (let i = 0; i < numShadows; i++) {
				const x = T.rand(-10, 10);
				const y = T.rand(-10, 10);
				const blur = T.rand(0, 20);
				const spread = T.rand(-5, 10);
				const inset = Math.random() > 0.7 ? "inset " : "";
				shadows.push(
					`${inset}${x}px ${y}px ${blur}px ${spread}px ${T.randomColor()}`,
				);
			}
			el.style.boxShadow = shadows.join(", ");
		}

		// Random outline
		if (Math.random() > 0.8) {
			const outlineStyles = [
				"dotted",
				"dashed",
				"solid",
				"double",
				"groove",
				"ridge",
			];
			el.style.outline = `${T.rand(1, 4)}px ${T.pick(outlineStyles)} ${T.randomColor()}`;
			el.style.outlineOffset = `${T.rand(-3, 5)}px`;
		}

		// Random border-radius
		if (Math.random() > 0.7) {
			const corners = [
				`${T.rand(0, 50)}%`,
				`${T.rand(0, 30)}px`,
				`${T.rand(0, 50)}% ${T.rand(0, 50)}% ${T.rand(0, 50)}% ${T.rand(0, 50)}%`,
			];
			el.style.borderRadius = T.pick(corners);
		}

		// Random z-index for chaos overlapping
		if (Math.random() > 0.8) {
			el.style.position = "relative";
			el.style.zIndex = String(T.rand(-10, 100));
		}
	});
}

/** Randomly applies vertical writing modes and RTL direction to short elements. ~5% of elements. */
export function addWritingModesChaos() {
	const elements = document.querySelectorAll<HTMLElement>("p, li, h3, span, a");
	elements.forEach((el) => {
		const textLength = (el.textContent || "").length;
		// Vertical text - only for short elements to avoid layout chaos
		if (Math.random() > 0.95 && textLength < 50) {
			el.style.writingMode = T.pick([
				"vertical-rl",
				"vertical-lr",
				"sideways-rl",
				"sideways-lr",
			]);
		}
		// RTL chaos
		if (Math.random() > 0.95) {
			el.style.direction = "rtl";
		}
	});
}

/** Applies repeating background patterns (checkerboard, stripes, polka dots) to header/footer/nav. */
export function addBackgroundPatterns() {
	const tileSize = T.rand(15, 40);
	const patterns = [
		// Checkerboard
		`repeating-conic-gradient(${T.randomColor()} 0% 25%, ${T.randomColor()} 0% 50%) 50% / ${tileSize}px ${tileSize}px`,
		// Stripes
		`repeating-linear-gradient(${T.rand(0, 180)}deg, ${T.randomColor()}, ${T.randomColor()} 10px, ${T.randomColor()} 10px, ${T.randomColor()} 20px)`,
		// Polka dots
		`radial-gradient(${T.randomColor()} 20%, transparent 20%) 0 0 / ${tileSize}px ${tileSize}px`,
		// Diagonal stripes
		`repeating-linear-gradient(45deg, ${T.randomColor()}, ${T.randomColor()} 5px, ${T.randomColor()} 5px, ${T.randomColor()} 10px)`,
		...T.geocitiesPatterns,
	];

	// Body background is already applied via placeholder in theme-shared.js
	// Just apply patterns to other elements
	document
		.querySelectorAll<HTMLElement>("header, footer, nav, .theme-switcher")
		.forEach((el) => {
			if (Math.random() > 0.5) {
				el.style.background = T.pick(patterns);
			}
		});
}

/** Styles horizontal rules with rainbow gradients, 3D bevels, or dotted patterns. */
export function addHrStyling() {
	document.querySelectorAll("hr").forEach((hr) => {
		const styles = [
			// Rainbow gradient
			`height: 5px; border: none; background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);`,
			// 3D bevel
			`height: 4px; border: none; border-top: 2px solid ${T.randomColor()}; border-bottom: 2px solid ${T.randomColor()};`,
			// Dotted rainbow
			`border: none; border-top: 3px dotted ${T.randomColor()};`,
			// Double line
			`border: none; border-top: double 5px ${T.randomColor()};`,
			// Wavy (via shadow)
			`height: 3px; border: none; background: ${T.randomColor()}; box-shadow: 0 3px 0 ${T.randomColor()}, 0 6px 0 ${T.randomColor()};`,
		];
		hr.style.cssText = T.pick(styles);
	});
}

/** Adds spin, bounce, pulse, or wiggle animations to tags, images, and buttons. 40% of elements. */
export function spinAndBounce() {
	const animations = [
		"geocities-spin",
		"geocities-bounce",
		"geocities-pulse",
		"geocities-wiggle",
	];
	document.querySelectorAll(".tag, img, button").forEach((el) => {
		if (Math.random() > 0.6) {
			el.classList.add(T.pick(animations));
		}
	});
}
