import { airHorn, impact, laserZap, randomDrop, rewindScratch } from "./drops";
import { getCurrentStation, getStationId, getStationJingle } from "./radio";
import type { DJAnnouncement, GenreType, SectionType } from "./types";

type PlayerMode = "tape" | "radio";

const T = window.ThemeUtils;

// Track current player mode for default text
let currentPlayerMode: PlayerMode = "tape";

export function setLyricsPlayerMode(mode: PlayerMode) {
	currentPlayerMode = mode;
}

/**
 * Get the default/idle text for the marquee based on current mode.
 */
function getDefaultLyricsText(): string {
	if (currentPlayerMode === "radio") {
		const station = getCurrentStation();
		return `${station.name} - ${station.tagline}`;
	}
	return "";
}

// Callback for when lyrics are displayed (for marquee)
// Rate is the speech rate (1.0 = normal, higher = faster)
type LyricsCallback = (text: string, rate?: number) => void;
let onLyricsDisplay: LyricsCallback | null = null;

export function setLyricsCallback(callback: LyricsCallback | null) {
	onLyricsDisplay = callback;
}

// Timeout for auto-clearing lyrics after speech
let lyricsClearTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Clear the lyrics display (e.g., after a break ends).
 * Resets to station tagline in radio mode, empty in tape mode.
 */
export function clearLyricsDisplay() {
	if (lyricsClearTimeout) {
		clearTimeout(lyricsClearTimeout);
		lyricsClearTimeout = null;
	}
	const defaultText = getDefaultLyricsText();
	lastSpokenText = defaultText;
	onLyricsDisplay?.(defaultText, 1);
}

/**
 * Schedule clearing the lyrics display after a delay.
 * Cancels any pending clear timeout.
 */
function scheduleLyricsClear(delayMs: number) {
	if (lyricsClearTimeout) {
		clearTimeout(lyricsClearTimeout);
	}
	lyricsClearTimeout = setTimeout(() => {
		lyricsClearTimeout = null;
		const defaultText = getDefaultLyricsText();
		lastSpokenText = defaultText;
		onLyricsDisplay?.(defaultText, 1);
	}, delayMs);
}

/**
 * Estimate speech duration in ms based on text and rate.
 * Roughly 150 words/min at rate 1.0, ~5 chars per word.
 */
function estimateSpeechDuration(text: string, rate: number): number {
	const words = text.length / 5;
	const wordsPerSecond = (150 / 60) * rate; // 2.5 at rate 1.0
	return (words / wordsPerSecond) * 1000;
}

// Current spoken text for display
let lastSpokenText = "";
export function getLastSpokenText() {
	return lastSpokenText;
}

