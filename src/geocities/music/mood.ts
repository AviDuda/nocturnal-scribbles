/**
 * Two-axis mood system for content-aware genre selection.
 *
 * The mood map has two axes:
 * - Energy: CHILL (-1) ←→ ENERGY (+1)
 * - Brightness: DARK (-1) ←→ BRIGHT (+1)
 *
 *                 BRIGHT (+1)
 *                     ↑
 *         Chiptune    |    Happycore
 *         MIDI        |    Trance
 *                     |
 * CHILL (-1) ←————————●————————→ ENERGY (+1)
 *                     |
 *         Ambient     |    Techno
 *         Vaporwave   |    Synthwave
 *         Lofi        |
 *                     ↓
 *                  DARK (-1)
 */

import type { GenreType, VisualState } from "./types";

export type MoodPoint = {
	energy: number; // -1 (chill) to +1 (energy)
	brightness: number; // -1 (dark) to +1 (bright)
};

/** Genre positions on the mood map */
export const genreMoodPositions: Record<GenreType, MoodPoint> = {
	// Chill + Dark quadrant
	ambient: { energy: -0.8, brightness: -0.3 },
	vaporwave: { energy: -0.7, brightness: -0.5 },
	lofi: { energy: -0.5, brightness: -0.2 },

	// Chill + Bright quadrant
	chiptune: { energy: -0.2, brightness: 0.7 },
	midi: { energy: 0.0, brightness: 0.5 },

	// Energy + Dark quadrant
	synthwave: { energy: 0.6, brightness: -0.4 },
	techno: { energy: 0.7, brightness: -0.6 },

	// Energy + Bright quadrant
	trance: { energy: 0.8, brightness: 0.3 },
	happycore: { energy: 0.9, brightness: 0.8 },
};

/** Clamp a value between min and max */
function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Calculate mood center point from page visual state.
 * This is the "target" mood based on page content, time, etc.
 */
export function calculateMoodCenter(state: VisualState): MoodPoint {
	let energy = 0;
	let brightness = 0;

	// === Content influences ===

	// Code blocks → digital, bright, slightly energetic (programming vibe)
	if (state.codeBlockCount > 0) {
		energy += 0.15;
		brightness += 0.25;
	}
	if (state.codeBlockCount > 3) {
		// Heavy code content
		brightness += 0.15;
	}

	// Blockquotes → reflective, nostalgic, chill
	if (state.blockquoteCount > 0) {
		energy -= 0.15;
		brightness -= 0.15;
	}

	// Long paragraphs → slower reading, more ambient/chill
	if (state.avgParagraphLength > 200) {
		energy -= 0.2;
	} else if (state.avgParagraphLength > 100) {
		energy -= 0.1;
	}

	// Lists → structured, rhythmic, slight energy
	if (state.listCount > 3) {
		energy += 0.1;
	}

	// Many headers → more structured content
	if (state.headerCount > 5) {
		energy += 0.05;
	}

	// External links → exploratory, outward-looking
	if (state.externalLinkCount > 5) {
		energy += 0.1;
	}

	// Images → visual content, slightly brighter
	if (state.imageCount > 3) {
		brightness += 0.1;
	}

	// === Time influences ===

	switch (state.timeSlot) {
		case "lateNight": // 2-5 AM - maximum chill, dark
			energy -= 0.35;
			brightness -= 0.25;
			break;
		case "earlyMorning": // 5-9 AM - calm but brightening
			energy -= 0.15;
			brightness += 0.2;
			break;
		case "morning": // 9 AM-12 PM - neutral, slight bright
			brightness += 0.1;
			break;
		case "afternoon": // 12-5 PM - neutral, page dominates
			// No shift, let page content determine mood
			break;
		case "evening": // 5-9 PM - darkening, slight energy
			energy += 0.1;
			brightness -= 0.15;
			break;
		case "night": // 9 PM-2 AM - dark shift
			brightness -= 0.2;
			break;
	}

	// Weekend nights → party energy shift
	if (state.isWeekendNight) {
		energy += 0.2;
	}

	// === Existing visual influences ===

	// Emoji influences (strong signals)
	const hasSpooky = state.emojiTypes.some((e) =>
		["👻", "💀", "🎃", "🦇"].includes(e),
	);
	if (hasSpooky) {
		brightness -= 0.4;
		energy += 0.2;
	}

	const hasFireEmoji = state.emojiTypes.some((e) =>
		["🔥", "⚡", "💥"].includes(e),
	);
	if (hasFireEmoji) {
		energy += 0.3;
	}

	const hasLoveEmoji = state.emojiTypes.some((e) =>
		["💖", "💕", "❤️", "💗", "✨", "⭐"].includes(e),
	);
	if (hasLoveEmoji) {
		brightness += 0.3;
	}

	// Raccoon → nocturnal lofi vibes
	if (state.emojiTypes.includes("🦝")) {
		energy -= 0.25;
		brightness -= 0.1;
	}

	// Retro emojis → vaporwave/midi (chill, mixed brightness)
	const hasRetro = state.emojiTypes.some((e) =>
		["📼", "💾", "📟", "🖥️", "💿"].includes(e),
	);
	if (hasRetro) {
		energy -= 0.2;
	}

	// Chaos level → energy shift
	if (state.chaosLevel > 80) {
		energy += 0.4;
		brightness += 0.2;
	} else if (state.chaosLevel > 60) {
		energy += 0.25;
	} else if (state.chaosLevel > 40) {
		energy += 0.1;
	}

	// Marquees → geocities energy
	if (state.marqueesCount > 3) {
		energy += 0.2;
	}

	// Dark pages → dark mood
	if (state.lightness < 30) {
		brightness -= 0.25;
	} else if (state.lightness > 70) {
		brightness += 0.15;
	}

	// High saturation → more vivid, synthwave territory
	if (state.saturation > 70) {
		energy += 0.15;
	}

	// Gradients → chill vibes
	if (state.hasGradient && !state.hasStripes) {
		energy -= 0.1;
	}

	// Stripes → digital, structured
	if (state.hasStripes) {
		brightness += 0.15;
	}

	// Element count fallback influence
	if (state.elementCount > 300) {
		energy += 0.1;
	} else if (state.elementCount < 100) {
		energy -= 0.1;
	}

	return {
		energy: clamp(energy, -1, 1),
		brightness: clamp(brightness, -1, 1),
	};
}

