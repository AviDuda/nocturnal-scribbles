// Shared theme utilities - loaded before theme-init.js and theme.js
window.ThemeUtils = (() => {
	const cursedFonts = [
		"Comic Sans MS, cursive",
		"Papyrus, fantasy",
		"Impact, sans-serif",
		"Brush Script MT, cursive",
		"Lucida Handwriting, cursive",
		"Courier New, monospace",
		"Times New Roman, serif",
		"Arial Black, sans-serif",
		"Trebuchet MS, sans-serif",
		"fantasy",
	];

	function randomColor(alpha = 1) {
		const h = Math.floor(Math.random() * 360);
		const s = 60 + Math.floor(Math.random() * 40);
		const l = 30 + Math.floor(Math.random() * 40);
		return alpha < 1
			? `hsla(${h}, ${s}%, ${l}%, ${alpha})`
			: `hsl(${h}, ${s}%, ${l}%)`;
	}

	function randomBackground() {
		const roll = Math.random();
		if (roll < 0.3) {
			return randomColor();
		} else if (roll < 0.6) {
			const angle = Math.floor(Math.random() * 360);
			return `linear-gradient(${angle}deg, ${randomColor()}, ${randomColor()})`;
		} else if (roll < 0.8) {
			return `radial-gradient(${randomColor()}, ${randomColor()})`;
		} else {
			return randomColor(0.5 + Math.random() * 0.4);
		}
	}

	function applyShiftingColors(hue: number) {
		const root = document.documentElement;
		root.style.setProperty("--bg", `hsl(${hue}, 30%, 12%)`);
		root.style.setProperty("--text", `hsl(${(hue + 180) % 360}, 30%, 85%)`);
		root.style.setProperty(
			"--text-light",
			`hsl(${(hue + 180) % 360}, 20%, 65%)`,
		);
		root.style.setProperty("--accent", `hsl(${(hue + 60) % 360}, 80%, 65%)`);
		root.style.setProperty("--accent-contrast", `hsl(${hue}, 30%, 12%)`);
		root.style.setProperty("--border", `hsl(${hue}, 30%, 25%)`);
		root.style.setProperty("--code-bg", `hsl(${hue}, 25%, 18%)`);
		root.style.setProperty("--tag-bg", `hsl(${hue}, 25%, 20%)`);
		root.style.setProperty("--tag-bg-hover", `hsl(${hue}, 30%, 28%)`);
	}

	function applyChaosColors() {
		const hue1 = Math.floor(Math.random() * 360);
		const hue2 = (hue1 + 120 + Math.floor(Math.random() * 120)) % 360;
		const light1 = Math.random() > 0.5;
		const root = document.documentElement;
		root.style.setProperty("--bg", `hsl(${hue1}, 70%, ${light1 ? 85 : 15}%)`);
		root.style.setProperty("--text", `hsl(${hue2}, 80%, ${light1 ? 20 : 85}%)`);
		root.style.setProperty(
			"--text-light",
			`hsl(${hue2}, 60%, ${light1 ? 35 : 70}%)`,
		);
		root.style.setProperty("--accent", `hsl(${(hue1 + 180) % 360}, 90%, 50%)`);
		root.style.setProperty(
			"--accent-contrast",
			`hsl(${hue1}, 70%, ${light1 ? 85 : 15}%)`,
		);
		root.style.setProperty(
			"--border",
			`hsl(${hue1}, 50%, ${light1 ? 70 : 30}%)`,
		);
		root.style.setProperty(
			"--code-bg",
			`hsl(${hue1}, 60%, ${light1 ? 75 : 25}%)`,
		);
		root.style.setProperty(
			"--tag-bg",
			`hsl(${hue1}, 50%, ${light1 ? 80 : 20}%)`,
		);
		root.style.setProperty(
			"--tag-bg-hover",
			`hsl(${hue1}, 50%, ${light1 ? 70 : 30}%)`,
		);
	}

	function pick<const T>(arr: readonly T[]): T {
		const index = Math.floor(Math.random() * arr.length);
		return arr[index] as T;
	}

	// Random number in range
	function rand(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Random float in range
	function randFloat(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	/**
	 * Start shifting theme animation.
	 * Returns interval ID so caller can store it for cleanup.
	 */
	function startShifting() {
		let hue = rand(0, 359);
		applyShiftingColors(hue);
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReducedMotion) {
			return null;
		}
		return setInterval(() => {
			hue = (hue + 1) % 360;
			applyShiftingColors(hue);
		}, 100);
	}

	/**
	 * Apply cursed theme styles.
	 * @param body - document.body, or null if not yet available
	 */
	function applyCursedStyles(body: HTMLElement | null) {
		applyChaosColors();
		const font = pick(cursedFonts);
		if (body) {
			body.style.fontFamily = font ?? "";
		} else {
			document.addEventListener("DOMContentLoaded", () => {
				document.body.style.fontFamily = font ?? "";
			});
		}
		const radius = rand(0, 29);
		const shadowX = rand(-5, 4);
		const shadowY = rand(-5, 4);
		const shadowColor = `hsl(${rand(0, 359)}, 80%, 40%)`;
		document.documentElement.style.setProperty("--radius", `${radius}px`);
		document.documentElement.style.setProperty(
			"--shadow",
			`${shadowX}px ${shadowY}px 0 ${shadowColor}`,
		);
	}

	// Emoji/icon patterns for geocities backgrounds
	const geocitiesPatterns = [
		// Stars
		`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ctext y='15' font-size='15'%3E%E2%AD%90%3C/text%3E%3C/svg%3E")`,
		// Hearts
		`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ctext y='15' font-size='15'%3E%E2%9D%A4%EF%B8%8F%3C/text%3E%3C/svg%3E")`,
		// Sparkles
		`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Ctext y='20' font-size='20'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E")`,
		// Fire
		`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25'%3E%3Ctext y='18' font-size='18'%3E%F0%9F%94%A5%3C/text%3E%3C/svg%3E")`,
		// Skulls
		`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25'%3E%3Ctext y='18' font-size='18'%3E%F0%9F%92%80%3C/text%3E%3C/svg%3E")`,
		// Aliens
		`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25'%3E%3Ctext y='18' font-size='18'%3E%F0%9F%91%BD%3C/text%3E%3C/svg%3E")`,
		// Raccoons!
		`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Ctext y='22' font-size='22'%3E%F0%9F%A6%9D%3C/text%3E%3C/svg%3E")`,
	];

	/**
	 * Apply geocities placeholder - random body background + hide content.
	 * Called early to prevent flash of unstyled content.
	 */
	function applyGeocitiesPlaceholder() {
		const body = document.body;
		const tileSize = rand(15, 40);

		// Build pattern options including geometric ones
		const patterns = [
			...geocitiesPatterns,
			// Checkerboard
			`repeating-conic-gradient(${randomColor()} 0% 25%, ${randomColor()} 0% 50%) 50% / ${tileSize}px ${tileSize}px`,
			// Stripes
			`repeating-linear-gradient(${rand(0, 180)}deg, ${randomColor()}, ${randomColor()} 10px, ${randomColor()} 10px, ${randomColor()} 20px)`,
			// Polka dots
			`radial-gradient(${randomColor()} 20%, transparent 20%) 0 0 / ${tileSize}px ${tileSize}px`,
			// Diagonal stripes
			`repeating-linear-gradient(45deg, ${randomColor()}, ${randomColor()} 5px, ${randomColor()} 5px, ${randomColor()} 10px)`,
		];

		// Hide content until full geocities loads
		document.documentElement.style.visibility = "hidden";

		// Reset body background
		if (body) {
			body.style.backgroundImage = "";
			body.style.backgroundColor = "";
			body.style.backgroundSize = "";
			body.style.backgroundRepeat = "";
		}

		// Random background style
		const bgStyle = Math.random();

		// Inject gradient-shift animation if needed
		let styleEl = document.getElementById("geocities-placeholder-styles");
		if (!styleEl) {
			styleEl = document.createElement("style");
			styleEl.id = "geocities-placeholder-styles";
			document.head.appendChild(styleEl);
		}

		// Base style to override body's var(--bg) background
		const baseStyle = `
			body {
				background: transparent !important;
			}
		`;

		if (bgStyle < 0.08) {
			// Animated gradient
			const bg1 = randomColor();
			const bg2 = randomColor();
			const bg3 = randomColor();
			const angle = rand(0, 360);
			styleEl.textContent = `
				${baseStyle}
				@keyframes geocities-placeholder-shift {
					0% { background-position: ${rand(0, 50)}% ${rand(0, 50)}%; }
					50% { background-position: ${rand(50, 100)}% ${rand(50, 100)}%; }
					100% { background-position: ${rand(0, 50)}% ${rand(0, 50)}%; }
				}
				html {
					background-image: linear-gradient(${angle}deg, ${bg1}, ${bg2}, ${bg3});
					background-size: 200% 200%;
					animation: geocities-placeholder-shift 8s ease infinite;
				}
			`;
		} else if (bgStyle < 0.25) {
			// Tiled emoji pattern
			const bgColor = randomColor();
			const opacity = randFloat(0.3, 0.8);
			const numLayers = rand(1, 3);
			const layers = [];
			const usedPatterns: string[] = [];
			for (let i = 0; i < numLayers; i++) {
				let pattern: string;
				do {
					pattern = pick(geocitiesPatterns);
				} while (
					usedPatterns.includes(pattern) &&
					usedPatterns.length < geocitiesPatterns.length
				);
				usedPatterns.push(pattern);
				const size = rand(20, 70);
				const offsetX = rand(0, size);
				const offsetY = rand(0, size);
				layers.push({ pattern, size, offsetX, offsetY });
			}
			const bgImages = layers.map((l) => l.pattern).join(", ");
			const bgSizes = layers.map((l) => `${l.size}px ${l.size}px`).join(", ");
			const bgPositions = layers
				.map((l) => `${l.offsetX}px ${l.offsetY}px`)
				.join(", ");
			styleEl.textContent = `
				${baseStyle}
				html {
					background-color: ${bgColor};
				}
				html::before {
					content: "";
					position: fixed;
					top: -50%;
					left: -50%;
					width: 200%;
					height: 200%;
					background-image: ${bgImages};
					background-size: ${bgSizes};
					background-position: ${bgPositions};
					background-repeat: repeat;
					opacity: ${opacity};
					pointer-events: none;
					z-index: -1;
				}
			`;
		} else if (bgStyle < 0.38) {
			// Radial gradient explosion
			const numStops = rand(3, 6);
			const stops = [];
			for (let i = 0; i < numStops; i++) {
				stops.push(`${randomColor()} ${Math.round((i / numStops) * 100)}%`);
			}
			styleEl.textContent = `
				${baseStyle}
				html {
					background-image: radial-gradient(circle at ${rand(20, 80)}% ${rand(20, 80)}%, ${stops.join(", ")});
				}
			`;
		} else if (bgStyle < 0.52) {
			// Conic gradient
			const numSlices = rand(4, 12);
			const slices = [];
			for (let i = 0; i < numSlices; i++) {
				slices.push(randomColor());
			}
			styleEl.textContent = `
				${baseStyle}
				html {
					background-image: conic-gradient(from ${rand(0, 360)}deg, ${slices.join(", ")});
				}
			`;
		} else if (bgStyle < 0.65) {
			// Multiple layered patterns
			const size = rand(25, 60);
			styleEl.textContent = `
				${baseStyle}
				html {
					background-color: ${randomColor()};
					background-image: ${pick(patterns)}, linear-gradient(${rand(0, 360)}deg, ${randomColor(0.3)}, ${randomColor(0.3)});
					background-size: ${size}px ${size}px, 100% 100%;
					background-repeat: repeat, no-repeat;
				}
			`;
		} else if (bgStyle < 0.78) {
			// Striped madness
			const numColors = rand(3, 7);
			const colors = [];
			for (let i = 0; i < numColors; i++) {
				const pct = Math.round((i / numColors) * 100);
				const nextPct = Math.round(((i + 1) / numColors) * 100);
				colors.push(`${randomColor()} ${pct}%`, `${randomColor()} ${nextPct}%`);
			}
			styleEl.textContent = `
				${baseStyle}
				html {
					background-image: repeating-linear-gradient(${rand(0, 180)}deg, ${colors.join(", ")});
				}
			`;
		} else if (bgStyle < 0.9) {
			// Multiple conic gradients
			styleEl.textContent = `
				${baseStyle}
				html {
					background-color: ${randomColor()};
					background-image:
						conic-gradient(from ${rand(0, 360)}deg at ${rand(0, 100)}% ${rand(0, 100)}%, ${randomColor(0.5)}, ${randomColor(0.5)}, ${randomColor(0.5)}, ${randomColor(0.5)}),
						conic-gradient(from ${rand(0, 360)}deg at ${rand(0, 100)}% ${rand(0, 100)}%, ${randomColor(0.5)}, ${randomColor(0.5)}, ${randomColor(0.5)}, ${randomColor(0.5)});
				}
			`;
		} else {
			// Noise-like pattern
			styleEl.textContent = `
				${baseStyle}
				html {
					background-color: ${randomColor()};
					background-image:
						repeating-conic-gradient(${randomColor()} 0% 25%, ${randomColor()} 0% 50%),
						repeating-conic-gradient(${randomColor(0.5)} 0% 25%, transparent 0% 50%);
					background-size: 10px 10px, 10px 10px;
					background-position: 0 0, 5px 5px;
				}
			`;
		}
	}

	/**
	 * Reveal content after geocities loads (or on error/timeout).
	 */
	function revealGeocitiesContent() {
		document.documentElement.style.visibility = "";
	}

	return {
		cursedFonts,
		geocitiesPatterns,
		randomColor,
		randomBackground,
		applyShiftingColors,
		applyChaosColors,
		startShifting,
		applyCursedStyles,
		applyGeocitiesPlaceholder,
		revealGeocitiesContent,
		pick,
		rand,
		randFloat,
	};
})();
