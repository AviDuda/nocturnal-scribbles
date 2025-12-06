import { scoring } from "./scoring";

const T = window.ThemeUtils;

/** Checks if an element is inside or contains a content area (for font selection). */
export function isContentArea(el: Element) {
	if (el.closest(".post-content, .page-content")) return true;
	if (el.querySelector(".post-content, .page-content")) return true;
	return false;
}

/** Adds cursor-following lens flare circles in various color palettes. 40% chance. */
export function addLensFlare() {
	if (Math.random() > 0.4) return;

	const flares: Array<{
		el: HTMLElement;
		offset: { x: number; y: number };
		size: number;
	}> = [];
	// Random flare style
	const style = T.pick(["rainbow", "warm", "cool", "mono", "chaos"]);
	const colorSets = {
		rainbow: [
			"rgba(255, 100, 100, 0.4)",
			"rgba(100, 255, 100, 0.3)",
			"rgba(100, 100, 255, 0.3)",
			"rgba(255, 255, 100, 0.4)",
			"rgba(255, 100, 255, 0.3)",
		],
		warm: [
			"rgba(255, 200, 100, 0.4)",
			"rgba(255, 150, 50, 0.3)",
			"rgba(255, 100, 100, 0.3)",
			"rgba(255, 220, 150, 0.4)",
			"rgba(255, 180, 80, 0.3)",
		],
		cool: [
			"rgba(100, 200, 255, 0.4)",
			"rgba(150, 100, 255, 0.3)",
			"rgba(100, 255, 200, 0.3)",
			"rgba(200, 150, 255, 0.4)",
			"rgba(100, 180, 255, 0.3)",
		],
		mono: [
			"rgba(255, 255, 255, 0.5)",
			"rgba(255, 255, 255, 0.3)",
			"rgba(255, 255, 255, 0.4)",
			"rgba(255, 255, 255, 0.2)",
			"rgba(255, 255, 255, 0.35)",
		],
		chaos: [
			T.randomColor(0.4),
			T.randomColor(0.3),
			T.randomColor(0.3),
			T.randomColor(0.4),
			T.randomColor(0.3),
		],
	};
	const colors = colorSets[style];
	const numFlares = T.rand(2, 5);

	for (let i = 0; i < numFlares; i++) {
		const size = T.rand(20, 100);
		const flare = document.createElement("div");
		flare.className = "geocities-lens-flare";
		flare.style.width = `${size}px`;
		flare.style.height = `${size}px`;
		flare.style.background = `radial-gradient(circle, ${colors[i % colors.length]}, transparent 70%)`;
		document.body.appendChild(flare);
		flares.push({
			el: flare,
			offset: { x: T.rand(-80, 80), y: T.rand(-60, 60) },
			size,
		});
	}

	document.addEventListener("mousemove", (e) => {
		for (const { el, offset, size } of flares) {
			el.style.left = `${e.clientX + offset.x - size / 2}px`;
			el.style.top = `${e.clientY + offset.y - size / 2}px`;
		}
	});
}

/** Animates page sections flying in from offscreen with random transforms. 30% chance. */
export function addPageEntryAnimation() {
	if (Math.random() > 0.3) return;

	const elements = document.querySelectorAll<HTMLElement>(
		"header, nav, main, footer",
	);

	const entryTransforms = [
		"translateX(-100vw) rotate(-30deg)",
		"translateX(100vw) rotate(30deg)",
		"translateY(-100vh) scale(0.1)",
		"translateY(100vh) scale(0.1)",
		"translateX(-100vw) translateY(-50vh)",
		"translateX(100vw) translateY(50vh)",
		"scale(3) rotate(180deg)",
		"scale(0) rotate(-180deg)",
		"translateY(-100vh) rotate(720deg)",
		"skewX(45deg) translateX(-100vw)",
		"skewY(45deg) translateY(100vh)",
	];

	// Random entry style: all same direction, or chaos
	const chaosMode = Math.random() > 0.5;
	const sharedTransform = T.pick(entryTransforms);

	elements.forEach((el, index) => {
		const transform = chaosMode ? T.pick(entryTransforms) : sharedTransform;
		el.style.setProperty("--entry-transform", transform);
		el.style.animationDelay = `${index * 0.05}s`;
		el.classList.add("geocities-entry");
	});
}

