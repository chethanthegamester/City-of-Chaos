# City of Chaos — Prototype 0.4

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
- Space: jump
- Click the game: capture the mouse for camera look
- Mouse: look around
- Escape: release the mouse

## Current limitations
- City graphics are intentionally back to the simple placeholder look. Prototype 0.4 focuses on a cleaner road grid, sidewalks, curbs, lane markings, and an initial crosswalk; detailed skyline art is postponed.
- Basic driving; full collision and pedestrian/traffic systems are not implemented. Character movement now has acceleration smoothing and a basic jump.
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
- [x] Add arrow-key support for movement and driving (reads both key codes and key values)
- [x] Remove the large on-screen controls panel
- [x] Add early dashed lane markings and raised curbs
- [x] Add smoother on-foot acceleration and a basic jump
- [ ] Verify keyboard controls in the user's browser
- [ ] Tune camera and vehicle handling from user feedback
- [ ] Add collision boundaries and road-aware movement
- [x] Replace irregular road strips with a consistent grid between building blocks
- [x] Align road-edge lines and dashed centre markings to the road surfaces
- [x] Add sidewalks, separated curbs, and a basic junction crossing
- [ ] Test road alignment and movement in the browser

### Stage 2 — Core movement and game systems
- [ ] Improved human physics: acceleration, braking, turning, jump/fall, grounded movement
- [ ] Character collision with sidewalks, curbs, buildings, and vehicles
- [ ] Improved character animations
- [ ] Better vehicle physics and collision
- [ ] Interactive map and destination markers
- [ ] Mission framework
- [ ] Save/load system
- [ ] Audio and settings

### Stage 3 — World building (postponed until roads and physics are solid)
- [ ] Detailed city graphics and skyline
- [ ] Add original districts and recognizable landmarks
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
- 0.2: Improved keyboard input handling, reduced HUD obstruction, added early dashed lane markings/curbs, and added smoother character movement plus jump.
- 0.3: Experimental skyline pass; postponed after user feedback.
- 0.4: Reverted the experimental skyline styling and rebuilt the road layout as a consistent grid with sidewalks, separated curbs, aligned lane markings, and a basic crosswalk. Browser testing is still pending.
