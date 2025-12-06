import type { PlayableItem, Song, TransitionStyle } from "./types";

/** Events emitted by the music system */
export type MusicEvent =
	| { type: "songEnding"; song: Song; barsRemaining: number; beatTime: number }
	| { type: "songEnded"; song: Song }
	| {
			type: "transitionStart";
			from: PlayableItem | null;
			to: PlayableItem;
			style: TransitionStyle;
	  }
	| { type: "transitionComplete" }
	| { type: "itemStarted"; item: PlayableItem }
	| { type: "queueUpdated"; queue: PlayableItem[] }
	| { type: "breakStarted"; item: PlayableItem }
	| { type: "breakEnded"; item: PlayableItem; skipped: boolean }
	| { type: "interrupted" };

type Listener<T> = (event: T) => void;

/**
 * Simple typed event emitter for music system events.
 */
class MusicEventEmitter {
	private listeners: Map<MusicEvent["type"], Set<Listener<MusicEvent>>> =
		new Map();

	on<T extends MusicEvent["type"]>(
		type: T,
		listener: Listener<Extract<MusicEvent, { type: T }>>,
	): () => void {
		if (!this.listeners.has(type)) {
			this.listeners.set(type, new Set());
		}
		const set = this.listeners.get(type);
		set?.add(listener as Listener<MusicEvent>);

		// Return unsubscribe function
		return () => {
			set?.delete(listener as Listener<MusicEvent>);
		};
	}

	off<T extends MusicEvent["type"]>(
		type: T,
		listener: Listener<Extract<MusicEvent, { type: T }>>,
	): void {
		this.listeners.get(type)?.delete(listener as Listener<MusicEvent>);
	}

	emit<T extends MusicEvent>(event: T): void {
		const set = this.listeners.get(event.type);
		if (set) {
			for (const listener of set) {
				try {
					listener(event);
				} catch (e) {
					console.error(`Error in music event listener for ${event.type}:`, e);
				}
			}
		}
	}

	/** Remove all listeners */
	clear(): void {
		this.listeners.clear();
	}
}

/** Global music event emitter instance */
export const musicEvents = new MusicEventEmitter();
