import { noteNames, trackPrefixes, trackSuffixes, trackWords } from "./data";
import { getCurrentStation } from "./radio";
import type { Genre, GenreType, TimeSlot, VisualState } from "./types";

const T = window.ThemeUtils;

type PlayerMode = "tape" | "radio";

// ============================================
// Genre-specific vocabulary
// ============================================

const genreWords: Record<GenreType, string[]> = {
	chiptune: [
		"8bit",
		"pixel",
		"retro",
		"arcade",
		"cartridge",
		"console",
		"joystick",
		"highscore",
		"levelup",
		"powerup",
		"boss",
		"quest",
		"sprite",
		"bleep",
		"bloop",
		"coin",
	],
	ambient: [
		"drift",
		"space",
		"void",
		"haze",
		"fog",
		"mist",
		"breath",
		"stillness",
		"horizon",
		"silence",
		"float",
		"dissolve",
		"ether",
		"liminal",
		"abyss",
	],
	synthwave: [
		"neon",
		"chrome",
		"night",
		"drive",
		"blade",
		"runner",
		"outrun",
		"retrowave",
		"gridline",
		"sunset",
		"highway",
		"miami",
		"laser",
		"testarossa",
		"palm",
	],
	lofi: [
		"chill",
		"late",
		"rain",
		"tape",
		"vinyl",
		"study",
		"coffee",
		"window",
		"cozy",
		"sleepy",
		"warm",
		"hiss",
		"raccoon",
		"dusty",
		"mellow",
		"hazy",
	],
	techno: [
		"pulse",
		"system",
		"grid",
		"machine",
		"warehouse",
		"industrial",
		"bunker",
		"acid",
		"minimal",
		"berlin",
		"dark",
		"cold",
		"concrete",
		"strobe",
	],
	trance: [
		"euphoria",
		"ascend",
		"energy",
		"dream",
		"uplifting",
		"anthem",
		"sunrise",
		"progressive",
		"melodic",
		"hands",
		"air",
		"peak",
		"bliss",
		"heaven",
	],
	midi: [
		"homepage",
		"webring",
		"guestbook",
		"netscape",
		"geocities",
		"tripod",
		"angelfire",
		"visitor",
		"counter",
		"under_construction",
		"welcome",
		"awards",
		"frames",
		"blink",
	],
	happycore: [
		"happy",
		"rave",
		"love",
		"party",
		"hardcore",
		"bounce",
		"candy",
		"rainbow",
		"smile",
		"jump",
		"hands",
		"forever",
		"insane",
		"massive",
	],
	vaporwave: [
		"mall",
		"plaza",
		"aesthetic",
		"memory",
		"sunset",
		"marble",
		"fountain",
		"elevator",
		"lounge",
		"corporate",
		"faded",
		"expired",
		"echo",
		"hologram",
	],
};

// ============================================
// Time-of-day vocabulary
// ============================================

const timeWords: Record<TimeSlot, string[]> = {
	lateNight: [
		"3am",
		"insomnia",
		"void",
		"darkness",
		"silence",
		"nocturnal",
		"sleepless",
		"drift",
		"witching",
		"liminal",
	],
	earlyMorning: [
		"dawn",
		"sunrise",
		"dew",
		"awakening",
		"first_light",
		"golden",
		"fresh",
		"mist",
		"birdsong",
		"quiet",
	],
	morning: [
		"morning",
		"bright",
		"start",
		"coffee",
		"clarity",
		"sunshine",
		"beginning",
		"routine",
		"calm",
		"focus",
	],
	afternoon: [
		"afternoon",
		"noon",
		"peak",
		"full",
		"steady",
		"midday",
		"productive",
		"active",
		"warm",
		"flow",
	],
	evening: [
		"dusk",
		"twilight",
		"golden_hour",
		"fading",
		"sunset",
		"winding",
		"calm",
		"evening",
		"amber",
		"reflection",
	],
	night: [
		"night",
		"dark",
		"moon",
		"stars",
		"nocturne",
		"shadow",
		"deep",
		"quiet",
		"mystery",
		"dreaming",
	],
};

// ============================================
// Emoji-specific words
// ============================================