/**
 * Calculate distance between two mood points.
 */
function moodDistance(a: MoodPoint, b: MoodPoint): number {
	const dE = a.energy - b.energy;
	const dB = a.brightness - b.brightness;
	return Math.sqrt(dE * dE + dB * dB);
}

/**
 * Select a genre based on mood center and variety.
 *
 * @param center - The target mood point from page analysis
 * @param variety - How far from center we can pick (0-1), tied to chaos slider
 * @returns The selected genre type
 */
export function selectGenreFromMood(
	center: MoodPoint,
	variety: number,
): GenreType {
	// Add random offset within variety range
	// Higher variety = more surprising genre choices
	const offset: MoodPoint = {
		energy: (Math.random() * 2 - 1) * variety * 0.8,
		brightness: (Math.random() * 2 - 1) * variety * 0.8,
	};

	const target: MoodPoint = {
		energy: clamp(center.energy + offset.energy, -1, 1),
		brightness: clamp(center.brightness + offset.brightness, -1, 1),
	};

	// Calculate distance to each genre
	const distances: { genre: GenreType; distance: number }[] = [];
	for (const [genre, position] of Object.entries(genreMoodPositions)) {
		distances.push({
			genre: genre as GenreType,
			distance: moodDistance(target, position),
		});
	}

	// Sort by distance
	distances.sort((a, b) => a.distance - b.distance);

	// Pick from the closest 3 genres with weighted probability
	// Closer genres are more likely to be picked
	const candidates = distances.slice(0, 3);
	const weights = candidates.map((c, i) => (1 / (c.distance + 0.1)) * (3 - i));
	const totalWeight = weights.reduce((sum, w) => sum + w, 0);

	let r = Math.random() * totalWeight;
	for (let i = 0; i < candidates.length; i++) {
		r -= weights[i] ?? 0;
		if (r <= 0) {
			return candidates[i]?.genre ?? "lofi";
		}
	}

	return candidates[0]?.genre ?? "lofi";
}

/**
 * Calculate post age multiplier for dusty tape effects.
 * Returns a value from 0 (new post) to 1 (very old post).
 */
export function getPostAgeEffect(postAgeDays: number | null): number {
	if (postAgeDays === null) return 0;
	if (postAgeDays <= 0) return 0;

	// Gradually increase dustiness:
	// - 0-7 days: minimal effect (0-0.1)
	// - 7-30 days: light dust (0.1-0.3)
	// - 30-90 days: moderate dust (0.3-0.5)
	// - 90-365 days: noticeable wear (0.5-0.7)
	// - 1+ years: full vintage treatment (0.7-1.0)
	if (postAgeDays <= 7) return postAgeDays / 70;
	if (postAgeDays <= 30) return 0.1 + (postAgeDays - 7) / 115;
	if (postAgeDays <= 90) return 0.3 + (postAgeDays - 30) / 300;
	if (postAgeDays <= 365) return 0.5 + (postAgeDays - 90) / 550;
	return Math.min(1, 0.7 + (postAgeDays - 365) / 1000);
}

/**
 * Get mood description for debugging/display.
 */
export function describeMood(mood: MoodPoint): string {
	const energyDesc =
		mood.energy < -0.5
			? "very chill"
			: mood.energy < -0.2
				? "chill"
				: mood.energy < 0.2
					? "neutral"
					: mood.energy < 0.5
						? "energetic"
						: "high energy";

	const brightnessDesc =
		mood.brightness < -0.5
			? "very dark"
			: mood.brightness < -0.2
				? "dark"
				: mood.brightness < 0.2
					? "neutral"
					: mood.brightness < 0.5
						? "bright"
						: "very bright";

	return `${energyDesc}, ${brightnessDesc}`;
}
