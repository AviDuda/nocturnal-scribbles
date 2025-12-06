/**
 * DJ drops and sound effects for the music player.
 * Synthesized audio samples triggered on drops, transitions, and section changes.
 */

let ctx: AudioContext | null = null;
let dropGain: GainNode | null = null;

function getContext() {
	if (!ctx) {
		ctx = new (
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext
		)();
		dropGain = ctx.createGain();
		dropGain.gain.value = 0.5;
		dropGain.connect(ctx.destination);
	}
	if (ctx.state === "suspended") {
		ctx.resume();
	}
	return ctx;
}

function getGain(): GainNode {
	getContext();
	if (!dropGain) throw new Error("Drop gain not initialized");
	return dropGain;
}

/**
 * Air horn - the classic DJ party horn.
 * Three stacked oscillators with pitch bend and distortion-like harmonics.
 */
export function airHorn(volume = 0.4) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	// Main horn frequencies (stacked for that beefy sound)
	const frequencies = [420, 560, 840];

	for (const freq of frequencies) {
		const osc = c.createOscillator();
		const oscGain = c.createGain();

		osc.type = "sawtooth";
		// Pitch bend up at start
		osc.frequency.setValueAtTime(freq * 0.9, now);
		osc.frequency.linearRampToValueAtTime(freq, now + 0.05);
		osc.frequency.setValueAtTime(freq, now + 0.4);
		osc.frequency.linearRampToValueAtTime(freq * 0.95, now + 0.5);

		oscGain.gain.setValueAtTime(0, now);
		oscGain.gain.linearRampToValueAtTime((volume / 3) * 0.8, now + 0.02);
		oscGain.gain.setValueAtTime((volume / 3) * 0.6, now + 0.4);
		oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

		osc.connect(oscGain);
		oscGain.connect(g);
		osc.start(now);
		osc.stop(now + 0.6);
	}
}

/**
 * Rewind scratch sound - that classic "wicka wicka" DJ scratch.
 */
export function rewindScratch(volume = 0.3) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	// White noise through bandpass, pitch-shifted
	const bufferSize = c.sampleRate * 0.3;
	const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}

	const noise = c.createBufferSource();
	noise.buffer = buffer;
	// Playback rate creates the scratch effect
	noise.playbackRate.setValueAtTime(2, now);
	noise.playbackRate.linearRampToValueAtTime(0.5, now + 0.15);
	noise.playbackRate.linearRampToValueAtTime(1.5, now + 0.25);

	const filter = c.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.value = 1500;
	filter.Q.value = 5;

	const noiseGain = c.createGain();
	noiseGain.gain.setValueAtTime(volume, now);
	noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

	noise.connect(filter);
	filter.connect(noiseGain);
	noiseGain.connect(g);
	noise.start(now);
	noise.stop(now + 0.35);
}

/**
 * Laser zap sound - for drops and transitions.
 */
export function laserZap(volume = 0.25) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	const osc = c.createOscillator();
	const oscGain = c.createGain();

	osc.type = "sawtooth";
	// Descending pitch
	osc.frequency.setValueAtTime(2000, now);
	osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

	oscGain.gain.setValueAtTime(volume, now);
	oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

	osc.connect(oscGain);
	oscGain.connect(g);
	osc.start(now);
	osc.stop(now + 0.25);
}

/**
 * Siren sound - ascending then descending.
 */
export function siren(volume = 0.2, duration = 0.8) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	const osc = c.createOscillator();
	const oscGain = c.createGain();

	osc.type = "square";
	osc.frequency.setValueAtTime(400, now);
	osc.frequency.linearRampToValueAtTime(800, now + duration / 2);
	osc.frequency.linearRampToValueAtTime(400, now + duration);

	oscGain.gain.setValueAtTime(volume, now);
	oscGain.gain.setValueAtTime(volume, now + duration * 0.9);
	oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

	osc.connect(oscGain);
	oscGain.connect(g);
	osc.start(now);
	osc.stop(now + duration + 0.1);
}

/**
 * Record stop - the vinyl slowdown effect.
 */
