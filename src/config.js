// Frame sequence settings. Originals live in public/frames and are never renamed.
export const FRAME_DIR = '/frames';   // change this to move the frame folder
export const FRAME_COUNT = 270;       // ezgif-frame-001.jpg … ezgif-frame-270.jpg
// Actual scene boundary found in the supplied frames: frame 152 → 153 is the
// biggest visual cut (nail-tech scene ends, close-up scene begins).
export const SCENE1_FRAMES = 152;     // scene 1 = frames 001–152 (~9.5 s)
export const frameUrl = (n) => `${FRAME_DIR}/ezgif-frame-${String(n).padStart(3, '0')}.jpg`;