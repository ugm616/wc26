/* BPM_OS — synthesized terminal SFX (WebAudio, no external files).
   Why synth instead of Pixabay downloads? Zero licensing issues,
   zero extra GitHub weight, works offline, and square-wave bleeps
   fit the black/red CRT terminal better than recorded samples.
   All sounds unlock on first user click (browser autoplay policy). */
(function () {
  "use strict";

  const storeKey = "bpmos_sound";
  let ctx = null;
  let master = null;
  let enabled = true;
  try {
    const saved = localStorage.getItem(storeKey);
    if (saved === "off") enabled = false;
  } catch (e) { /* private mode */ }

  function ensureCtx() {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      return ctx;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
    return ctx;
  }

  function tone(freq, dur, type, vol, when, slideTo) {
    if (!enabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    try {
      const t0 = ac.currentTime + (when || 0);
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || "square";
      o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.5, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g);
      g.connect(master);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    } catch (e) { /* ignore */ }
  }

  function noise(dur, vol, when, highpass) {
    if (!enabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    try {
      const t0 = ac.currentTime + (when || 0);
      const len = Math.floor(ac.sampleRate * dur);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ac.createBufferSource();
      src.buffer = buf;
      const g = ac.createGain();
      g.gain.value = vol || 0.25;
      const f = ac.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = highpass || 800;
      src.connect(f);
      f.connect(g);
      g.connect(master);
      src.start(t0);
    } catch (e) { /* ignore */ }
  }

  const SFX = {
    get enabled() { return enabled; },
    unlock() { ensureCtx(); },
    toggle() {
      enabled = !enabled;
      try { localStorage.setItem(storeKey, enabled ? "on" : "off"); } catch (e) {}
      if (enabled) { ensureCtx(); SFX.click(); }
      return enabled;
    },
    click() { tone(760, 0.06, "square", 0.4); tone(1520, 0.03, "square", 0.15, 0.02); },
    hover() { tone(1250, 0.025, "square", 0.08); },
    type() { tone(380 + Math.random() * 320, 0.035, "square", 0.22); },
    bootStep(i) { tone(180 + i * 60, 0.09, "sawtooth", 0.3); },
    tick() { tone(1050, 0.045, "square", 0.3); },
    alert() {
      for (let i = 0; i < 3; i++) {
        tone(440, 0.12, "square", 0.4, i * 0.16);
        tone(880, 0.12, "square", 0.3, i * 0.16 + 0.06);
      }
      noise(0.4, 0.12, 0, 400);
    },
    granted() { tone(523, 0.12, "square", 0.4); tone(784, 0.18, "square", 0.4, 0.12); },
    denied() { tone(220, 0.2, "sawtooth", 0.4, 0, 110); },
    open() {
      tone(90, 0.35, "sawtooth", 0.35, 0, 900);
      noise(0.25, 0.2, 0, 1200);
      tone(1320, 0.06, "square", 0.2, 0.3);
    },
    close() {
      tone(900, 0.28, "sawtooth", 0.3, 0, 90);
      noise(0.2, 0.15, 0.05, 900);
    },
    enter() {
      tone(130, 0.4, "sawtooth", 0.35, 0, 520);
      tone(660, 0.12, "square", 0.3, 0.25);
      tone(990, 0.2, "square", 0.3, 0.37);
    },
    access() { tone(300 + Math.random() * 200, 0.05, "square", 0.15); }
  };

  window.BPM_SFX = SFX;
})();
