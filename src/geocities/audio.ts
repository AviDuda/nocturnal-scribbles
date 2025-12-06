const T = window.ThemeUtils;

let ctx: AudioContext | null = null;

/**
 * Gets or creates the shared AudioContext, resuming if suspended due to browser autoplay policy.
 */
function getContext() {
	if (!ctx) {
		ctx = new (
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext
		)();
	}
	// Resume if suspended (browser autoplay policy)
	if (ctx.state === "suspended") {
		ctx.resume();
	}
	return ctx;
}

/**
 * Plays a tone using the Web Audio API with exponential decay.
 */
export function playTone(
	frequency: number,
	duration: number,
	type: OscillatorType = "square",
	volume = 0.3,
) {
	const c = getContext();
	const osc = c.createOscillator();
	const gain = c.createGain();

	osc.type = type;
	osc.frequency.setValueAtTime(frequency, c.currentTime);

	gain.gain.setValueAtTime(volume, c.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration);

	osc.connect(gain);
	gain.connect(c.destination);

	osc.start(c.currentTime);
	osc.stop(c.currentTime + duration);
}

/** Plays a quick high-frequency blip sound. */
export function pop() {
	const freq = T.rand(800, 1200);
	playTone(freq, 0.08, "square", 0.2);
}

/** Plays a clean ding sound at configurable pitch. */
export function ding(pitch = 1) {
	const baseFreq = 880 * pitch;
	playTone(baseFreq, 0.15, "sine", 0.25);
}

/** Plays an ascending pitch sound based on combo level, with a harmonic overlay. */
export function combo(level: number) {
	const baseFreq = 440;
	const freq = baseFreq * 1.1 ** Math.min(level, 10);
	playTone(freq, 0.1, "square", 0.2);
	// Add harmonic
	setTimeout(() => {
		playTone(freq * 1.5, 0.08, "sine", 0.15);
	}, 30);
}

/** Plays a triumphant major arpeggio jingle for catching raccoons. */
export function raccoon() {
	const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6 - major arpeggio
	notes.forEach((freq, i) => {
		setTimeout(() => {
			playTone(freq, 0.15, "square", 0.25);
			// Add sparkle
			playTone(freq * 2, 0.1, "sine", 0.1);
		}, i * 60);
	});
}

/** Plays a descending filtered whoosh sound for falling particles. */
export function whoosh() {
	const c = getContext();
	const osc = c.createOscillator();
	const gain = c.createGain();
	const filter = c.createBiquadFilter();

	osc.type = "sawtooth";
	osc.frequency.setValueAtTime(400, c.currentTime);
	osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.15);

	filter.type = "lowpass";
	filter.frequency.setValueAtTime(2000, c.currentTime);
	filter.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);

	gain.gain.setValueAtTime(0.15, c.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);

	osc.connect(filter);
	filter.connect(gain);
	gain.connect(c.destination);

	osc.start(c.currentTime);
	osc.stop(c.currentTime + 0.15);
}

/** Plays a high-pitched twinkle with a quick harmonic tail. */
export function sparkle() {
	const freq = T.rand(1500, 2500);
	playTone(freq, 0.06, "sine", 0.15);
	setTimeout(() => {
		playTone(freq * 1.2, 0.04, "sine", 0.1);
	}, 20);
}

/** Plays a gentle, short twinkle for star interactions. */
export function twinkle() {
	const freq = T.rand(1200, 1800);
	playTone(freq, 0.05, "sine", 0.1);
}
