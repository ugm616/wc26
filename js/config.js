/* ============================================================
   WCFIN_OS — EDIT THIS FILE TO GO LIVE
   ------------------------------------------------------------
   1. COUNTDOWN: set countdownTarget to your launch date/time.
      Use ISO format with timezone, e.g. "2026-12-31T23:59:59Z"
      or "2026-10-31T20:00:00-04:00". Countdown runs in the
      visitor's browser. When it hits zero, an [ ENTER ] button
      replaces the countdown.

   2. VIDEOS: all videos are Google Drive files. For each video,
      paste either the full preview link or just the File ID.

      Example link:
        https://drive.google.com/file/d/1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi/preview
      File ID is the part between /d/ and /preview:
        1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi

      You can paste the full link OR just the ID — both work.

    3. CLOSING VIDEOS:
      All video popups close manually via the [X] button in the
      top-right of the modal — intro and chapters alike.
      No auto-close on video end.

   4. DIRECT MP4 (optional future upgrade):
      If you ever host .mp4 files elsewhere, put the full .mp4 URL
      in mp4Url and the player will use a real <video> tag
      (true muted greyscale thumbnails). Closing is still manual
      via [X].
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
    // placeholder — same for all until you provide real links
    driveFileId: "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi",
    mp4Url: "" // optional direct .mp4 override
  },

  // ---- 6 CHAPTERS (top-left -> bottom-right) ----
  chapters: [
    { name: "INTRODUCTION", driveFileId: "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi", mp4Url: "" },
    { name: "CRUELLA",      driveFileId: "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi", mp4Url: "" },
    { name: "MICAH",        driveFileId: "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi", mp4Url: "" },
    { name: "VAGABOND",     driveFileId: "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi", mp4Url: "" },
    { name: "HAYWOOD",      driveFileId: "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi", mp4Url: "" },
    { name: "CONCLUSION",   driveFileId: "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi", mp4Url: "" }
  ]
};

/* Accepts a full Drive URL or a bare ID, returns the bare ID */
function wcfinExtractDriveId(input) {
  if (!input) return "";
  const m = String(input).match(/[-\w]{25,}/);
  return m ? m[0] : String(input).trim();
}
