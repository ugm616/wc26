# BPM_OS // BPM

One-page cyberpunk OS terminal — black + red only, VT323 only.

Flow: **Countdown → [ENTER] → Boot → Remote-login hijack → "REMOTE USER ACCESSING FILE BPM.VID" → intro video modal → 6-chapter desktop → chapter modals.**

## Run locally

Any static server (required — don't open via `file://`, video + fonts need http):

```bash
cd wcfin
npx serve .
# or
python -m http.server 8000
```

Visit `http://localhost:8000`.

Test shortcuts (for you, not in UI):
- `?enter` — skip countdown
- `?desktop` — jump straight to desktop grid

## Go live (edit 1 file)

Edit **`js/config.js`**:

1. `countdownTarget` — your launch date, ISO format, e.g. `"2026-10-31T20:00:00-04:00"`.
2. `intro.mp4Url` + `chapters[].mp4Url` — full Cloudflare R2 `.mp4` URLs (one per chapter when ready).
3. Closing is always manual via [X]. Thumbnails are muted + greyscale, playback is color + sound.

Chapter order (top-left → bottom-right): INTRODUCTION, CRUELLA, MICAH, VAGABOND, HAYWOOD, CONCLUSION.

## Deploy to GitHub Pages

1. Create a repo, upload the contents of `wcfin/` to root (or keep in subfolder).
2. Repo **Settings → Pages → Deploy from branch**, branch `main`, folder `/ (root)` (or `/wcfin` if subfolder).
3. Live at `https://<user>.github.io/<repo>/`.

No build step. Fonts are self-hosted in `fonts/VT323/`. No trackers, no backend.

## Video notes (R2 only — no Drive)

- Upload each chapter to Cloudflare R2 as `.mp4` (H.264 + AAC) and paste the public URL into `mp4Url`.
- Thumbnails: muted + greyscale via CSS (`filter: grayscale(1)`), snug-fit via `object-fit: cover`.
- Modal playback is in full color with sound (user gesture = click, so autoplay with sound works).
- All popups (intro + chapters) close manually via the [X] button top-right. No auto-close.

## Sound (synthesized, no files)

All SFX are generated in `js/sound.js` via WebAudio — clicks, boot bleeps,
typing ticks, countdown ticks, remote-user alarm, access granted chime,
file-access static, and CRT open/close sweeps. No Pixabay downloads, no
licensing, no extra weight. Toggle with `[SOUND: ON/OFF]` (top bar / countdown).
Browsers require one click before audio starts, so sound unlocks on [ ENTER ].

## Troubleshooting: video shows an error instead of playing

Uploading to GitHub will NOT by itself fix a local error — same code runs in
both places. If the first modal says the signal is weak / file is missing:

1. Don't double-click `index.html` (`file://`). Serve it:
   `python -m http.server 8000` then open `http://localhost:8000`.
   Same for GitHub Pages — that part is already http(s), so fine.
2. Keep folder structure intact: `index.html` + `js/config.js` +
   `js/sound.js` + `js/app.js`. If `config.js` fails to load the player
   falls back to the built-in R2 link and logs a warning in DevTools console.
3. R2 bucket must allow public access (Public Development URL or custom
   domain) so the `.mp4` returns `video/mp4` to visitors.
4. Adblock / tracking prevention can block media — test in a clean window
   and check DevTools console → Network for blocked `.mp4` requests.
