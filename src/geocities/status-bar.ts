const T = window.ThemeUtils;

/** Pixel offsets for each side where status bars are placed, used to position other elements. */
export const statusBarOffsets = { top: 0, bottom: 0, left: 0, right: 0 };

/**
 * Adds 1-4 nostalgic status bars with scrolling marquee messages (visitor counters,
 * web ring links, ICQ numbers, etc) in random positions around the viewport.
 */
export function addStatusBar() {
	const statusBarStyles = [
		// Classic Windows 95
		`background: linear-gradient(to bottom, #dfdfdf, #c0c0c0); color: #000080;`,
		// Windows 98
		`background: linear-gradient(to bottom, #d4d0c8, #808080); color: #000;`,
		// Neon green
		`background: #000; color: #0f0; text-shadow: 0 0 5px #0f0, 0 0 10px #0f0;`,
		// Neon pink
		`background: #000; color: #f0f; text-shadow: 0 0 5px #f0f, 0 0 10px #f0f;`,
		// Rainbow
		`background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet); color: #fff; text-shadow: 1px 1px 2px #000;`,
		// Hot pink
		`background: #ff1493; color: #fff;`,
		// Matrix
		`background: #000; color: #0f0; font-family: "Courier New", monospace; letter-spacing: 2px;`,
		// Vaporwave
		`background: linear-gradient(90deg, #ff71ce, #01cdfe, #05ffa1, #b967ff); color: #fff; font-family: "Times New Roman", serif;`,
		// Fire
		`background: linear-gradient(to top, #ff0000, #ff7700, #ffff00); color: #000; font-weight: bold;`,
		// Ocean
		`background: linear-gradient(90deg, #000428, #004e92); color: #7fdbff;`,
		// Sunset
		`background: linear-gradient(90deg, #f12711, #f5af19); color: #fff; text-shadow: 1px 1px 0 #000;`,
		// Galaxy
		`background: linear-gradient(90deg, #0f0c29, #302b63, #24243e); color: #e0e0e0;`,
		// Toxic
		`background: #1a1a1a; color: #39ff14; font-family: "Impact", sans-serif;`,
		// Barbie
		`background: linear-gradient(90deg, #ff69b4, #ff1493, #ff69b4); color: #fff; font-family: "Comic Sans MS", cursive;`,
		// Construction
		`background: repeating-linear-gradient(45deg, #000, #000 10px, #ff0 10px, #ff0 20px); color: #fff; text-shadow: 1px 1px 0 #000, -1px -1px 0 #000;`,
		// Hacker
		`background: #0a0a0a; color: #00ff00; font-family: "Lucida Console", monospace; text-shadow: 0 0 3px #00ff00;`,
		// Cyberpunk
		`background: linear-gradient(90deg, #00d4ff, #090979, #ff00ff); color: #fff; font-family: "Arial Black", sans-serif;`,
		// MS-DOS
		`background: #000080; color: #aaa; font-family: "Courier New", monospace;`,
		// Random chaos
		`background: ${T.randomBackground()}; color: ${T.randomColor()};`,
	];

	const separators = [
		" \u2605 ",
		" \u2665 ",
		" \u266B ",
		" \u2600 ",
		" \u263A ",
		" ~ ",
		" * ",
		" | ",
		" :: ",
		" >>> ",
		" -=*=- ",
		" <3 ",
	];

	const midiFiles = [
		"canyon.mid",
		"passport.mid",
		"flourish.mid",
		"rickroll.mid",
		"doom_e1m1.mid",
		"zelda_theme.mid",
		"sandstorm.mid",
		"nyan_cat.mid",
	];

	const webringNames = [
		"Raccoon WebRing",
		"90s Nostalgia Ring",
		"Cool Homepages United",
		"Under Construction Club",
		"GeoCities Survivors",
		"Visitor Counter Club",
	];

	function getMessages() {
		const visitorCount = T.rand(1, 999999);
		return [
			`Welcome to my homepage!!!`,
			`WELCOME TO MY SITE`,
			`~*~Welcome~*~`,
			`You are visitor #${visitorCount}`,
			`Sign my guestbook!`,
			`Best viewed in Netscape Navigator 4.0`,
			`Best viewed at 800x600 resolution`,
			`Last updated: ${T.pick(["January", "February", "March"])} ${T.rand(1, 28)}, ${T.rand(1997, 2003)}`,
			`This site is Y2K compliant!`,
			`Survived Y2K!`,
			`ICQ#: ${T.rand(10000000, 99999999)}`,
			`AIM: xX_${T.pick(["cool", "dark", "fire"])}_${T.pick(["dude", "wolf", "angel"])}${T.rand(69, 99)}Xx`,
			`\u266B Now playing: ${T.pick(midiFiles)} \u266B`,
			`Download Winamp NOW!`,
			`Powered by FrontPage`,
			`Made with Notepad`,
			`Member of the ${T.pick(webringNames)}`,
			`[ Previous | Random | Next ]`,
			`Made with \u2665 and GeoCities`,
			`Bookmark this page!`,
			`Do NOT steal my graphics!!!`,
			`No right-clicking allowed!`,
			`\u26A0 UNDER CONSTRUCTION \u26A0`,
			`Page views: ${T.rand(100, 999999).toLocaleString()}`,
			`Currently ${T.rand(1, 50)} users online`,
			`[NEW!]`,
			`[HOT!]`,
			`[COOL!]`,
			`>>> CLICK HERE <<<`,
		];
	}

	type StatusBarSide = "bottom" | "top" | "left" | "right";

	function createStatusBar(side: StatusBarSide) {
		const statusBar = document.createElement("div");
		statusBar.className = `geocities-status-bar geocities-status-${side}`;

		const isVertical = side === "left" || side === "right";
		const barSize = T.rand(24, 32);

		// Base positioning
		const baseStyle = `
				position: fixed;
				font-size: ${T.rand(10, 14)}px;
				z-index: 9998;
				overflow: hidden;
				${T.pick(statusBarStyles)}
			`;

		// Position-specific styles
		const positionStyles: Record<StatusBarSide, string> = {
			bottom: `bottom: 0; left: 0; right: 0; height: ${barSize}px; border-top: 2px outset #fff;`,
			top: `top: 0; left: 0; right: 0; height: ${barSize}px; border-bottom: 2px outset #fff;`,
			left: `left: 0; top: 0; bottom: 0; width: ${barSize}px; border-right: 2px outset #fff; writing-mode: vertical-rl; text-orientation: mixed;`,
			right: `right: 0; top: 0; bottom: 0; width: ${barSize}px; border-left: 2px outset #fff; writing-mode: vertical-rl; text-orientation: mixed;`,
		};

		statusBar.style.cssText = baseStyle + positionStyles[side];

		// Get content
		const sep = T.pick(separators);
		const messages = getMessages();
		const shuffled = messages.sort(() => Math.random() - 0.5);
		const selectedMessages = shuffled.slice(0, T.rand(4, 8));
		const content = selectedMessages.join(sep);

		// Marquee direction based on side
		const directions = isVertical ? ["up", "down"] : ["left", "right"];
		const direction = T.pick(directions);
		const behavior = T.pick(["scroll", "scroll", "scroll", "alternate"]);
		const speed = T.rand(1, 12);

		statusBar.innerHTML = `<marquee direction="${direction}" behavior="${behavior}" scrollamount="${speed}" style="height: 100%; width: 100%;">${content}</marquee>`;

		// Random extra flair
		if (Math.random() > 0.7) statusBar.style.fontWeight = "bold";
		if (Math.random() > 0.85)
			statusBar.style.textTransform = T.pick(["uppercase", "lowercase"]);

		return { element: statusBar, side, size: barSize };
	}

	// Determine how many status bars (weighted toward 1)
	const roll = Math.random();
	let numBars: number;
	if (roll < 0.55) numBars = 1;
	else if (roll < 0.8) numBars = 2;
	else if (roll < 0.95) numBars = 3;
	else numBars = 4;

	// Pick which sides get bars
	const allSides: StatusBarSide[] = ["bottom", "top", "left", "right"];
	const shuffledSides = [...allSides].sort(() => Math.random() - 0.5);
	// Bottom is more likely to be first if only 1 bar
	if (numBars === 1 && Math.random() < 0.6) {
		const bottomIdx = shuffledSides.indexOf("bottom");
		if (bottomIdx > 0) {
			shuffledSides.splice(bottomIdx, 1);
			shuffledSides.unshift("bottom");
		}
	}
	const selectedSides = shuffledSides.slice(0, numBars);

	// Create status bars and add padding
	const bars = selectedSides.map((side) => createStatusBar(side));
	const paddingProps = {
		bottom: "paddingBottom",
		top: "paddingTop",
		left: "paddingLeft",
		right: "paddingRight",
	} as const;
	for (const bar of bars) {
		document.body.appendChild(bar.element);
		// Add padding to body for each bar
		document.body.style[paddingProps[bar.side]] = `${bar.size + 4}px`;
		// Track for other elements to avoid
		statusBarOffsets[bar.side] = bar.size + 4;
	}
}
