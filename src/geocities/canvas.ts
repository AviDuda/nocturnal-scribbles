import { statusBarOffsets } from "./status-bar";

const T = window.ThemeUtils;

/** Returns CSS position properties avoiding status bar areas. */
function getAnimationPosition() {
	const vertical = T.pick(["top", "bottom"]);
	const horizontal = T.pick(["left", "right"]);
	const vOffset = statusBarOffsets[vertical] + T.rand(10, 100);
	const hOffset = statusBarOffsets[horizontal] + T.rand(10, 80);
	return `${vertical}: ${vOffset}px; ${horizontal}: ${hOffset}px;`;
}

/** Adds an animated "UNDER CONSTRUCTION" banner with yellow/black stripes. 25% chance. */
export function addUnderConstructionBanner() {
	if (Math.random() > 0.25) return;

	const canvas = document.createElement("canvas");
	const width = 200;
	const height = 40;
	canvas.width = width;
	canvas.height = height;
	canvas.style.cssText = `
			position: fixed;
			${getAnimationPosition()}
			z-index: 9990;
			image-rendering: pixelated;
			pointer-events: none;
		`;
	document.body.appendChild(canvas);

	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx) return;
	const ctx = maybeCtx;
	const stripeWidth = 20;
	let offset = 0;

	function draw() {
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, width, height);

		// Animated diagonal stripes
		ctx.fillStyle = "#ffcc00";
		for (let x = -height + offset; x < width + height; x += stripeWidth * 2) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x + height, height);
			ctx.lineTo(x + height + stripeWidth, height);
			ctx.lineTo(x + stripeWidth, 0);
			ctx.closePath();
			ctx.fill();
		}

		// Border
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 3;
		ctx.strokeRect(1, 1, width - 2, height - 2);

		// Text
		ctx.fillStyle = "#ff0000";
		ctx.font = "bold 12px Arial";
		ctx.textAlign = "center";
		ctx.fillText("UNDER CONSTRUCTION", width / 2, height / 2 + 4);

		offset = (offset + 0.5) % (stripeWidth * 2);
		requestAnimationFrame(draw);
	}
	draw();
}

/** Adds a rotating 3D wireframe shape (cube, pyramid, star, or spiral). 20% chance. */
export function addSpinningShape() {
	if (Math.random() > 0.2) return;

	const canvas = document.createElement("canvas");
	const size = T.rand(60, 100);
	canvas.width = size;
	canvas.height = size;
	canvas.style.cssText = `
			position: fixed;
			${getAnimationPosition()}
			z-index: 9989;
			pointer-events: none;
		`;
	document.body.appendChild(canvas);

	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx) return;
	const ctx = maybeCtx;
	const cx = size / 2;
	const cy = size / 2;
	const shapeType = T.pick(["cube", "pyramid", "star", "spiral"]);
	const color1 = T.randomColor();
	const color2 = T.randomColor();
	const starPoints = T.rand(5, 8); // Fixed at creation time
	let angle = 0;
	const speed = T.randFloat(0.01, 0.03);

	function draw() {
		ctx.clearRect(0, 0, size, size);
		ctx.save();
		ctx.translate(cx, cy);

		if (shapeType === "cube") {
			// 3D-ish rotating cube
			const s = size * 0.3;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);

			// Simple 3D cube projection
			const vertices: [number, number, number][] = [
				[-1, -1, -1],
				[1, -1, -1],
				[1, 1, -1],
				[-1, 1, -1],
				[-1, -1, 1],
				[1, -1, 1],
				[1, 1, 1],
				[-1, 1, 1],
			];
			const edges: [number, number][] = [
				[0, 1],
				[1, 2],
				[2, 3],
				[3, 0],
				[4, 5],
				[5, 6],
				[6, 7],
				[7, 4],
				[0, 4],
				[1, 5],
				[2, 6],
				[3, 7],
			];

			// Rotate around Y and X axis
			const projected = vertices.map(([x, y, z]): [number, number] => {
				// Rotate Y
				const x1 = x * cos - z * sin;
				const z1 = x * sin + z * cos;
				// Rotate X
				const y1 = y * Math.cos(angle * 0.7) - z1 * Math.sin(angle * 0.7);
				const z2 = y * Math.sin(angle * 0.7) + z1 * Math.cos(angle * 0.7);
				// Project
				const scale = 2 / (3 + z2);
				return [x1 * s * scale, y1 * s * scale];
			});

			ctx.strokeStyle = color1;
			ctx.lineWidth = 2;
			for (const [a, b] of edges) {
				const pa = projected[a];
				const pb = projected[b];
				if (!pa || !pb) continue;
				ctx.beginPath();
				ctx.moveTo(pa[0], pa[1]);
				ctx.lineTo(pb[0], pb[1]);
				ctx.stroke();
			}
		} else if (shapeType === "pyramid") {
			const s = size * 0.35;
			ctx.rotate(angle);
			ctx.strokeStyle = color1;
			ctx.lineWidth = 2;
			// Draw pyramid from top
			for (let i = 0; i < 4; i++) {
				const a = (i / 4) * Math.PI * 2;
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
				ctx.stroke();
			}
			// Base
			ctx.beginPath();
			for (let i = 0; i <= 4; i++) {
				const a = (i / 4) * Math.PI * 2;
				if (i === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
				else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
			}
			ctx.stroke();
		} else if (shapeType === "star") {
			const outerR = size * 0.4;
			const innerR = size * 0.2;
			ctx.rotate(angle);
			ctx.fillStyle = color1;
			ctx.strokeStyle = color2;
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (let i = 0; i < starPoints * 2; i++) {
				const r = i % 2 === 0 ? outerR : innerR;
				const a = (i / (starPoints * 2)) * Math.PI * 2 - Math.PI / 2;
				if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
				else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
			}
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		} else if (shapeType === "spiral") {
			ctx.strokeStyle = color1;
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (let i = 0; i < 100; i++) {
				const a = i / 10 + angle * 3;
				const r = i * 0.3;
				const x = Math.cos(a) * r;
				const y = Math.sin(a) * r;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.stroke();
		}

		ctx.restore();
		angle += speed;
		requestAnimationFrame(draw);
	}
	draw();
}