/** Applies random keyframe animations (spin, pulse, bounce, jello, etc) to ~15% of elements. */
export function addRandomAnimations() {
	const elements = document.querySelectorAll<HTMLElement>(
		"h1, h2, h3, img, .tag, button, a, li, p, span, strong, em, code",
	);

	const timingFunctions = [
		"linear",
		"ease",
		"ease-in",
		"ease-out",
		"ease-in-out",
		"cubic-bezier(0.68, -0.55, 0.265, 1.55)", // Back
		"cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Elastic-ish
	];

	const directions = ["normal", "reverse", "alternate", "alternate-reverse"];

	elements.forEach((el) => {
		// Only animate ~15% of elements
		if (Math.random() > 0.15) return;

		const duration = T.randFloat(2, 15);
		const delay = T.randFloat(0, 5);
		const timing = T.pick(timingFunctions);
		const direction = T.pick(directions);
		const id = Math.random().toString(36).slice(2, 9);

		// Pick a random animation type
		const animationType = T.pick([
			"spin",
			"pulse",
			"bounce",
			"shake",
			"wobble",
			"float",
			"swing",
			"rubber",
			"jello",
		]);

		let keyframes = "";
		switch (animationType) {
			case "spin":
				keyframes = `
						@keyframes spin-${id} {
							to { transform: rotate(${T.pick([360, -360, 720, -720])}deg); }
						}
					`;
				break;
			case "pulse": {
				const scaleMin = T.randFloat(0.9, 1);
				const scaleMax = T.randFloat(1, 1.2);
				keyframes = `
						@keyframes pulse-${id} {
							0%, 100% { transform: scale(${scaleMin}); }
							50% { transform: scale(${scaleMax}); }
						}
					`;
				break;
			}
			case "bounce": {
				const bounceHeight = T.rand(5, 20);
				keyframes = `
						@keyframes bounce-${id} {
							0%, 100% { transform: translateY(0); }
							50% { transform: translateY(-${bounceHeight}px); }
						}
					`;
				break;
			}
			case "shake": {
				const shakeX = T.rand(2, 8);
				keyframes = `
						@keyframes shake-${id} {
							0%, 100% { transform: translateX(0); }
							25% { transform: translateX(-${shakeX}px); }
							75% { transform: translateX(${shakeX}px); }
						}
					`;
				break;
			}
			case "wobble": {
				const wobbleAngle = T.rand(3, 10);
				keyframes = `
						@keyframes wobble-${id} {
							0%, 100% { transform: rotate(0deg); }
							25% { transform: rotate(-${wobbleAngle}deg); }
							75% { transform: rotate(${wobbleAngle}deg); }
						}
					`;
				break;
			}
			case "float": {
				const floatY = T.rand(5, 15);
				const floatX = T.rand(-5, 5);
				keyframes = `
						@keyframes float-${id} {
							0%, 100% { transform: translate(0, 0); }
							50% { transform: translate(${floatX}px, -${floatY}px); }
						}
					`;
				break;
			}
			case "swing": {
				const swingAngle = T.rand(5, 15);
				keyframes = `
						@keyframes swing-${id} {
							0%, 100% { transform: rotate(0deg); transform-origin: top center; }
							25% { transform: rotate(${swingAngle}deg); }
							75% { transform: rotate(-${swingAngle}deg); }
						}
					`;
				break;
			}
			case "rubber":
				keyframes = `
						@keyframes rubber-${id} {
							0%, 100% { transform: scale(1, 1); }
							30% { transform: scale(1.25, 0.75); }
							40% { transform: scale(0.75, 1.25); }
							50% { transform: scale(1.15, 0.85); }
							65% { transform: scale(0.95, 1.05); }
							75% { transform: scale(1.05, 0.95); }
						}
					`;
				break;
			case "jello":
				keyframes = `
						@keyframes jello-${id} {
							0%, 100% { transform: skewX(0deg) skewY(0deg); }
							22% { transform: skewX(-${T.rand(5, 12)}deg) skewY(-${T.rand(2, 5)}deg); }
							44% { transform: skewX(${T.rand(4, 10)}deg) skewY(${T.rand(2, 4)}deg); }
							66% { transform: skewX(-${T.rand(2, 6)}deg) skewY(-${T.rand(1, 3)}deg); }
							88% { transform: skewX(${T.rand(1, 3)}deg) skewY(${T.rand(1, 2)}deg); }
						}
					`;
				break;
		}

		const style = document.createElement("style");
		style.textContent = keyframes;
		document.head.appendChild(style);

		const animName = `${animationType}-${id}`;
		el.style.animation = `${animName} ${duration}s ${timing} ${delay}s infinite ${direction}`;
		el.style.display = "inline-block"; // Needed for transforms on inline elements
	});
}

