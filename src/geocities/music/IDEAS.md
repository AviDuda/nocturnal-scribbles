# Music Player Ideas

Future enhancements, wild experiments, and feature dreams.

**No user tracking.** No storing visits, play counts, listening history, or any persistent user data. Session-only state is fine. Time-based features use the clock, not stored timestamps. If a feature requires remembering users across sessions, don't build it.

---

## Architecture & Core Concepts

### Debug/Power User Features (Hidden)

Decomposed toggles for advanced users:
- Source: Page / Station / Random / Time
- DJ: On / Off
- Commercials: On / Off
- Genre Lock: Auto / Locked / Chaos

### Future: Tune-In Dial

Physical dial UI to tune between stations. Static between frequencies. Signal clarifies as you approach a station. Very tactile.

---

## Generation Modes

Beyond tape mode (page-reactive) and radio mode (station-based), additional modes for specific use cases.

### Scene Presets

Pre-configured generation for common contexts:

| Scene | Energy | Brightness | Character |
|-------|--------|------------|-----------|
| Menu | -0.3 | +0.2 | Inviting, loopable, not distracting |
| Gameplay | +0.3 | 0 | Engaging but sustainable for long sessions |
| Tension | +0.4 | -0.6 | Building unease, sparse, unsettling |
| Victory | +0.6 | +0.7 | Triumphant, bright, celebratory |
| Defeat | -0.5 | -0.5 | Somber, deflated, reflective |
| Ambient Background | -0.7 | -0.1 | Atmospheric, unobtrusive, endless |

### Emotion Targeting

Direct mood selection bypassing page analysis:

| Emotion | Energy | Brightness | Notes |
|---------|--------|------------|-------|
| Anxious | +0.2 | -0.4 | Restless, unstable rhythms, minor keys |
| Nostalgic | -0.4 | +0.1 | Warm but melancholic, vintage processing |
| Melancholic | -0.5 | -0.3 | Slow, sparse, minor, lots of reverb |
| Manic | +0.8 | +0.3 | Fast, chaotic, genre-hopping |
| Peaceful | -0.6 | +0.3 | Gentle, major keys, soft timbres |
| Dread | -0.2 | -0.8 | Slow builds, dissonance, dark |
| Lonely | -0.4 | -0.2 | Sparse, single voices, space |
| Hopeful | +0.1 | +0.5 | Building energy, major progressions |

### Loop-Ready Exports

Generate tracks designed for seamless looping:

- **Bar counts:** 4, 8, 16, 32 bars (user selectable)
- **Duration targets:** 15s, 30s, 1min, 2min
- **Loop point markers:** Metadata for DAW import
- **Intro/outro options:** With or without, for flexibility
- **Seamless mode:** End matches beginning for perfect loops

### Transition Stingers

Short musical hits for scene changes:

- **Victory sting:** 2-4 second triumphant hit
- **Defeat sting:** 2-4 second somber hit
- **Discovery sting:** Curious, rising
- **Alert sting:** Attention-grabbing
- **Transition whoosh:** Swoosh between scenes
- **UI confirm/cancel:** Short feedback sounds

### Emotional Arcs

Music that evolves over a defined duration:

- **Build:** Starts sparse, adds layers, crescendos
- **Decay:** Starts full, strips away, fades
- **Wave:** Builds and releases in cycles
- **Shift:** Gradual mood transformation (e.g., hopeful → dread)
- **Arc duration:** User-defined (30s to 5min)

### Parameter Locking

Control what stays constant vs. what varies:

- **Lock tempo:** Keep BPM, change everything else
- **Lock genre:** Stay in genre, vary song
- **Lock mood:** Keep energy/brightness, vary genre
- **Lock key:** Same musical key, different songs
- **Lock structure:** Same form, different content

### Extended Duration Tracks

Currently tracks are 1-3 minutes. Options for longer generation:

- **Duration targets:** 5 min, 10 min, 15 min, 30 min
- **Section variety:** More section types, less repetition over time
- **Development:** Themes introduced early, developed/transformed later
- **Dynamic arrangement:** Instruments enter/exit more gradually
- **Key changes:** Modulation to related keys for freshness

