/* ============================================================
   BPM_OS — EDIT THIS FILE TO GO LIVE
   ------------------------------------------------------------
   1. COUNTDOWN (GMT — one instant, worldwide):
      Write your launch time in GMT and every visitor unlocks at
      that same instant, whatever their timezone (UK Sat 17:00 GMT
      = Philippines Sun 01:00 — identical moment).
      Formats (all read as GMT):
        "2026-09-26T17:00:00Z" = Sat 26 Sep 2026, 5pm GMT (preferred)
        "2026-09-26 17:00"     = same thing (GMT assumed)
        "2026-09-26"           = that date, GMT midnight
      The page shows each visitor the GMT time AND their local
      equivalent, and the countdown math is pure epoch milliseconds
      so timezones cannot drift it.

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
