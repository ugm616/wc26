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

   2. VIDEOS: direct .mp4 links (Cloudflare R2).
      intro.mp4Url = full film. chapters[].mp4Url = one per chapter.
      Each video has an optional backupMp4Url — a second copy in the
      bucket (convention: backup/000.mp4…). If the primary errors,
      the player retries the backup once automatically before
      giving SIGNAL LOST.

   3. THUMBNAILS: still images (Cloudflare R2), e.g. 001.png.
      chapters[].thumbUrl = one PNG per chapter. Images are drawn
      once to a tiny pixelated canvas — near-zero bandwidth.
      If a PNG is missing, the tile falls back to a muted video
      preview so the grid never looks broken.

   4. CLOSING VIDEOS:
      All video popups close manually via the [X] button in the
      top-right of the modal — intro and chapters alike.
      No auto-close on video end.
   ============================================================ */

const R2 = "https://pub-472b1ae435af4460ab024c0b2a8f1365.r2.dev";

const WCFIN_CONFIG = {
  // ---- LAUNCH COUNTDOWN (EDIT THIS) ----
  countdownTarget: "2026-12-31T23:59:59Z",

  // Shown during the fake remote-login typing performance
  remoteUsername: "BULLETPROOF",
  remotePassword: "hunter26",

  // ---- FULL FILM (plays once before desktop + via PLAY FULL FILM) ----
  // Primary = H.264/faststart (plays everywhere incl. iPhone).
  // Backup = AV1 originals (desktop Chrome).
  intro: {
    title: "BPM.VID",
    mp4Url: R2 + "/backup/000.mp4",
    backupMp4Url: R2 + "/000.mp4"
  },

  // ---- 6 CHAPTERS (top-left -> bottom-right) ----
  // Primaries = H.264, backups = AV1 originals,
  // thumbnails in the repo's images/ folder.
  chapters: [
    { name: "INTRODUCTION", mp4Url: R2 + "/backup/001.mp4", backupMp4Url: R2 + "/001.mp4", thumbUrl: "images/001.png" },
    { name: "CRUELLA",      mp4Url: R2 + "/backup/002.mp4", backupMp4Url: R2 + "/002.mp4", thumbUrl: "images/002.png" },
    { name: "MICAH",        mp4Url: R2 + "/backup/003.mp4", backupMp4Url: R2 + "/backup/003.mp4", thumbUrl: "images/003.png" },
    { name: "VAGABOND",     mp4Url: R2 + "/backup/004.mp4", backupMp4Url: R2 + "/backup/004.mp4", thumbUrl: "images/004.png" },
    { name: "HAYWOOD",      mp4Url: R2 + "/backup/005.mp4", backupMp4Url: R2 + "/backup/005.mp4", thumbUrl: "images/005.png" },
    { name: "CONCLUSION",   mp4Url: R2 + "/backup/006.mp4", backupMp4Url: R2 + "/backup/006.mp4", thumbUrl: "images/006.png" }
  ]
};