Needs work on structure generation to stay interesting over longer durations.

### Endless / Drift Mode

Continuous generation without song boundaries. Music slowly morphs over time:

- **No endings:** Stream runs indefinitely until stopped
- **Parameter drift:** Tempo, key, energy slowly shift over minutes/hours
- **Genre blending:** Gradually transitions between genres (lofi → ambient → vaporwave)
- **Seamless evolution:** No abrupt changes, everything crossfades organically
- **Drift speed control:** How fast parameters change (glacial → noticeable)

Different from automix (discrete songs with crossfades). This is one continuous piece that becomes something else over time. Like generative ambient for long sessions.

Could have presets:
- **Study drift:** Stays in chill zone, very slow changes
- **Journey drift:** Explores full mood space over hours
- **Night drift:** Follows time of day (energetic evening → ambient late night → gentle morning)

---

## Session Workflow

Features for working with generated music (session-only, no persistence across visits).

### Favorites

- **Star current track:** Save to session favorites list
- **Favorites panel:** Review starred tracks
- **Re-generate from favorite:** Recreate using saved seed
- **Export all favorites:** Batch download

### Another Take

- **Regenerate similar:** New song, same parameters
- **Variation slider:** How different should the new take be (0% = nearly identical, 100% = just the locked params)
- **A/B comparison:** Toggle between current and previous

### Quick Export

