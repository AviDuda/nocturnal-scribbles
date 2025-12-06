/**
 * Unified break system for handling non-music interruptions.
 *
 * This module manages:
 * - Ad breaks (commercials with intro/outro)
 * - DJ announcements (guestbook, dedications, station IDs)
 * - Jingles, news, silence (future)
 *
 * All breaks flow through the same pipeline, with consistent
 * skip behavior and event emission.
 */

import { musicEvents } from "./events";
import {
	cancelCurrentSpeech,
	clearLyricsDisplay,
	playAdBreak as playAdBreakTTS,
	playDJAnnouncement as playDJAnnouncementTTS,
} from "./lyrics";
import {
	generateAdBreak,
	getCurrentDJ,
	getCurrentStation,
	getGuestbookEntry,
	getStationId,
	getStationJingle,
} from "./radio";
import type { DJAnnouncement, DJSegment, PlayableItem } from "./types";

const T = window.ThemeUtils;

// ============================================
// State
// ============================================

type BreakState = "idle" | "playing";

let breakState: BreakState = "idle";
let currentBreak: PlayableItem | null = null;
let skipRequested = false;
let breakResolve: (() => void) | null = null;

// ============================================
// Public API
// ============================================

/** Check if a break is currently playing */
export function isBreakPlaying(): boolean {
	return breakState === "playing";
}

/** Get the current break item (if any) */
export function getCurrentBreak(): PlayableItem | null {
	return currentBreak;
}

/**
 * Play a break item. Returns a Promise that resolves when the break ends
 * (either naturally or via skip).
 */
export async function playBreak(item: PlayableItem): Promise<void> {
	if (breakState === "playing") {
		// Already playing a break - skip it first
		skipBreak();
	}

	breakState = "playing";
	currentBreak = item;
	skipRequested = false;

	musicEvents.emit({ type: "breakStarted", item });

	try {
		switch (item.kind) {
			case "adBreak":
				await playAdBreakWithSkipSupport(item.adBreak);
				break;
			case "djAnnouncement":
				await playDJAnnouncementWithSkipSupport(item.announcement);
				break;
			case "silence":
				await playSilence(item.duration);
				break;
			// Future: jingle, news, commercial
			default:
				// Unknown break type - just wait briefly
				await wait(500);
		}
	} finally {
		const wasSkipped = skipRequested;
		breakState = "idle";
		currentBreak = null;
		skipRequested = false;
		breakResolve = null;

		// Clear the marquee so it doesn't stay stuck on the last break text
		clearLyricsDisplay();

		musicEvents.emit({ type: "breakEnded", item, skipped: wasSkipped });
	}
}

/**
 * Skip the current break. Cancels speech and resolves the break promise.
 */
export function skipBreak(): void {
	if (breakState !== "playing") return;

	skipRequested = true;
	cancelCurrentSpeech();

	// Resolve the break promise if waiting
	if (breakResolve) {
		breakResolve();
		breakResolve = null;
	}
}

// ============================================
// Break Triggering
// ============================================

/** Probability of DJ announcement (checked first, more common) */
const DJ_ANNOUNCEMENT_CHANCE = 0.25;
/** Probability of ad break */
const AD_BREAK_CHANCE = 0.12;

type PlayerMode = "tape" | "radio";

/**
 * Decide whether to trigger a break after the current song.
 * Returns a PlayableItem to queue, or null for no break.
 */
export function shouldTriggerBreak(mode: PlayerMode): PlayableItem | null {
	// Only trigger breaks in radio mode
	if (mode !== "radio") return null;

	// Check for DJ announcement first (more common, less intrusive)
	if (Math.random() < DJ_ANNOUNCEMENT_CHANCE) {
		const announcement = generateDJAnnouncement();
		if (announcement) {
			return { kind: "djAnnouncement", announcement };
		}
	}

	// Check for ad break
	if (Math.random() < AD_BREAK_CHANCE) {
		return { kind: "adBreak", adBreak: generateAdBreak() };
	}

	return null;
}

