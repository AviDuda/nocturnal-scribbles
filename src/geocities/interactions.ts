import { geocitiesBorders } from "./data";

const T = window.ThemeUtils;

/** Makes elements with move/resize cursors actually draggable/resizable via mouse events. */
export function addInteractiveCursors() {
	const moveCursors = ["move", "grab", "all-scroll"];
	const resizeCursors = [
		"n-resize",
		"s-resize",
		"e-resize",
		"w-resize",
		"ne-resize",
		"nw-resize",
		"se-resize",
		"sw-resize",
		"col-resize",
		"row-resize",
	];

	let activeEl: HTMLElement | null = null;
	let action: "move" | "resize" | null = null;
	let startX = 0;
	let startY = 0;
	let startWidth = 0;
	let startHeight = 0;
	let startElLeft = 0;
	let startElTop = 0;
	let resizeDir = "";

	document.addEventListener("mousedown", (e) => {
		const el = e.target;
		if (!(el instanceof HTMLElement)) return;
		// Skip if it's a link or button (let them work normally)
		if (el.tagName === "A" || el.tagName === "BUTTON") return;
		// Skip score counter (has its own drag logic)
		if (el.closest(".geocities-score-counter")) return;

		const cursor = getComputedStyle(el).cursor;

		if (moveCursors.includes(cursor)) {
			e.preventDefault();
			activeEl = el;
			action = "move";
			startX = e.clientX;
			startY = e.clientY;

			// Make element positionable if not already
			const computedStyle = getComputedStyle(el);
			if (computedStyle.position === "static") {
				el.style.position = "relative";
			}
			// Get current left/top (default to 0 for relative positioning)
			startElLeft = Number.parseInt(computedStyle.left, 10) || 0;
			startElTop = Number.parseInt(computedStyle.top, 10) || 0;

			el.style.cursor = "grabbing";
			document.body.style.userSelect = "none";
		} else if (resizeCursors.includes(cursor)) {
			e.preventDefault();
			activeEl = el;
			action = "resize";
			resizeDir = cursor;
			const rect = el.getBoundingClientRect();
			startX = e.clientX;
			startY = e.clientY;
			startWidth = rect.width;
			startHeight = rect.height;
			document.body.style.userSelect = "none";
		}
	});

	document.addEventListener("mousemove", (e) => {
		if (!activeEl) return;

		const dx = e.clientX - startX;
		const dy = e.clientY - startY;

		if (action === "move") {
			activeEl.style.left = `${startElLeft + dx}px`;
			activeEl.style.top = `${startElTop + dy}px`;
		} else if (action === "resize") {
			// Handle resize based on exact cursor direction
			switch (resizeDir) {
				case "e-resize":
					activeEl.style.width = `${startWidth + dx}px`;
					break;
				case "w-resize":
					activeEl.style.width = `${startWidth - dx}px`;
					break;
				case "s-resize":
					activeEl.style.height = `${startHeight + dy}px`;
					break;
				case "n-resize":
					activeEl.style.height = `${startHeight - dy}px`;
					break;
				case "se-resize":
					activeEl.style.width = `${startWidth + dx}px`;
					activeEl.style.height = `${startHeight + dy}px`;
					break;
				case "sw-resize":
					activeEl.style.width = `${startWidth - dx}px`;
					activeEl.style.height = `${startHeight + dy}px`;
					break;
				case "ne-resize":
					activeEl.style.width = `${startWidth + dx}px`;
					activeEl.style.height = `${startHeight - dy}px`;
					break;
				case "nw-resize":
					activeEl.style.width = `${startWidth - dx}px`;
					activeEl.style.height = `${startHeight - dy}px`;
					break;
				case "col-resize":
					activeEl.style.width = `${startWidth + dx}px`;
					break;
				case "row-resize":
					activeEl.style.height = `${startHeight + dy}px`;
					break;
			}
		}
	});

	document.addEventListener("mouseup", () => {
		if (activeEl) {
			if (action === "move") {
				activeEl.style.cursor = "grab";
			}
			document.body.style.userSelect = "";
			activeEl = null;
			action = null;
		}
	});
}

