/* WCFIN_OS — boot -> remote login -> file open -> desktop -> chapters */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const FALLBACK_DRIVE_ID = "1kWqoeuCto9GgYdZIpkwO6rv2lF5XMmCi";
  const FALLBACK_CHAPTERS = [
    { name: "INTRODUCTION", driveFileId: FALLBACK_DRIVE_ID, mp4Url: "" },
    { name: "CRUELLA", driveFileId: FALLBACK_DRIVE_ID, mp4Url: "" },
    { name: "MICAH", driveFileId: FALLBACK_DRIVE_ID, mp4Url: "" },
    { name: "VAGABOND", driveFileId: FALLBACK_DRIVE_ID, mp4Url: "" },
    { name: "HAYWOOD", driveFileId: FALLBACK_DRIVE_ID, mp4Url: "" },
    { name: "CONCLUSION", driveFileId: FALLBACK_DRIVE_ID, mp4Url: "" }
  ];
  const defaults = { countdownTarget: "", remoteUsername: "BULLETPROOF", remotePassword: "", intro: { title: "WC26.VID", driveFileId: FALLBACK_DRIVE_ID, mp4Url: "" }, chapters: FALLBACK_CHAPTERS };
  const cfg = Object.assign({}, defaults, window.WCFIN_CONFIG || {});
  cfg.intro = Object.assign({}, defaults.intro, (window.WCFIN_CONFIG && window.WCFIN_CONFIG.intro) || {});
  // Chapters: prefer config, but NEVER leave the grid empty — fall back
  // to the 6 placeholder chapters so the desktop always shows 6 screens.
  const cfgChapters = window.WCFIN_CONFIG && Array.isArray(window.WCFIN_CONFIG.chapters) ? window.WCFIN_CONFIG.chapters : [];
  cfg.chapters = cfgChapters.length ? cfgChapters : FALLBACK_CHAPTERS.slice();
  if (!window.WCFIN_CONFIG) {
    console.warn("[BPM_OS] js/config.js did not load — using 6 fallback placeholder chapters. Serve over http(s), not file://, and keep js/ next to index.html.");
  } else if (!cfgChapters.length) {
    console.warn("[BPM_OS] config.js has no chapters — using 6 fallback placeholders.");
  }

  // ---------- Drive URL helpers ----------
  function driveId(raw) {
    if (window.wcfinExtractDriveId) return window.wcfinExtractDriveId(raw);
    if (!raw) return "";
    const m = String(raw).match(/[-\w]{25,}/);
    return m ? m[0] : String(raw).trim();
  }
  function previewUrl(id) {
    return "https://drive.google.com/file/d/" + id + "/preview";
  }
  function directUrl(id) {
    return "https://drive.google.com/uc?export=download&id=" + id;
  }

  // ---------- Screens ----------
  const screens = {
    countdown: $("#screen-countdown"),
    boot: $("#screen-boot"),
    login: $("#screen-login"),
    access: $("#screen-access"),
    desktop: $("#screen-desktop"),
  };
  function show(name) {
    Object.entries(screens).forEach(([k, el]) => {
      if (!el) return;
      el.classList.toggle("active", k === name);
    });
    window.scrollTo(0, 0);
  }

  function flashFrame() {
    const f = $("#flash-frame");
    if (!f) return;
    f.classList.remove("hit");
    void f.offsetWidth;
    f.classList.add("hit");
  }

  const params = new URLSearchParams(location.search);

  // ---------- 1. COUNTDOWN ----------
  const cdDisplay = $("#countdown-display");
  const cdDate = $("#countdown-date");
  const cdWrap = $("#countdown-live");
  const cdExpired = $("#countdown-expired");
  const btnEnter = $("#btn-enter");

  function targetTime() {
    const t = Date.parse(cfg.countdownTarget);
    return isNaN(t) ? NaN : t;
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function sfx(name, arg) {
    try {
      const s = window.BPM_SFX;
      if (s && typeof s[name] === "function") s[name](arg);
    } catch (e) { /* audio never blocks flow */ }
  }

  let lastCdSec = -1;
  function renderCountdown() {
    const t = targetTime();
    if (cdDate) cdDate.textContent = "TARGET: " + (cfg.countdownTarget || "UNSET") + " // LOCAL TIME: " + new Date().toLocaleString();
    if (isNaN(t)) {
      // Invalid date -> allow entry immediately (owner hasn't set it yet)
      if (cdDisplay) cdDisplay.innerHTML = "00<span class='cd-sep'>:</span>00<span class='cd-sep'>:</span>00<span class='cd-sep'>:</span>00";
      revealEnter();
      return;
    }
    const diff = t - Date.now();
    if (diff <= 0) {
      if (cdDisplay) cdDisplay.innerHTML = "00<span class='cd-sep'>:</span>00<span class='cd-sep'>:</span>00<span class='cd-sep'>:</span>00";
      revealEnter();
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    if (cdDisplay) cdDisplay.innerHTML =
      pad(d) + "<span class='cd-sep'>:</span>" + pad(h) + "<span class='cd-sep'>:</span>" + pad(m) + "<span class='cd-sep'>:</span>" + pad(s);
    // Final-10-seconds terminal ticking
    const totalSec = Math.floor(diff / 1000);
    if (totalSec <= 10 && totalSec !== lastCdSec) {
      lastCdSec = totalSec;
      sfx("tick");
    }
  }
  let entered = false;
  function revealEnter() {
    if (entered) return;
    entered = true;
    if (cdWrap) cdWrap.style.display = "none";
    if (cdExpired) cdExpired.style.display = "block";
    flashFrame();
  }
  let cdTimer = setInterval(renderCountdown, 1000);
  renderCountdown();

  if (btnEnter) btnEnter.addEventListener("click", () => {
    sfx("unlock");
    sfx("enter");
    sfx("click");
    startBoot();
  });

  // Dev shortcuts (not advertised in UI): ?enter / ?boot / ?desktop
  if (params.has("desktop")) {
    clearInterval(cdTimer);
    buildDesktop();
    show("desktop");
  } else if (params.has("boot") || params.has("enter")) {
    clearInterval(cdTimer);
    startBoot();
  }

  // ---------- 2. BOOT ----------
  const bootLog = $("#boot-log");
  const bootFill = $("#boot-fill");
  const bootPct = $("#boot-pct");
  let booting = false;

  const BOOT_LINES = [
    "BPM_OS BIOS v6.1.6 — SECURE TERMINAL",
    "MEMORY CHECK ............ 640K OK",
    "RED BUS ................. ONLINE",
    "CRT LINK ................ SYNCED",
    "MOUNTING /dev/wc26 ...... OK",
    "LOADING BPM_OS ........",
  ];

  function startBoot() {
    if (booting) return;
    booting = true;
    clearInterval(cdTimer);
    flashFrame();
    show("boot");
    if (!bootLog) { startLogin(); return; }
    bootLog.innerHTML = "";
    let li = 0;
    function nextLine() {
      if (li < BOOT_LINES.length) {
        const div = document.createElement("div");
        const last = li === BOOT_LINES.length - 1;
        div.innerHTML = "<span class='dim'>&gt;</span> " + BOOT_LINES[li] + (last ? " <span class='cursor'></span>" : " <span class='ok'>[OK]</span>");
        bootLog.appendChild(div);
        sfx("bootStep", li);
        const pct = Math.round(((li + 1) / (BOOT_LINES.length + 1)) * 100);
        if (bootFill) bootFill.style.width = pct + "%";
        if (bootPct) bootPct.textContent = "LOADING " + pct + "%";
        li++;
        setTimeout(nextLine, 420 + Math.random() * 280);
      } else {
        if (bootFill) bootFill.style.width = "100%";
        if (bootPct) bootPct.textContent = "LOADING 100% — ACCESSING REMOTE LINK";
        setTimeout(startLogin, 600);
      }
    }
    nextLine();
  }

  // ---------- 3. REMOTE LOGIN HIJACK ----------
  const loginBox = $("#login-box");
  const loginStandby = $("#login-standby");
  const remoteFlash = $("#remote-flash");
  const loginForm = $("#login-form");
  const loginUser = $("#login-user");
  const loginPass = $("#login-pass");
  const loginStatus = $("#login-status");

  function typeInto(el, text, mask, done) {
    let i = 0;
    el.textContent = "";
    function tick() {
      if (i < text.length) {
        el.textContent += mask ? "*" : text[i];
        i++;
        sfx("type");
        setTimeout(tick, 70 + Math.random() * 160);
      } else if (done) done();
    }
    tick();
  }

  function startLogin() {
    show("login");
    flashFrame();
    if (!loginBox) { startAccess(); return; }
    // Phase 1: standby, visually frozen for 1s
    loginBox.classList.add("frozen");
    if (loginStandby) loginStandby.innerHTML = "STANDBY — AWAITING LOCAL LOGIN... <span class='cursor'></span>";
    if (remoteFlash) remoteFlash.classList.remove("show");
    if (loginForm) loginForm.style.display = "none";
    if (loginStatus) loginStatus.textContent = "";

    setTimeout(() => {
      // Phase 2: freeze breaks, remote user connects
      loginBox.classList.remove("frozen");
      if (loginStandby) loginStandby.textContent = "// SIGNAL INTERCEPTED //";
      if (remoteFlash) remoteFlash.classList.add("show");
      sfx("alert");
      flashFrame();
      const w = $("#modal-window");
      if (w) { w.classList.add("glitch-hit"); setTimeout(() => w.classList.remove("glitch-hit"), 500); }

      setTimeout(() => {
        // Phase 3: fields fill themselves like someone else is typing
        if (loginForm) loginForm.style.display = "block";
        if (loginStatus) loginStatus.textContent = "REMOTE INPUT DETECTED — WATCHING...";
        typeInto(loginUser, cfg.remoteUsername || "BULLETPROOF", false, () => {
          typeInto(loginPass, cfg.remotePassword || "********", true, () => {
            if (loginStatus) loginStatus.textContent = "AUTHENTICATING...";
            setTimeout(() => {
              if (loginStatus) loginStatus.textContent = "ACCESS GRANTED — WELCOME";
              sfx("granted");
              flashFrame();
              setTimeout(startAccess, 1100);
            }, 1200);
          });
        });
      }, 1400);
    }, 1000);
  }

  // ---------- 4. ACCESSING FILE ----------
  const accessFill = $("#access-fill");
  const accessPct = $("#access-pct");
  function startAccess() {
    show("access");
    flashFrame();
    let p = 0;
    function step() {
      p += 4 + Math.random() * 9;
      if (p >= 100) {
        p = 100;
        if (accessFill) accessFill.style.width = "100%";
        if (accessPct) accessPct.textContent = "FILE OPEN — LAUNCHING VIEWER";
        setTimeout(() => openIntro(), 500);
        return;
      }
      if (accessFill) accessFill.style.width = p + "%";
      if (accessPct) accessPct.textContent = "OPENING FILE... " + Math.floor(p) + "%";
      sfx("access");
      setTimeout(step, 120);
    }
    step();
  }

  // ---------- 5. MODAL PLAYER ----------
  const overlay = $("#modal-overlay");
  const mWindow = $("#modal-window");
  const mTitle = $("#modal-title");
  const mWrap = $("#modal-video-wrap");
  const mBoot = $("#modal-bootmsg");
  const mClose = $("#modal-close");
  const mNote = $("#modal-note");

  let isIntroOpen = false;
  let introDone = false;

  function clearMedia() {
    if (!mWrap) return;
    mWrap.querySelectorAll("video, iframe, .modal-scan").forEach((el) => el.remove());
  }

  function buildMedia(driveFileId, mp4Url) {
    const id = driveId(driveFileId) || FALLBACK_DRIVE_ID;
    if (mp4Url) {
      const v = document.createElement("video");
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.preload = "auto";
      v.src = mp4Url;
      v.style.filter = "none";
      // No auto-close: visitor closes manually via [X] (top-right).
      mWrap.appendChild(v);
      const scan = document.createElement("div");
      scan.className = "modal-scan";
      mWrap.appendChild(scan);
      return;
    }
    // Google Drive preview (only reliable way for Drive files).
    // Manual close only via [X] top-right — no auto-end.
    const f = document.createElement("iframe");
    f.src = previewUrl(id);
    f.allow = "autoplay; fullscreen; encrypted-media";
    f.allowFullscreen = true;
    f.title = "video player";
    // If Drive refuses to load (offline, blocked 3rd-party cookies,
    // file not shared as "Anyone with the link"), surface a hint
    // inside the modal instead of a black box.
    f.addEventListener("load", () => {
      // Preview iframes give no further signal; hide any stale boot text.
      if (mBoot) mBoot.classList.add("hidden");
    });
    mWrap.appendChild(f);
    const scan = document.createElement("div");
    scan.className = "modal-scan";
    mWrap.appendChild(scan);
    // Safety net: if the iframe never fires load (network/adblock),
    // show a hint after 8s but keep the frame (it may still appear).
    setTimeout(() => {
      try {
        if (overlay.classList.contains("open") && mWrap.contains(f) && !f.contentWindow) throw 0;
      } catch (e) {
        if (mBoot) { mBoot.classList.remove("hidden"); mBoot.textContent = "SIGNAL WEAK — CHECK CONNECTION OR DRIVE SHARING // [X] TO CLOSE"; }
      }
    }, 8000);
  }

  function openModal(opts) {
    // opts: { title, driveFileId, mp4Url, intro }
    // Close is manual only via [X] top-right — no auto-end.
    clearMedia();
    isIntroOpen = !!opts.intro;
    if (mTitle) mTitle.textContent = "▸ " + (opts.title || "WC26.VID");
    if (mBoot) { mBoot.classList.remove("hidden"); mBoot.textContent = "OPENING " + (opts.title || "FILE") + "..."; }
    if (mNote) mNote.textContent = "PLAYING IN COLOR // PRESS [X] TO CLOSE";
    overlay.classList.add("open");
    mWindow.classList.remove("closing");
    mWindow.classList.add("opening");
    sfx("open");
    flashFrame();
    // CRT pop, then load media (feels like a file opening)
    setTimeout(() => {
      mWindow.classList.remove("opening");
      mWindow.classList.add("glitch-hit");
      setTimeout(() => mWindow.classList.remove("glitch-hit"), 450);
      if (mBoot) mBoot.classList.add("hidden");
      buildMedia(opts.driveFileId, opts.mp4Url);
    }, 480);
  }

  function closeModal() {
    if (!overlay.classList.contains("open")) return;
    sfx("close");
    mWindow.classList.remove("opening");
    mWindow.classList.add("closing");
    flashFrame();
    setTimeout(() => {
      overlay.classList.remove("open");
      mWindow.classList.remove("closing");
      clearMedia();
      if (isIntroOpen && !introDone) {
        introDone = true;
        isIntroOpen = false;
        buildDesktop();
        show("desktop");
      }
      isIntroOpen = false;
    }, 340);
  }

  if (mClose) mClose.addEventListener("click", () => { sfx("click"); closeModal(); });
  if (overlay) overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function openIntro() {
    const intro = cfg.intro || {};
    openModal({
      title: intro.title || "WC26.VID",
      driveFileId: intro.driveFileId,
      mp4Url: intro.mp4Url,
      intro: true,
    });
  }

  // ---------- 6. DESKTOP ----------
  const grid = $("#chapter-grid");
  const clockEl = $("#desktop-clock");
  let desktopBuilt = false;

  function buildDesktop() {
    if (!grid) return;
    // Allow rebuild if a previous run left the grid empty (e.g. config
    // failed on first pass). Normal path still builds exactly once.
    if (desktopBuilt && grid.children.length) return;
    desktopBuilt = true;
    grid.innerHTML = "";
    const chapters = (cfg.chapters && cfg.chapters.length ? cfg.chapters : FALLBACK_CHAPTERS).slice(0, 6);
    chapters.forEach((ch, i) => {
      const id = driveId(ch.driveFileId) || FALLBACK_DRIVE_ID;
      const num = String(i + 1).padStart(2, "0");
      const tile = document.createElement("button");
      tile.className = "tile";
      tile.type = "button";
      tile.setAttribute("aria-label", "Play chapter " + ch.name);

      const screen = document.createElement("div");
      screen.className = "tile-screen";

      // Muted greyscale thumbnail.
      // Drive preview iframe is the reliable base layer (instant
      // placeholder, same video for all 6 until real links arrive).
      // If a real direct .mp4 is provided, layer a muted looping
      // <video> on top; if it fails it hides itself, revealing the
      // iframe underneath. Drive direct-download URLs are NOT used
      // as video src (they return HTML confirm pages = black tiles).
      const f = document.createElement("iframe");
      f.src = previewUrl(id);
      // Privacy-friendly + faster tiles: no autoplay param needed,
      // preview starts paused (muted in spirit — no sound).
      f.tabIndex = -1;
      f.setAttribute("aria-hidden", "true");
      f.setAttribute("loading", "lazy");
      screen.appendChild(f);
      if (ch.mp4Url) {
        const v = document.createElement("video");
        v.muted = true;
        v.loop = true;
        v.autoplay = true;
        v.playsInline = true;
        v.preload = "metadata";
        v.setAttribute("muted", "");
        v.src = ch.mp4Url;
        const tryPlay = () => { v.play && v.play().catch(() => {}); };
        v.addEventListener("canplay", tryPlay);
        v.addEventListener("error", () => v.remove());
        screen.appendChild(v);
        tryPlay();
      }

      const numEl = document.createElement("div");
      numEl.className = "tile-num";
      numEl.textContent = num;
      const recEl = document.createElement("div");
      recEl.className = "tile-rec";
      recEl.innerHTML = "<i></i>PREVIEW";
      const ntsc = document.createElement("div");
      ntsc.className = "tile-ntsc";
      const vign = document.createElement("div");
      vign.className = "tile-vign";
      screen.appendChild(numEl);
      screen.appendChild(recEl);
      screen.appendChild(ntsc);
      screen.appendChild(vign);

      const label = document.createElement("div");
      label.className = "tile-label";
      const nameSpan = document.createElement("span");
      nameSpan.textContent = num + " // " + ch.name;
      const playSpan = document.createElement("span");
      playSpan.className = "play";
      playSpan.textContent = "▶";
      label.appendChild(nameSpan);
      label.appendChild(playSpan);

      tile.appendChild(screen);
      tile.appendChild(label);
      tile.addEventListener("click", () => {
        sfx("unlock");
        sfx("click");
        openModal({
          title: ch.name + ".VID",
          driveFileId: ch.driveFileId,
          mp4Url: ch.mp4Url,
          intro: false,
        });
      });
      tile.addEventListener("mouseenter", () => sfx("hover"));
      grid.appendChild(tile);
    });
    startClock();
  }

  function startClock() {
    function tick() {
      if (clockEl) {
        const d = new Date();
        clockEl.textContent = "SYS.TIME " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // iOS/Safari: resume muted thumbnail playback on first touch
  document.addEventListener("touchstart", function resume() {
    document.querySelectorAll(".tile-screen video").forEach((v) => {
      v.play && v.play().catch(() => {});
    });
  }, { passive: true });

  // ---------- 7. SOUND TOGGLE ----------
  function paintSoundButtons() {
    const on = !(window.BPM_SFX && window.BPM_SFX.enabled === false);
    document.querySelectorAll("[data-sound-toggle]").forEach((b) => {
      b.textContent = on ? "[SOUND: ON]" : "[SOUND: OFF]";
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-sound-toggle]");
    if (!b) return;
    try {
      const s = window.BPM_SFX;
      if (s) { s.unlock(); s.toggle(); }
    } catch (err) { /* ignore */ }
    paintSoundButtons();
  });
  paintSoundButtons();
})();