const emojiWords: Record<string, string[]> = {
	"🦝": [
		"raccoon",
		"trash_panda",
		"nocturnal",
		"bandit",
		"ringtail",
		"scavenger",
		"masked",
		"dumpster",
	],
	"🔥": [
		"fire",
		"flame",
		"burning",
		"lit",
		"blazing",
		"inferno",
		"heat",
		"ember",
	],
	"💖": [
		"love",
		"heart",
		"affection",
		"pink",
		"sweet",
		"tender",
		"warm",
		"crush",
	],
	"💕": ["love", "hearts", "floating", "dreamy", "romantic", "soft", "flutter"],
	"❤️": ["love", "red", "passion", "heart", "deep", "true", "eternal"],
	"⭐": [
		"star",
		"shine",
		"sparkle",
		"bright",
		"celestial",
		"glitter",
		"twinkle",
	],
	"✨": [
		"sparkle",
		"magic",
		"glitter",
		"shimmer",
		"dazzle",
		"fairy",
		"enchant",
	],
	"👻": ["ghost", "spooky", "phantom", "spirit", "haunted", "specter", "boo"],
	"💀": ["skull", "bones", "death", "skeleton", "dark", "doom", "grave"],
	"🎃": [
		"pumpkin",
		"halloween",
		"spooky",
		"orange",
		"jack",
		"lantern",
		"autumn",
	],
	"🦇": ["bat", "vampire", "night", "gothic", "wing", "echo", "cave"],
	"🌙": ["moon", "lunar", "night", "crescent", "glow", "silver", "tide"],
	"🌊": ["wave", "ocean", "sea", "tide", "surf", "deep", "blue", "flow"],
	"☔": ["rain", "drops", "storm", "wet", "umbrella", "grey", "puddle"],
	"🌸": ["blossom", "cherry", "pink", "spring", "petal", "bloom", "sakura"],
	"🍂": ["autumn", "leaf", "fall", "orange", "crisp", "wind", "cozy"],
	"❄️": ["snow", "ice", "cold", "winter", "frost", "crystal", "frozen"],
	"⚡": ["lightning", "electric", "shock", "bolt", "power", "surge", "flash"],
	"💾": ["floppy", "save", "retro", "data", "disk", "backup", "old_school"],
	"📼": ["vhs", "tape", "retro", "rewind", "record", "analog", "nostalgic"],
	"🖥️": ["computer", "screen", "desktop", "digital", "monitor", "pixel"],
	"💿": ["cd", "disc", "burn", "rip", "audio", "album", "shiny"],
	"📟": ["pager", "beep", "90s", "retro", "message", "signal"],
	"🎮": [
		"game",
		"controller",
		"play",
		"level",
		"score",
		"pixel",
		"press_start",
	],
	"🕹️": ["joystick", "arcade", "retro", "cabinet", "quarter", "highscore"],
	"🎧": ["headphones", "audio", "listen", "beats", "music", "stereo", "bass"],
	"🎵": ["music", "note", "melody", "tune", "song", "sound", "harmony"],
	"🌈": ["rainbow", "colors", "pride", "spectrum", "arc", "bright", "vivid"],
	"🍕": ["pizza", "late_night", "snack", "cheese", "slice", "delivery"],
	"☕": ["coffee", "caffeine", "brew", "morning", "espresso", "bean", "cup"],
	"🍜": ["ramen", "noodle", "late", "hot", "comfort", "slurp", "steam"],
};

// ============================================
// Content-type words
// ============================================

const contentWords = {
	code: [
		"syntax",
		"compile",
		"debug",
		"function",
		"loop",
		"array",
		"binary",
		"stack",
		"algorithm",
		"recursive",
	],
	reflective: [
		"memory",
		"thought",
		"dream",
		"wonder",
		"musing",
		"reflect",
		"ponder",
		"remember",
		"echo",
		"past",
	],
	longform: [
		"chapter",
		"scroll",
		"deep",
		"journey",
		"story",
		"epic",
		"saga",
		"tale",
		"passage",
		"reading",
	],
	structured: [
		"list",
		"order",
		"sequence",
		"step",
		"item",
		"check",
		"bullet",
		"organize",
		"plan",
		"task",
	],
	visual: [
		"image",
		"picture",
		"gallery",
		"frame",
		"snapshot",
		"capture",
		"view",
		"scene",
		"visual",
		"render",
	],
	exploratory: [
		"link",
		"hop",
		"surf",
		"browse",
		"wander",
		"discover",
		"explore",
		"journey",
		"portal",
		"gateway",
	],
};

// ============================================
// Chaos/energy modifiers
// ============================================

