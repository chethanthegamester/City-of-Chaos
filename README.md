# City of Chaos — Prototype 0.1

An original browser-first 3D city exploration and driving prototype. This is an independent project and is not affiliated with Rockstar Games or GTA.

## Run it
Use a local web server because the game loads Three.js as a JavaScript module:
1. Open this repository in Visual Studio Code.
2. Install the Live Server extension.
3. Right-click `index.html` and choose **Open with Live Server**.

## Controls
- W / Up Arrow: move forward / accelerate
- S / Down Arrow: move backward / reverse
- A / Left Arrow: move left / steer left
- D / Right Arrow: move right / steer right
- Shift: run
- E: enter or exit the blue car (stand close)
- Click the game: capture the mouse for camera look
- Mouse: look around
- Escape: release the mouse

## Current limitations
- Procedural placeholder city geometry, not final art.
- Basic driving; full collision and pedestrian/traffic systems are not implemented.
- No missions, accounts, cloud saves, sound, or mobile touch controls yet.
- Three.js loads from a CDN, so an internet connection is required.

## Project feature tracker

### Stage 0 — Planning and setup
- [x] Original project concept and working title: City of Chaos
- [x] Browser-first approach selected
- [x] GitHub repository created and connected
- [x] Feature tracker established

### Stage 1 — First playable prototype (0.1)
- [x] 3D scene and camera
- [x] Procedurally generated city blocks and roads
- [x] Basic player character
- [x] Walking and running controls
- [x] Original drivable blue car
- [x] Enter / exit vehicle
- [x] Basic HUD and control instructions
- [ ] Verify locally in the user's browser
- [x] Correct forward/reverse and left/right control directions
- [x] Add arrow-key support for movement and driving
- [ ] Verify keyboard controls in the user's browser
- [ ] Tune camera and vehicle handling from user feedback
- [ ] Add collision boundaries and road-aware movement

### Stage 2 — Core game systems (planned)
- [ ] Improved character animations
- [ ] Better vehicle physics and collision
- [ ] Interactive map and destination markers
- [ ] Mission framework
- [ ] Save/load system
- [ ] Audio and settings

### Stage 3 — World building (planned)
- [ ] Distinct city districts
- [ ] Original buildings and landmarks
- [ ] Traffic and pedestrian simulation
- [ ] Weather and time-of-day system
- [ ] Interiors and activity locations

### Stage 4 — Online features (planned only if needed)
- [ ] Select a separate Supabase project
- [ ] Authentication
- [ ] Cloud saves with Row Level Security
- [ ] Player profiles and leaderboards

### Stage 5 — Release readiness
- [ ] Desktop browser testing
- [ ] Mobile browser controls and performance
- [ ] Accessibility and settings
- [ ] Privacy and legal pages if accounts/analytics are added
- [ ] itch.io browser release
- [ ] Final QA checklist

## Changelog
- 0.1: First prototype committed. Core scene, movement, car and HUD are implemented in code. Browser play-testing remains pending.