// ============================================
// DJ Block Generation
// ============================================

// Generic DJ phrases - raccoon and geocities flavored
const djPhrases = [
	// Raccoon vibes
	"Broadcasting from the information superhighway",
	"Keep those browsers locked right here",
	"Streaming at 56k of pure audio bliss",
	"This one's going out to all the night owls",
	"Dial-up dedication station",
	"Your number one source for procedurally generated bangers",
	"The only station that plays while you raid the trash",
	"Nocturnal vibes only, no daytime allowed",
	"Brought to you by trash cans everywhere",
	"Broadcasting live from behind the dumpster",
	"Your host with the most garbage",
	"Nocturnal programming for nocturnal listeners",
	"Keep those tiny paws on the keyboard",
	"Late night tunes for the terminally online",
	"Where the bandwidth flows and the GIFs glow",
	"Scribbling in the dark so you don't have to",
	"Peak dumpster diving hours",
	"Tiny hands, big beats",
	"Masked and ready to party",
	"Raiding your eardrums",
	"Trash panda approved audio",
	"The night shift is the right shift",
	// Geocities nostalgia
	"Best experienced with Netscape Navigator",
	"Under construction since 1999",
	"Hit counter goes brrr",
	"Webmaster certified bangers",
	"Frames within frames within beats",
	"No Flash plugin required",
	"Please disable your popup blocker for full experience",
	"Optimized for 800 by 600 resolution",
	"This page best viewed at 3 AM",
	"Web ring approved content",
	"Guestbook entries are my love language",
	"Dancing baby energy only",
	"Marquee scrolling through your soul",
	"Blink tag enthusiast radio",
	"Table layout survivors unite",
	"MIDI collection on shuffle",
	"Angelfire and chill",
	"Tripod gang for life",
];

// Dedication templates
const dedicationTemplates = [
	"This one goes out to {name}",
	"Shout out to {name}",
	"Big ups to {name}",
	"Sending this track to {name}",
	"Dedicated to {name} and all the homies",
	"This banger is for {name}",
	"{name}, this one's for you",
	"Playing this for {name}",
	"Spinning this for {name}",
	"Paws up for {name}",
	"This next track is dedicated to {name}",
	"From the bottom of my trash can heart, this goes to {name}",
	"Raiding this beat for {name}",
	"{name} requested this vibe and I delivered",
	"Manifesting good energy for {name}",
];

// Dedication recipients - mix of nostalgic and raccoon themed
const dedicationNames = [
	// Internet nostalgia
	"all the 56k modem users",
	"everyone still on dial-up",
	"the webmasters out there",
	"my Geocities neighbors",
	"the Netscape Navigator fans",
	"anyone reading this in Internet Explorer",
	"visitors from the web ring",
	"everyone who signed the guestbook",
	"the HTML purists",
	"my Angelfire friends",
	"the Tripod crew",
	"anyone with a dancing baby GIF",
	"the marquee tag enthusiasts",
	"lovers of the blink tag",
	"people who remember frames",
	"table layout survivors",
	"the MIDI file collectors",
	"anyone who had a GeoCities page",
	"the AOL Instant Messenger veterans",
	"people who remember when Yahoo was cool",
	"those who survived the dot-com crash",
	"visitors with a custom cursor",
	"anyone who used Ask Jeeves",
	// Raccoon and nocturnal vibes
	"the night shift raccoons",
	"the trash pandas of the internet",
	"all raccoons up past bedtime",
	"anyone scribbling in the dark",
	"nocturnal coders everywhere",
	"the dumpster divers of data",
	"fellow procrastinating raccoons",
	"night owl developers",
	"anyone else with tiny paws on a keyboard",
	"creatures of the night",
	"insomniacs and night crawlers",
	"the 3 AM thought havers",
	"those who fear the sunrise",
	"midnight snack enthusiasts",
	"everyone avoiding sleep",
	"the terminally online",
];