// Genre-specific vocabulary
const genrePhrases: Record<GenreType, Record<SectionType, string[]>> = {
	chiptune: {
		intro: ["LEVEL ONE", "INSERT COIN", "PLAYER ONE READY", "GAME START"],
		verse: [
			"JUMPING OVER OBSTACLES",
			"COLLECTING ALL THE COINS",
			"PIXEL PERFECT",
			"POWER UP ACQUIRED",
		],
		chorus: ["HIGH SCORE", "BONUS STAGE", "MEGA COMBO", "ACHIEVEMENT UNLOCKED"],
		bridge: ["LOADING NEXT LEVEL", "CHECKPOINT REACHED", "SAVE POINT"],
		breakdown: ["PAUSE MENU", "INVENTORY CHECK"],
		drop: ["BOSS BATTLE", "FINAL FORM", "ULTRA MODE"],
		outro: ["GAME OVER", "CONTINUE?", "INSERT COIN TO PLAY AGAIN"],
	},
	ambient: {
		intro: ["breathe", "floating", "drifting into space"],
		verse: [
			"consciousness expanding",
			"waves of calm",
			"the void welcomes you",
		],
		chorus: ["transcendence", "infinite peace", "one with the cosmos"],
		bridge: ["between worlds", "liminal space"],
		breakdown: ["dissolving", "reforming"],
		drop: ["enlightenment achieved"],
		outro: ["returning", "slowly", "back to earth"],
	},
	synthwave: {
		intro: ["NIGHT DRIVE", "NEON LIGHTS", "NINETEEN EIGHTY FIVE"],
		verse: [
			"CRUISING DOWN THE HIGHWAY",
			"CHROME AND STEEL",
			"LASER GRID HORIZON",
			"RETRO FUTURE",
		],
		chorus: [
			"LIVING THE DREAM",
			"SUNSET CHASE",
			"OUTRUN THE NIGHT",
			"MIDNIGHT CITY",
		],
		bridge: ["PALM TREES PASSING BY", "RADIO STATIC"],
		breakdown: ["ENGINE COOLING", "NEON FADE"],
		drop: ["TURBO BOOST", "MAXIMUM VELOCITY", "HYPERDRIVE"],
		outro: ["SUNRISE APPROACHING", "JOURNEY ENDS", "FADE TO DAWN"],
	},
	lofi: {
		intro: ["just... yeah", "whatever", "it's fine"],
		verse: [
			"studying all night",
			"coffee getting cold",
			"rain on the window",
			"homework can wait",
		],
		chorus: [
			"vibing",
			"it's a mood",
			"no thoughts just beats",
			"perfectly chill",
		],
		bridge: ["stretching", "checking phone", "still raining"],
		breakdown: ["taking a break", "maybe a nap"],
		drop: ["actually productive now", "in the zone"],
		outro: ["sleepy now", "good night", "same time tomorrow"],
	},
	techno: {
		intro: ["SYSTEM ONLINE", "INITIALIZING", "SEQUENCE ACTIVATED"],
		verse: [
			"MACHINES ARE DANCING",
			"INDUSTRIAL RHYTHM",
			"REPETITION IS KEY",
			"MECHANICAL PRECISION",
		],
		chorus: [
			"FULL POWER",
			"MAXIMUM OUTPUT",
			"OVERDRIVE ENGAGED",
			"SYSTEM OVERLOAD",
		],
		bridge: ["RECALIBRATING", "PROCESSING"],
		breakdown: ["STANDBY MODE", "COOLING SYSTEMS"],
		drop: ["CRITICAL MASS", "TOTAL DESTRUCTION", "BASS OVERLOAD"],
		outro: ["SHUTTING DOWN", "SEQUENCE COMPLETE", "SYSTEM OFFLINE"],
	},
	trance: {
		intro: ["CLOSE YOUR EYES", "FEEL THE ENERGY", "JOURNEY BEGINS"],
		verse: [
			"RISING HIGHER",
			"EUPHORIA BUILDING",
			"HANDS IN THE AIR",
			"COLLECTIVE CONSCIOUSNESS",
		],
		chorus: [
			"TOGETHER AS ONE",
			"PURE BLISS",
			"TRANSCENDENT STATE",
			"UNITED WE DANCE",
		],
		bridge: ["BREATHE", "THE MOMENT IS NOW"],
		breakdown: ["ANTICIPATION", "WAITING FOR IT"],
		drop: ["HERE IT COMES", "RELEASE", "EXPLOSION OF JOY", "PEAK EXPERIENCE"],
		outro: ["COMING DOWN", "BEAUTIFUL MEMORIES", "UNTIL NEXT TIME"],
	},
	midi: {
		intro: ["WELCOME TO MY HOMEPAGE", "PAGE LOADING", "BUFFERING"],
		verse: [
			"UNDER CONSTRUCTION",
			"BEST VIEWED AT 800 BY 600",
			"OPTIMIZED FOR INTERNET EXPLORER",
			"FRAMES ENABLED",
		],
		chorus: [
			"SIGN MY GUESTBOOK",
			"YOU ARE VISITOR NUMBER",
			"JOIN MY WEBRING",
			"EMAIL THE WEBMASTER",
		],
		bridge: ["PLEASE WAIT", "LOADING IMAGES"],
		breakdown: ["CONNECTION LOST", "RECONNECTING"],
		drop: ["DOWNLOAD COMPLETE", "NEW MESSAGE", "YOU'VE GOT MAIL"],
		outro: ["THANKS FOR VISITING", "COME BACK SOON", "BOOKMARK THIS PAGE"],
	},
	happycore: {
		intro: ["ARE YOU READY", "LET'S GO", "HERE WE GO"],
		verse: [
			"HANDS UP HIGH",
			"FEEL THE BASS",
			"NEVER STOP DANCING",
			"PURE ENERGY",
		],
		chorus: [
			"HARDCORE WILL NEVER DIE",
			"ONE MORE TIME",
			"LOUDER",
			"MAXIMUM OVERDRIVE",
		],
		bridge: ["CATCH YOUR BREATH", "GET READY"],
		breakdown: ["WAIT FOR IT", "HERE IT COMES"],
		drop: [
			"DROP THE BASS",
			"TOTAL MAYHEM",
			"ABSOLUTE MADNESS",
			"INSANITY MODE ACTIVATED",
		],
		outro: ["WHAT A NIGHT", "AMAZING", "SAME TIME NEXT WEEK"],
	},
	vaporwave: {
		intro: ["welcome", "please enjoy your stay", "loading memories"],
		verse: [
			"empty mall echoes",
			"fountain sounds",
			"escalator dreams",
			"food court nostalgia",
		],
		chorus: [
			"it's all in your head",
			"nothing is real",
			"beautiful emptiness",
			"marble paradise",
		],
		bridge: ["elevator music", "hold please"],
		breakdown: ["closing time", "lights dimming"],
		drop: ["aesthetic achieved", "maximum chill", "transcendence"],
		outro: ["goodbye", "thank you for shopping", "come again"],
	},
};

