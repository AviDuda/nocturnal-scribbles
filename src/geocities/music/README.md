# Geocities Music Player

```
~*~*~*~ WELCOME TO THE MUSIC ZONE ~*~*~*~
      [ Best experienced at 2 AM ]
```

A procedural music generator that creates endless, unique tracks in the spirit of late-90s web nostalgia. The music adapts to page content, reacting to colors, emojis, and chaos levels.

You are visitor #000001. Please sign the guestbook.

## Features

### Page-Reactive Generation

Every track is unique. The generator reads your page like a webmaster reads their hit counter:

- **Content-aware**: Code blocks trigger digital vibes, blockquotes create reflective moods, long paragraphs shift toward ambient
- **Emoji-aware**: Raccoons bring lofi, fire emojis bring energy, spooky emojis go dark
- **Time-aware**: Late night gets chill and dark, weekends get party energy
- **Visual-aware**: Page colors, gradients, and chaos level (marquees, animations) all influence the mood

### Two-Axis Mood System

Genres live on a mood map. Page content, time of day, and visual properties shift where you land:

```
                BRIGHT
                   ↑
       Chiptune    |    Happycore
       MIDI        |    Trance
                   |
CHILL ←————————————●————————————→ ENERGY
                   |
       Ambient     |    Techno
       Vaporwave   |    Synthwave
       Lofi        |
                   ↓
                 DARK
```

### Genres

Nine distinct styles, each with unique synthesis:

| Genre | Tempo | Character |
|-------|-------|-----------|
| Chiptune | 120-160 | 8-bit arcade, square waves |
| Ambient | 60-90 | Floating pads, spacey delay |
| Synthwave | 100-120 | Neon nights, sawtooth leads |
| Lofi | 70-90 | Jazzy swing, warm filters |
| Techno | 125-140 | Machine precision, sidechain pump |
| Trance | 135-150 | Euphoric builds, big drops |
| MIDI | 100-140 | 90s homepage sound, dry and thin |
| Happycore | 160-180 | Maximum BPM, rave energy |
| Vaporwave | 60-80 | Slowed down, detuned, empty mall |

### Song Structures

```
[ UNDER CONSTRUCTION - 18 STRUCTURES AND COUNTING ]
```

Eighteen compositional forms including:

- **Verse-Chorus** - Classic pop structure
- **Build-Drop** - EDM tension and release
- **AABA** - Jazz standard form
- **Rave** - Multiple drops, high energy
- **Chill** - Laid back, no high energy
- **Epic** - Slow build to massive climax
- **Drone** - Long ambient evolution
- **12-Bar Blues** - Classic blues form
- Plus: Ambient, Through-Composed, Loop, Minimal, Rondo, Binary, Strophic, Medley, Double Drop, Breakdown-Heavy

### Melody Patterns

Sixteen distinct melodic approaches:

- **Riff** - Short repeating fragment
- **Sequence** - Motif at different pitches
- **Call and Response** - Phrase then answer
- **Pedal** - Melody over drone note
- **Counterpoint** - Two independent lines
- **Motif Development** - Theme with variations (inversion, augmentation)
- Plus: Free, Octave Jumps, Trill, Ostinato, Scale Run, Syncopated, Staccato, Chromatic Approach, Echo, Intervallic

### Rhythm

- **23 drum patterns**: basic, syncopated, house, techno, trap, dnb, jazz, latin, afrobeat, dubstep, drill, motorik, and more
- **4 rhythm variations**: normal, breakdown (stripped to kick), dropout (random silences), polyrhythm (cross-rhythms)
- **6 fill types**: snare rolls, tom fills, crashes, flams, ghost notes, buildups

### Tape vs Radio Mode

**Tape Mode** (Side A / Side B)
- Page-reactive music that adapts to what you're viewing
- Flip the tape for B-side: inverts the mood (chill lofi becomes energetic happycore)
- Each page gets its own unique mixtape

