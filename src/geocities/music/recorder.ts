import { STEPS_PER_BAR } from "./data";
import type { Song } from "./types";

const T = window.ThemeUtils;

type ProgressCallback = (progress: number, status: string) => void;

// Yield to main thread to keep UI responsive
function yieldToMain(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Render a song to an audio buffer using OfflineAudioContext.
 * Uses chunked processing to avoid blocking the main thread.
 */
export async function renderSongToBuffer(
	song: Song,
	onProgress?: ProgressCallback,
): Promise<AudioBuffer> {
	// Full quality: 44100 Hz stereo (CD quality)
	const sampleRate = 44100;
	const numChannels = 2;
	const secondsPerStep = 60 / song.tempo / 4;
	const totalSteps = song.totalBars * STEPS_PER_BAR;
	const duration = totalSteps * secondsPerStep + 1; // +1 for tail

	onProgress?.(0, "Creating audio context...");
	await yieldToMain();

	const ctx = new OfflineAudioContext(
		numChannels,
		sampleRate * duration,
		sampleRate,
	);

	// Create effects chain
	const masterGain = ctx.createGain();
	masterGain.gain.value = 1;

	const effectsGain = ctx.createGain();
	effectsGain.gain.value = 0.5;

	const delayNode = ctx.createDelay(0.5);
	delayNode.delayTime.value = 60 / song.tempo / 2;

	const delayFeedback = ctx.createGain();
	delayFeedback.gain.value = song.delayAmount;

	const filterNode = ctx.createBiquadFilter();
	filterNode.type = "lowpass";
	filterNode.frequency.value = song.filterCutoff;
	filterNode.Q.value = 0.5;

	// Connect effects
	masterGain.connect(filterNode);
	filterNode.connect(effectsGain);
	filterNode.connect(delayNode);
	delayNode.connect(delayFeedback);
	delayFeedback.connect(delayNode);
	delayNode.connect(effectsGain);
	effectsGain.connect(ctx.destination);

	// Helper functions for synthesis
	function noteToFreq(note: number) {
		return 261.63 * 2 ** (note / 12);
	}

	function scheduleNote(
		freq: number,
		startTime: number,
		duration: number,
		type: OscillatorType,
		volume: number,
	) {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, startTime);

		gain.gain.setValueAtTime(0, startTime);
		gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
		gain.gain.setValueAtTime(volume * 0.8, startTime + duration * 0.3);
		gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

		osc.connect(gain);
		gain.connect(masterGain);
		osc.start(startTime);
		osc.stop(startTime + duration + 0.1);
	}

	function scheduleBass(freq: number, startTime: number, duration: number) {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		const filter = ctx.createBiquadFilter();

		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(freq, startTime);

		filter.type = "lowpass";
		filter.frequency.setValueAtTime(2000, startTime);
		filter.frequency.exponentialRampToValueAtTime(
			200,
			startTime + duration * 0.8,
		);
		filter.Q.value = 2;

		gain.gain.setValueAtTime(0, startTime);
		gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

		osc.connect(filter);
		filter.connect(gain);
		gain.connect(masterGain);
		osc.start(startTime);
		osc.stop(startTime + duration + 0.1);
	}

	function schedulePad(notes: number[], startTime: number, duration: number) {
		for (const note of notes) {
			const freq = noteToFreq(note);
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, startTime);

			const attackTime = Math.min(0.5, duration * 0.2);
			gain.gain.setValueAtTime(0, startTime);
			gain.gain.linearRampToValueAtTime(0.04, startTime + attackTime);
			gain.gain.setValueAtTime(0.04, startTime + duration * 0.7);
			gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

			osc.connect(gain);
			gain.connect(masterGain);
			osc.start(startTime);
			osc.stop(startTime + duration + 0.2);
		}
	}

	function scheduleDrum(
		type: string,
		startTime: number,
		velocity: number,
		pitch: number | null,
	) {
		if (type === "kick") {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(150, startTime);
			osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.1);
			gain.gain.setValueAtTime(0.5 * velocity, startTime);
			gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
			osc.connect(gain);
			gain.connect(masterGain);
			osc.start(startTime);
			osc.stop(startTime + 0.25);
		} else if (type === "snare") {
			const osc = ctx.createOscillator();
			const oscGain = ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(180, startTime);
			osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.05);
			oscGain.gain.setValueAtTime(0.2 * velocity, startTime);
			oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
			osc.connect(oscGain);
			oscGain.connect(masterGain);
			osc.start(startTime);
			osc.stop(startTime + 0.1);

			// Noise
			const bufferSize = sampleRate * 0.15;
			const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				data[i] = Math.random() * 2 - 1;
			}
			const noise = ctx.createBufferSource();
			noise.buffer = buffer;
			const noiseGain = ctx.createGain();
			const filter = ctx.createBiquadFilter();
			filter.type = "highpass";
			filter.frequency.value = 1500;
			noiseGain.gain.setValueAtTime(0.25 * velocity, startTime);
			noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
			noise.connect(filter);
			filter.connect(noiseGain);
			noiseGain.connect(masterGain);
			noise.start(startTime);
			noise.stop(startTime + 0.15);
		} else if (type === "hihat" || type === "hihatOpen") {
			const isOpen = type === "hihatOpen";
			const dur = isOpen ? 0.2 : 0.05;
			const bufferSize = sampleRate * dur;
			const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				data[i] = Math.random() * 2 - 1;
			}
			const noise = ctx.createBufferSource();
			noise.buffer = buffer;
			const noiseGain = ctx.createGain();
			const filter = ctx.createBiquadFilter();
			filter.type = "highpass";
			filter.frequency.value = isOpen ? 7000 : 9000;
			noiseGain.gain.setValueAtTime(0.08 * velocity, startTime);
			noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
			noise.connect(filter);
			filter.connect(noiseGain);
			noiseGain.connect(masterGain);
			noise.start(startTime);
			noise.stop(startTime + dur);
		} else if (type === "tom") {
			const freq = pitch || 150;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, startTime);
			osc.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + 0.15);
			gain.gain.setValueAtTime(0.3 * velocity, startTime);
			gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
			osc.connect(gain);
			gain.connect(masterGain);
			osc.start(startTime);
			osc.stop(startTime + 0.2);
		} else if (type === "crash") {
			const bufferSize = sampleRate * 0.8;
			const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				data[i] = Math.random() * 2 - 1;
			}
			const noise = ctx.createBufferSource();
			noise.buffer = buffer;
			const noiseGain = ctx.createGain();
			const filter = ctx.createBiquadFilter();
			filter.type = "highpass";
			filter.frequency.value = 5000;
			noiseGain.gain.setValueAtTime(0.15, startTime);
			noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
			noise.connect(filter);
			filter.connect(noiseGain);
			noiseGain.connect(masterGain);
			noise.start(startTime);
			noise.stop(startTime + 0.8);
		} else if (type === "cowbell") {
			// 808-style cowbell
			const osc1 = ctx.createOscillator();
			const osc2 = ctx.createOscillator();
			const gain = ctx.createGain();
			const filter = ctx.createBiquadFilter();

			osc1.type = "square";
			osc2.type = "square";
			osc1.frequency.setValueAtTime(800, startTime);
			osc2.frequency.setValueAtTime(540, startTime);

			filter.type = "bandpass";
			filter.frequency.value = 800;
			filter.Q.value = 3;

			gain.gain.setValueAtTime(0.3 * velocity, startTime);
			gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

			osc1.connect(filter);
			osc2.connect(filter);
			filter.connect(gain);
			gain.connect(masterGain);

			osc1.start(startTime);
			osc2.start(startTime);
			osc1.stop(startTime + 0.08);
			osc2.stop(startTime + 0.08);
		} else if (type === "clap") {
			// Layered noise for clap
			const numLayers = 4;
			for (let layer = 0; layer < numLayers; layer++) {
				const delay = layer * 0.01;
				const bufferSize = sampleRate * 0.1;
				const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
				const data = buffer.getChannelData(0);
				for (let i = 0; i < bufferSize; i++) {
					data[i] = Math.random() * 2 - 1;
				}
				const noise = ctx.createBufferSource();
				noise.buffer = buffer;
				const noiseGain = ctx.createGain();
				const filter = ctx.createBiquadFilter();
				filter.type = "bandpass";
				filter.frequency.value = 1500 + Math.random() * 500;
				filter.Q.value = 1;

				const layerVol = (0.15 * velocity) / numLayers;
				noiseGain.gain.setValueAtTime(layerVol, startTime + delay);
				noiseGain.gain.exponentialRampToValueAtTime(
					0.001,
					startTime + delay + 0.08,
				);

				noise.connect(filter);
				filter.connect(noiseGain);
				noiseGain.connect(masterGain);
				noise.start(startTime + delay);
				noise.stop(startTime + delay + 0.1);
			}
		}
	}

	// Schedule all sections with progress updates
	let currentTime = 0;
	const totalSections = song.structure.sections.length;

	for (let i = 0; i < totalSections; i++) {
		const section = song.structure.sections[i];
		if (!section) continue;

		const pattern = song.patterns.get(section.type);
		if (!pattern) continue;

		onProgress?.(
			0.1 + (i / totalSections) * 0.6,
			`Scheduling ${section.type}...`,
		);
		await yieldToMain();

		const sectionSteps = section.bars * STEPS_PER_BAR;

		// Schedule all notes in this pattern
		for (const n of pattern.melody) {
			const noteTime = currentTime + n.step * secondsPerStep;
			scheduleNote(
				noteToFreq(n.note),
				noteTime,
				n.duration * secondsPerStep,
				T.pick(song.genre.oscTypes.melody),
				0.1 * (n.velocity || 1),
			);
		}

		for (const n of pattern.bass) {
			const noteTime = currentTime + n.step * secondsPerStep;
			scheduleBass(noteToFreq(n.note), noteTime, n.duration * secondsPerStep);
		}

		for (const n of pattern.arpeggio) {
			const noteTime = currentTime + n.step * secondsPerStep;
			scheduleNote(
				noteToFreq(n.note),
				noteTime,
				n.duration * secondsPerStep,
				"triangle",
				0.05,
			);
		}

		for (const p of pattern.pad) {
			const noteTime = currentTime + p.step * secondsPerStep;
			schedulePad(p.notes, noteTime, p.duration * secondsPerStep);
		}

		for (const d of pattern.drums) {
			const noteTime = currentTime + d.step * secondsPerStep;
			scheduleDrum(d.type, noteTime, d.velocity || 1, d.pitch ?? null);
		}

		currentTime += sectionSteps * secondsPerStep;
	}

	onProgress?.(0.75, "Rendering audio...");
	await yieldToMain();

	// Render
	const buffer = await ctx.startRendering();

	onProgress?.(0.95, "Encoding WAV...");
	await yieldToMain();

	return buffer;
}