// Special phrases for page content
const emojiPhrases: Record<string, string[]> = {
	"🦝": [
		"RACCOON DETECTED",
		"NOCTURNAL VIBES",
		"TRASH PANDA ENERGY",
		"SCRIBBLING IN THE DARK",
	],
	"🔥": ["FIRE EMOJI FIRE EMOJI", "THINGS ARE LIT", "BURNING UP"],
	"💖": ["LOVE IN THE AIR", "HEARTS EVERYWHERE", "MAXIMUM AFFECTION"],
	"👻": ["SPOOKY SCARY", "BOO", "GHOSTLY PRESENCE DETECTED"],
	"⭐": ["STAR POWER", "SHINING BRIGHT", "TWINKLE TWINKLE"],
	"💀": ["SKELETAL REMAINS", "BONE ZONE", "SKULL EMOJI DETECTED"],
};

// Random filler announcements
const fillerPhrases = [
	"THIS PAGE IS UNDER CONSTRUCTION",
	"BEST VIEWED IN NETSCAPE NAVIGATOR",
	"SIGN MY GUESTBOOK",
	"WEBMASTER APPROVED",
	"GEOCITIES CERTIFIED",
	"WELCOME TO MY HOME PAGE",
	"THANKS FOR VISITING",
	"PLEASE BOOKMARK THIS PAGE",
	"EMAIL ME",
	"JOIN MY WEB RING",
];

let speechEnabled = true;
let lastSpokenTime = 0;
const MIN_SPEECH_INTERVAL = 3000; // Don't speak more than every 3 seconds

// Voice types for different content
type VoiceType = "dj" | "song" | "commercial" | "system";

// Voice slots - different voices for different purposes
const voices: Record<VoiceType, SpeechSynthesisVoice | null> = {
	dj: null, // Consistent per station, authoritative
	song: null, // Changes per track, for lyrics
	commercial: null, // Energetic, sales-y
	system: null, // For station IDs, jingles
};

// Voice characteristics per type
const voiceSettings: Record<
	VoiceType,
	{ pitch: number; rate: number; volume: number }
> = {
	dj: { pitch: 0.9, rate: 0.85, volume: 0.75 }, // Lower, slower, radio DJ
	song: { pitch: 1.0, rate: 0.9, volume: 0.7 }, // Normal, for lyrics
	commercial: { pitch: 1.15, rate: 1.05, volume: 0.8 }, // Higher, faster, energetic
	system: { pitch: 1.0, rate: 0.8, volume: 0.75 }, // Clear, authoritative
};

