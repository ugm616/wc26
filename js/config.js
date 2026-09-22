/* ============================================================
   BPM_OS — EDIT THIS FILE TO GO LIVE
   ------------------------------------------------------------
   1. COUNTDOWN: set countdownTarget to your launch date/time.
      Use ISO format with timezone, e.g. "2026-12-31T23:59:59Z"
      or "2026-10-31T20:00:00-04:00". Countdown runs in the
      visitor's browser. When it hits zero, an [ ENTER ] button
      replaces the countdown.

   2. VIDEOS: direct .mp4 links (Cloudflare R2). Paste the full
      .mp4 URL into mp4Url for the intro + each chapter.
      No Google Drive — R2 only.

   3. CLOSING VIDEOS:
      All video popups close manually via the [X] button in the
      top-right of the modal — intro and chapters alike.
      No auto-close on video end.
   ============================================================ */

const WCFIN_CONFIG = {
  // ---- LAUNCH COUNTDOWN (EDIT THIS) ----
  countdownTarget: "2026-12-31T23:59:59Z",

  // Shown during the fake remote-login typing performance
  remoteUsername: "BULLETPROOF",
  remotePassword: "hunter26",

  // ---- INTRO / MAIN FILE (plays once before desktop) ----
  intro: {
    title: "WC26.VID",
    mp4Url: "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev/intro.mp4"
  },

  // ---- 6 CHAPTERS (top-left -> bottom-right) ----
  // Same R2 file for all 6 until per-chapter links arrive.
  chapters: [
    { name: "INTRODUCTION", mp4Url: "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev/intro.mp4" },
    { name: "CRUELLA",      mp4Url: "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev/intro.mp4" },
    { name: "MICAH",        mp4Url: "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev/intro.mp4" },
    { name: "VAGABOND",     mp4Url: "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev/intro.mp4" },
    { name: "HAYWOOD",      mp4Url: "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev/intro.mp4" },
    { name: "CONCLUSION",   mp4Url: "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev/intro.mp4" }
  ]
};
