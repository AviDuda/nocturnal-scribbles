import { STEPS_PER_BAR } from "./data";
import type { Song } from "./types";

type ProgressCallback = (progress: number, status: string) => void;

// MIDI constants
const TICKS_PER_BEAT = 480;
const TICKS_PER_STEP = TICKS_PER_BEAT / 4; // 16th notes

// Convert note number (0 = C4) to MIDI note (60 = C4)
function toMidiNote(note: number): number {
	return note + 60;
}

// Write variable length quantity (VLQ) for MIDI
function writeVLQ(value: number): number[] {
	if (value < 0) value = 0;
	const bytes: number[] = [];
	bytes.unshift(value & 0x7f);
	value >>= 7;
	while (value > 0) {
		bytes.unshift((value & 0x7f) | 0x80);
		value >>= 7;
	}
	return bytes;
}

// Write a 16-bit big-endian value
function write16(value: number): number[] {
	return [(value >> 8) & 0xff, value & 0xff];
}

// Write a 32-bit big-endian value
function write32(value: number): number[] {
	return [
		(value >> 24) & 0xff,
		(value >> 16) & 0xff,
		(value >> 8) & 0xff,
		value & 0xff,
	];
}

type MidiEvent = {
	tick: number;
	data: number[];
};

// Create a MIDI track from events
function createTrack(events: MidiEvent[]): number[] {
	// Sort events by tick
	events.sort((a, b) => a.tick - b.tick);

	const trackData: number[] = [];
	let lastTick = 0;

	for (const event of events) {
		const delta = event.tick - lastTick;
		trackData.push(...writeVLQ(delta));
		trackData.push(...event.data);
		lastTick = event.tick;
	}

	// End of track
	trackData.push(0x00, 0xff, 0x2f, 0x00);

	// Track header
	const header = [
		0x4d,
		0x54,
		0x72,
		0x6b, // "MTrk"
		...write32(trackData.length),
	];

	return [...header, ...trackData];
}

// Note on event
function noteOn(channel: number, note: number, velocity: number): number[] {
	return [0x90 | (channel & 0x0f), note & 0x7f, velocity & 0x7f];
}

// Note off event
function noteOff(channel: number, note: number): number[] {
	return [0x80 | (channel & 0x0f), note & 0x7f, 0x00];
}

// Program change (instrument) event
function programChange(channel: number, program: number): number[] {
	return [0xc0 | (channel & 0x0f), program & 0x7f];
}

// Get appropriate MIDI program for each track type
function getProgram(
	trackType: "melody" | "bass" | "arp" | "pad" | "drums",
	genreName: string,
): number {
	// General MIDI programs
	const programs = {
		// Melody
		melody: {
			chiptune: 80, // Square lead
			ambient: 89, // Pad 2 (warm)
			synthwave: 81, // Sawtooth lead
			lofi: 4, // Electric piano
			techno: 81, // Sawtooth lead
			trance: 81, // Sawtooth lead
			midi: 80, // Square lead (authentic MIDI sound)
			happycore: 80, // Square lead
			vaporwave: 88, // Pad 1 (new age)
		},
		// Bass
		bass: {
			chiptune: 38, // Synth bass 1
			ambient: 39, // Synth bass 2
			synthwave: 38, // Synth bass 1
			lofi: 33, // Electric bass (finger)
			techno: 38, // Synth bass 1
			trance: 38, // Synth bass 1
			midi: 38, // Synth bass 1
			happycore: 38, // Synth bass 1
			vaporwave: 39, // Synth bass 2
		},
		// Arpeggio
		arp: {
			default: 81, // Sawtooth lead
		},
		// Pad
		pad: {
			default: 89, // Pad 2 (warm)
		},
		// Drums are on channel 10, no program needed
		drums: {
			default: 0,
		},
	};

	if (trackType === "melody") {
		return (
			programs.melody[genreName as keyof typeof programs.melody] ??
			programs.melody.synthwave
		);
	}
	if (trackType === "bass") {
		return (
			programs.bass[genreName as keyof typeof programs.bass] ??
			programs.bass.synthwave
		);
	}
	return 81;
}

// Drum map: our drum names to General MIDI drum notes
const drumMap: Record<string, number> = {
	kick: 36, // Bass Drum 1
	snare: 38, // Acoustic Snare
	hihat: 42, // Closed Hi-Hat
	hihatOpen: 46, // Open Hi-Hat
	tom: 45, // Low Tom
	crash: 49, // Crash Cymbal 1
	cowbell: 56, // Cowbell
	clap: 39, // Hand Clap
	ride: 51, // Ride Cymbal 1
	rimshot: 37, // Side Stick
	shaker: 70, // Maracas
	conga: 63, // Open Hi Conga
	bongo: 60, // Hi Bongo
	sub808: 36, // Bass Drum 1 (same as kick)
};

/**
 * Export a song to MIDI format.
 */