/**
 * Encode an AudioBuffer to WAV format.
 */
function encodeWAV(buffer: AudioBuffer): Blob {
	const numChannels = buffer.numberOfChannels;
	const sampleRate = buffer.sampleRate;
	const format = 1; // PCM
	const bitDepth = 16;

	const bytesPerSample = bitDepth / 8;
	const blockAlign = numChannels * bytesPerSample;
	const byteRate = sampleRate * blockAlign;
	const dataSize = buffer.length * blockAlign;
	const headerSize = 44;
	const totalSize = headerSize + dataSize;

	const arrayBuffer = new ArrayBuffer(totalSize);
	const view = new DataView(arrayBuffer);

	// Write WAV header
	const writeString = (offset: number, str: string) => {
		for (let i = 0; i < str.length; i++) {
			view.setUint8(offset + i, str.charCodeAt(i));
		}
	};

	writeString(0, "RIFF");
	view.setUint32(4, totalSize - 8, true);
	writeString(8, "WAVE");
	writeString(12, "fmt ");
	view.setUint32(16, 16, true); // fmt chunk size
	view.setUint16(20, format, true);
	view.setUint16(22, numChannels, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, byteRate, true);
	view.setUint16(32, blockAlign, true);
	view.setUint16(34, bitDepth, true);
	writeString(36, "data");
	view.setUint32(40, dataSize, true);

	// Interleave channels and write samples
	const channels: Float32Array[] = [];
	for (let i = 0; i < numChannels; i++) {
		channels.push(buffer.getChannelData(i));
	}

	let offset = 44;
	for (let i = 0; i < buffer.length; i++) {
		for (let ch = 0; ch < numChannels; ch++) {
			const sample = Math.max(-1, Math.min(1, channels[ch]?.[i] ?? 0));
			const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
			view.setInt16(offset, intSample, true);
			offset += 2;
		}
	}

	return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Save a song to a WAV file.
 */
export async function saveSongAsWAV(
	song: Song,
	onProgress?: ProgressCallback,
): Promise<void> {
	const buffer = await renderSongToBuffer(song, onProgress);
	const blob = encodeWAV(buffer);

	onProgress?.(1, "Downloading...");
	await yieldToMain();

	// Create download link
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	const safeName = song.trackName.replace(/[^a-zA-Z0-9_-]/g, "_");
	const suffix = `[${song.genre.name}_${song.structure.name.replace(/ /g, "_").toLowerCase()}]`;
	a.download = `${safeName}_${suffix}.wav`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