const chaosWords = {
	low: ["calm", "still", "quiet", "gentle", "soft", "peaceful", "serene"],
	medium: ["steady", "flow", "groove", "vibe", "ride", "cruise", "wave"],
	high: [
		"chaos",
		"wild",
		"insane",
		"manic",
		"hyper",
		"turbo",
		"overdrive",
		"maximum",
		"extreme",
	],
};

// ============================================
// Post age / vintage modifiers
// ============================================

const vintageWords = [
	"dusty",
	"worn",
	"faded",
	"vintage",
	"classic",
	"antique",
	"aged",
	"retro",
	"old_school",
	"timeless",
	"archive",
	"relic",
];

// ============================================
// Color-influenced words (based on hue)
// ============================================

function getColorWord(hue: number): string {
	// Map hue to color words
	if (hue < 30 || hue >= 330)
		return T.pick(["red", "crimson", "ruby", "blood", "scarlet"]);
	if (hue < 60) return T.pick(["orange", "amber", "gold", "sunset", "copper"]);
	if (hue < 90) return T.pick(["yellow", "lemon", "golden", "sun", "bright"]);
	if (hue < 150) return T.pick(["green", "emerald", "jade", "forest", "lime"]);
	if (hue < 210) return T.pick(["cyan", "teal", "aqua", "ocean", "azure"]);
	if (hue < 270)
		return T.pick(["blue", "cobalt", "sapphire", "navy", "indigo"]);
	if (hue < 330)
		return T.pick(["purple", "violet", "magenta", "plum", "lavender"]);
	return T.pick(["grey", "silver", "ash", "smoke", "steel"]);
}

// ============================================
// Artist name generator
// ============================================

const artistPrefixes = [
	"xX_",
	"XX_",
	"DJ_",
	"MC_",
	"The_",
	"",
	"",
	"",
	"~",
	"*",
];
const artistSuffixes = [
	"_Xx",
	"_XX",
	"99",
	"2000",
	"1997",
	"98",
	"_official",
	"",
	"",
	"",
	"~",
	"*",
];
const artistFirstWords = [
	// Cyber/tech
	"Cyber",
	"Digital",
	"Pixel",
	"Neon",
	"Chrome",
	"Binary",
	"Virtual",
	"Glitch",
	"Data",
	"Signal",
	// Dark/edge
	"Dark",
	"Shadow",
	"Phantom",
	"Ghost",
	"Void",
	"Night",
	"Midnight",
	"Eclipse",
	"Noir",
	// Nature/space
	"Moon",
	"Star",
	"Solar",
	"Crystal",
	"Storm",
	"Wave",
	"Dream",
	"Cloud",
	// Cool words
	"Cool",
	"Chill",
	"Vapor",
	"Synth",
	"Bass",
	"Beat",
	"Groove",
	"Pulse",
	// Mall/vaporwave
	"Mall",
	"Plaza",
	"Fountain",
	"Elevator",
	"Marble",
	"Sunset",
	// Animals
	"Wolf",
	"Owl",
	"Cat",
	"Fox",
	"Raccoon",
	"Panda",
	// Forbidden cats / trash animals
	"Trash",
	"Dumpster",
	"Bandit",
	"Ringtail",
	"Possum",
	"Tanuki",
	"Nocturnal",
	"Masked",
	"Garbage",
	"Bin",
	"Feral",
	"Stray",
	"Alley",
];
const artistSecondWords = [
	// Role/identity
	"Walker",
	"Rider",
	"Hunter",
	"Runner",
	"Dreamer",
	"Drifter",
	"Surfer",
	"Crawler",
	// Descriptors
	"Angel",
	"Demon",
	"Knight",
	"Ninja",
	"Samurai",
	"Wizard",
	"Master",
	"King",
	"Queen",
	"Lord",
	// Nature
	"Fire",
	"Ice",
	"Thunder",
	"Rain",
	"Wind",
	"Blade",
	// Tech
	"Bot",
	"Droid",
	"Core",
	"Wave",
	"Grid",
	"Zone",
	"Byte",
	// Simple
	"Kid",
	"Guy",
	"Dude",
	"Girl",
	"Boy",
	"Man",
	// Forbidden cat vibes
	"Panda",
	"Bandit",
	"Scavenger",
	"Prowler",
	"Lurker",
	"Creeper",
	"Raider",
	"Digger",
];