export function recordStop(volume = 0.3) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	// Low rumble that slows down
	const osc = c.createOscillator();
	const oscGain = c.createGain();
	const filter = c.createBiquadFilter();

	osc.type = "sawtooth";
	osc.frequency.setValueAtTime(100, now);
	osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);

	filter.type = "lowpass";
	filter.frequency.setValueAtTime(500, now);
	filter.frequency.exponentialRampToValueAtTime(50, now + 0.5);

	oscGain.gain.setValueAtTime(volume, now);
	oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

	osc.connect(filter);
	filter.connect(oscGain);
	oscGain.connect(g);
	osc.start(now);
	osc.stop(now + 0.6);
}

/**
 * Build-up riser - white noise sweep for tension.
 */
export function riser(volume = 0.2, duration = 2) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	const bufferSize = c.sampleRate * duration;
	const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}

	const noise = c.createBufferSource();
	noise.buffer = buffer;

	const filter = c.createBiquadFilter();
	filter.type = "highpass";
	// Sweep from low to high
	filter.frequency.setValueAtTime(100, now);
	filter.frequency.exponentialRampToValueAtTime(8000, now + duration);

	const noiseGain = c.createGain();
	noiseGain.gain.setValueAtTime(0.01, now);
	noiseGain.gain.linearRampToValueAtTime(volume, now + duration * 0.9);
	noiseGain.gain.linearRampToValueAtTime(0, now + duration);

	noise.connect(filter);
	filter.connect(noiseGain);
	noiseGain.connect(g);
	noise.start(now);
	noise.stop(now + duration + 0.1);
}

/**
 * Impact/drop hit - a big downward sweep with punch.
 */
export function impact(volume = 0.4) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	// Low punch
	const kick = c.createOscillator();
	const kickGain = c.createGain();
	kick.type = "sine";
	kick.frequency.setValueAtTime(150, now);
	kick.frequency.exponentialRampToValueAtTime(30, now + 0.2);
	kickGain.gain.setValueAtTime(volume, now);
	kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
	kick.connect(kickGain);
	kickGain.connect(g);
	kick.start(now);
	kick.stop(now + 0.5);

	// Noise burst
	const bufferSize = c.sampleRate * 0.1;
	const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}
	const noise = c.createBufferSource();
	noise.buffer = buffer;
	const noiseGain = c.createGain();
	noiseGain.gain.setValueAtTime(volume * 0.5, now);
	noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
	noise.connect(noiseGain);
	noiseGain.connect(g);
	noise.start(now);
	noise.stop(now + 0.15);
}

/**
 * Dial-up modem connection sound - the iconic 56k handshake.
 * Synthesized approximation of the actual modem negotiation.
 */
