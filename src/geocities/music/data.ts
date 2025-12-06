export const STEPS_PER_BAR = 16;
export const BARS = 4;
export const TOTAL_STEPS = STEPS_PER_BAR * BARS;
export const FADE_TIME = 0.3;

// Scales (semitones from root)
export const scales = {
	/** Happy, bright, resolved - pop, chiptune, happycore */
	major: [0, 2, 4, 5, 7, 9, 11],
	/** Sad, emotional, introspective - synthwave, ambient */
	minor: [0, 2, 3, 5, 7, 8, 10],
	/** Open, simple, Eastern feel - ambient, chiptune */
	pentatonic: [0, 2, 4, 7, 9],
	/** Bluesy, soulful, rock - lofi, blues rock */
	minorPentatonic: [0, 3, 5, 7, 10],
	/** Gritty, expressive, the blue note - lofi, rock */
	blues: [0, 3, 5, 6, 7, 10],
	/** Minor with bright 6th - jazzy, lofi, chill */
	dorian: [0, 2, 3, 5, 7, 9, 10],
	/** Major with flat 7th - rock, funk, laid back */
	mixolydian: [0, 2, 4, 5, 7, 9, 10],
	/** Dark, Spanish, tense - techno, metal, flamenco */
	phrygian: [0, 1, 3, 5, 7, 8, 10],
	/** Classical drama, raised 7th tension - trance, orchestral */
	harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
	/** Jazz sophistication, smooth ascent - jazz, fusion */
	melodicMinor: [0, 2, 3, 5, 7, 9, 11],
	/** Dreamy, floaty, no resolution - ambient, impressionist */
	wholeTone: [0, 2, 4, 6, 8, 10],
	/** Raised 4th, bright and floating - film scores, synthwave */
	lydian: [0, 2, 4, 6, 7, 9, 11],
	/** Arabic/Spanish flavor, exotic tension - world, techno */
	phrygianDominant: [0, 1, 4, 5, 7, 8, 10],
	/** Symmetric tension, horror vibes - spooky, dramatic */
	diminished: [0, 2, 3, 5, 6, 8, 9, 11],
	/** All 12 notes, maximum chaos - experimental, atonal */
	chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	/** Darkest mode, unstable root - horror, tension */
	locrian: [0, 1, 3, 5, 6, 8, 10],
	/** Traditional Japanese pentatonic - serene, Eastern */
	hirajoshi: [0, 2, 3, 7, 8],
	/** Japanese In scale - dark, mysterious Eastern */
	insen: [0, 1, 5, 7, 10],
};

// Chord progressions (as scale degrees)
export const progressions = [
	/** I-IV-V-V - Rock standard, strong resolution */
	[0, 3, 4, 4],
	/** I-IV-V-I - Classic turnaround */
	[0, 3, 4, 0],
	/** I-vi-IV-V - 50s progression, doo-wop */
	[0, 5, 3, 4],
	/** I-V-vi-IV - Axis of awesome, every pop song ever */
	[0, 4, 5, 3],
	/** I-I-IV-V - Simple rock */
	[0, 0, 3, 4],
	/** I-IV-I-V - Country, folk */
	[0, 3, 0, 4],
	/** vi-IV-I-V - Modern pop, emotional */
	[5, 3, 0, 4],
	/** I-iii-IV-V - Gentle build */
	[0, 2, 3, 4],
	/** i-VII-VI-VII - Andalusian cadence, flamenco descending */
	[0, 6, 5, 6],
	/** ii-V-I - Jazz turnaround, the most important jazz progression */
	[1, 4, 0],
	/** I-vi-ii-V - Full jazz turnaround, circle of fifths */
	[0, 5, 1, 4],
	/** i-iv-VII-III - Epic/cinematic, game music */
	[0, 3, 6, 2],
	/** I-bVII-IV-I - Mixolydian vamp, rock anthem */
	[0, 6, 3, 0],
	/** i-VI-III-VII - Minor epic, emotional climax */
	[0, 5, 2, 6],
	/** I-V-IV-V - Arena rock, anthemic */
	[0, 4, 3, 4],
	/** i-i-iv-V - Minor tension build */
	[0, 0, 3, 4],
	/** I-II-IV-I - Lydian bright, dreamy float */
	[0, 1, 3, 0],
	/** i-VII-VI-V - Descending minor, dramatic */
	[0, 6, 5, 4],
	/** I-iii-vi-IV - Sensitive singer-songwriter */
	[0, 2, 5, 3],
	/** i-iv-i-V - Minor blues feel */
	[0, 3, 0, 4],
	/** I-IV-vi-V - Uplifting pop */
	[0, 3, 5, 4],
	/** vi-V-IV-III - Phrygian descent, dark */
	[5, 4, 3, 2],
	/** I-V-vi-iii-IV - Extended emotional arc */
	[0, 4, 5, 2, 3],
	/** i-III-VII-IV - Minor modal interchange */
	[0, 2, 6, 3],
	/** Pachelbel Canon - I-V-vi-iii-IV-I-IV-V (8-bar) */
	[0, 4, 5, 2, 3, 0, 3, 4],
	/** Neo-soul - ii-IV-vi-IV feel */
	[1, 3, 5, 3],
	/** Neo-soul variation - I-vi-ii-V with extensions */
	[0, 5, 1, 4],
	/** Trap/hip-hop - stay on root, occasional move */
	[0, 0, 0, 5],
	/** Trap two-chord vamp */
	[0, 0, 3, 3],
	/** Trap minor vamp */
	[0, 0, 5, 5],
	/** Chromatic descent - film score drama */
	[0, 7, 6, 5],
	/** Chromatic mediants - unexpected color */
	[0, 4, 3, 1],
	/** Ambient drone - minimal movement */
	[0, 0, 0, 0],
	/** Ambient with subtle shift */
	[0, 0, 4, 0],
	/** Blues turnaround */
	[0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4],
	/** Giant Steps (Coltrane changes) - chromatic mediant movement */
	[0, 4, 0, 4, 1, 5],
	/** Giant Steps simplified - major thirds cycle */
	[0, 4, 1],
	/** Gospel - Amen cadence (IV-I) extended */
	[3, 0, 3, 0],
	/** Gospel - extended church progression */
	[0, 3, 1, 4, 0],
	/** Gospel - soul stirring ii-IV-I */
	[1, 3, 0],
	/** Pedal point - chords move over static bass */
	[0, 3, 4, 0],
	/** Pedal - tension build over root */
	[0, 1, 2, 4],
	/** Suspended feel - unresolved, floating */
	[0, 4, 0, 4],
	/** Sus4 vibe - tension without resolution */
	[0, 0, 3, 4],
];