export function setSpeechEnabled(enabled: boolean) {
	speechEnabled = enabled;
}

export function isSpeechEnabled() {
	return speechEnabled;
}

// Initialize all voice slots from available voices
function initializeVoices() {
	const available = speechSynthesis.getVoices();
	if (available.length === 0) return;

	// Try to pick different voices for variety
	const shuffled = [...available].sort(() => Math.random() - 0.5);

	// Assign voices, trying to get variety
	voices.dj = shuffled[0] ?? null;
	voices.song = shuffled[1] ?? shuffled[0] ?? null;
	voices.commercial = shuffled[2] ?? shuffled[0] ?? null;
	voices.system = shuffled[3] ?? shuffled[0] ?? null;
}

// Pick a new random voice for songs (called per track)
export function randomizeVoice() {
	const available = speechSynthesis.getVoices();
	if (available.length === 0) return;

	// Only randomize the song voice, keep others stable
	voices.song = T.pick(available);

	// Initialize others if not set
	if (!voices.dj) initializeVoices();
}

// Change DJ voice (called when switching stations)
export function randomizeDJVoice() {
	const available = speechSynthesis.getVoices();
	if (available.length === 0) return;

	voices.dj = T.pick(available);
	voices.system = T.pick(available); // System voice also changes with station
}

function getVoice(type: VoiceType): SpeechSynthesisVoice | null {
	if (!voices[type]) {
		initializeVoices();
	}
	return voices[type];
}

export function speak(
	text: string,
	options: {
		pitch?: number;
		rate?: number;
		skipRateLimit?: boolean;
		voiceType?: VoiceType;
		priority?: "high" | "normal" | "low";
	} = {},
) {
	const voiceType = options.voiceType ?? "song";
	const settings = voiceSettings[voiceType];
	const actualRate = options.rate ?? settings.rate;

	// Store for marquee display regardless of speech settings
	lastSpokenText = text;
	onLyricsDisplay?.(text, actualRate);

	// Schedule clearing after estimated speech duration + buffer
	const speechDuration = estimateSpeechDuration(text, actualRate);
	const clearDelay = speechDuration + 3000; // 3 second buffer after speech
	scheduleLyricsClear(clearDelay);

	if (!speechEnabled) return;
	if (!("speechSynthesis" in window)) return;

	const priority = options.priority ?? "normal";

	// Check if already speaking
	if (speechSynthesis.speaking) {
		// High priority can interrupt, others skip
		if (priority === "high") {
			speechSynthesis.cancel();
		} else {
			// Skip this speech, something else is playing
			return;
		}
	}

	// Rate limit (unless explicitly skipped or high priority)
	const now = Date.now();
	if (
		!options.skipRateLimit &&
		priority !== "high" &&
		now - lastSpokenTime < MIN_SPEECH_INTERVAL
	) {
		return;
	}
	lastSpokenTime = now;

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.voice = getVoice(voiceType);
	// Allow override but fall back to voice type defaults
	utterance.pitch = options.pitch ?? settings.pitch;
	utterance.rate = actualRate;
	utterance.volume = settings.volume;

	speechSynthesis.speak(utterance);
}

// DJ drop sounds enabled
let dropsEnabled = true;

export function setDropsEnabled(enabled: boolean) {
	dropsEnabled = enabled;
}

export function areDropsEnabled() {
	return dropsEnabled;
}

// Play a DJ drop sound based on section type
function maybeTriggerDrop(genre: GenreType, section: SectionType) {
	if (!dropsEnabled) return;

	// High-energy genres get more drops
	const isHighEnergy =
		genre === "happycore" ||
		genre === "techno" ||
		genre === "trance" ||
		genre === "chiptune";

	// Drops on "drop" section - very likely for EDM
	if (section === "drop") {
		if (Math.random() < (isHighEnergy ? 0.5 : 0.25)) {
			// Pick an appropriate drop
			const dropType = Math.random();
			if (dropType < 0.3) {
				airHorn(0.25);
			} else if (dropType < 0.5) {
				impact(0.3);
			} else if (dropType < 0.7) {
				laserZap(0.2);
			} else {
				randomDrop(0.2);
			}
		}
		return;
	}

	// Occasional drops on chorus for high energy genres
	if (section === "chorus" && isHighEnergy && Math.random() < 0.15) {
		randomDrop(0.15);
		return;
	}

	// Rewind scratch on breakdown sometimes
	if (section === "breakdown" && Math.random() < 0.1) {
		rewindScratch(0.2);
	}
}