function generateArtistName(): string {
	const styles: (() => string)[] = [
		// GeoCities username style: xX_DarkAngel_Xx
		() => {
			const first = T.pick(artistFirstWords);
			const second = T.pick(artistSecondWords);
			return `${T.pick(artistPrefixes)}${first}${second}${T.pick(artistSuffixes)}`;
		},
		// DJ/Producer style: DJ_Pixel or MALL_WALKER
		() => {
			const style = Math.random();
			if (style < 0.4) {
				return `DJ_${T.pick(artistFirstWords)}`;
			}
			return `${T.pick(artistFirstWords).toUpperCase()}_${T.pick(artistSecondWords).toUpperCase()}`;
		},
		// Band style: The Void, Neon Dreams
		() => {
			if (Math.random() < 0.4) {
				return `The_${T.pick(artistFirstWords)}`;
			}
			return `${T.pick(artistFirstWords)}_${T.pick(artistFirstWords)}s`;
		},
		// Simple + year: Nightowl2000, Vapor98
		() => {
			const year = T.pick(["97", "98", "99", "2000", "2001", "95", "96"]);
			return `${T.pick(artistFirstWords)}${T.pick(artistSecondWords)}${year}`;
		},
		// Single word + number
		() => {
			const num = T.pick(["99", "2000", "707", "808", "303", "101", "X"]);
			return `${T.pick(artistFirstWords)}${num}`;
		},
	];

	return T.pick(styles)();
}

// ============================================
// Radio mode name generator (genre-focused, not page-aware)
// ============================================

function generateRadioName(genre: Genre, rootNote: number): string {
	const station = getCurrentStation();
	const noteName = noteNames[rootNote] ?? "C";
	const genreWord = T.pick(genreWords[genre.name]);

	// Pick a random time vibe (not current time, just flavor)
	const randomTimeSlot = T.pick([
		"lateNight",
		"earlyMorning",
		"morning",
		"afternoon",
		"evening",
		"night",
	] as const);
	const timeWord = T.pick(timeWords[randomTimeSlot]);

	const patterns: (() => string)[] = [
		// Genre + general word + note
		() => {
			const word = T.pick(trackWords);
			return `${genreWord}_${word}_${noteName}`;
		},

		// Classic style: prefix + genre + suffix
		() => {
			return `${T.pick(trackPrefixes)}${genreWord}_${T.pick(trackWords)}${T.pick(trackSuffixes)}`;
		},

		// Time-flavored + genre
		() => {
			return `${timeWord}_${genreWord}_${noteName}`;
		},

		// Double genre words
		() => {
			const genreWord2 = T.pick(genreWords[genre.name]);
			return `${T.pick(trackPrefixes)}${genreWord}_${genreWord2}${T.pick(trackSuffixes)}`;
		},

		// General word combo
		() => {
			const word1 = T.pick(trackWords);
			const word2 = T.pick(trackWords);
			return `${word1}_${word2}_${noteName}`;
		},

		// Time + general word
		() => {
			const word = T.pick(trackWords);
			return `${timeWord}_${word}${T.pick(trackSuffixes)}`;
		},

		// Artist attribution (~25% of patterns)
		() => {
			const artist = generateArtistName();
			const songName = `${genreWord}_${T.pick(trackWords)}`;
			return `${artist} - ${songName}`;
		},
		() => {
			const artist = generateArtistName();
			const songName = `${timeWord}_${genreWord}`;
			return `${artist} - ${songName}`;
		},

		// Station flavor (~12% of patterns - 1 out of 8)
		() => {
			const dj = T.pick(station.djNames);
			const suffix = T.pick(["mix", "session", "edit", "remix", "cut"]);
			return `${dj}_${genreWord}_${suffix}`;
		},
	];

	return T.pick(patterns)();
}

// ============================================
// Content-aware name generators (tape mode)
// ============================================

