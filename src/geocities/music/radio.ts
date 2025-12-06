import {
	type Commercial,
	commercials,
	guestbookEntries,
	type RadioStation,
	stations,
} from "./radio-data";
import type { GenreType } from "./types";

const T = window.ThemeUtils;

// Commercials that can play between songs

/**
 * Get commercials that match a station's ad categories.
 * Returns all commercials that have at least one matching category.
 */
export function getCommercialsForStation(station: RadioStation): Commercial[] {
	return commercials.filter((commercial) =>
		commercial.categories.some((cat) => station.adCategories.includes(cat)),
	);
}

/**
 * Get a random commercial appropriate for the given station.
 */
export function getRandomCommercial(station: RadioStation): Commercial {
	const stationCommercials = getCommercialsForStation(station);
	if (stationCommercials.length === 0) {
		// Fallback to any commercial if station has no matching ads
		return T.pick(commercials);
	}
	return T.pick(stationCommercials);
}

// Guestbook entries that can be read out

let currentStation: RadioStation | null = null;
let currentDJ: string | null = null;

/**
 * Get a random station, or the current one if set.
 */
export function getCurrentStation(): RadioStation {
	if (!currentStation) {
		currentStation = T.pick(stations);
	}
	return currentStation;
}

/**
 * Set the current station.
 */
export function setCurrentStation(station: RadioStation | null) {
	currentStation = station;
	currentDJ = null; // Reset DJ when changing stations
}

/**
 * Get a random station.
 */
export function getRandomStation(): RadioStation {
	return T.pick(stations);
}

/**
 * Get the current DJ name for the station.
 */
export function getCurrentDJ(): string {
	const station = getCurrentStation();
	if (!currentDJ) {
		currentDJ = T.pick(station.djNames);
	}
	return currentDJ;
}

/**
 * Get a station jingle.
 */
export function getStationJingle(): string {
	return T.pick(getCurrentStation().jingles);
}

/**
 * Get a station ID.
 */
export function getStationId(): string {
	return T.pick(getCurrentStation().stationIds);
}

/**
 * Get a random guestbook entry.
 */
export function getGuestbookEntry(): { name: string; message: string } {
	return T.pick(guestbookEntries);
}

/**
 * Get a genre appropriate for the current station.
 */
export function getStationGenre(): GenreType {
	const station = getCurrentStation();
	return T.pick(station.preferredGenres);
}

/**
 * Find a station by name.
 */
export function findStation(name: string): RadioStation | undefined {
	return stations.find((s) => s.name.toLowerCase() === name.toLowerCase());
}

// ============================================
// Ad Break Generation
// ============================================

/** Track recently played commercials to avoid immediate repeats */
const recentCommercials: string[] = [];
const MAX_RECENT_COMMERCIALS = 10;

/**
 * Get an ad break intro jingle for the current station.
 */
export function getAdBreakIntro(): string {
	const station = getCurrentStation();
	return T.pick(station.adBreakIntros);
}

/**
 * Get an ad break outro jingle for the current station.
 */
export function getAdBreakOutro(): string {
	const station = getCurrentStation();
	return T.pick(station.adBreakOutros);
}

/**
 * Generate an ad break with 1-3 commercials appropriate for the station.
 * Each commercial gets a different voice index for variety.
 */
export function generateAdBreak(): {
	commercials: { product: string; lines: string[]; voiceIndex: number }[];
	introJingle: string;
	outroJingle: string;
} {
	const station = getCurrentStation();
	const stationCommercials = getCommercialsForStation(station);

	// Filter out recently played commercials
	const availableCommercials = stationCommercials.filter(
		(c) => !recentCommercials.includes(c.product),
	);

	// Fall back to all station commercials if we've played them all recently
	const commercialPool =
		availableCommercials.length > 0 ? availableCommercials : stationCommercials;

	// Pick 1-3 commercials
	const numCommercials = T.rand(1, 3);
	const selectedCommercials: {
		product: string;
		lines: string[];
		voiceIndex: number;
	}[] = [];

	// Shuffle and pick
	const shuffled = [...commercialPool].sort(() => Math.random() - 0.5);
	for (let i = 0; i < numCommercials && i < shuffled.length; i++) {
		const commercial = shuffled[i];
		if (!commercial) continue;
		selectedCommercials.push({
			product: commercial.product,
			lines: commercial.lines,
			voiceIndex: i % 4, // Cycle through 4 voice slots
		});

		// Track as recently played
		recentCommercials.push(commercial.product);
		if (recentCommercials.length > MAX_RECENT_COMMERCIALS) {
			recentCommercials.shift();
		}
	}

	return {
		commercials: selectedCommercials,
		introJingle: getAdBreakIntro(),
		outroJingle: getAdBreakOutro(),
	};
}