/** Makes elements flee from the cursor when it approaches. 20% chance, 15% of elements. */
export function addCursorRepulsion() {
	if (Math.random() > 0.2) return;

	const elements = document.querySelectorAll<HTMLElement>(
		"a, button, h1, h2, h3, .tag, img, li",
	);
	const repelDistance = T.rand(80, 150);
	const repelStrength = T.randFloat(30, 80);

	const repulsiveEls: Array<{
		el: HTMLElement;
		originalX: number;
		originalY: number;
		strength: number;
	}> = [];
	elements.forEach((el) => {
		// 15% of elements flee
		if (Math.random() > 0.15) return;
		el.style.transition = `transform ${T.randFloat(0.1, 0.3)}s ease-out`;
		el.style.position = "relative";
		repulsiveEls.push({
			el,
			originalX: 0,
			originalY: 0,
			strength: T.randFloat(0.5, 1.5),
		});
	});

	if (repulsiveEls.length === 0) return;

	document.addEventListener("mousemove", (e) => {
		for (const item of repulsiveEls) {
			const rect = item.el.getBoundingClientRect();
			const elCenterX = rect.left + rect.width / 2;
			const elCenterY = rect.top + rect.height / 2;

			const dx = elCenterX - e.clientX;
			const dy = elCenterY - e.clientY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < repelDistance) {
				const force =
					(1 - distance / repelDistance) * repelStrength * item.strength;
				const angle = Math.atan2(dy, dx);
				const moveX = Math.cos(angle) * force;
				const moveY = Math.sin(angle) * force;
				item.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
			} else {
				item.el.style.transform = "translate(0, 0)";
			}
		}
	});
}

/** Injects dynamic CSS hover rules with random scale, rotation, colors, and filters. 40% chance. */
export function addHoverEffects() {
	if (Math.random() > 0.4) return;

	const elements = document.querySelectorAll(
		"a, button, h1, h2, h3, li, p, img, .tag, pre, code",
	);

	elements.forEach((el) => {
		// 30% of elements get hover effects
		if (Math.random() > 0.3) return;

		const id = `hover-${Math.random().toString(36).slice(2, 9)}`;
		el.classList.add(id);

		const effects = [];

		// Random scale
		if (Math.random() > 0.5) {
			const scale = T.randFloat(1.05, 1.3);
			effects.push(`transform: scale(${scale})`);
		}

		// Random rotation
		if (Math.random() > 0.6) {
			const rotate = T.rand(-15, 15);
			effects.push(`transform: rotate(${rotate}deg)`);
		}

		// Random color change
		if (Math.random() > 0.5) {
			effects.push(`color: ${T.randomColor()}`);
		}

		// Random background
		if (Math.random() > 0.6) {
			effects.push(`background: ${T.randomColor()}`);
		}

		// Random shadow
		if (Math.random() > 0.5) {
			const shadow = `${T.rand(-10, 10)}px ${T.rand(-10, 10)}px ${T.rand(5, 20)}px ${T.randomColor()}`;
			effects.push(`box-shadow: ${shadow}`);
		}

		// Random text shadow
		if (Math.random() > 0.6) {
			const textShadow = `${T.rand(-5, 5)}px ${T.rand(-5, 5)}px ${T.rand(2, 10)}px ${T.randomColor()}`;
			effects.push(`text-shadow: ${textShadow}`);
		}

		// Random filter
		if (Math.random() > 0.7) {
			const filterEffects = [
				`brightness(${T.randFloat(1.2, 1.5)})`,
				`saturate(${T.randFloat(1.5, 3)})`,
				`hue-rotate(${T.rand(30, 180)}deg)`,
				"invert(1)",
				`contrast(${T.randFloat(1.2, 2)})`,
			];
			effects.push(`filter: ${T.pick(filterEffects)}`);
		}

		// Random border
		if (Math.random() > 0.7) {
			effects.push(
				`border: ${T.rand(2, 5)}px ${T.pick(geocitiesBorders)} ${T.randomColor()}`,
			);
		}

		// Random outline
		if (Math.random() > 0.7) {
			effects.push(
				`outline: ${T.rand(2, 5)}px ${T.pick(["dotted", "dashed", "solid", "double"])} ${T.randomColor()}`,
			);
		}

		if (effects.length === 0) {
			effects.push(`transform: scale(1.1)`);
		}

		const transition = `all ${T.randFloat(0.1, 0.4)}s ${T.pick(["ease", "ease-in-out", "linear"])}`;

		const style = document.createElement("style");
		style.textContent = `
				.${id} { transition: ${transition}; }
				.${id}:hover { ${effects.join(" !important; ")} !important; }
			`;
		document.head.appendChild(style);
	});
}