// Drum pattern types
export const drumPatterns: Record<
	string,
	{
		kick: number[];
		snare: number[];
		hihat: string;
		cowbell?: number[];
		clap?: number[];
		ride?: number[];
		rimshot?: number[];
		shaker?: string; // "16ths" | "8ths" | false
		conga?: number[];
		sub808?: number[];
	}
> = {
	/** Standard rock/pop beat */
	basic: { kick: [0, 8], snare: [4, 12], hihat: "8ths" },
	/** Offbeat kick for groove */
	syncopated: { kick: [0, 6, 10], snare: [4, 12], hihat: "8ths" },
	/** Four-on-the-floor with cowbell */
	disco: {
		kick: [0, 4, 8, 12],
		snare: [4, 12],
		hihat: "16ths",
		cowbell: [2, 6, 10, 14],
	},
	/** Slow, heavy feel */
	halftime: { kick: [0], snare: [8], hihat: "8ths" },
	/** Broken beat, jungle influence */
	breakbeat: { kick: [0, 6, 10, 14], snare: [4, 12], hihat: "offbeat" },
	/** Sparse, ambient friendly */
	minimal: { kick: [0, 8], snare: [8], hihat: "sparse" },
	/** 808 trap style - sparse kick, claps, rolling hats */
	trap: { kick: [0, 10], snare: [], hihat: "16ths", clap: [4, 12] },
	/** Classic house - 4x4 with offbeat open hats */
	house: { kick: [0, 4, 8, 12], snare: [], hihat: "offbeat", clap: [4, 12] },
	/** Drum and bass - fast syncopated breaks */
	dnb: { kick: [0, 10], snare: [4, 14], hihat: "16ths" },
	/** Jazz/lofi with ride cymbal */
	jazz: {
		kick: [0, 10],
		snare: [4],
		hihat: "sparse",
		ride: [0, 2, 4, 6, 8, 10, 12, 14],
		rimshot: [7, 15],
	},
	/** Latin groove with congas */
	latin: {
		kick: [0, 8],
		snare: [4, 12],
		hihat: "8ths",
		conga: [2, 5, 7, 10, 13, 15],
		shaker: "16ths",
	},
	/** Deep 808 trap with sub bass */
	trap808: {
		kick: [],
		snare: [],
		hihat: "16ths",
		clap: [4, 12],
		sub808: [0, 10],
	},
	/** Bossa nova inspired */
	bossa: {
		kick: [0, 6, 10],
		snare: [],
		hihat: "sparse",
		rimshot: [4, 12],
		shaker: "16ths",
	},
	/** Funky groove with shaker */
	funk: {
		kick: [0, 6, 10],
		snare: [4, 12],
		hihat: "16ths",
		shaker: "8ths",
		conga: [3, 11],
	},
	/** Reggae one-drop - kick and snare on 3, nothing on 1 */
	reggae: {
		kick: [12],
		snare: [12],
		hihat: "offbeat",
		rimshot: [4, 8],
	},
	/** UK Garage / 2-step - broken, shuffled beat */
	twoStep: {
		kick: [0, 7, 10],
		snare: [4, 14],
		hihat: "16ths",
		clap: [4],
	},
	/** Shuffle - triplet feel, great for lofi */
	shuffle: {
		kick: [0, 8],
		snare: [4, 12],
		hihat: "8ths", // Would ideally be triplets but using 8ths as approximation
		ride: [0, 3, 5, 8, 11, 13], // Triplet-ish feel
	},
	/** Industrial - mechanical, relentless, aggressive */
	industrial: {
		kick: [0, 4, 8, 12],
		snare: [2, 6, 10, 14],
		hihat: "16ths",
		clap: [4, 12],
	},
	/** Afrobeat - polyrhythmic, highlife influenced */
	afrobeat: {
		kick: [0, 7, 10],
		snare: [4, 14],
		hihat: "16ths",
		conga: [0, 3, 5, 8, 10, 13, 15],
		shaker: "16ths",
		cowbell: [2, 6, 10, 14],
	},
	/** Dubstep - half-time with heavy sub and offbeat snares */
	dubstep: {
		kick: [0],
		snare: [8],
		hihat: "offbeat",
		sub808: [0, 6, 10],
		clap: [8],
	},
	/** UK Drill - dark, sliding 808s, triplet-ish hats */
	drill: {
		kick: [],
		snare: [],
		hihat: "16ths",
		sub808: [0, 3, 7, 10],
		clap: [4, 14],
		rimshot: [6, 12],
	},
	/** Motorik - German krautrock, driving hypnotic 4/4 */
	motorik: {
		kick: [0, 4, 8, 12],
		snare: [4, 12],
		hihat: "8ths",
		ride: [0, 4, 8, 12],
	},
	/** New Wave - 80s synth-pop, clean electronic beats */
	newWave: {
		kick: [0, 8],
		snare: [4, 12],
		hihat: "16ths",
		clap: [4, 12],
		cowbell: [6, 14],
	},
};