/** Creates clickable sparkle particles that follow cursor movement. 25% chance. */
export function addSparkleTrail() {
	if (Math.random() > 0.25) return;

	const sparkleChars = T.pick([
		["✨", "⭐", "💫", "🌟", "✦"],
		["💖", "💕", "💗", "💓", "♥"],
		["🦝", "✨", "🌙", "⭐", "🦝"],
		["🔥", "💥", "⚡", "✨", "💫"],
		["🌸", "🌺", "🌷", "💮", "🌼"],
		["❄️", "✨", "💎", "⭐", "🌟"],
	]);

	let mouseX = 0;
	let mouseY = 0;
	const minClickDistance = 50; // Must drift this far from cursor to be clickable

	document.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		if (Math.random() > 0.3) return; // Throttle sparkles

		const sparkle = document.createElement("div");
		sparkle.className = "sparkle-trail";
		sparkle.textContent = T.pick(sparkleChars);
		sparkle.style.cssText = `
				position: fixed;
				left: ${e.clientX}px;
				top: ${e.clientY}px;
				pointer-events: auto;
				cursor: pointer;
				z-index: 9999;
				font-size: ${T.rand(12, 24)}px;
				transform: translate(-50%, -50%);
				animation: sparkle-fade 1s ease-out forwards;
			`;
		const emoji = sparkle.textContent;
		sparkle.addEventListener("click", () => {
			if (sparkle.classList.contains("popped")) return;
			// Only count if sparkle has drifted away from cursor
			const rect = sparkle.getBoundingClientRect();
			const sparkleX = rect.left + rect.width / 2;
			const sparkleY = rect.top + rect.height / 2;
			const distance = Math.sqrt(
				(sparkleX - mouseX) ** 2 + (sparkleY - mouseY) ** 2,
			);
			if (distance < minClickDistance) return; // Too close to cursor
			sparkle.classList.add("popped");
			const points = scoring.addPoints("sparkle", emoji);
			scoring.showFloatingCounter();
			scoring.createPopEffect(rect.left, rect.top, points, scoring.combo);
			sparkle.remove();
		});
		document.body.appendChild(sparkle);
		setTimeout(() => sparkle.remove(), 1000);
	});

	const style = document.createElement("style");
	style.textContent = `
			@keyframes sparkle-fade {
				0% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
				100% { opacity: 0; transform: translate(-50%, -100%) scale(0.5) rotate(${T.rand(-180, 180)}deg); }
			}
		`;
	document.head.appendChild(style);
}