/** Creates emoji particle bursts on click events. 35% chance. */
export function addClickBurst() {
	if (Math.random() > 0.35) return;

	const burstSets = [
		["💥", "⭐", "✨", "💫", "🌟"],
		["🦝", "🌙", "⭐", "✨", "💫"],
		["💖", "💕", "💗", "💓", "💘"],
		["🔥", "💥", "⚡", "✨", "🌟"],
		["🎉", "🎊", "✨", "⭐", "🌟"],
		["💀", "☠️", "👻", "💥", "✨"],
		["🌈", "⭐", "✨", "💫", "🦄"],
	];
	const burstChars = T.pick(burstSets);
	const numParticles = T.rand(5, 12);

	const style = document.createElement("style");
	style.textContent = `
			@keyframes click-burst {
				0% {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
				}
				100% {
					opacity: 0;
					transform: translate(
						calc(-50% + var(--burst-x)),
						calc(-50% + var(--burst-y))
					) scale(0.5);
				}
			}
		`;
	document.head.appendChild(style);

	document.addEventListener("click", (e) => {
		for (let i = 0; i < numParticles; i++) {
			const particle = document.createElement("div");
			particle.textContent = T.pick(burstChars);
			const angle = (i / numParticles) * Math.PI * 2 + T.randFloat(-0.3, 0.3);
			const distance = T.rand(50, 150);
			const burstX = Math.cos(angle) * distance;
			const burstY = Math.sin(angle) * distance;

			particle.style.cssText = `
					position: fixed;
					left: ${e.clientX}px;
					top: ${e.clientY}px;
					pointer-events: none;
					z-index: 10000;
					font-size: ${T.rand(16, 32)}px;
					--burst-x: ${burstX}px;
					--burst-y: ${burstY}px;
					animation: click-burst ${T.randFloat(0.5, 1)}s ease-out forwards;
				`;
			document.body.appendChild(particle);
			setTimeout(() => particle.remove(), 1000);
		}
	});
}

/** Creates a trail of elements that follow the mouse cursor. 20% chance. */
export function addMouseTrail() {
	if (Math.random() > 0.2) return;

	const trailLength = T.rand(5, 12);
	const trailElements: Array<{ el: HTMLElement; x: number; y: number }> = [];
	const trailStyle = T.pick(["circles", "emoji", "squares", "gradient"]);

	const trailConfigs = {
		circles: { char: "●", colors: true },
		emoji: {
			char: T.pick(["🦝", "⭐", "💖", "🔥", "👁️", "✨"]),
			colors: false,
		},
		squares: { char: "■", colors: true },
		gradient: { char: "●", colors: "rainbow" },
	};
	const config = trailConfigs[trailStyle];

	for (let i = 0; i < trailLength; i++) {
		const el = document.createElement("div");
		el.textContent = config.char;
		const size = 20 - i * 1.5;
		let color = "";
		if (config.colors === true) {
			color = `color: ${T.randomColor()};`;
		} else if (config.colors === "rainbow") {
			const hue = (i / trailLength) * 360;
			color = `color: hsl(${hue}, 100%, 50%);`;
		}
		el.style.cssText = `
				position: fixed;
				pointer-events: none;
				z-index: 9998;
				font-size: ${size}px;
				${color}
				transition: left 0.1s ease-out, top 0.1s ease-out;
				opacity: ${1 - i / trailLength};
			`;
		document.body.appendChild(el);
		trailElements.push({ el, x: 0, y: 0 });
	}

	document.addEventListener("mousemove", (e) => {
		const first = trailElements[0];
		if (first) {
			first.x = e.clientX;
			first.y = e.clientY;
		}
	});

	function updateTrail() {
		for (let i = trailElements.length - 1; i > 0; i--) {
			const curr = trailElements[i];
			const prev = trailElements[i - 1];
			if (curr && prev) {
				curr.x += (prev.x - curr.x) * 0.3;
				curr.y += (prev.y - curr.y) * 0.3;
			}
		}
		for (const t of trailElements) {
			t.el.style.left = `${t.x}px`;
			t.el.style.top = `${t.y}px`;
		}
		requestAnimationFrame(updateTrail);
	}
	updateTrail();
}