**Radio Mode**
- Tune into a station for the full DJ experience
- Station jingles, commercials, guestbook shoutouts, song dedications
- Station genre preferences override page detection
- Click radio again to cycle through stations

### Radio Stations

```
>>> TUNE IN TO THE INFORMATION SUPERHIGHWAY <<<
```

Twenty themed stations:

| Station | Frequency | Vibe |
|---------|-----------|------|
| RACCOON FM | 97.3 | Nocturnal beats (lofi, ambient, vaporwave) |
| GeoCities Radio | 95.6 | The World Wide Web (midi, chiptune) |
| RAVE.NET | 140.0 | Maximum BPM (happycore, trance, techno) |
| Aesthetic FM | 80.0 | It's all in your head (vaporwave, ambient) |
| Nocturnal Scribbles Radio | 3.33 | Late night thoughts |
| ELEVATOR.FM | 88.8 | Going up (vaporwave, ambient) |
| CONSTRUCTION ZONE | 110.1 | Hard hats required (techno, trance) |
| WEBRING RADIO | 99.9 | Previous, next, random (all genres) |
| MIDNIGHT.GOV | 0.00 | Numbers. Only numbers. (ambient) |
| PIXEL PARTY | 8.00 | Insert coin (chiptune, happycore) |
| Y2K PANIC FM | 19.99 | The countdown never ends (trance, techno) |
| PIRATE RADIO | ??? | Unauthorized broadcast |
| THE VOID | 0.01 | ... (ambient) |
| SHOPPING CHANNEL | 24.7 | Call now (vaporwave, midi) |
| TEST PATTERN | 00.0 | Please stand by (ambient) |
| HOLD MUSIC | 1.800 | Your call is important to us |
| ARCADE ZONE | 16.00 | Insert quarters (chiptune, happycore) |
| DARK.NET | 66.6 | We know your IP (techno, ambient) |
| CAFE.FM | 45.0 | Take your time (lofi) |
| DUMPSTER DIVE FM | 3.AM | We eat everything (all genres) |

Each station has unique DJs, jingles, and themed commercials for fictional 90s web products.

### Player Controls

- **Transport**: Play, pause, stop, prev/next
- **Seek**: Scrub through songs
- **Volume** and **Loop**
- **Genre Lock**: Stay in one genre
- **Automix**: Smooth transitions between songs
- **Mixer**: Mute individual tracks (melody, bass, drums, arp, pad)
- **Chaos Slider**: Affects detuning, timing variation, filter wobble, genre variety
- **Info Panel**: See current patterns and settings
- **Station List**: Browse and select stations

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/pause |
| N | Next track |
| L | Toggle loop |
| G | Lock/unlock genre |
| M | Toggle mixer |
| A | Toggle automix |
| I | Toggle info panel |
| S | Toggle station list |
| T | Tape mode (or flip tape) |
| R | Radio mode (or cycle stations) |
| Left/Right | Seek 5 seconds |

### Audio

- Sidechain compression (kick ducks other instruments)
- Genre-appropriate delay and filtering
- Filter sweeps on bass and transitions
- LFO wobble effects
- Swing timing (lofi gets jazzy, techno stays rigid)
- Vibrato on sustained notes

### Export

- **WAV**: Full quality audio (download time: 45 minutes on 56k)
- **MIDI**: Import into your DAW

### Visualizer

Real-time FFT spectrum analyzer reacts to the music.

## The Vibe

This isn't meant to sound professional. It's meant to sound like a MIDI file auto-playing on someone's Angelfire page in 1998, or the background music in a Flash game, or the soundtrack to browsing GeoCities at 2 AM when you should be sleeping.

Procedural, chaotic, nostalgic. Every refresh brings a new track. Every page sounds different.

```
*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    Thanks for visiting! Come back soon!
         [  PREV  |  RANDOM  |  NEXT  ]
*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
```

Welcome to the information superhighway. Please sign the guestbook.