function generateContentAwareName(
	visualState: VisualState,
	genre: Genre,
	rootNote: number,
): string {
	const noteName = noteNames[rootNote] ?? "C";

	// 1. Emoji-based word (strongest signal)
	let emojiWord: string | null = null;
	for (const emoji of visualState.emojiTypes) {
		if (emojiWords[emoji]) {
			emojiWord = T.pick(emojiWords[emoji]);
			break;
		}
	}

	// 2. Time-based word
	const timeWord = T.pick(timeWords[visualState.timeSlot]);

	// 3. Genre word
	const genreWord = T.pick(genreWords[genre.name]);

	// 4. Content-type word
	let contentWord: string | null = null;
	if (visualState.codeBlockCount > 2) {
		contentWord = T.pick(contentWords.code);
	} else if (visualState.blockquoteCount > 1) {
		contentWord = T.pick(contentWords.reflective);
	} else if (visualState.avgParagraphLength > 200) {
		contentWord = T.pick(contentWords.longform);
	} else if (visualState.listCount > 3) {
		contentWord = T.pick(contentWords.structured);
	} else if (visualState.imageCount > 3) {
		contentWord = T.pick(contentWords.visual);
	} else if (visualState.externalLinkCount > 5) {
		contentWord = T.pick(contentWords.exploratory);
	}

	// 5. Chaos word
	let chaosWord: string | null = null;
	if (visualState.chaosLevel > 60) {
		chaosWord = T.pick(chaosWords.high);
	} else if (visualState.chaosLevel > 30) {
		chaosWord = T.pick(chaosWords.medium);
	} else if (Math.random() < 0.3) {
		chaosWord = T.pick(chaosWords.low);
	}

	// 6. Vintage word for old posts
	let vintageWord: string | null = null;
	if (visualState.postAgeDays !== null && visualState.postAgeDays > 90) {
		if (Math.random() < 0.5) {
			vintageWord = T.pick(vintageWords);
		}
	}

	// 7. Color word
	const colorWord =
		Math.random() < 0.3 ? getColorWord(visualState.dominantHue) : null;

	// 8. Weekend night special
	const weekendWord = visualState.isWeekendNight
		? T.pick(["party", "late", "wild", "endless"])
		: null;

	// Build name using different patterns
	const patterns: (() => string)[] = [
		// Emoji + genre + note
		() => {
			if (emojiWord) {
				return `${T.pick(trackPrefixes)}${emojiWord}_${genreWord}_${noteName}${T.pick(trackSuffixes)}`;
			}
			return `${T.pick(trackPrefixes)}${timeWord}_${genreWord}_${noteName}${T.pick(trackSuffixes)}`;
		},

		// Time + content + genre
		() => {
			const word = contentWord ?? T.pick(trackWords);
			return `${timeWord}_${word}_${genreWord}`;
		},

		// Chaos + genre + note
		() => {
			if (chaosWord) {
				return `${T.pick(trackPrefixes)}${chaosWord}_${genreWord}_${noteName}`;
			}
			return `${T.pick(trackPrefixes)}${genreWord}_${T.pick(trackWords)}_${noteName}`;
		},

		// Vintage style for old posts
		() => {
			if (vintageWord) {
				return `${vintageWord}_${genreWord}_${noteName}${T.pick(["[remaster]", "[archive]", "[found]", "[tape]"])}`;
			}
			return `${T.pick(trackPrefixes)}${T.pick(trackWords)}_${genreWord}${T.pick(trackSuffixes)}`;
		},

		// Color + time + note
		() => {
			if (colorWord) {
				return `${colorWord}_${timeWord}_${noteName}`;
			}
			return `${genreWord}_${timeWord}_${noteName}`;
		},

		// Weekend special
		() => {
			if (weekendWord) {
				return `${T.pick(trackPrefixes)}${weekendWord}_${genreWord}_${timeWord}${T.pick(trackSuffixes)}`;
			}
			return `${T.pick(trackPrefixes)}${genreWord}_${T.pick(trackWords)}${T.pick(trackSuffixes)}`;
		},

		// Content-heavy style
		() => {
			if (contentWord) {
				const mood = emojiWord ?? timeWord;
				return `${mood}_${contentWord}_${noteName}`;
			}
			return `${T.pick(trackWords)}_${genreWord}_${noteName}`;
		},

		// Triple combo
		() => {
			const w1 = emojiWord ?? timeWord;
			const w2 = contentWord ?? genreWord;
			const w3 = chaosWord ?? T.pick(trackWords);
			return `${w1}_${w2}_${w3}`;
		},
	];

	return T.pick(patterns)();
}

// ============================================
// Main export
// ============================================

/**
 * Generate a procedural track name based on player mode, page state, genre, and musical key.
 *
 * In tape mode: Names are content-aware, reflecting page emojis, time of day, content type,
 * chaos level, post age, and colors.
 *
 * In radio mode: Names are genre-focused with random time flavors, fictional artist attributions,
 * and occasional station/DJ references.
 */
export function generateTrackName(
	visualState: VisualState,
	genre: Genre,
	rootNote: number,
	mode: PlayerMode = "tape",
): string {
	if (mode === "radio") {
		return generateRadioName(genre, rootNote);
	}
	return generateContentAwareName(visualState, genre, rootNote);
}
