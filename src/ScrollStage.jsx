import { useEffect, useRef } from 'react';
import { FRAME_COUNT, SCENE1_FRAMES, frameUrl } from './config';
import { SCENE_TITLES } from './content';

// Pinned-scroll timeline (fraction of the pinned scroll distance):
//   0.00 – 0.50  scene 1 (frames 1–152)
//   0.50 – 0.60  page-turn: scene 1 folds away, scene 2 is revealed underneath
//   0.60 – 1.00  scene 2 (frames 153–270)
const T_FLIP_START = 0.5;
const T_FLIP_END = 0.6;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function ScrollStage() {
  const outerRef = useRef(null);
  const canvasA = useRef(null);   // scene 1 (top layer, folds away)
  const canvasB = useRef(null);   // scene 2 (underneath)
  const flipRef = useRef(null);
  const shadeRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const cA = canvasA.current;
    const cB = canvasB.current;
    let frameReq = 0;

    // Preload all frames once (they are small, 1280x720 JPGs).
    const frameImgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.onload = () => { img.ok = true; schedule(); };
      img.onerror = () => { img.ok = false; };
      img.src = frameUrl(i + 1);
      return img;
    });

    // Graceful fallback: if a frame is missing, use the nearest loaded one.
    const pick = (i) => {
      for (let d = 0; d < 12; d++) {
        const a = frameImgs[i - d];
        const b = frameImgs[i + d];
        if (a && a.ok) return a;
        if (b && b.ok) return b;
      }
      return null;
    };

    // Draw the full frame, fitted inside the canvas (no stretch, no crop).
    const drawTo = (canvas, img) => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!img) return;
      const s = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    const render = () => {
      frameReq = 0;
      const rect = outer.getBoundingClientRect();
      const range = outer.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / range);

      // Scene 1 index (0-based): frames 1 → 152
      const s1Last = SCENE1_FRAMES - 1;
      const idxA = p < T_FLIP_START ? Math.round((p / T_FLIP_START) * s1Last) : s1Last;

      // Scene 2 index (0-based): frames 153 → 270
      const s2First = SCENE1_FRAMES;
      const s2Last = FRAME_COUNT - 1;
      const idxB = p < T_FLIP_END
        ? s2First
        : s2First + Math.round(clamp((p - T_FLIP_END) / (1 - T_FLIP_END)) * (s2Last - s2First));

      drawTo(cA, pick(idxA));
      drawTo(cB, pick(idxB));

      // Page-turn: scene 1 rotates away from its left edge.
      const t = clamp((p - T_FLIP_START) / (T_FLIP_END - T_FLIP_START));
      const layer = flipRef.current;
      if (p >= T_FLIP_END) {
        layer.style.visibility = 'hidden';
      } else {
        layer.style.visibility = 'visible';
        layer.style.transform = `rotateY(${-90 * t}deg)`;
      }
      shadeRef.current.style.opacity = p >= T_FLIP_START && p < T_FLIP_END ? Math.sin(t * Math.PI) * 0.6 : 0;

      // Titles stay in sync with their scenes. Title 1 is fully visible through
      // scene 1 and fades out as the page turn begins. Title 2 fades in only
      // after the turn completes, so the two never show together.
      title1Ref.current.style.opacity = clamp(1 - (p - T_FLIP_START) / 0.04);
      const in2 = clamp((p - T_FLIP_END) / 0.08);
      title2Ref.current.style.opacity = in2;
      title2Ref.current.style.transform = `translateY(${(1 - in2) * 14}px)`;
    };

    const schedule = () => {
      if (!frameReq) frameReq = requestAnimationFrame(render);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      [cA, cB].forEach((c) => {
        const r = c.getBoundingClientRect();
        c.width = Math.max(1, Math.round(r.width * dpr));
        c.height = Math.max(1, Math.round(r.height * dpr));
      });
      schedule();
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameReq);
    };
  }, []);

  return (
    <section className="pin-outer" ref={outerRef} aria-label="Landing animation">
      <div className="pin-inner">
        <div className="stage">
          <div className="layer layer-b"><canvas ref={canvasB} /></div>
          <div className="layer layer-a" ref={flipRef}>
            <canvas ref={canvasA} />
            <div className="shade" ref={shadeRef} />
          </div>
          <div className="stage-title title-1" ref={title1Ref}>
            <p className="kicker">{SCENE_TITLES[0].kicker}</p>
            <h1>{SCENE_TITLES[0].title}</h1>
            <p className="quote">{SCENE_TITLES[0].quote}</p>
            <span className="scroll-cue">{SCENE_TITLES[0].cue}</span>
          </div>
          <div className="stage-title title-2" ref={title2Ref} style={{ opacity: 0 }}>
            <h1>{SCENE_TITLES[1].title}</h1>
            <p className="subtitle">{SCENE_TITLES[1].subtitle}</p>
            <p className="quote">{SCENE_TITLES[1].quote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}