export function announceSection(
	genre: GenreType,
	section: SectionType,
	pageEmojis: string[] = [],
	mode: PlayerMode = "radio",
) {
	const isRadio = mode === "radio";

	// Maybe trigger a DJ drop sound (radio only)
	if (isRadio) {
		maybeTriggerDrop(genre, section);
	}

	// Chance for inline speech (lyrics, jingles, station IDs)
	// DJ banter/guestbook/dedications now handled via queued breaks between songs
	const speakChance = isRadio ? 0.25 : 0.08;
	if (Math.random() > speakChance) return;

	let phrase: string;

	// === RADIO-ONLY SHORT CONTENT (plays over music) ===
	if (isRadio) {
		// Station jingle (more likely on intro/outro)
		// Jingles are high priority - they can interrupt
		const jingleChance =
			section === "intro" || section === "outro" ? 0.25 : 0.1;
		if (Math.random() < jingleChance) {
			phrase = getStationJingle();
			speak(phrase, { voiceType: "system", priority: "high" });
			return;
		}

		// Quick station ID
		if (Math.random() < 0.08) {
			phrase = getStationId();
			speak(phrase, { voiceType: "system" });
			return;
		}
	}

	// === CONTENT FOR BOTH MODES (lyrics/song content) ===

	// Emoji-specific phrase if we have matching emojis
	// These are "lyrics" - use the song voice
	if (Math.random() < 0.2) {
		for (const emoji of pageEmojis) {
			const phrases = emojiPhrases[emoji];
			if (phrases) {
				phrase = T.pick(phrases);
				speak(phrase, { voiceType: "song", pitch: 1.2 });
				return;
			}
		}
	}

	// Random filler (song voice - like backing vocals)
	if (Math.random() < 0.15) {
		phrase = T.pick(fillerPhrases);
		speak(phrase, { voiceType: "song", pitch: 1.1 });
		return;
	}

	// Genre/section-specific phrase (lyrics - song voice)
	const sectionPhrases = genrePhrases[genre]?.[section];
	if (sectionPhrases) {
		phrase = T.pick(sectionPhrases);
		// Vary pitch based on section energy
		const pitch =
			section === "drop" || section === "chorus"
				? 1.3
				: section === "outro"
					? 0.8
					: 1.0;
		speak(phrase, { voiceType: "song", pitch });
	}
}

// For manual testing
export function testSpeech() {
	speak("WELCOME TO GEOCITIES PLAYER", {
		voiceType: "system",
		priority: "high",
	});
}

// ============================================
// Ad Break Playback
// ============================================

/** Pool of voices for ad breaks (different from regular voice slots) */
let adVoices: SpeechSynthesisVoice[] = [];

/** Initialize ad voices with variety */
function initAdVoices() {
	const available = speechSynthesis.getVoices();
	if (available.length === 0) return;

	// Shuffle and pick up to 4 different voices for ads
	adVoices = [...available].sort(() => Math.random() - 0.5).slice(0, 4);
}

/** Get a specific ad voice by index - ensures different voices for different indices */
function getAdVoice(index: number): SpeechSynthesisVoice | null {
	// Try to init if empty
	if (adVoices.length === 0) {
		initAdVoices();
	}

	// If we have ad voices, use them
	if (adVoices.length > 0) {
		return adVoices[index % adVoices.length] ?? null;
	}

	// Fallback: get voices directly and pick by index
	const available = speechSynthesis.getVoices();
	if (available.length === 0) return null;

	// Use modulo to cycle through available voices
	return available[index % available.length] ?? null;
}