// Visitor counter phrases - geocities style
const visitorPhrases = [
	"You are visitor number {n}",
	"Welcome visitor {n}",
	"Guest number {n} has arrived",
	"Counting you as number {n}",
	"Hit counter says {n}",
	"You're number {n} to witness this chaos",
	"Visitor {n} has entered the dumpster",
	"The counter ticks to {n}",
	"Congratulations, you're visitor {n}",
	"{n} raccoons have visited this page",
	"Guest {n} in the building",
	"Adding you to the count: {n}",
];

// Time-aware phrases based on actual hour
function getTimeAwarePhrase(): string {
	const hour = new Date().getHours();

	if (hour >= 0 && hour < 5) {
		return T.pick([
			`It's ${hour} AM and you're still awake. Respect.`,
			"Why are you still up? Same reason as me probably",
			"The best code is written after midnight",
			"Sleep is for people with normal schedules",
			"Peak raccoon hours right now",
			"3 AM thoughts hitting different",
			"The night shift is the right shift",
			"Everyone else is asleep, but not us",
			"Late night coding session in progress",
			"Nocturnal creatures unite",
			"This is when the real ones are online",
			"The witching hour belongs to us",
			"Darkness is our natural habitat",
			"Who needs sleep when you have beats",
			"The trash cans are extra quiet tonight",
		]);
	}
	if (hour >= 5 && hour < 7) {
		return T.pick([
			"Did you stay up all night? Respect",
			"Early bird or late owl? You decide",
			"The sun is coming up but the beats don't stop",
			"Almost made it to a reasonable hour",
			"Time to pretend you woke up early",
			"The sunrise can't stop this vibe",
			"Birds are singing, we're still grinding",
			"Another all-nighter in the books",
		]);
	}
	if (hour >= 7 && hour < 12) {
		return T.pick([
			"Morning vibes, but the late night energy remains",
			"Coffee strongly recommended at this hour",
			"Good morning to those who actually slept",
			"Daytime? How pedestrian",
			"The sun is up but the beats never stopped",
			"Pretending to be a morning person",
			"Daylight mode activated, reluctantly",
		]);
	}
	if (hour >= 12 && hour < 17) {
		return T.pick([
			"Afternoon beats for the afternoon heat",
			"Pretending to be productive hours",
			"Waiting for it to be socially acceptable to go back to bed",
			"The sun is at its peak, but so are we",
			"Midday vibes for the daydreamers",
			"Counting down to acceptable night time",
		]);
	}
	if (hour >= 17 && hour < 21) {
		return T.pick([
			"Evening approaches, the raccoons awaken",
			"Prime time for procrastination",
			"The sun sets, the code flows",
			"Golden hour for night creatures",
			"Getting ready for peak hours",
			"The day people are logging off, we're logging on",
			"Transitioning to nocturnal mode",
		]);
	}
	// 21-24
	return T.pick([
		"The night is young and so are these beats",
		"Prime nocturnal hours approaching",
		"This is when the real work begins",
		"Settling in for a long night",
		"The moon is up and so are we",
		"Night mode fully engaged",
		"Peak performance hours activated",
		"The darkness welcomes us",
	]);
}