/** Creates clickable emoji particles that fall continuously from the top. 20% chance. */
export function addFallingParticles() {
	if (Math.random() > 0.2) return;

	const particleSets = [
		["❄️", "❅", "❆", "✨"],
		["🦝", "🌙", "⭐", "✨"],
		["💖", "💕", "💗", "♥"],
		["🍂", "🍁", "🌿", "🍃"],
		["⭐", "🌟", "✨", "💫"],
		["🌸", "🌺", "💮", "🌷"],
	];
	const particles = T.pick(particleSets);
	const numParticles = T.rand(15, 30);

	const style = document.createElement("style");
	style.textContent = `
			@keyframes falling-particle {
				0% { transform: translateY(0) rotate(0deg); }
				100% { transform: translateY(calc(100vh + 50px)) rotate(360deg); }
			}
			@keyframes falling-pop {
				0% { transform: scale(1); }
				50% { transform: scale(1.8); }
				100% { transform: scale(0); opacity: 0; }
			}
			.falling-particle {
				position: fixed;
				top: -50px;
				pointer-events: auto;
				cursor: pointer;
				z-index: 9997;
				animation: falling-particle var(--fall-duration) linear infinite;
				animation-delay: var(--fall-delay);
			}
			.falling-particle.popped {
				animation: falling-pop 0.3s ease-out forwards;
				pointer-events: none;
			}
		`;
	document.head.appendChild(style);

	for (let i = 0; i < numParticles; i++) {
		const particle = document.createElement("div");
		particle.className = "falling-particle";
		particle.textContent = T.pick(particles);
		particle.style.cssText = `
				left: ${Math.random() * 100}vw;
				font-size: ${T.rand(12, 28)}px;
				--fall-duration: ${T.rand(8, 20)}s;
				--fall-delay: ${T.rand(0, 10)}s;
				opacity: ${T.randFloat(0.4, 0.9)};
			`;
		const emoji = particle.textContent;
		particle.addEventListener("click", () => {
			if (particle.classList.contains("popped")) return;
			particle.classList.add("popped");
			const points = scoring.addPoints("falling", emoji);
			scoring.showFloatingCounter();
			const rect = particle.getBoundingClientRect();
			scoring.createPopEffect(rect.left, rect.top, points, scoring.combo);
			setTimeout(() => particle.remove(), 300);
		});
		document.body.appendChild(particle);
	}
}

/** Places clickable twinkling star emojis at random fixed positions on the page. 25% chance. */
export function addTwinklingStars() {
	if (Math.random() > 0.25) return;

	const starSets = [
		["✦", "✧", "⋆", "✶", "✷", "✸"],
		["🦝", "⭐", "🌙"],
		["💫", "⭐", "🌟", "✨"],
		["✿", "❀", "✾", "❁"],
	];
	const stars = T.pick(starSets);
	const numStars = T.rand(20, 50);

	const style = document.createElement("style");
	style.textContent = `
			@keyframes twinkle {
				0%, 100% { opacity: var(--twinkle-min); transform: scale(1); }
				50% { opacity: var(--twinkle-max); transform: scale(1.2); }
			}
			@keyframes star-pop {
				0% { transform: scale(1); }
				50% { transform: scale(1.5); }
				100% { transform: scale(0); opacity: 0; }
			}
			.twinkle-star {
				position: fixed;
				pointer-events: auto;
				cursor: pointer;
				z-index: 1;
				animation: twinkle var(--twinkle-duration) ease-in-out infinite;
				animation-delay: var(--twinkle-delay);
			}
			.twinkle-star.popped {
				animation: star-pop 0.3s ease-out forwards;
				pointer-events: none;
			}
		`;
	document.head.appendChild(style);

	for (let i = 0; i < numStars; i++) {
		const star = document.createElement("div");
		star.className = "twinkle-star";
		star.textContent = T.pick(stars);
		star.style.cssText = `
				left: ${Math.random() * 100}vw;
				top: ${Math.random() * 100}vh;
				font-size: ${T.rand(8, 20)}px;
				--twinkle-duration: ${T.randFloat(1, 4)}s;
				--twinkle-delay: ${T.randFloat(0, 3)}s;
				--twinkle-min: ${T.randFloat(0.2, 0.5)};
				--twinkle-max: ${T.randFloat(0.7, 1)};
			`;
		const emoji = star.textContent;
		star.addEventListener("click", () => {
			if (star.classList.contains("popped")) return;
			star.classList.add("popped");
			const points = scoring.addPoints("star", emoji);
			scoring.showFloatingCounter();
			const rect = star.getBoundingClientRect();
			scoring.createPopEffect(rect.left, rect.top, points, scoring.combo);
			setTimeout(() => star.remove(), 300);
		});
		document.body.appendChild(star);
	}
}