/** Speak text and return a Promise that resolves when done */
function speakAsync(
	text: string,
	voice: SpeechSynthesisVoice | null,
	settings: { pitch: number; rate: number; volume: number },
): Promise<void> {
	return new Promise((resolve) => {
		if (!speechEnabled || !("speechSynthesis" in window)) {
			// Still show in marquee even if speech disabled
			lastSpokenText = text;
			onLyricsDisplay?.(text, settings.rate);
			resolve();
			return;
		}

		// Update marquee display
		lastSpokenText = text;
		onLyricsDisplay?.(text, settings.rate);

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = voice;
		utterance.pitch = settings.pitch;
		utterance.rate = settings.rate;
		utterance.volume = settings.volume;

		utterance.onend = () => resolve();
		utterance.onerror = () => resolve(); // Don't fail the whole ad break on error

		speechSynthesis.speak(utterance);
	});
}

/** Wait for a specified duration */
function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type AdBreakCommercial = {
	product: string;
	lines: string[];
	voiceIndex: number;
};

/**
 * Play a full ad break with intro, commercials, and outro.
 * Returns a Promise that resolves when the ad break is complete.
 */
export async function playAdBreak(adBreak: {
	commercials: AdBreakCommercial[];
	introJingle: string;
	outroJingle: string;
}): Promise<void> {
	if (!("speechSynthesis" in window)) return;

	// Cancel any current speech
	speechSynthesis.cancel();

	// Re-randomize ad voices for variety between ad breaks
	initAdVoices();

	const djSettings = voiceSettings.dj;
	const commercialSettings = voiceSettings.commercial;

	// Speak intro jingle (DJ voice)
	await speakAsync(adBreak.introJingle, getVoice("dj"), djSettings);
	await wait(400); // Brief pause after intro

	// Speak each commercial with its assigned voice and varied pitch
	for (let i = 0; i < adBreak.commercials.length; i++) {
		const commercial = adBreak.commercials[i];
		if (!commercial) continue;

		const adVoice = getAdVoice(commercial.voiceIndex);

		// Vary pitch and rate per commercial for more distinction
		const pitchVariation =
			[1.0, 0.85, 1.15, 0.95][commercial.voiceIndex % 4] ?? 1.0;
		const rateVariation =
			[1.0, 1.1, 0.95, 1.05][commercial.voiceIndex % 4] ?? 1.0;
		const adSettings = {
			pitch: commercialSettings.pitch * pitchVariation,
			rate: commercialSettings.rate * rateVariation,
			volume: commercialSettings.volume,
		};

		// Speak each line of the commercial
		for (const line of commercial.lines) {
			await speakAsync(line, adVoice, adSettings);
			await wait(200); // Brief pause between lines
		}

		// Pause between commercials (if not the last one)
		if (i < adBreak.commercials.length - 1) {
			await wait(600);
		}
	}

	await wait(400); // Brief pause before outro

	// Speak outro jingle (DJ voice)
	await speakAsync(adBreak.outroJingle, getVoice("dj"), djSettings);
}

/**
 * Cancel any currently playing speech synthesis.
 * Used by the break system to skip breaks.
 */
export function cancelCurrentSpeech(): void {
	if ("speechSynthesis" in window) {
		speechSynthesis.cancel();
	}
}

/**
 * Play a DJ block with multiple segments.
 * Returns a Promise that resolves when all segments are complete.
 */
export async function playDJAnnouncement(
	announcement: DJAnnouncement,
): Promise<void> {
	if (!("speechSynthesis" in window)) return;

	// Cancel any current speech
	speechSynthesis.cancel();

	for (let i = 0; i < announcement.segments.length; i++) {
		const segment = announcement.segments[i];
		if (!segment) continue;

		const voiceType = segment.voiceType ?? "dj";
		const settings = voiceSettings[voiceType];

		await speakAsync(segment.text, getVoice(voiceType), settings);

		// Brief pause between segments (not after the last one)
		if (i < announcement.segments.length - 1) {
			await wait(300);
		}
	}
}