// Note names for display
export const noteNames = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
];

// Track name parts for generation
export const trackPrefixes = [
	"xX_",
	"~*",
	">>",
	"[[",
	"...",
	"***",
	"=>",
	"!!",
	"<<<",
	"###",
	"--",
	"++",
	"$$",
	"@@",
	"<>",
	"::",
	"||",
	"//",
	"[!]",
	"(*)",
];
export const trackWords = [
	// Tech/cyber
	"cyber",
	"digital",
	"pixel",
	"virtual",
	"matrix",
	"binary",
	"glitch",
	"chrome",
	"silicon",
	"protocol",
	"modem",
	"bandwidth",
	"download",
	"upload",
	"server",
	"gateway",
	// Retro/nostalgia
	"retro",
	"vapor",
	"arcade",
	"cassette",
	"dial",
	"floppy",
	"geocities",
	"netscape",
	"tripod",
	"angelfire",
	// Space/cosmic
	"cosmic",
	"star",
	"moon",
	"solar",
	"lunar",
	"astral",
	"nebula",
	"orbit",
	"galaxy",
	"void",
	// Energy/intensity
	"neon",
	"electric",
	"hyper",
	"mega",
	"turbo",
	"ultra",
	"super",
	"laser",
	"plasma",
	"pulse",
	"surge",
	"rush",
	// Music/vibe
	"synth",
	"techno",
	"dance",
	"rave",
	"beat",
	"bass",
	"wave",
	"groove",
	"rhythm",
	"echo",
	// Time/mood
	"midnight",
	"dream",
	"dawn",
	"dusk",
	"twilight",
	"eternal",
	"infinite",
	"lost",
	"faded",
	// Nature/elements
	"fire",
	"storm",
	"rain",
	"ocean",
	"crystal",
	"shadow",
	"phantom",
	"ghost",
	// Chaos/edge
	"chaos",
	"dark",
	"edge",
	"razor",
	"static",
	"noise",
	"distort",
	// Web/network
	"web",
	"surf",
	"net",
	"link",
	"page",
	"site",
	"ring",
	// Character
	"raccoon",
	"tanuki",
	"redpanda",
	"trashpanda",
	"bandit",
	"nocturnal",
	"coder",
	"hacker",
	"angel",
	"demon",
	"ninja",
	"samurai",
	"wizard",
	"witch",
	// Abstract
	"future",
	"past",
	"zone",
	"realm",
	"dimension",
	"sector",
	"level",
];
export const trackSuffixes = [
	"_Xx",
	"*~",
	"<<",
	"]]",
	"...",
	"***",
	"<=",
	"!!",
	".mid",
	".wav",
	"(final)",
	"(v2)",
	"(remix)",
	"(edit)",
	"_FINAL_v3",
	"_mix",
	"_extended",
	"_club",
	"_radio",
	"_dub",
	"_inst",
	"[1998]",
	"[2000]",
	"_128kbps",
	"_HQ",
	"_rip",
	"_NEW!",
];