export async function exportSongToMIDI(
	song: Song,
	onProgress?: ProgressCallback,
): Promise<Blob> {
	onProgress?.(0, "Generating MIDI...");

	const microsecondsPerBeat = Math.round((60 / song.tempo) * 1000000);

	// Tempo track (track 0)
	const tempoTrack: MidiEvent[] = [
		// Track name
		{
			tick: 0,
			data: [
				0xff,
				0x03,
				song.trackName.length,
				...song.trackName.split("").map((c) => c.charCodeAt(0)),
			],
		},
		// Tempo
		{
			tick: 0,
			data: [
				0xff,
				0x51,
				0x03,
				(microsecondsPerBeat >> 16) & 0xff,
				(microsecondsPerBeat >> 8) & 0xff,
				microsecondsPerBeat & 0xff,
			],
		},
	];

	// Helper to create track name meta event
	const trackName = (name: string): MidiEvent => ({
		tick: 0,
		data: [
			0xff,
			0x03,
			name.length,
			...name.split("").map((c) => c.charCodeAt(0)),
		],
	});

	// Melody track (channel 0)
	const melodyEvents: MidiEvent[] = [
		trackName("Melody"),
		{ tick: 0, data: programChange(0, getProgram("melody", song.genre.name)) },
	];

	// Bass track (channel 1)
	const bassEvents: MidiEvent[] = [
		trackName("Bass"),
		{ tick: 0, data: programChange(1, getProgram("bass", song.genre.name)) },
	];

	// Arp track (channel 2)
	const arpEvents: MidiEvent[] = [
		trackName("Arpeggio"),
		{ tick: 0, data: programChange(2, getProgram("arp", song.genre.name)) },
	];

	// Pad track (channel 3)
	const padEvents: MidiEvent[] = [
		trackName("Pad"),
		{ tick: 0, data: programChange(3, getProgram("pad", song.genre.name)) },
	];

	// Drums track (channel 9 = MIDI channel 10)
	const drumEvents: MidiEvent[] = [trackName("Drums")];

	// Process all sections
	let currentStep = 0;
	const totalSections = song.structure.sections.length;

	for (let i = 0; i < totalSections; i++) {
		const section = song.structure.sections[i];
		if (!section) continue;

		const pattern = song.patterns.get(section.type);
		if (!pattern) continue;

		onProgress?.(
			0.1 + (i / totalSections) * 0.7,
			`Processing ${section.type}...`,
		);

		// Add melody notes
		for (const n of pattern.melody) {
			const tick = (currentStep + n.step) * TICKS_PER_STEP;
			const duration = Math.round(n.duration * TICKS_PER_STEP);
			const note = toMidiNote(n.note);
			const velocity = Math.round((n.velocity || 1) * 100);

			melodyEvents.push({ tick, data: noteOn(0, note, velocity) });
			melodyEvents.push({ tick: tick + duration, data: noteOff(0, note) });
		}

		// Add bass notes
		for (const n of pattern.bass) {
			const tick = (currentStep + n.step) * TICKS_PER_STEP;
			const duration = Math.round(n.duration * TICKS_PER_STEP);
			const note = toMidiNote(n.note);

			bassEvents.push({ tick, data: noteOn(1, note, 100) });
			bassEvents.push({ tick: tick + duration, data: noteOff(1, note) });
		}

		// Add arpeggio notes
		for (const n of pattern.arpeggio) {
			const tick = (currentStep + n.step) * TICKS_PER_STEP;
			const duration = Math.round(n.duration * TICKS_PER_STEP);
			const note = toMidiNote(n.note);

			arpEvents.push({ tick, data: noteOn(2, note, 80) });
			arpEvents.push({ tick: tick + duration, data: noteOff(2, note) });
		}

		// Add pad chords
		for (const p of pattern.pad) {
			const tick = (currentStep + p.step) * TICKS_PER_STEP;
			const duration = Math.round(p.duration * TICKS_PER_STEP);

			for (const noteNum of p.notes) {
				const note = toMidiNote(noteNum);
				padEvents.push({ tick, data: noteOn(3, note, 60) });
				padEvents.push({ tick: tick + duration, data: noteOff(3, note) });
			}
		}

		// Add drums (channel 9)
		for (const d of pattern.drums) {
			const tick = (currentStep + d.step) * TICKS_PER_STEP;
			const drumNote = drumMap[d.type] ?? 36;
			const velocity = Math.round((d.velocity || 1) * 100);

			drumEvents.push({ tick, data: noteOn(9, drumNote, velocity) });
			drumEvents.push({
				tick: tick + TICKS_PER_STEP / 2,
				data: noteOff(9, drumNote),
			});
		}

		currentStep += section.bars * STEPS_PER_BAR;
	}

	onProgress?.(0.85, "Building MIDI file...");

	// Create all tracks
	const tracks = [
		createTrack(tempoTrack),
		createTrack(melodyEvents),
		createTrack(bassEvents),
		createTrack(arpEvents),
		createTrack(padEvents),
		createTrack(drumEvents),
	];

	// MIDI file header
	const header = [
		0x4d,
		0x54,
		0x68,
		0x64, // "MThd"
		...write32(6), // Header length
		...write16(1), // Format 1 (multiple tracks)
		...write16(tracks.length), // Number of tracks
		...write16(TICKS_PER_BEAT), // Ticks per beat
	];

	// Combine all data
	const midiData = new Uint8Array([...header, ...tracks.flat()]);

	onProgress?.(1, "Done!");

	return new Blob([midiData], { type: "audio/midi" });
}

/**
 * Save a song as a MIDI file.
 */
export async function saveSongAsMIDI(
	song: Song,
	onProgress?: ProgressCallback,
): Promise<void> {
	const blob = await exportSongToMIDI(song, onProgress);

	// Create download link
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${song.trackName.replace(/[^a-zA-Z0-9_-]/g, "_")}.mid`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