/** Generate a single DJ segment by type */
function generateSegment(type: DJSegment["type"]): DJSegment | null {
	const station = getCurrentStation();
	const dj = getCurrentDJ();

	switch (type) {
		case "djIntro": {
			const intros = [
				`This is ${dj} on ${station.name}`,
				`${dj} here, keeping the vibes alive`,
				`You're hanging with ${dj}`,
				`${dj} in the mix`,
				`It's your host ${dj}, coming at you live`,
				`${dj} behind the decks, or whatever raccoons have`,
				`Your nocturnal guide ${dj} here`,
				`${dj} reporting for duty`,
				`Welcome back, it's ${dj}`,
				`${dj} still here, still not sleeping`,
				`The one and only ${dj} on ${station.name}`,
				`${dj} with the tiny paws on the faders`,
			];
			return { type: "djIntro", text: T.pick(intros) };
		}
		case "guestbook": {
			const entry = getGuestbookEntry();
			const templates = [
				`Got a message in the guestbook from ${entry.name}. They say: ${entry.message}`,
				`${entry.name} writes in the guestbook: ${entry.message}`,
				`Shoutout to ${entry.name} who says: ${entry.message}`,
				`Someone actually signed the guestbook! ${entry.name} writes: ${entry.message}`,
				`Reading from the guestbook, ${entry.name} dropped this gem: ${entry.message}`,
				`The guestbook is poppin'. ${entry.name} says: ${entry.message}`,
				`Fresh entry from ${entry.name}: ${entry.message}`,
				`${entry.name} took the time to write: ${entry.message}. We appreciate you.`,
				`Guestbook check! ${entry.name} left us this: ${entry.message}`,
			];
			return { type: "guestbook", text: T.pick(templates) };
		}
		case "dedication": {
			const template = T.pick(dedicationTemplates);
			const name = T.pick(dedicationNames);
			return { type: "dedication", text: template.replace("{name}", name) };
		}
		case "stationId": {
			return { type: "stationId", text: getStationId(), voiceType: "system" };
		}
		case "timeCheck": {
			return { type: "timeCheck", text: getTimeAwarePhrase() };
		}
		case "visitorCount": {
			const visitorNum = T.rand(1000, 99999);
			const template = T.pick(visitorPhrases);
			return {
				type: "visitorCount",
				text: template.replace("{n}", String(visitorNum)),
				voiceType: "system",
			};
		}
		case "generic": {
			return { type: "generic", text: T.pick(djPhrases) };
		}
		default:
			return null;
	}
}

/**
 * Generate a DJ block with multiple segments mixed together.
 * Creates a natural-feeling DJ break with 2-4 segments.
 */
export function generateDJAnnouncement(): DJAnnouncement | null {
	const segments: DJSegment[] = [];

	// Always start with DJ intro (50% chance) or station ID (50% chance)
	const opener = Math.random() < 0.5 ? "djIntro" : "stationId";
	const openerSegment = generateSegment(opener);
	if (openerSegment) segments.push(openerSegment);

	// Pick 1-2 middle segments from the meatier content
	const middleTypes: DJSegment["type"][] = [
		"guestbook",
		"dedication",
		"timeCheck",
		"visitorCount",
		"generic",
	];
	const numMiddle = T.rand(1, 2);
	const shuffled = [...middleTypes].sort(() => Math.random() - 0.5);

	for (let i = 0; i < numMiddle && i < shuffled.length; i++) {
		const type = shuffled[i];
		if (!type) continue;
		const segment = generateSegment(type);
		if (segment) segments.push(segment);
	}

	// 30% chance to end with a station jingle
	if (Math.random() < 0.3) {
		segments.push({
			type: "generic",
			text: getStationJingle(),
			voiceType: "system",
		});
	}

	if (segments.length === 0) return null;

	return { segments };
}

// ============================================
// Internal Helpers
// ============================================

/** Wait helper that can be interrupted by skip */
function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		if (skipRequested) {
			resolve();
			return;
		}

		const timeout = setTimeout(resolve, ms);
		breakResolve = () => {
			clearTimeout(timeout);
			resolve();
		};
	});
}

/** Play ad break with skip support */
async function playAdBreakWithSkipSupport(adBreak: {
	commercials: { product: string; lines: string[]; voiceIndex: number }[];
	introJingle: string;
	outroJingle: string;
}): Promise<void> {
	if (skipRequested) return;

	// Delegate to the TTS implementation in lyrics.ts
	// We wrap it to check for skip between steps
	await playAdBreakTTS(adBreak);
}

/** Play DJ announcement with skip support */
async function playDJAnnouncementWithSkipSupport(
	announcement: DJAnnouncement,
): Promise<void> {
	if (skipRequested) return;

	await playDJAnnouncementTTS(announcement);
}

/** Play silence (dead air) with skip support */
async function playSilence(duration: number): Promise<void> {
	await wait(duration);
}