/** Adds a frame-based ASCII art animation (spinner, loading bar, cat, raccoon, etc). 20% chance. */
export function addAsciiAnimation() {
	if (Math.random() > 0.2) return;

	const container = document.createElement("pre");
	container.style.cssText = `
			position: fixed;
			${getAnimationPosition()}
			z-index: 9988;
			font-family: monospace;
			font-size: ${T.rand(10, 14)}px;
			line-height: 1;
			color: ${T.randomColor()};
			background: ${T.randomColor(0.8)};
			padding: 5px;
			border: 2px solid ${T.randomColor()};
			pointer-events: none;
			text-shadow: 1px 1px 0 ${T.randomColor()};
		`;
	document.body.appendChild(container);

	const animations = {
		spinner: {
			frames: ["|", "/", "-", "\\"],
			interval: 100,
		},
		dots: {
			frames: ["   ", ".  ", ".. ", "...", ".. ", ".  "],
			interval: 200,
		},
		loading: {
			frames: [
				"[    ]",
				"[=   ]",
				"[==  ]",
				"[=== ]",
				"[====]",
				"[ ===]",
				"[  ==]",
				"[   =]",
			],
			interval: 100,
		},
		bounce: {
			frames: [
				"(o    )",
				"( o   )",
				"(  o  )",
				"(   o )",
				"(    o)",
				"(   o )",
				"(  o  )",
				"( o   )",
			],
			interval: 120,
		},
		dance: {
			frames: ["┌(・。・)┘", "└(・。・)┐", "┌(・。・)┘", "└(・。・)┐"],
			interval: 300,
		},
		cat: {
			frames: [
				" /\\_/\\ \n( o.o )\n > ^ <",
				" /\\_/\\ \n( -.- )\n > ^ <",
				" /\\_/\\ \n( o.o )\n > ^ <",
				" /\\_/\\ \n( ^.^ )\n > ^ <",
			],
			interval: 400,
		},
		raccoon: {
			frames: [
				"  /\\\\_//\\\\\n (  ◕‿◕) \n />🍕>",
				"  /\\\\_//\\\\\n (  ◕‿◕) \n <🍕<\\",
				"  /\\\\_//\\\\\n (  ◕‿◕) \n />🍕>",
				"  /\\\\_//\\\\\n (  ◕ω◕) \n   🍕   ",
			],
			interval: 350,
		},
		fire: {
			frames: [
				"  )  \n ) \\ \n(   )",
				" (   \n  ) )\n(   )",
				"  )  \n ( ( \n(   )",
				" ) ) \n (   \n(   )",
			],
			interval: 150,
		},
		email: {
			frames: [
				"   stripes   \n  [stripes]  \n  [_____]  ",
				"  stripes   \n  [stripes]  \n  [_____]  ",
				"   stripes   \n  [stripes]  \n  [_____]  ",
				"   stripes   \n  [stripes]  \n  [_____]  ",
			].map((f) =>
				f.replace(/stripes/g, "=====").replace(/\[stripes\]/g, "|     |"),
			),
			interval: 500,
		},
	};

	const anim = T.pick(Object.values(animations));
	let frame = 0;

	function animate() {
		container.textContent = anim.frames[frame] ?? "";
		frame = (frame + 1) % anim.frames.length;
	}
	animate();
	setInterval(animate, anim.interval);
}