export function dialUpModem(volume = 0.2) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	// Phase 1: Dial tone (0-0.3s)
	const dialTone = c.createOscillator();
	const dialGain = c.createGain();
	dialTone.type = "sine";
	dialTone.frequency.value = 440;
	dialGain.gain.setValueAtTime(volume * 0.3, now);
	dialGain.gain.setValueAtTime(0, now + 0.3);
	dialTone.connect(dialGain);
	dialGain.connect(g);
	dialTone.start(now);
	dialTone.stop(now + 0.35);

	// Phase 2: DTMF-like dialing (0.3-0.8s)
	const dialFreqs = [697, 770, 852, 941, 1209, 1336, 1477];
	for (let i = 0; i < 7; i++) {
		const dtmf = c.createOscillator();
		const dtmfGain = c.createGain();
		dtmf.type = "sine";
		dtmf.frequency.value = dialFreqs[i % dialFreqs.length] ?? 697;
		const startT = now + 0.3 + i * 0.07;
		dtmfGain.gain.setValueAtTime(0, startT);
		dtmfGain.gain.linearRampToValueAtTime(volume * 0.4, startT + 0.01);
		dtmfGain.gain.setValueAtTime(volume * 0.4, startT + 0.05);
		dtmfGain.gain.linearRampToValueAtTime(0, startT + 0.06);
		dtmf.connect(dtmfGain);
		dtmfGain.connect(g);
		dtmf.start(startT);
		dtmf.stop(startT + 0.1);
	}

	// Phase 3: Carrier tone negotiation (0.9-1.5s)
	const carrier1 = c.createOscillator();
	const carrier1Gain = c.createGain();
	carrier1.type = "sine";
	carrier1.frequency.setValueAtTime(1200, now + 0.9);
	carrier1.frequency.setValueAtTime(2400, now + 1.1);
	carrier1.frequency.setValueAtTime(1200, now + 1.3);
	carrier1Gain.gain.setValueAtTime(0, now + 0.9);
	carrier1Gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.95);
	carrier1Gain.gain.setValueAtTime(volume * 0.5, now + 1.4);
	carrier1Gain.gain.linearRampToValueAtTime(0, now + 1.5);
	carrier1.connect(carrier1Gain);
	carrier1Gain.connect(g);
	carrier1.start(now + 0.9);
	carrier1.stop(now + 1.55);

	// Phase 4: Digital noise handshake (1.5-2.5s)
	const noiseBuffer = c.createBuffer(1, c.sampleRate * 1, c.sampleRate);
	const noiseData = noiseBuffer.getChannelData(0);
	for (let i = 0; i < noiseData.length; i++) {
		// Pulsing noise pattern
		const pulse = Math.sin(i / (c.sampleRate / 100)) > 0 ? 1 : 0.3;
		noiseData[i] = (Math.random() * 2 - 1) * pulse;
	}
	const noise = c.createBufferSource();
	noise.buffer = noiseBuffer;
	const noiseFilter = c.createBiquadFilter();
	noiseFilter.type = "bandpass";
	noiseFilter.frequency.value = 2000;
	noiseFilter.Q.value = 5;
	const noiseGain = c.createGain();
	noiseGain.gain.setValueAtTime(0, now + 1.5);
	noiseGain.gain.linearRampToValueAtTime(volume * 0.6, now + 1.6);
	noiseGain.gain.setValueAtTime(volume * 0.6, now + 2.4);
	noiseGain.gain.linearRampToValueAtTime(0, now + 2.5);
	noise.connect(noiseFilter);
	noiseFilter.connect(noiseGain);
	noiseGain.connect(g);
	noise.start(now + 1.5);
	noise.stop(now + 2.6);

	// Phase 5: Connection established beeps (2.5-2.8s)
	const beep1 = c.createOscillator();
	const beep2 = c.createOscillator();
	const beepGain = c.createGain();
	beep1.type = "sine";
	beep2.type = "sine";
	beep1.frequency.value = 1400;
	beep2.frequency.value = 1800;
	beepGain.gain.setValueAtTime(0, now + 2.5);
	beepGain.gain.linearRampToValueAtTime(volume * 0.3, now + 2.55);
	beepGain.gain.setValueAtTime(volume * 0.3, now + 2.7);
	beepGain.gain.linearRampToValueAtTime(0, now + 2.8);
	beep1.connect(beepGain);
	beep2.connect(beepGain);
	beepGain.connect(g);
	beep1.start(now + 2.5);
	beep2.start(now + 2.5);
	beep1.stop(now + 2.85);
	beep2.stop(now + 2.85);
}

/**
 * Short dial-up blip for quick transitions.
 */
export function dialUpBlip(volume = 0.2) {
	const c = getContext();
	const g = getGain();
	const now = c.currentTime;

	const osc1 = c.createOscillator();
	const osc2 = c.createOscillator();
	const oscGain = c.createGain();

	osc1.type = "sine";
	osc2.type = "sine";
	osc1.frequency.value = 1200;
	osc2.frequency.value = 2400;

	oscGain.gain.setValueAtTime(volume, now);
	oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

	osc1.connect(oscGain);
	osc2.connect(oscGain);
	oscGain.connect(g);
	osc1.start(now);
	osc2.start(now);
	osc1.stop(now + 0.2);
	osc2.stop(now + 0.2);
}

// Random drop types for variety
const dropTypes = [
	"airHorn",
	"laserZap",
	"rewindScratch",
	"impact",
	"dialUpBlip",
] as const;
type DropType = (typeof dropTypes)[number];

/**
 * Play a random DJ drop sound.
 */
export function randomDrop(volume = 0.3): DropType {
	const type =
		dropTypes[Math.floor(Math.random() * dropTypes.length)] ?? "airHorn";
	switch (type) {
		case "airHorn":
			airHorn(volume);
			break;
		case "laserZap":
			laserZap(volume);
			break;
		case "rewindScratch":
			rewindScratch(volume);
			break;
		case "impact":
			impact(volume);
			break;
		case "dialUpBlip":
			dialUpBlip(volume);
			break;
	}
	return type;
}

/**
 * Set the master volume for drops.
 */
export function setDropVolume(volume: number) {
	if (dropGain) {
		dropGain.gain.value = Math.max(0, Math.min(1, volume));
	}
}