WAV and MIDI export already exist. See [Export Improvements](#export-improvements) for format ideas.

Workflow improvements:

- **One-click export:** Download what's playing without opening menus
- **Export from favorites:** Batch download all starred tracks
- **Auto-filename:** Use generated track name as filename

---

## New Genres

Genres that fit the 90s web aesthetic and are achievable with oscillator synthesis:

| Genre | Energy | Brightness | Character |
|-------|--------|------------|-----------|
| Rock/Metal | +0.7 | -0.5 | Distorted power chords, palm mutes, big snare |
| Drum & Bass | +0.8 | -0.4 | Fast breaks (170 BPM), heavy sub |
| Trip-Hop | -0.6 | -0.5 | Slow breaks, moody, Portishead vibes |
| Eurodance | +0.7 | +0.5 | 90s club, very synthy |
| Industrial | +0.8 | -0.8 | Aggressive, noisy, NIN territory |
| Gabber | +1.0 | -0.7 | Distorted kicks, 180+ BPM, maximum chaos |
| Ska-Punk | +0.6 | +0.4 | Offbeat stabs, brass-like synths |
| Acid | +0.5 | -0.3 | 303 squelch, resonant filter sweeps |

### Rock/Metal Specifics

- Power chord voicings (root + fifth + octave)
- Palm-muted chugging (16th notes, short envelope + LP filter)
- Drop-D tuning feel with low root notes
- Gated reverb snare (very 90s)
- Structure: verse-chorus with breakdowns

### Acid Specifics

- 303-style bass: saw + resonant filter with envelope
- Filter accent on certain steps
- Classic acid patterns: 16th note sequences with rests

---

## Sound Design

### New Tracks / Layers

- **Texture/Atmosphere Layer** - Ambient background sounds:
  - Rain/nature for ambient genre
  - Crowd atmosphere for rave structures
  - Tape warble for vaporwave (beyond just detuning)
  - Room tone / air

- **Lead/Hook Synth** - Separate from melody track:
  - Higher octave, brighter timbre for drops
  - Distinct hook patterns during high-energy sections
  - Currently melody does everything

### New Instruments

- **Vocoder Chords** - Robot voice pad sounds

### Synthesis Enhancements

**Synthesis Types:**
- **FM Synthesis** - Metallic, bell-like tones (DX7 style)
- **Additive Synthesis** - Build sounds from individual sine harmonics
- **Physical Modeling** - Karplus-Strong plucked strings, blown tubes, struck objects
- **Wavetable** - Morph between waveforms over time
- **Vector Synthesis** - Joystick-style morphing between 4 waveforms
- **Phase Distortion** - Casio CZ-style waveshaping
- **Granular Synthesis** - Clouds of tiny sound grains
- **Supersaw** - Dedicated multiple detuned sawtooth stack (not just detune parameter)

**Oscillator Features:**
- **Hard Sync** - Slave oscillator reset by master (aggressive timbres)
- **Sub Oscillator** - Octave-down layer for bass weight
- **Noise Types** - Pink, brown, blue noise (not just white)
- **Wavefolding** - Fold waveforms back on themselves (West Coast style)
- **Wave Morphing** - Smooth interpolation between wave shapes
- **Ring Modulation** - Multiply two oscillators for metallic tones
- **Formant Oscillator** - Vowel-like tones built into the oscillator

**Filter Types:**
- **State Variable Filter** - Morphable LP/HP/BP/Notch
- **Ladder Filter** - Moog-style resonant lowpass
- **Comb Filter** - Metallic resonances, Karplus-Strong basis
- **Formant Filter** - Vowel shaping (a-e-i-o-u)
- **Filter FM** - Audio-rate filter modulation for aggression
- **Parallel/Serial Filters** - Multiple filter routing options
- **Self-oscillating Filter** - Filter as a sound source

**Modulation Sources:**
- **Multiple LFOs** - More than one modulation source
- **Step Sequencer Mod** - Rhythmic parameter automation
- **Sample & Hold** - Random stepped modulation
- **Envelope Follower** - React to audio dynamics
- **Mod Matrix** - Flexible source-to-destination routing
- **Audio-rate Modulation** - Oscillators modulating parameters
- **Chaos/Random** - Lorenz attractor, noise-based modulation

**Envelope Enhancements:**
- **Multi-stage Envelopes** - DAHDSR or more complex shapes
- **Looping Envelopes** - Repeat for rhythmic effects
- **Curve Controls** - Exponential, logarithmic, S-curve options
- **Per-stage Curves** - Different curve per ADSR segment
- **Envelope Retrigger Modes** - Reset behavior options

**Voice Architecture:**
- **True Polyphony** - Independent voice management
- **Unison Modes** - Stack voices with spread
- **Legato Modes** - Mono with held envelope
- **Chord Memory** - Play chords from single notes
- **Voice Stealing Modes** - How to handle voice overflow
- **MPE Support** - Per-note expression (pitch bend, pressure)

**Tuning & Pitch:**
- **Microtuning** - Non-12TET scales (quarter tones, etc.)
- **Just Intonation** - Pure harmonic ratios
- **Scala File Support** - Load custom tunings
- **Pitch Drift** - Analog-style tuning instability
- **Octave Stretching** - Piano-style inharmonicity

**Special:**
- **Feedback Loops** - Route output back to input
- **Cross-modulation** - Oscillators modulating each other
- **Bit Manipulation** - Bitwise XOR, AND on waveforms
- **Circuit Bending** - Intentional glitches and errors
- **Analog Modeling** - Component-level simulation (caps, resistors)
- **DC Offset Control** - For asymmetric waveforms

### Effects

**Modulation:**
- **Flanger** - Jet-like swooshing via short modulated delay
- **Phaser** - Sweeping notch filters for movement
- **Tremolo** - Volume LFO modulation (classic synth effect)
- **Auto-pan** - Stereo position modulation
- **Ring Modulation** - Metallic, atonal textures
- **Rotary/Leslie** - Spinning speaker simulation (great for pads)

**Distortion:**
- **Overdrive** - Warm tube-style saturation
- **Distortion** - Harder clipping for edge
- **Fuzz** - Extreme square-wave clipping
- **Tape Saturation** - Warm analog compression and harmonics
- **Waveshaper** - Custom distortion curves
- **Exciter/Enhancer** - Add high-frequency harmonics for presence

**Dynamics:**
- **Compressor** - Glue the mix together, add punch
- **Limiter** - Prevent clipping on master output
- **Multiband Compressor** - Different compression per frequency band
- **Gate/Noise Gate** - Cut audio below threshold
- **Transient Shaper** - Control attack/sustain independently
- **Ducker** - More sophisticated sidechain compression

**Frequency:**
- **Parametric EQ** - Per-genre frequency shaping
- **Graphic EQ** - Visual frequency bands
- **Wah** - Swept resonant bandpass filter
- **Formant Filter** - Vowel-like sounds (a-e-i-o-u)
- **Comb Filter** - Metallic resonances
- **Tilt EQ** - Simple bright/dark control

**Delay:**
- **Ping Pong Delay** - Stereo bouncing delay
- **Tape Delay** - Warped delay with wow/flutter degradation
- **Multi-tap Delay** - Multiple delay taps at different times
- **Ducking Delay** - Delay that quiets when input is present
- **Reverse Delay** - Backwards echoes

**Reverb Variants:**
- **Shimmer Reverb** - Pitch-shifted reverb tails (ethereal)
- **Gated Reverb** - 80s style abrupt cutoff
- **Spring Reverb** - Twangy, lo-fi character
- **Plate Reverb** - Dense, smooth tails
- **Reverse Reverb** - Swells into notes

**Pitch:**
- **Pitch Shifter** - Octave up/down layers
- **Harmonizer** - Add harmony notes at intervals
- **Octaver** - Dedicated octave up/down
- **Detune** - Slight pitch offset for thickness

**Spectral/Experimental:**
- **Granular** - Glitchy, stuttery textures from audio grains
- **Spectral Freeze** - Sustain a moment indefinitely
- **Vocoder** - Robot voice synthesis
- **Convolution** - Use any sound as reverb impulse
- **Spectral Delay** - Different delays per frequency
- **Frequency Shifter** - Shift frequencies (not pitch) for weird effects

### Lo-Fi Treatments

- **Dusty EQ** - Roll off highs, boost low-mids
- **Record Skip** - Occasional loop/stutter glitch

---

## Musical Content

### Melody Patterns (Future)

- **Question/Answer Phrasing** - Musical punctuation (more sophisticated than current call/response)
- **Metric Modulation** - Tempo feels like it changes
- **Rubato** - Expressive timing freedom

### Pattern Differentiation Problem

**Current issue:** All melody patterns use the same note selection logic, making them sound similar despite different structures.

**What's the same across all patterns:**
- Melodic intervals: `[-2, -1, -1, 0, 1, 1, 2]` stepwise motion everywhere
- Rhythm values: `[0.5, 1, 1, 1.5]` - same three durations
- Chord tones: `[0, 2, 4]` - same choices in every pattern

**Fix: Give each pattern type distinct vocabulary:**

| Pattern | Intervals | Rhythm | Contour |
|---------|-----------|--------|---------|
| Riff | Bigger leaps, exact repetition | Short, punchy, consistent | Angular |
| Call/Response | Steps + leaps | Long → short, short → long | Question ends high, answer ends low |
| Sequence | Strict transposition | Identical each repeat | Ascending or descending |
| Ostinato | Very narrow (1-2 notes) | Mechanical, exact | Flat |
| Pedal | Wide around drone | Flowing, rubato-like | Circular |
| Trance | Rising 4ths/5ths | Dotted rhythms | Uplifting arc |
| Lofi | Chromatic approaches | Swing, behind-beat | Lazy, meandering |
| Chiptune | Octave jumps | Fast arpeggios | Bouncy |

**Same issue exists in bass patterns** - all use similar root/fifth movement regardless of pattern type.

**Priority:** High impact, relatively contained change - differentiate the interval/rhythm pools per pattern type.

### Drum Patterns (Future)

- **Blast Beats** - Very fast alternating kick/snare (metal)
- **Ghost Notes** - Quiet snare hits between main beats (funk/groove)

---

## Radio & DJ Features

### Sound Effects Library

Triggered between songs or on section changes:

- **Dial-up Modem** - Synthesize the 56k handshake sequence
- **ICQ "Uh Oh"** - Incoming message sound
- **AOL "You've Got Mail"** - Classic notification
- **Windows Startup** - The Microsoft boot chime
- **Windows Error** - Ding! Critical stop!
- **AIM Door Open/Close** - Buddy sign on/off
- **Fax Machine** - Beeps and screeches
- **Keyboard Typing** - Mechanical clatter
- **Mouse Click** - UI feedback sound
- **Cash Register** - Ka-ching!

### DJ Drops

Short vocal samples for drops and transitions:

- **"REWIND!"** - With scratch effect
- **"SELECTA!"** - Dancehall style
- **"BIG UP!"** - Shoutout energy
- **Air Horn** - The classic party horn
- **Laser Zap** - Pew pew pew
- **Record Scratch** - Wicka wicka
- **Explosion** - For drops
- **Crowd Cheer** - "YEAH!"
- **Siren** - Police/ambulance
- **Gunshot** - Dancehall reload

### Station Content

- **Weather Report** - "Packet loss on the I-56k, expect delays"
- **Traffic Update** - "Heavy congestion on the backbone router"
- **News Headlines** - "Scientists discover new animated GIF format"
- **Horoscope** - "Aquarius: Today you will encounter a 404 error"
- **Call-In Segment** - Pre-recorded "callers" with questions
- **Contest Announcements** - "Be caller 56 to win a free web counter!"
- **PSAs** - "Remember to defrag your hard drive"

### Station Enhancements (Implemented stations need special features)

**PIRATE RADIO** - Needs audio glitch effects: signal cuts in/out, static bursts, frequency drift

**THE VOID** - Could use extra sparse/unsettling processing: longer silences, distant reverb, very low volume

### Time-Locked Stations

Some stations only broadcast at certain hours. Outside hours: static or "off air" message.

| Station | Hours | Vibe |
|---------|-------|------|
| MIDNIGHT.GOV | 12-5 AM | Numbers station, coded messages |
| TEST PATTERN | 4-6 AM | Liminal, end of broadcast day |
| HOLD MUSIC | 9 AM-5 PM | Business hours only |

*Note: Stations are implemented but time-locking is not yet active.*

---

## Player Features

### Visualizer Modes

- **Oscilloscope** - Waveform display
- **Spectrum Bars** - Current FFT but with style options
- **Circular Spectrum** - Bars arranged in a circle
- **Milkdrop-Style** - Reactive patterns and shapes
- **Matrix Rain** - Frequency data drives the rain speed
- **Fire** - Audio-reactive flames
- **Starfield** - Stars zoom speed tied to bass

### UI Enhancements

- **Equalizer** - 5-10 band EQ with visual sliders
- **Skin System** - Different visual themes (Winamp skins!)
- **Mini Mode** - Collapse to just a small bar
- **Playlist View** - See upcoming/past tracks
- **Album Art** - Procedurally generated artwork
- **Spectrum Background** - Visualizer behind the whole page
- **Now Playing Toast** - Notification when track changes

### Playback Features

- **Queue System** - Add songs to a playlist (session only)
- **Shuffle Station** - Random station each track
- **Gapless Playback** - No silence between songs
- **Speed Control** - Playback rate adjustment (nightcore mode at 1.25x)

### Song Persistence

- **Song Seed** - Generate a shareable code that recreates the exact song
- **Share URL** - Link format: `?track=xX_raccoon_vapor_C*~&seed=7a3f9b`
- **Export Presets** - Save genre/structure combinations as downloadable file

---

## Interactive Features

### Page Integration

- **Click to Trigger** - Click page elements to play sounds
- **Hover Sounds** - Mouse over elements triggers notes
- **Scroll DJ** - Scrolling scratches/modulates the music
- **Typing Percussion** - Keyboard becomes a drum pad
- **Cursor Theremin** - Mouse X/Y controls pitch and filter
- **Element Sonification** - Each DOM element type has a sound

### Reactive Behaviors

- **Visibility API** - Mute when tab not visible
- **Idle Detection** - Chill out to ambient when inactive
- **Scroll Position** - Section of page affects genre
- **Weather API** - Rain sounds when it's raining IRL
- **Battery Level** - Low battery = slowed down, sad

---

## Technical Improvements

### Audio Quality

- **Stereo** - Pan instruments left/right
- **Better Filters** - Resonant filters, different types
- **Oversampling** - Reduce aliasing on harsh waveforms
- **Dynamic Range** - Limiter on master output
- **Ducking Polish** - Smoother sidechain curves

### Per-Instrument Effects Routing

**Current problem:** All audio goes through one global reverb chain. Drums get reverbed even in genres where they should be dry (chiptune, techno).

**Current signal flow:**
```
All synths → effectsGain → chorusReverbChain → output
```

**Better approach - separate buses:**
```
Drums → drumBus (dry or minimal reverb) → output
Bass → bassBus (usually dry) → output
Melody/Pad/Arp → melodicBus → chorusReverbChain → output
```

**Options:**
1. **Full separation**: Three buses with independent effects chains
2. **Drums-only fix**: Drums bypass reverb, everything else uses current chain
3. **Per-genre drum reverb**: Add `drumReverbRange` to genre config, separate from melodic reverb

**Priority:** High for chiptune/techno/midi where reverbed drums sound obviously wrong. Those genres want that dry, punchy, machine-precise drum sound.

### Track Mute Delay Bug

**Problem:** Toggling instruments off doesn't take effect immediately - takes up to 15 seconds.

**Cause:** 15-second lookahead scheduling for background playback. Notes are pre-scheduled as Web Audio nodes. `setTrackMute()` only sets a flag checked when *new* notes are scheduled - already-scheduled nodes play regardless.

**Fix options:**
1. **Per-track gain nodes** - Route each track through its own GainNode, mute by setting gain to 0 (instant)
2. **Track scheduled nodes per-track** - Store node references by track type, stop them on mute
3. **Hybrid** - Use gain nodes for instant mute, but also stop scheduled nodes to free resources

Option 1 is cleanest - adds drums/bass/melody/pad/arp/fx gain nodes, mute controls gain instead of skipping scheduling.

### Performance

- **Web Worker** - Move audio scheduling off main thread
- **AudioWorklet** - Custom DSP in real-time
- **Lazy Loading** - Don't load music code until needed
- **Memory Management** - Clean up finished oscillators
- **Buffer Pooling** - Reuse audio buffers

### Export Improvements

- **MP3 Export** - Smaller files (need encoder library)
- **OGG Export** - Open format option
- **Stem Export** - Separate files per track
- **Loop Export** - Just the main loop, perfect for tiling
- **Ringtone Length** - 30-second export option

### CLI / API Design

For using the generator outside the browser (batch generation, game asset pipelines, scripting):

**Architecture goal:** Keep generation logic cleanly separated from browser-specific code (Web Audio API, DOM). Core generation should be pure functions that output note/timing data, with rendering as a separate layer.

**Potential CLI:**
```bash
npx nocturnal-music generate --emotion dread --duration 30 --loop --out track.wav
npx nocturnal-music batch --preset tense-ambient --count 10 --out ./assets/
npx nocturnal-music list-presets
```

**Programmatic API:**
```typescript
import { generate, render } from 'nocturnal-music';

const song = generate({
  emotion: 'dread',
  duration: 30,
  loop: true,
});

await render(song, { format: 'wav', output: 'track.wav' });
```

**Why this matters:** Games using non-JS tech (Godot, Unity, Love2D) can't embed the generator at runtime. But a CLI/API lets you generate assets during development and drop the files into any project.

**HTTP endpoint:**
```
GET /generate?emotion=dread&duration=30&loop=true&format=wav
→ Returns audio file
```

Could run as a local dev server or hosted service. Useful for non-JS projects that want on-demand generation during development.

**Game editor plugins:**

Integrate directly into game engines as editor extensions:
- **Godot plugin** - Generate and import audio from editor panel
- **Unity package** - Custom window for music generation
- **Love2D helper** - Lua script that calls local endpoint

Side benefit: Learning each editor's plugin system while building something useful.

**WASM build:**

Compile generator to WebAssembly for embedding in non-JS environments:
- Rust, Go, C++, etc. can load WASM modules
- Runtime generation in Godot, Unity, Love2D becomes possible
- Same generation logic, different host language

**Not a priority** - web tool with good export workflow covers most use cases. But keeping the code modular makes this possible later.

---

## Beyond Music

### Sound Effects Generation

Procedural SFX using similar synthesis approach:

- **UI sounds:** Clicks, hovers, confirms, cancels, errors
- **Footsteps:** Variations on surface types (wood, stone, grass)
- **Impacts:** Hits, explosions, thuds with energy scaling
- **Ambient loops:** Wind, rain, room tone, forest
- **Pickups/collectibles:** Satisfying chimes and swooshes

Royalty-free, infinite variations, no licensing headaches.

### Adaptive Music Sets

Generate variations of the same theme for dynamic game audio:

- **Calm / Medium / Intense** versions of one piece
- Same key, tempo, core motifs - different energy and density
- Compatible layers that can crossfade based on gameplay
- Export as stems for in-game mixing

Example: Generate a "dungeon theme" → get exploration layer, combat layer, boss layer that all work together.

### Visual Sync / Generative Visuals

Music generation already produces structured data (beats, sections, energy curves). Export this for visual sync:

- **Beat markers** - Drive particle bursts, screen shake, flash
- **Section changes** - Trigger color palette shifts, transitions
- **Energy curves** - Control intensity of visual effects over time
- **Frequency data** - Already have analyser, could export for offline use

Could pair with procedural visual generators. Another "learn a thing" angle (shaders, visual programming).

---

## Wild Ideas

### Multiplayer Radio

Would require server infrastructure, but could be fun someday:

- **Shared Station** - Everyone hears the same song (synced playback)
- **Request Line** - Users submit requests via form
- **Dedication Board** - Public dedications scroll by
- **Listener Count** - "1,337 listeners tuned in"

### AI Integration

- **LLM Lyrics** - Generate actual lyrics for the track
- **Style Transfer** - "Make this sound more like X"
- **Image to Music** - Convert page screenshots to sound

### Absurd Features

- **Physical CD Burn** - Pretend to burn a CD with progress bar
- **Floppy Disk Mode** - Fits in 1.44MB (very compressed)
- **Dial-Up Simulator** - Wait for "connection" before music
- **Buffer Wheel** - Fake loading spinner
- **Clip Art Radio** - Every track has clip art cover
- **MIDI Karaoke** - On-screen lyrics with bouncing ball
- **Web 1.0 Leaderboard** - High scores for chaos level
- **AOL Keyword** - "AOL Keyword: RACCOON"

---

## Easter Eggs

No user tracking required - all based on time, input, or page content.

### Keyboard/Input Triggers

- **Konami code** → Unlocks secret station
- **Type "raccoon"** → Instant lofi + raccoon DJ takeover
- **Type "chaos"** → Maximum chaos mode

### Time-Based

- **3:33 AM exactly** → Special broadcast
- **Friday 13th** → Spooky station override
- **New Year's midnight** → Celebration mode
- **4:04 AM** → "Station not found" glitch music

### Page-Based

- **404 page** → Glitched, broken music that's actually good
- **Page has "under construction"** → CONSTRUCTION ZONE station available
- **Page title contains "raccoon"** → Raccoon FM auto-tunes

### Interaction-Based (Session Only)

- **Flip tape 5 times in a row** → "Indecisive" audio easter egg
- **Max out chaos slider** → Brief audio freakout

---

## Priority Tiers

### Do Next (High Impact)
- Song seed for sharing/recreating tracks
- Favorites system (star tracks, review, regenerate from seed)
- Scene/emotion preset selector (menu, tension, peaceful, dread, etc.)
- Loop-ready export options (bar count, seamless mode)

### Do Eventually (Medium Impact)
- Extended duration tracks (5-30 min with more section variety)
- Endless/drift mode (continuous morphing stream)
- Stem export (separate drums/bass/melody files)
- Parameter locking UI (beyond just genre lock)
- Transition stingers (short hits for scene changes)

### Do Maybe (Fun but Effort)
- More visualizer modes
- Station special effects (PIRATE RADIO glitches, THE VOID processing)
- Time-locked stations
- Texture/atmosphere layer
- Skin system
- Weather/traffic reports
- Tune-in dial UI

### Do If Bored (Wild)
- Click-to-trigger sounds
- Album art generation
- Easter eggs (Konami code, time-based triggers)
- Multiplayer shared radio
- LLM-generated lyrics
- Physical CD burn animation
- Debug/power user decomposed toggles

---

**When implementing features:** Update [README.md](./README.md) with user-facing feature descriptions. The README is a non-technical feature overview, not dev docs.