/** Adds a classic demoscene-style fire effect using pixel buffer simulation. 15% chance. */
export function addFireEffect() {
	if (Math.random() > 0.15) return;

	const canvas = document.createElement("canvas");
	const width = T.rand(60, 100);
	const height = T.rand(80, 120);
	canvas.width = width;
	canvas.height = height;
	const horizontal = T.pick(["left", "right"]);
	canvas.style.cssText = `
			position: fixed;
			bottom: ${statusBarOffsets.bottom + T.rand(0, 20)}px;
			${horizontal}: ${statusBarOffsets[horizontal] + T.rand(5, 60)}px;
			z-index: 9987;
			pointer-events: none;
			image-rendering: pixelated;
		`;
	document.body.appendChild(canvas);

	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx) return;
	const ctx = maybeCtx;

	// Fire buffer (cooling map)
	const fireWidth = Math.floor(width / 2);
	const fireHeight = Math.floor(height / 2);
	const fire = new Array(fireWidth * fireHeight).fill(0);

	// Palette (black -> red -> yellow -> white)
	const palette: string[] = [];
	for (let i = 0; i < 256; i++) {
		let r: number, g: number, b: number;
		if (i < 64) {
			r = i * 4;
			g = 0;
			b = 0;
		} else if (i < 128) {
			r = 255;
			g = (i - 64) * 4;
			b = 0;
		} else if (i < 192) {
			r = 255;
			g = 255;
			b = (i - 128) * 4;
		} else {
			r = 255;
			g = 255;
			b = 255;
		}
		palette.push(`rgb(${r},${g},${b})`);
	}

	const imageData = ctx.createImageData(fireWidth, fireHeight);

	function draw() {
		// Random heat at bottom
		for (let x = 0; x < fireWidth; x++) {
			fire[(fireHeight - 1) * fireWidth + x] = Math.random() > 0.5 ? 255 : 0;
		}

		// Propagate fire upward with cooling
		for (let y = 0; y < fireHeight - 1; y++) {
			for (let x = 0; x < fireWidth; x++) {
				const src =
					fire[(y + 1) * fireWidth + ((x - 1 + fireWidth) % fireWidth)] +
					fire[(y + 1) * fireWidth + x] +
					fire[(y + 1) * fireWidth + ((x + 1) % fireWidth)] +
					fire[Math.min(y + 2, fireHeight - 1) * fireWidth + x];
				fire[y * fireWidth + x] = Math.max(0, src / 4 - T.rand(0, 3));
			}
		}

		// Render to image data
		for (let i = 0; i < fire.length; i++) {
			const val = Math.floor(fire[i]);
			const idx = i * 4;
			// Parse palette color
			const color = palette[Math.min(val, 255)];
			if (!color) continue;
			const match = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
			if (match?.[1] && match[2] && match[3]) {
				imageData.data[idx] = Number.parseInt(match[1], 10);
				imageData.data[idx + 1] = Number.parseInt(match[2], 10);
				imageData.data[idx + 2] = Number.parseInt(match[3], 10);
				imageData.data[idx + 3] = val > 10 ? 255 : 0;
			}
		}

		ctx.putImageData(imageData, 0, 0);
		// Scale up
		ctx.drawImage(canvas, 0, 0, fireWidth, fireHeight, 0, 0, width, height);

		requestAnimationFrame(draw);
	}
	draw();
}

/** Adds a Matrix-style falling character rain effect with katakana and raccoons. 10% chance. */
export function addMatrixRain() {
	if (Math.random() > 0.1) return;

	const canvas = document.createElement("canvas");
	const width = T.rand(100, 150);
	const height = T.rand(150, 250);
	canvas.width = width;
	canvas.height = height;
	canvas.style.cssText = `
			position: fixed;
			${getAnimationPosition()}
			z-index: 9986;
			pointer-events: none;
			opacity: 0.8;
			border: 1px solid #0f0;
		`;
	document.body.appendChild(canvas);

	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx) return;
	const ctx = maybeCtx;
	const fontSize = 10;
	const columns = Math.floor(width / fontSize);
	const drops = new Array(columns).fill(1);

	const chars =
		"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789🦝";

	function draw() {
		ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = "#0f0";
		ctx.font = `${fontSize}px monospace`;

		for (let i = 0; i < drops.length; i++) {
			const char = chars[Math.floor(Math.random() * chars.length)] ?? "🦝";
			ctx.fillText(char, i * fontSize, drops[i] * fontSize);

			if (drops[i] * fontSize > height && Math.random() > 0.975) {
				drops[i] = 0;
			}
			drops[i]++;
		}
	}
	setInterval(draw, 50);
}
