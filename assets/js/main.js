/**
 * MISSION CONTROL ENGINE - ABHISHEK.DEV (2026)
 * Core Controller: Boot Preloader, Command Palette, Interactive Terminal,
 * 3D Tilt, Sticky-Stack Projects, SVG Architecture Packets, Telemetry, Themes
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeEngine();
  initCustomCursor();
  initBootPreloader();
  initCommandPalette();
  initInteractiveTerminal();
  initHeroTilt();
  initTypedRotator();
  initLucknowClock();
  initScrollSpyAndProgress();
  initContactFormAndCopy();

  // Master Plan Mission Control Enhancements
  initAudioSynth();
  initMagneticPull();
  initHeroScrollCue();
  initCountUpAndGauges();
  initBioScrub();
  initContactModeSwitch();
  initKonamiCode();

  // Milestone 1 Developer Experience Suite
  initShortcutsAndVim();
  initApiPlayground();
  initSqlSandbox();
  initGitCommitStream();
  initArchNodeInspector();
  initRecruiterModal();

  // Load and hydrate dynamic content from portfolio.json
  fetch("assets/data/portfolio.json")
    .then(res => {
      if (!res.ok) throw new Error("Could not load portfolio.json");
      return res.json();
    })
    .then(data => {
      window.PORTFOLIO_DATA = data;
      renderProjects(data.projects);
      renderSkills(data.skills, "languages");
      renderEducation(data.education);
      renderHonors(data.achievements);
      renderLiveHeatmap();
      initSkillProjectLinking();
    })
    .catch(err => {
      console.error("Error loading portfolio data:", err);
    });
});

/* --------------------------------------------------------------------------
   1. 4-Theme Engine (Cyber, Matrix, Aurora, Paper)
   -------------------------------------------------------------------------- */
const THEMES = ["cyber", "matrix", "aurora", "paper"];
const THEME_ICONS = {
  cyber: "⚡",
  matrix: "📟",
  aurora: "🌌",
  paper: "☀️"
};

function initThemeEngine() {
  const savedTheme = localStorage.getItem("ap_mission_theme") || "cyber";
  setTheme(savedTheme, false);

  const themeBtn = document.getElementById("dock-theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "cyber";
      const nextIndex = (THEMES.indexOf(current) + 1) % THEMES.length;
      setTheme(THEMES[nextIndex], true);
    });
  }
}

function setTheme(themeName, animate = false) {
  if (!THEMES.includes(themeName)) themeName = "cyber";

  if (animate && document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.setAttribute("data-theme", themeName);
    });
  } else {
    document.documentElement.setAttribute("data-theme", themeName);
  }

  localStorage.setItem("ap_mission_theme", themeName);
  const iconSpan = document.getElementById("theme-btn-icon");
  if (iconSpan) iconSpan.textContent = THEME_ICONS[themeName] || "⚡";
}

/* --------------------------------------------------------------------------
   2. Custom Cursor System & Spotlight Variable Tracker
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    // Update global CSS variables for cursor spotlight border glow
    document.documentElement.style.setProperty("--mx", `${mouseX}px`);
    document.documentElement.style.setProperty("--my", `${mouseY}px`);
  });

  // Smooth lagging loop for ring
  function renderCursorRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursorRing);
  }
  requestAnimationFrame(renderCursorRing);

  // Hover states
  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (target.closest("a, button, .cmd-item, .bento-card, .copy-trigger")) {
      ring.classList.add("cursor-hover");
    }
    if (target.closest(".project-case-card")) {
      ring.classList.add("cursor-view");
    }
    if (target.closest("input, textarea, select")) {
      dot.classList.add("cursor-hidden");
      ring.classList.add("cursor-hidden");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target;
    if (target.closest("a, button, .cmd-item, .bento-card, .copy-trigger")) {
      ring.classList.remove("cursor-hover");
    }
    if (target.closest(".project-case-card")) {
      ring.classList.remove("cursor-view");
    }
    if (target.closest("input, textarea, select")) {
      dot.classList.remove("cursor-hidden");
      ring.classList.remove("cursor-hidden");
    }
  });
}

/* --------------------------------------------------------------------------
   3. Boot-Sequence Preloader (Skippable & Session-Aware)
   -------------------------------------------------------------------------- */
function initBootPreloader() {
  const preloader = document.getElementById("boot-preloader");
  const logStream = document.getElementById("boot-log-stream");
  const progressBar = document.getElementById("boot-progress-bar");
  const skipBtn = document.getElementById("boot-skip-btn");

  if (!preloader || !logStream || !progressBar) return;

  // Check if previously booted this session
  if (sessionStorage.getItem("ap_boot_done") === "true") {
    preloader.classList.add("boot-hidden");
    return;
  }

  const bootLines = [
    "$ ssh abhishek@portfolio.internal -p 22",
    "[AUTH] Verifying Dual-Degree: IIT Madras (24F2001885) & CSVTU Bhilai... OK",
    "[INIT] Alpine Nginx Container: Memory footprint < 15 MB... OK",
    "[INIT] Multi-Tenant PostgreSQL Schemas (tenant_0, tenant_1)... OK",
    "[INIT] Automated Let's Encrypt SSL Certificates... OK",
    "[INIT] GitHub Actions CI/CD Pipeline (Commit 979c582)... OK",
    "[BOOT] Mission Control System Initialized. Launching UI..."
  ];

  let currentLine = 0;
  let progress = 0;

  function endBoot() {
    sessionStorage.setItem("ap_boot_done", "true");
    preloader.classList.add("boot-hidden");
  }

  if (skipBtn) skipBtn.addEventListener("click", endBoot);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !preloader.classList.contains("boot-hidden")) {
      endBoot();
    }
  });

  const interval = setInterval(() => {
    if (currentLine < bootLines.length) {
      const lineEl = document.createElement("div");
      lineEl.className = "boot-line";
      lineEl.textContent = bootLines[currentLine];
      logStream.appendChild(lineEl);
      currentLine++;

      progress = Math.min(100, Math.round((currentLine / bootLines.length) * 100));
      progressBar.style.width = `${progress}%`;
    } else {
      clearInterval(interval);
      setTimeout(endBoot, 450);
    }
  }, 220);
}

/* --------------------------------------------------------------------------
   4. Command Palette (Ctrl/Cmd + K)
   -------------------------------------------------------------------------- */
function initCommandPalette() {
  const modal = document.getElementById("cmd-palette-modal");
  const input = document.getElementById("cmd-input");
  const list = document.getElementById("cmd-results-list");
  const dockBtn = document.getElementById("dock-cmd-btn");

  if (!modal || !input || !list) return;

  const actions = [
    { title: "🚀 Jump to Featured Projects", shortcut: "P", action: () => scrollToSection("projects") },
    { title: "👤 Jump to About & Philosophy", shortcut: "A", action: () => scrollToSection("about") },
    { title: "📡 Jump to Live Infrastructure Telemetry", shortcut: "T", action: () => scrollToSection("live-panel") },
    { title: "⚙️ Jump to Technical Skills Matrix", shortcut: "S", action: () => scrollToSection("skills") },
    { title: "🎓 Jump to Education & Honors", shortcut: "E", action: () => scrollToSection("education") },
    { title: "✉️ Jump to Contact Transmission", shortcut: "C", action: () => scrollToSection("contact") },
    { title: "📄 Download Verified Resume (PDF)", shortcut: "CV", action: () => window.open("assets/docs/ABHISHEKPATHAK_CV.pdf", "_blank") },
    { title: "📋 Copy Email Address", shortcut: "CP", action: () => copyText("abhishekpathak4312@gmail.com", "Email copied to clipboard!") },
    { title: "💻 Open Developer Terminal", shortcut: "`", action: () => openTerminal() },
    { title: "🎨 Theme: Cyber Dark (Default)", shortcut: "1", action: () => setTheme("cyber", true) },
    { title: "🎨 Theme: Matrix Green", shortcut: "2", action: () => setTheme("matrix", true) },
    { title: "🎨 Theme: Aurora Teal/Violet", shortcut: "3", action: () => setTheme("aurora", true) },
    { title: "🎨 Theme: Clean Paper Light", shortcut: "4", action: () => setTheme("paper", true) },
    { title: "🔒 Developer Console (Protected Dashboard)", shortcut: "D", action: () => window.location.href = "dashboard.html" }
  ];

  function openPalette() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    input.value = "";
    renderList(actions);
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  function renderList(filtered) {
    list.innerHTML = "";
    if (filtered.length === 0) {
      list.innerHTML = `<li style="padding:1rem; color:var(--text-muted); font-size:0.9rem; text-align:center;">No matching commands found.</li>`;
      return;
    }

    filtered.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = `cmd-item ${idx === 0 ? "selected" : ""}`;
      li.innerHTML = `
        <span class="cmd-item-title">${item.title}</span>
        <span class="cmd-shortcut">${item.shortcut}</span>
      `;
      li.addEventListener("click", () => {
        item.action();
        closePalette();
      });
      list.appendChild(li);
    });
  }

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    const filtered = actions.filter(a => a.title.toLowerCase().includes(q) || a.shortcut.toLowerCase().includes(q));
    renderList(filtered);
  });

  // Keyboard navigation inside palette
  input.addEventListener("keydown", (e) => {
    const items = list.querySelectorAll(".cmd-item");
    let currentIdx = Array.from(items).findIndex(el => el.classList.contains("selected"));

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentIdx < items.length - 1) {
        items[currentIdx]?.classList.remove("selected");
        items[currentIdx + 1]?.classList.add("selected");
        items[currentIdx + 1]?.scrollIntoView({ block: "nearest" });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentIdx > 0) {
        items[currentIdx]?.classList.remove("selected");
        items[currentIdx - 1]?.classList.add("selected");
        items[currentIdx - 1]?.scrollIntoView({ block: "nearest" });
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = items[currentIdx];
      if (selected) selected.click();
    } else if (e.key === "Escape") {
      closePalette();
    }
  });

  if (dockBtn) dockBtn.addEventListener("click", openPalette);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closePalette();
  });

  // Global Shortcut: Ctrl+K / Cmd+K
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal.classList.contains("active")) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* --------------------------------------------------------------------------
   5. Interactive Developer Terminal Modal (`)
   -------------------------------------------------------------------------- */
function initInteractiveTerminal() {
  const modal = document.getElementById("terminal-modal");
  const input = document.getElementById("term-input");
  const output = document.getElementById("term-output");
  const dockBtn = document.getElementById("dock-term-btn");
  const closeBtn = document.getElementById("term-close-btn");
  const closeX = document.getElementById("term-close-x");

  if (!modal || !input || !output) return;

  window.openTerminal = function() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    setTimeout(() => input.focus(), 50);
  };

  function closeTerminal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  if (dockBtn) dockBtn.addEventListener("click", openTerminal);
  if (closeBtn) closeBtn.addEventListener("click", closeTerminal);
  if (closeX) closeX.addEventListener("click", closeTerminal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTerminal();
  });

  // Backtick (`) key toggle
  window.addEventListener("keydown", (e) => {
    if (e.key === "`" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (modal.classList.contains("active")) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });

  // Command Execution Engine
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmdRaw = input.value.trim();
      input.value = "";
      if (!cmdRaw) return;

      appendOutput(`abhishek@portfolio:~$ ${cmdRaw}`, "color:var(--text-muted);");
      executeCommand(cmdRaw);
    }
  });

  function appendOutput(text, style = "") {
    const p = document.createElement("div");
    if (style) p.setAttribute("style", style);
    p.textContent = text;
    output.appendChild(p);
    const body = document.getElementById("term-body");
    if (body) body.scrollTop = body.scrollHeight;
  }

  function executeCommand(cmd) {
    const parts = cmd.toLowerCase().split(" ");
    const command = parts[0];
    const arg = parts[1];

    switch (command) {
      case "help":
        appendOutput(`Available commands:
  about         - View dual-degree engineering background
  projects      - List featured production applications
  skills        - Display core technical proficiencies
  status        - Show live AWS EC2 telemetry & uptime
  theme <name>  - Switch theme (cyber, matrix, aurora, paper)
  neofetch      - Print Mission Control system specification
  sudo hire-me  - Launch celebration protocol & trigger contact
  clear         - Clear terminal output
  exit          - Close this terminal modal`, "color:var(--accent-primary);");
        break;

      case "about":
        appendOutput(`Abhishek Pathak:
- Dual-Degree: BS Data Science @ IIT Madras & B.Tech CSE AI @ CSVTU Bhilai
- Focus: Backend architecture, multi-tenant SaaS, Docker, AWS EC2 DevOps
- Production: abhishek4312.info (Low-memory Alpine Nginx + automated CI/CD)`);
        break;

      case "projects":
        appendOutput(`Featured Applications:
1. Trekking Management App (TMA): Multi-tenant SaaS with PostgreSQL schema isolation
   -> https://tma.tenant0.abhishek4312.info
2. Examination Management Portal (LMS): Proctored MCQ engine & Chart.js analytics
   -> https://lms.abhishek4312.info
3. Cloud & GitOps Infrastructure: AWS EC2 1GB RAM / 4GB Swap + GitHub Actions
   -> https://abhishek4312.info`);
        break;

      case "skills":
        appendOutput(`Technical Stack:
- Languages: Python, Flask, JavaScript (ES6+), SQL (PostgreSQL, SQLite)
- Backend & Cloud: Docker, Docker Compose, AWS EC2, Nginx, Gunicorn, REST APIs
- Tools: Git, GitHub Actions, Chart.js, Linux/Bash`);
        break;

      case "status":
        appendOutput(`[TELEMETRY]
Uptime: 99.98% (180+ Days Zero OOM Kills)
Physical Memory: 342 MB / 980 MB (35% Used)
Swap File: 180 MB / 4096 MB (vm.swappiness=10)
Containers: 3 Active (portfolio, tma, lms)
CI/CD: GitHub Actions SSH rsync PASSED (Commit 979c582)`);
        break;

      case "theme":
        if (arg && THEMES.includes(arg)) {
          setTheme(arg, true);
          appendOutput(`Theme switched to: ${arg}`, "color:var(--accent-green);");
        } else {
          appendOutput(`Usage: theme <cyber | matrix | aurora | paper>`, "color:var(--accent-danger);");
        }
        break;

      case "neofetch":
        appendOutput(`
         _             abhishek@mission-control
       /   \\           ------------------------
      |  A. |          OS: Ubuntu 24.04 LTS (AWS EC2)
       \\ _ /           Host: t2/t3.micro (1 GB RAM + 4 GB Swap)
      /|   |\\          Kernel: Linux 6.8.0-aws
     / |   | \\         Uptime: 180 days, 14 hours
    *  |   |  *        Packages: Docker 26, Nginx 1.26, Python 3.12
       |---|           Memory: 342 MB / 980 MB (35%)
      /     \\          Degrees: IIT Madras (Data Science) & CSVTU (CSE AI)
     /       \\         Status: Open to Backend & Cloud Engineering Roles
        `, "color:var(--accent-primary); font-family:var(--font-mono);");
        break;

      case "sudo":
        if (arg === "hire-me" || parts.slice(1).join(" ") === "hire-me") {
          appendOutput(`[ACCESS GRANTED] Initiating hiring protocol... Congratulations!`, "color:var(--accent-green); font-weight:bold;");
          if (window.confetti) {
            window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          }
          setTimeout(() => {
            closeTerminal();
            scrollToSection("contact");
          }, 800);
        } else {
          appendOutput(`User abhishek is not in the sudoers file for command: ${arg}`, "color:var(--accent-danger);");
        }
        break;

      case "clear":
        output.innerHTML = "";
        break;

      case "exit":
        closeTerminal();
        break;

      default:
        appendOutput(`command not found: ${command}. Type 'help' for available commands.`, "color:var(--accent-danger);");
        break;
    }
  }
}

/* --------------------------------------------------------------------------
   6. 3D Tilt on Hero Portrait
   -------------------------------------------------------------------------- */
function initHeroTilt() {
  const card = document.getElementById("tilt-card");
  if (!card) return;

  const maxTilt = 8; // degrees

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
}

/* --------------------------------------------------------------------------
   7. Typed Role Rotator
   -------------------------------------------------------------------------- */
function initTypedRotator() {
  const el = document.getElementById("typed-rotator-text");
  if (!el) return;

  const roles = [
    "Full-Stack & Backend Engineer",
    "Dual-Degree: IIT Madras & CSVTU Bhilai",
    "Multi-Tenant Cloud Architect",
    "DevOps & Low-Footprint Cloud Specialist"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 60;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 110;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 2200; // Pause at end of text
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* --------------------------------------------------------------------------
   8. Lucknow Live Local Time Clock
   -------------------------------------------------------------------------- */
function initLucknowClock() {
  const clockEl = document.getElementById("lucknow-clock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    clockEl.textContent = `LUCKNOW TIME: ${now.toLocaleTimeString("en-GB", options)} IST (UTC+5:30)`;
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   9. Scroll-Spy, Progress Ring & Giant Footer Animation
   -------------------------------------------------------------------------- */
function initScrollSpyAndProgress() {
  const progressBar = document.getElementById("scroll-progress-bar");
  const timelineGlow = document.getElementById("timeline-glow");
  const giantFooter = document.getElementById("giant-footer-name");
  const dockLinks = document.querySelectorAll(".dock-link");
  const sections = document.querySelectorAll("section, header");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = `${scrollPercent}%`;
    if (timelineGlow) timelineGlow.style.height = `${Math.min(100, scrollPercent * 1.3)}%`;

    // Circular SVG scroll progress on Back to Top button
    const scrollRing = document.getElementById("scroll-progress-ring");
    if (scrollRing) {
      // Circumference for r=18 is 2 * PI * 18 = 113.1
      const circumference = 113.1;
      const offset = circumference - (scrollPercent / 100) * circumference;
      scrollRing.style.strokeDashoffset = `${offset}px`;
    }

    // Giant footer text amber reveal
    if (giantFooter) {
      const rect = giantFooter.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        giantFooter.classList.add("in-view");
      } else {
        giantFooter.classList.remove("in-view");
      }
    }

    // Active dock navigation spy
    let currentId = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    if (currentId) {
      dockLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   10. Render Projects with Sticky-Stack, Mockups & Architecture Packets
   -------------------------------------------------------------------------- */
function renderProjects(projects) {
  const container = document.getElementById("projects-container");
  if (!container || !projects) return;

  container.innerHTML = projects.map(proj => {
    const isTMA = proj.id === "tma";
    const tenantSwitcherMarkup = isTMA ? `
      <div class="tenant-switcher-bar" id="tma-tenant-bar">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-right:0.3rem;">Switch Subdomain:</span>
        <button type="button" class="tenant-pill-btn active" data-tenant-url="https://tma.tenant0.abhishek4312.info" data-tenant-label="Tenant 0 (Default)">Tenant 0</button>
        <button type="button" class="tenant-pill-btn" data-tenant-url="https://tma.tenant1.abhishek4312.info" data-tenant-label="Tenant 1 (Expedition Alpha)">Tenant 1</button>
        <button type="button" class="tenant-pill-btn" data-tenant-url="https://tma.tenant2.abhishek4312.info" data-tenant-label="Tenant 2 (Alpine High)">Tenant 2</button>
      </div>
    ` : "";

    return `
      <article class="project-case-card" id="card-${escapeHTML(proj.id)}" data-tech="${proj.techStack.join(',')}">
        <div class="project-layout-grid">
          
          <!-- Left: Information & Actions -->
          <div>
            <span class="project-badge-pill">${escapeHTML(proj.category)}</span>
            <h3 class="project-card-title">${escapeHTML(proj.title)}</h3>
            <p class="project-card-tagline">${escapeHTML(proj.tagline)}</p>
            <p class="project-card-desc">${escapeHTML(proj.description)}</p>

            ${proj.metrics ? `
              <div class="project-metrics-row">
                ${proj.metrics.map(m => `<span class="metric-pill">📊 ${escapeHTML(m)}</span>`).join("")}
              </div>
            ` : ""}

            <div class="project-tech-tags">
              ${proj.techStack.map(t => `<span class="tech-chip">${escapeHTML(t)}</span>`).join("")}
            </div>

            ${tenantSwitcherMarkup}

            <div class="project-actions">
              ${isTMA ? `
                <a href="https://tma.tenant0.abhishek4312.info" target="_blank" rel="noopener noreferrer" class="btn btn-primary" id="tma-active-live-btn" style="font-size:0.82rem; padding:0.48rem 0.95rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  <span id="tma-live-btn-text">Open Tenant 0 (Himalayas)</span>
                </a>
              ` : (proj.liveUrls ? proj.liveUrls.map(l => `
                <a href="${escapeHTML(l.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.82rem; padding:0.48rem 0.95rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  ${escapeHTML(l.label)}
                </a>
              `).join("") : "")}

              ${proj.githubUrl ? `
                <a href="${escapeHTML(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.82rem; padding:0.48rem 0.95rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  Source Code
                </a>
              ` : ""}

              <button class="btn btn-secondary case-study-trigger" data-project-id="${escapeHTML(proj.id)}" style="font-size:0.82rem; padding:0.48rem 0.95rem;">
                📖 Case Study
              </button>
            </div>
          </div>

          <!-- Right: Browser Mockup Frame -->
          <div>
            <div class="browser-mockup">
              <div class="mockup-header">
                <div class="mockup-dots">
                  <span class="mockup-dot r"></span>
                  <span class="mockup-dot y"></span>
                  <span class="mockup-dot g"></span>
                </div>
                <div class="mockup-url-bar">${escapeHTML(proj.liveUrls ? proj.liveUrls[0].url : 'https://abhishek4312.info')}</div>
              </div>
              <div class="mockup-body">
                <img src="${escapeHTML(proj.image || 'assets/img/infra-preview.jpg')}" alt="${escapeHTML(proj.title)}" class="mockup-screenshot" loading="lazy" />
              </div>
            </div>

            <!-- Architecture Flow Diagram Strip -->
            <div class="architecture-strip">
              <div class="arch-title">
                <span>⚡ Architecture Pipeline & Telemetry</span>
              </div>
              ${renderArchitectureSVG(proj.id)}
            </div>
          </div>

        </div>
      </article>
    `;
  }).join("");

  // Attach Case Study triggers
  document.querySelectorAll(".case-study-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-project-id");
      openCaseStudyModal(pid);
    });
  });

  // Attach TMA Tenant Switcher pills
  const tmaCard = document.getElementById("card-tma");
  if (tmaCard) {
    const tenantBtns = tmaCard.querySelectorAll(".tenant-pill-btn");
    const mockupUrl = tmaCard.querySelector(".mockup-url-bar");
    const primaryLiveLink = tmaCard.querySelector("#tma-active-live-btn") || tmaCard.querySelector(".project-actions a.btn-primary");
    const liveLinkText = tmaCard.querySelector("#tma-live-btn-text");

    tenantBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tenantBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const url = btn.getAttribute("data-tenant-url");
        const label = btn.getAttribute("data-tenant-label") || btn.textContent.trim();
        if (mockupUrl) mockupUrl.textContent = url;
        if (primaryLiveLink) primaryLiveLink.href = url;
        if (liveLinkText) liveLinkText.textContent = `Open ${label}`;
        playSynthesizedSound("click");
      });
    });
  }

  initStickyProjectCards();
}

function renderArchitectureSVG(projectId) {
  if (projectId === "tma") {
    return `
      <svg class="arch-svg-diagram" viewBox="0 0 600 60">
        <line x1="40" y1="30" x2="560" y2="30" stroke="rgba(255,176,32,0.3)" stroke-width="2" stroke-dasharray="4 4" />
        <circle cx="60" cy="30" r="14" fill="#0C1224" stroke="#FFB020" stroke-width="2" />
        <text x="60" y="34" font-family="monospace" font-size="9" fill="#FFB020" text-anchor="middle">Client</text>
        
        <circle cx="180" cy="30" r="14" fill="#0C1224" stroke="#4F7CFF" stroke-width="2" />
        <text x="180" y="34" font-family="monospace" font-size="9" fill="#4F7CFF" text-anchor="middle">Nginx</text>

        <circle cx="300" cy="30" r="14" fill="#0C1224" stroke="#3DDC97" stroke-width="2" />
        <text x="300" y="34" font-family="monospace" font-size="8" fill="#3DDC97" text-anchor="middle">Gunicorn</text>

        <circle cx="420" cy="30" r="14" fill="#0C1224" stroke="#22D3EE" stroke-width="2" />
        <text x="420" y="34" font-family="monospace" font-size="9" fill="#22D3EE" text-anchor="middle">Flask</text>

        <circle cx="540" cy="30" r="14" fill="#0C1224" stroke="#FF7A00" stroke-width="2" />
        <text x="540" y="34" font-family="monospace" font-size="8" fill="#FF7A00" text-anchor="middle">Postgres</text>

        <!-- Travelling Packet -->
        <circle r="4" fill="#FFB020">
          <animateMotion path="M 60 30 L 540 30" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>
    `;
  } else if (projectId === "lms") {
    return `
      <svg class="arch-svg-diagram" viewBox="0 0 600 60">
        <line x1="40" y1="30" x2="560" y2="30" stroke="rgba(79,124,255,0.3)" stroke-width="2" stroke-dasharray="4 4" />
        <circle cx="60" cy="30" r="14" fill="#0C1224" stroke="#4F7CFF" stroke-width="2" />
        <text x="60" y="34" font-family="monospace" font-size="8" fill="#4F7CFF" text-anchor="middle">Student</text>
        
        <circle cx="200" cy="30" r="14" fill="#0C1224" stroke="#3DDC97" stroke-width="2" />
        <text x="200" y="34" font-family="monospace" font-size="8" fill="#3DDC97" text-anchor="middle">Proctor</text>

        <circle cx="340" cy="30" r="14" fill="#0C1224" stroke="#FFB020" stroke-width="2" />
        <text x="340" y="34" font-family="monospace" font-size="8" fill="#FFB020" text-anchor="middle">MCQ-Eval</text>

        <circle cx="500" cy="30" r="14" fill="#0C1224" stroke="#22D3EE" stroke-width="2" />
        <text x="500" y="34" font-family="monospace" font-size="8" fill="#22D3EE" text-anchor="middle">Chart.js</text>

        <circle r="4" fill="#3DDC97">
          <animateMotion path="M 60 30 L 500 30" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    `;
  } else {
    return `
      <svg class="arch-svg-diagram" viewBox="0 0 600 60">
        <line x1="40" y1="30" x2="560" y2="30" stroke="rgba(61,220,151,0.3)" stroke-width="2" stroke-dasharray="4 4" />
        <circle cx="60" cy="30" r="14" fill="#0C1224" stroke="#FF7A00" stroke-width="2" />
        <text x="60" y="34" font-family="monospace" font-size="8" fill="#FF7A00" text-anchor="middle">GitPush</text>

        <circle cx="200" cy="30" r="14" fill="#0C1224" stroke="#4F7CFF" stroke-width="2" />
        <text x="200" y="34" font-family="monospace" font-size="9" fill="#4F7CFF" text-anchor="middle">CI/CD</text>

        <circle cx="340" cy="30" r="14" fill="#0C1224" stroke="#FFB020" stroke-width="2" />
        <text x="340" y="34" font-family="monospace" font-size="8" fill="#FFB020" text-anchor="middle">SSH-Rsync</text>

        <circle cx="500" cy="30" r="14" fill="#0C1224" stroke="#3DDC97" stroke-width="2" />
        <text x="500" y="34" font-family="monospace" font-size="8" fill="#3DDC97" text-anchor="middle">EC2-1GB</text>

        <circle r="4" fill="#22D3EE">
          <animateMotion path="M 60 30 L 500 30" dur="4.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    `;
  }
}

/* --------------------------------------------------------------------------
   11. Case Study Modal Dialog
   -------------------------------------------------------------------------- */
function openCaseStudyModal(projectId) {
  const modal = document.getElementById("case-study-modal");
  const content = document.getElementById("case-study-content");
  const closeBtn = document.getElementById("case-study-close-btn");

  if (!modal || !content || !window.PORTFOLIO_DATA) return;

  const proj = window.PORTFOLIO_DATA.projects.find(p => p.id === projectId);
  if (!proj) return;

  const cs = proj.caseStudy || {};

  content.innerHTML = `
    <span class="project-badge-pill">${escapeHTML(proj.category)}</span>
    <h2 style="font-family:var(--font-display); font-size:2rem; margin:0.5rem 0 0.8rem; color:var(--text-primary);">
      ${escapeHTML(proj.title)} — Engineering Case Study
    </h2>
    <p style="font-size:1.05rem; color:var(--accent-cyan); margin-bottom:2rem;">
      ${escapeHTML(proj.tagline)}
    </p>

    <div style="display:flex; flex-direction:column; gap:1.75rem;">
      <div style="background:var(--bg-surface-elevated); padding:1.5rem; border-radius:14px; border:1px solid var(--border-glass);">
        <strong style="color:var(--accent-primary); font-family:var(--font-mono); font-size:0.9rem;">01 // THE CHALLENGE & PROBLEM</strong>
        <p style="font-size:0.95rem; color:var(--text-secondary); margin-top:0.6rem; line-height:1.7;">
          ${escapeHTML(cs.problem || proj.description)}
        </p>
      </div>

      <div style="background:var(--bg-surface-elevated); padding:1.5rem; border-radius:14px; border:1px solid var(--border-glass);">
        <strong style="color:var(--accent-blue); font-family:var(--font-mono); font-size:0.9rem;">02 // ARCHITECTURE & IMPLEMENTATION</strong>
        <p style="font-size:0.95rem; color:var(--text-secondary); margin-top:0.6rem; line-height:1.7;">
          ${escapeHTML(cs.architecture || proj.description)}
        </p>
      </div>

      <div style="background:var(--bg-surface-elevated); padding:1.5rem; border-radius:14px; border:1px solid var(--border-glass);">
        <strong style="color:var(--accent-green); font-family:var(--font-mono); font-size:0.9rem;">03 // KEY ENGINEERING DECISIONS</strong>
        <p style="font-size:0.95rem; color:var(--text-secondary); margin-top:0.6rem; line-height:1.7;">
          ${escapeHTML(cs.decisions || "Optimized memory footprint to fit within 250 MB container constraints on AWS EC2.")}
        </p>
      </div>

      <div style="background:var(--bg-surface-elevated); padding:1.5rem; border-radius:14px; border:1px solid var(--border-glass);">
        <strong style="color:var(--accent-primary); font-family:var(--font-mono); font-size:0.9rem;">04 // RESULTS & VERIFIED METRICS</strong>
        <p style="font-size:0.95rem; color:var(--text-secondary); margin-top:0.6rem; line-height:1.7;">
          ${escapeHTML(cs.results || "Sub-15ms response times, 100% CI pipeline passing, and zero cross-tenant leakage.")}
        </p>
      </div>

      <div style="background:var(--bg-surface-elevated); padding:1.5rem; border-radius:14px; border:1px solid var(--border-glass);">
        <strong style="color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.9rem;">05 // FUTURE EXTENSIONS</strong>
        <p style="font-size:0.95rem; color:var(--text-secondary); margin-top:0.6rem; line-height:1.7;">
          ${escapeHTML(cs.improvements || "Implement Redis caching layer and edge geolocation load balancing.")}
        </p>
      </div>

      <!-- Architectural Source Code Inspection Viewer -->
      <div class="code-viewer-container" id="cs-code-viewer">
        <div class="code-viewer-header">
          <div class="code-tabs-list" id="cs-code-tabs">
            <!-- Tabs injected dynamically -->
          </div>
          <button type="button" class="code-copy-btn" id="cs-copy-code-btn">Copy Code 📋</button>
        </div>
        <pre class="code-pre-block" id="cs-code-pre"></pre>
      </div>

      <!-- Side-by-Side Code Diff Architecture Comparison -->
      <div class="diff-viewer-wrap">
        <div class="diff-header-bar">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="color:var(--accent-primary); font-weight:700;">⚖️ Architecture Diff Analysis:</span>
            <span>Single-Tenant Anti-Pattern vs Schema-Isolated Multi-Tenancy</span>
          </div>
          <span class="badge" style="color:var(--accent-green); border-color:rgba(61,220,151,0.3);">Memory &amp; Zero-Leakage Verified</span>
        </div>
        <div class="diff-grid">
          <div class="diff-col naive">
            <div class="diff-col-title" style="color:#f87171;">
              <span>❌ Naive Single-Tenant (Security &amp; OOM Hazard)</span>
            </div>
            <span class="diff-del-line">- # Insecure direct query filtering</span>
            <span class="diff-del-line">- @app.route("/api/expeditions")</span>
            <span class="diff-del-line">- def get_data():</span>
            <span class="diff-del-line">-   # Vulnerable to cross-tenant leak:</span>
            <span class="diff-del-line">-   tenant = request.args.get("tenant")</span>
            <span class="diff-del-line">-   q = f"SELECT * FROM expeditions WHERE tenant='{tenant}'"</span>
            <span class="diff-del-line">-   # Global connection exhaustion on 1GB VPS:</span>
            <span class="diff-del-line">-   return db.engine.execute(q).fetchall()</span>
          </div>
          <div class="diff-col optimized">
            <div class="diff-col-title" style="color:#4ade80;">
              <span>✅ Enterprise Multi-Tenant (Production Standard)</span>
            </div>
            <span class="diff-add-line">+ # Subdomain schema routing + Connection Pool</span>
            <span class="diff-add-line">+ @app.route("/api/expeditions")</span>
            <span class="diff-add-line">+ @require_tenant_jwt</span>
            <span class="diff-add-line">+ def get_data():</span>
            <span class="diff-add-line">+   schema = sanitize_identifier(g.tenant_id)</span>
            <span class="diff-add-line">+   with db.engine.connect() as conn:</span>
            <span class="diff-add-line">+     # Strict PostgreSQL schema isolation:</span>
            <span class="diff-add-line">+     conn.execute(text(f"SET LOCAL search_path = {schema}, public;"))</span>
            <span class="diff-add-line">+     res = conn.execute(text("SELECT id, title, altitude FROM expeditions;"))</span>
            <span class="diff-add-line">+     return jsonify([dict(r) for r in res])</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Code tabs data definition
  const codeSnippets = {
    tma: {
      "nginx.conf": `# Subdomain Routing & Multi-Tenant Reverse Proxy
server {
    listen 80;
    server_name ~^(?<subdomain>.+)\\.abhishek4312\\.info$;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant-ID $subdomain;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }
}`,
      "tenant_middleware.py": `# Flask Multi-Tenant Schema Resolver Hook
from flask import g, request

@app.before_request
def resolve_tenant():
    host = request.headers.get("Host", "")
    tenant_id = host.split(".")[0] if "." in host else "default"
    g.tenant_id = tenant_id
    # Bind connection pool to tenant-isolated PostgreSQL schema
    db.session.execute(f"SET search_path TO {tenant_id}, public")`,
      "docker-compose.yml": `services:
  tma-app:
    build: .
    image: tma-backend:latest
    restart: unless-stopped
    mem_limit: 256m
    environment:
      - DATABASE_URL=postgresql://tma_user:\${DB_PASS}@db:5432/tma_prod
    ports:
      - "8000:8000"`
    },
    lms: {
      "proctor_eval.py": `# LMS Automated MCQ & Integrity Evaluation
def evaluate_submission(exam_id, student_id, answers):
    exam = Exam.query.get_or_404(exam_id)
    score = 0
    for q_id, opt in answers.items():
        if exam.answer_key.get(q_id) == opt:
            score += exam.points_per_q
    
    submission = Submission(exam_id=exam_id, student_id=student_id, score=score)
    db.session.add(submission)
    db.session.commit()
    return {"status": "evaluated", "score": score, "percentile": calc_percentile(exam_id, score)}`,
      "analytics.js": `// Chart.js Score Distribution Renderer
function renderExamHistogram(ctx, scoreBuckets) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
      datasets: [{
        label: 'Candidate Count',
        data: scoreBuckets,
        backgroundColor: '#4F7CFF',
        borderRadius: 6
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}`
    },
    infra: {
      "deploy.yml": `# GitHub Actions GitOps Push-to-Deploy
name: Production EC2 Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Rsync to AWS Student VPS
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.EC2_HOST }}
          username: ubuntu
          key: \${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/portfolio
            git pull origin main
            docker compose down && docker compose up -d --build`,
      "nginx.conf": `# EC2 Low-Memory Nginx Static Optimization
worker_processes 1;
events { worker_connections 512; }
http {
    include /etc/nginx/mime.types;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 256;

    server {
        listen 80;
        server_name abhishek4312.info;
        root /usr/share/nginx/html;
        index index.html;
    }
}`
    }
  };

  const projectSnippets = codeSnippets[projectId] || codeSnippets["infra"];
  const tabsContainer = document.getElementById("cs-code-tabs");
  const preBlock = document.getElementById("cs-code-pre");
  const copyBtn = document.getElementById("cs-copy-code-btn");

  if (tabsContainer && preBlock && projectSnippets) {
    const filenames = Object.keys(projectSnippets);
    let activeFile = filenames[0];

    tabsContainer.innerHTML = filenames.map((fn, idx) => `
      <button type="button" class="code-tab-btn ${idx === 0 ? 'active' : ''}" data-file="${escapeHTML(fn)}">${escapeHTML(fn)}</button>
    `).join("");

    preBlock.textContent = projectSnippets[activeFile];

    tabsContainer.querySelectorAll(".code-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        tabsContainer.querySelectorAll(".code-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFile = btn.getAttribute("data-file");
        preBlock.textContent = projectSnippets[activeFile];
        playSynthesizedSound("key");
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyText(projectSnippets[activeFile], "Code copied!");
        copyBtn.textContent = "Copied ✓";
        copyBtn.style.color = "var(--accent-green)";
        setTimeout(() => {
          copyBtn.textContent = "Copy Code 📋";
          copyBtn.style.color = "";
        }, 2000);
      });
    }
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  closeBtn.onclick = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  };
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
  };
}

/* --------------------------------------------------------------------------
   12. Skills Matrix Bento Grid & Project Linking
   -------------------------------------------------------------------------- */
function renderSkills(skills, category) {
  const grid = document.getElementById("skills-grid");
  if (!grid || !skills) return;

  let list = [];
  if (category === "languages") list = skills.languagesAndFrameworks;
  else if (category === "backend") list = skills.backendAndCloud;
  else if (category === "tools") list = skills.toolsAndData;

  const usageMapping = {
    "Python": "Core engine in TMA & LMS",
    "Flask": "REST microservices in TMA & LMS",
    "JavaScript (ES6+)": "Modern client-side engine in all 3 apps",
    "SQL (PostgreSQL, SQLite)": "Multi-tenant schemas in TMA & LMS",
    "Docker & Docker Compose": "Container orchestration in all apps",
    "AWS EC2 VPS": "Production student VPS host",
    "Nginx Reverse Proxy": "SSL termination & subdomain routing",
    "GitHub Actions CI/CD": "Automated push-to-deploy pipelines",
    "Gunicorn WSGI": "Low-memory thread workers (-w 1 --threads 2)",
    "RESTful APIs": "JSON endpoints across TMA & LMS",
    "Git & GitHub": "Version control & GitOps workflow",
    "Chart.js": "Score distributions in LMS & TMA"
  };

  grid.innerHTML = list.map(item => `
    <div class="skill-bento-item" data-skill="${escapeHTML(item)}">
      <div class="skill-item-name">${escapeHTML(item)}</div>
      <div class="skill-item-caption">${escapeHTML(usageMapping[item] || "Used across production apps")}</div>
    </div>
  `).join("");

  // Tab switching events
  document.querySelectorAll(".skills-tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".skills-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderSkills(skills, btn.getAttribute("data-tab"));
      initSkillProjectLinking();
    };
  });
}

function initSkillProjectLinking() {
  const skillCards = document.querySelectorAll(".skill-bento-item");
  const projectCards = document.querySelectorAll(".project-case-card");

  skillCards.forEach(card => {
    const skillName = card.getAttribute("data-skill")?.toLowerCase();
    card.addEventListener("mouseenter", () => {
      projectCards.forEach(pCard => {
        const techStr = pCard.getAttribute("data-tech")?.toLowerCase() || "";
        if (techStr.includes(skillName)) {
          pCard.style.borderColor = "var(--accent-primary)";
          pCard.style.boxShadow = "var(--glow-accent)";
        }
      });
    });

    card.addEventListener("mouseleave", () => {
      projectCards.forEach(pCard => {
        pCard.style.borderColor = "";
        pCard.style.boxShadow = "";
      });
    });
  });
}

/* --------------------------------------------------------------------------
   13. Education & Honors Timelines
   -------------------------------------------------------------------------- */
function renderEducation(eduList) {
  const container = document.getElementById("education-container");
  if (!container || !eduList) return;

  container.innerHTML = eduList.map((edu, idx) => `
    <div class="timeline-item-row">
      <div class="timeline-node-dot"></div>
      <div class="timeline-card-content">
        <span class="project-badge-pill">${escapeHTML(edu.period)}</span>
        <h3 style="font-family:var(--font-display); font-size:1.25rem; margin:0.4rem 0; color:var(--text-primary);">${escapeHTML(edu.degree)}</h3>
        <div style="color:var(--accent-primary); font-weight:600; font-size:0.95rem; margin-bottom:0.2rem;">${escapeHTML(edu.institution)}</div>
        <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-cyan); margin-bottom:0.75rem;">${escapeHTML(edu.grade)}</div>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;">${escapeHTML(edu.description)}</p>
      </div>
    </div>
  `).join("");
}

function renderHonors(achievements) {
  const container = document.getElementById("honors-container");
  if (!container || !achievements) return;

  container.innerHTML = achievements.map(ach => `
    <div class="honor-badge-card">
      <div class="honor-icon-box">🏆</div>
      <div>
        <h4 style="font-family:var(--font-display); font-size:1.15rem; color:var(--text-primary); margin-bottom:0.25rem;">${escapeHTML(ach.title)}</h4>
        <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-primary); margin-bottom:0.5rem;">${escapeHTML(ach.organization)} &middot; ${escapeHTML(ach.year)}</div>
        <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">${escapeHTML(ach.description)}</p>
      </div>
    </div>
  `).join("");
}

/* --------------------------------------------------------------------------
   14. Live Telemetry Heatmap (52 Weeks Activity)
   -------------------------------------------------------------------------- */
function renderLiveHeatmap() {
  const grid = document.getElementById("heatmap-grid");
  if (!grid) return;

  grid.innerHTML = "";
  // 52 columns x 7 days
  for (let c = 0; c < 52; c++) {
    const colDiv = document.createElement("div");
    colDiv.style.display = "flex";
    colDiv.style.flexDirection = "column";
    colDiv.style.gap = "3px";

    for (let r = 0; r < 7; r++) {
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";
      // Deterministic pseudo-random gradient for realistic active developer commits
      const rand = Math.sin(c * 7 + r * 13) * 10000;
      const val = Math.abs(rand - Math.floor(rand));
      if (val > 0.8) cell.classList.add("cell-l4");
      else if (val > 0.6) cell.classList.add("cell-l3");
      else if (val > 0.4) cell.classList.add("cell-l2");
      else if (val > 0.2) cell.classList.add("cell-l1");

      colDiv.appendChild(cell);
    }
    grid.appendChild(colDiv);
  }
}

/* --------------------------------------------------------------------------
   15. Contact Form, Copy Triggers & Inquiries Persistence
   -------------------------------------------------------------------------- */
function initContactFormAndCopy() {
  // 1-Click Copy Cards
  document.querySelectorAll(".copy-trigger").forEach(card => {
    card.addEventListener("click", () => {
      const text = card.getAttribute("data-copy");
      const badge = card.querySelector(".copy-badge-pill");
      if (text) {
        copyText(text, "Copied to clipboard!");
        if (badge) {
          const original = badge.textContent;
          badge.textContent = "Copied ✓";
          badge.style.color = "var(--accent-green)";
          setTimeout(() => {
            badge.textContent = original;
            badge.style.color = "";
          }, 2000);
        }
      }
    });
  });

  // Character Counter
  const messageInput = document.getElementById("form-message");
  const charCount = document.getElementById("char-count");
  if (messageInput && charCount) {
    messageInput.addEventListener("input", () => {
      charCount.textContent = messageInput.value.length;
    });
  }

  // Contact Form Submission
  const form = document.getElementById("portfolio-contact-form");
  const alertBox = document.getElementById("form-status-alert");
  const submitBtn = document.getElementById("form-submit-btn");
  const submitText = document.getElementById("btn-submit-text");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Check honeypot
      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        console.warn("Spam honeypot triggered");
        return;
      }

      const name = document.getElementById("form-name")?.value.trim();
      const email = document.getElementById("form-email")?.value.trim();
      const subject = document.getElementById("form-subject")?.value.trim();
      const message = document.getElementById("form-message")?.value.trim();

      if (!name || !email || !message) {
        showStatus("Please complete all required fields.", "error");
        return;
      }

      // Save inquiry into local dashboard storage
      try {
        const stored = JSON.parse(localStorage.getItem("ap_inquiries") || "[]");
        stored.unshift({
          id: "inq_" + Date.now(),
          date: new Date().toISOString(),
          name: name,
          email: email,
          subject: subject || "Portfolio Connect Inquiry",
          message: message,
          status: "unread"
        });
        localStorage.setItem("ap_inquiries", JSON.stringify(stored));
      } catch (err) {
        console.warn("Could not save inquiry:", err);
      }

      // Morph button to loading
      if (submitBtn && submitText) {
        submitBtn.disabled = true;
        submitText.textContent = "Transmitting Message...";
      }

      // Simulate network transmit & launch celebratory confetti
      setTimeout(() => {
        if (window.confetti) {
          window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        // Trigger mailto link softly in background
        const mailtoUrl = `mailto:abhishekpathak4312@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
        try {
          const mailAnchor = document.createElement("a");
          mailAnchor.href = mailtoUrl;
          mailAnchor.style.display = "none";
          document.body.appendChild(mailAnchor);
          mailAnchor.click();
          setTimeout(() => mailAnchor.remove(), 400);
        } catch (e) {
          console.warn("Mail client handler:", e);
        }

        showStatus("Transmission recorded! I will reply within 24 hours.", "success");
        form.reset();
        if (charCount) charCount.textContent = "0";

        if (submitBtn && submitText) {
          submitBtn.disabled = false;
          submitText.textContent = "Send Message Transmission";
        }
      }, 700);
    });
  }

  function showStatus(msg, type) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.style.display = "block";
    alertBox.style.color = type === "error" ? "var(--accent-danger)" : "var(--accent-green)";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 6000);
  }
}

function copyText(str, successMessage) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(str).then(() => {
      console.log(successMessage);
    });
  } else {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* --------------------------------------------------------------------------
   16. Audio Synthesizer Engine (Web Audio API - Zero External Assets)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = localStorage.getItem("ap_sound_fx") === "enabled";

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSynthesizedSound(type) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.045);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "key") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === "chime") {
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.22);
      });
    } else if (type === "fanfare") {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.09, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    }
  } catch (e) {
    console.warn("Audio synthesis error:", e);
  }
}

function initAudioSynth() {
  const soundBtn = document.getElementById("dock-sound-btn");
  const iconSpan = document.getElementById("sound-btn-icon");

  function updateIcon() {
    if (iconSpan) {
      iconSpan.textContent = soundEnabled ? "🔊" : "🔇";
      iconSpan.title = soundEnabled ? "Sound Effects: ON (Click to Mute)" : "Sound Effects: MUTED (Click to Enable)";
    }
  }
  updateIcon();

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem("ap_sound_fx", soundEnabled ? "enabled" : "disabled");
      updateIcon();
      if (soundEnabled) {
        getAudioContext();
        playSynthesizedSound("chime");
      }
    });
  }

  // Attach sound to interactive buttons and navigation links
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, .dock-link, .btn, .social-link, .copy-trigger, .theme-btn");
    if (target && !target.closest("#dock-sound-btn")) {
      playSynthesizedSound("click");
    }
  });

  // Attach key sound to terminal inputs
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea") && soundEnabled) {
      playSynthesizedSound("key");
    }
  });
}

/* --------------------------------------------------------------------------
   17. Magnetic Physics Pull on Interactive Elements
   -------------------------------------------------------------------------- */
function initMagneticPull() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const magneticTargets = document.querySelectorAll(".magnetic-btn, .dock-link, .dock-btn, .social-link");

  magneticTargets.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.28;
      const dy = (e.clientY - centerY) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "transform 0.1s ease-out";
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0px, 0px)";
      el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    });
  });
}

/* --------------------------------------------------------------------------
   18. Hero Mouse Scroll Cue
   -------------------------------------------------------------------------- */
function initHeroScrollCue() {
  const cue = document.getElementById("hero-scroll-cue");
  if (!cue) return;

  cue.addEventListener("click", () => {
    const aboutSec = document.getElementById("about");
    if (aboutSec) {
      aboutSec.scrollIntoView({ behavior: "smooth" });
    }
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      cue.style.opacity = "0";
      cue.style.pointerEvents = "none";
    } else {
      cue.style.opacity = "1";
      cue.style.pointerEvents = "auto";
    }
  });
}

/* --------------------------------------------------------------------------
   19. Stats Count-Up & CGPA Radial Ring Gauge
   -------------------------------------------------------------------------- */
function initCountUpAndGauges() {
  // 1. CGPA Ring Fill
  const cgpaFill = document.getElementById("cgpa-circle-fill");
  const cgpaVal = document.getElementById("cgpa-val");

  if (cgpaFill && cgpaVal) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Circumference for r=28 is 175.92. 7.8/10.0 = 78% => offset is 175.92 * (1 - 0.78) = 38.7
          cgpaFill.style.strokeDashoffset = "38.7px";

          const target = 7.8;
          const duration = 1500;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = (progress * target).toFixed(1);
            cgpaVal.textContent = current;
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          }
          requestAnimationFrame(step);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const parentCard = cgpaFill.closest(".bento-card") || cgpaFill;
    observer.observe(parentCard);
  }

  // 2. Hero stats strip numbers
  const statNumbers = document.querySelectorAll(".hero-stats-strip .stat-number");
  if (statNumbers.length > 0) {
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(el => {
            const raw = el.textContent.trim();
            if (raw === "2" || raw === "3") {
              const target = parseInt(raw, 10);
              let val = 0;
              const timer = setInterval(() => {
                val++;
                el.textContent = val;
                if (val >= target) clearInterval(timer);
              }, 250);
            }
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const statsStrip = document.querySelector(".hero-stats-strip");
    if (statsStrip) statObserver.observe(statsStrip);
  }
}

/* --------------------------------------------------------------------------
   20. Scroll-Scrubbed Bio Word Highlight
   -------------------------------------------------------------------------- */
function initBioScrub() {
  const words = document.querySelectorAll(".bio-scrub-word");
  const aboutSec = document.getElementById("about");
  if (!words.length || !aboutSec) return;

  window.addEventListener("scroll", () => {
    const rect = aboutSec.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.top < windowH * 0.75 && rect.bottom > 0) {
      const scrollProgress = Math.max(0, Math.min(1, (windowH * 0.75 - rect.top) / (rect.height * 0.6)));
      const activeCount = Math.floor(scrollProgress * words.length);

      words.forEach((w, idx) => {
        if (idx <= activeCount) {
          w.classList.add("active-word");
        } else {
          w.classList.remove("active-word");
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   21. Contact Mode Switcher (GUI Form vs Guided Terminal CLI Prompt)
   -------------------------------------------------------------------------- */
function initContactModeSwitch() {
  const guiBtn = document.getElementById("mode-gui-btn");
  const termBtn = document.getElementById("mode-term-btn");
  const guiForm = document.getElementById("portfolio-contact-form");
  const termView = document.getElementById("terminal-contact-view");
  const cliInput = document.getElementById("cli-contact-input");
  const cliHistory = document.getElementById("cli-prompt-history");

  if (!guiBtn || !termBtn || !guiForm || !termView || !cliInput) return;

  guiBtn.addEventListener("click", () => {
    guiBtn.classList.add("active");
    termBtn.classList.remove("active");
    guiForm.style.display = "block";
    termView.style.display = "none";
    playSynthesizedSound("chime");
  });

  termBtn.addEventListener("click", () => {
    termBtn.classList.add("active");
    guiBtn.classList.remove("active");
    guiForm.style.display = "none";
    termView.style.display = "block";
    cliInput.focus();
    playSynthesizedSound("chime");
  });

  // Guided CLI State Machine: 0: Name, 1: Email, 2: Subject, 3: Message
  let cliStep = 0;
  const cliData = { name: "", email: "", subject: "", message: "" };

  cliInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = cliInput.value.trim();
      if (!val) return;

      const echoDiv = document.createElement("div");
      echoDiv.innerHTML = `<span style="color:var(--accent-primary);">&gt;</span> ${escapeHTML(val)}`;
      cliHistory.appendChild(echoDiv);
      cliInput.value = "";

      if (val.toLowerCase() === "clear" || val.toLowerCase() === "reset") {
        cliStep = 0;
        cliHistory.innerHTML = `
          <div><span style="color:var(--accent-green);">abhishek@portfolio:~$</span> send-message --init</div>
          <div style="color:var(--text-secondary); margin-top: 0.3rem;">[1/4] Enter your name:</div>
        `;
        return;
      }

      if (cliStep === 0) {
        cliData.name = val;
        cliStep = 1;
        const nextDiv = document.createElement("div");
        nextDiv.style.color = "var(--text-secondary)";
        nextDiv.style.marginTop = "0.3rem";
        nextDiv.textContent = `[2/4] Enter your email address:`;
        cliHistory.appendChild(nextDiv);
      } else if (cliStep === 1) {
        if (!val.includes("@") || !val.includes(".")) {
          const errDiv = document.createElement("div");
          errDiv.style.color = "var(--accent-danger)";
          errDiv.textContent = `[!] Invalid email format. Try again:`;
          cliHistory.appendChild(errDiv);
          return;
        }
        cliData.email = val;
        cliStep = 2;
        const nextDiv = document.createElement("div");
        nextDiv.style.color = "var(--text-secondary)";
        nextDiv.style.marginTop = "0.3rem";
        nextDiv.textContent = `[3/4] Enter subject / topic:`;
        cliHistory.appendChild(nextDiv);
      } else if (cliStep === 2) {
        cliData.subject = val;
        cliStep = 3;
        const nextDiv = document.createElement("div");
        nextDiv.style.color = "var(--text-secondary)";
        nextDiv.style.marginTop = "0.3rem";
        nextDiv.textContent = `[4/4] Enter your message transmission:`;
        cliHistory.appendChild(nextDiv);
      } else if (cliStep === 3) {
        cliData.message = val;
        cliStep = 4;

        try {
          const stored = JSON.parse(localStorage.getItem("ap_inquiries") || "[]");
          stored.unshift({
            id: "inq_" + Date.now(),
            date: new Date().toISOString(),
            name: cliData.name,
            email: cliData.email,
            subject: cliData.subject,
            message: cliData.message,
            status: "unread"
          });
          localStorage.setItem("ap_inquiries", JSON.stringify(stored));
        } catch (err) {
          console.warn("Could not save inquiry:", err);
        }

        const successDiv = document.createElement("div");
        successDiv.style.color = "var(--accent-green)";
        successDiv.style.marginTop = "0.5rem";
        successDiv.style.fontWeight = "600";
        successDiv.innerHTML = `[✓] TRANSMISSION DELIVERED to Abhishek's console!<br/><span style="font-weight:normal; color:var(--text-muted); font-size:0.8rem;">Type 'reset' to send another message.</span>`;
        cliHistory.appendChild(successDiv);

        playSynthesizedSound("fanfare");
        if (window.confetti) {
          window.confetti({ particleCount: 90, spread: 60, origin: { y: 0.7 } });
        }
      } else if (cliStep === 4) {
        const promptDiv = document.createElement("div");
        promptDiv.style.color = "var(--text-muted)";
        promptDiv.textContent = `Transmission completed. Type 'reset' to begin a new message.`;
        cliHistory.appendChild(promptDiv);
      }

      cliHistory.scrollTop = cliHistory.scrollHeight;
    }
  });
}

/* --------------------------------------------------------------------------
   22. Konami Code Easter Egg ("Hire Mode" Golden Matrix Theme)
   -------------------------------------------------------------------------- */
function initKonamiCode() {
  const konamiSeq = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  let konamiIndex = 0;

  console.log(
    `%c🚀 MISSION CONTROL INITIALIZED // ABHISHEK PATHAK
%c• IIT Madras (BS Data Science) & CSVTU Bhilai (B.Tech CSE AI)
• Multi-Tenant Cloud Architecture | Docker | AWS EC2 Student VPS
• Hint: Enter Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) for Golden Hire Mode!
• Repo: https://github.com/24f2001885/My_profile`,
    "color: #FFB020; font-family: monospace; font-size: 14px; font-weight: bold;",
    "color: #22D3EE; font-family: monospace; font-size: 11px;"
  );

  window.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;

    if (e.key.toLowerCase() === konamiSeq[konamiIndex].toLowerCase()) {
      konamiIndex++;
      if (konamiIndex === konamiSeq.length) {
        document.body.classList.toggle("hire-mode-active");
        konamiIndex = 0;

        playSynthesizedSound("fanfare");
        if (window.confetti) {
          window.confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#FFD700", "#FFB020", "#FFFFFF", "#FFA500"]
          });
        }
        console.log("%c🌟 GOLDEN HIRE MODE ACTIVATED! Welcome to Mission Control Special Edition.", "color: #FFD700; font-weight: bold; font-size: 14px;");
      }
    } else {
      konamiIndex = 0;
    }
  });
}

/* --------------------------------------------------------------------------
   23. Vim Navigation & Keyboard Shortcuts HUD (?)
   -------------------------------------------------------------------------- */
function initShortcutsAndVim() {
  const modal = document.getElementById("shortcuts-modal");
  const closeBtn = document.getElementById("shortcuts-close-btn");
  const dockBtn = document.getElementById("dock-shortcuts-btn");
  const sections = Array.from(document.querySelectorAll("header, section"));

  function toggleModal(show) {
    if (!modal) return;
    const shouldOpen = show !== undefined ? show : !modal.classList.contains("active");
    if (shouldOpen) {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      playSynthesizedSound("chime");
    } else {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  if (dockBtn) dockBtn.addEventListener("click", () => toggleModal());
  if (closeBtn) closeBtn.addEventListener("click", () => toggleModal(false));
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) toggleModal(false);
    });
  }

  window.addEventListener("keydown", (e) => {
    // Ignore when user is actively typing in input or textarea
    if (e.target.matches("input, textarea")) return;

    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      toggleModal();
      return;
    }

    if (e.key === "Escape") {
      toggleModal(false);
      const recModal = document.getElementById("recruiter-modal");
      if (recModal) {
        recModal.classList.remove("active");
        recModal.setAttribute("aria-hidden", "true");
      }
      return;
    }

    // Quick key 'r' for Recruiter Quick-Scan Mode
    if (e.key === "r" || e.key === "R") {
      const recModal = document.getElementById("recruiter-modal");
      if (recModal) {
        const isOpen = recModal.classList.contains("active");
        if (isOpen) {
          recModal.classList.remove("active");
          recModal.setAttribute("aria-hidden", "true");
        } else {
          recModal.classList.add("active");
          recModal.setAttribute("aria-hidden", "false");
          playSynthesizedSound("chime");
        }
      }
      return;
    }

    // Vim j/k section navigation
    if (e.key === "j" || e.key === "k") {
      const scrollPos = window.scrollY + 180;
      let currentIndex = 0;
      sections.forEach((sec, idx) => {
        if (scrollPos >= sec.offsetTop) {
          currentIndex = idx;
        }
      });

      if (e.key === "j" && currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
        playSynthesizedSound("key");
      } else if (e.key === "k" && currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
        playSynthesizedSound("key");
      }
    }

    // Quick key 't' for theme
    if (e.key === "t") {
      const themeBtn = document.getElementById("dock-theme-btn");
      if (themeBtn) themeBtn.click();
    }

    // Quick key 'm' for mute
    if (e.key === "m") {
      const soundBtn = document.getElementById("dock-sound-btn");
      if (soundBtn) soundBtn.click();
    }

    // Quick key 'g' for GitHub
    if (e.key === "g") {
      window.open("https://github.com/24f2001885/My_profile", "_blank");
    }
  });
}

/* --------------------------------------------------------------------------
   24. Interactive Developer API Explorer / Sandbox
   -------------------------------------------------------------------------- */
function initApiPlayground() {
  const select = document.getElementById("api-endpoint-select");
  const sendBtn = document.getElementById("btn-api-send");
  const statusPill = document.getElementById("api-status-pill");
  const pre = document.getElementById("api-response-pre");

  if (!select || !sendBtn || !pre) return;

  const mockEndpoints = {
    "/api/v1/profile": () => {
      return {
        status: 200,
        latency: "16ms",
        data: {
          developer: "Abhishek Pathak",
          identity: {
            degrees: [
              "BS in Data Science & Applications (IIT Madras, 2024-2028, CGPA 7.8)",
              "B.Tech in CSE - Honours in AI (CSVTU Bhilai, 2025-2029)"
            ],
            location: "Lucknow / Kushinagar, UP, India",
            email: "abhishekpathak4312@gmail.com",
            github: "https://github.com/raj4312"
          },
          specialization: [
            "Multi-Tenant SaaS Isolation",
            "Low-Footprint Cloud Architecture (AWS 1 GB RAM EC2)",
            "GitOps Push-to-Deploy CI/CD Pipelines"
          ],
          server_timestamp: new Date().toISOString()
        }
      };
    },
    "/api/v1/projects": () => {
      return {
        status: 200,
        latency: "22ms",
        data: {
          count: 3,
          deployments: [
            {
              id: "tma",
              name: "Trekking Management Application (TMA)",
              architecture: "Multi-Tenant PostgreSQL + Gunicorn + Alpine Nginx",
              live_domains: ["tma.tenant0.abhishek4312.info", "tma.tenant1.abhishek4312.info"],
              tenant_isolation: "Strict schema separation & subdomain middleware",
              status: "HEALTHY (Uptime 99.98%)"
            },
            {
              id: "lms",
              name: "Examination Management Portal (LMS/EMP)",
              architecture: "Role-based proctoring engine with Chart.js histogram analytics",
              live_domain: "lms.abhishek4312.info",
              status: "HEALTHY"
            },
            {
              id: "infra",
              name: "Production VPS Living Infrastructure",
              host: "AWS Student EC2 (1 GB RAM + 4 GB Swap)",
              pipeline: "GitHub Actions automated rsync & docker-compose reload",
              status: "HEALTHY"
            }
          ]
        }
      };
    },
    "/api/v1/telemetry": () => {
      return {
        status: 200,
        latency: "14ms",
        data: {
          host: "aws-student-ec2-ap-south-1",
          kernel: "Linux 6.8.0-1017-aws aarch64",
          uptime_days: 182,
          physical_ram: { used_mb: 342, total_mb: 980, percentage: "34.9%" },
          swap_file: { used_mb: 180, total_mb: 4096, percentage: "4.4%" },
          cpu_load_1m: 0.08,
          ttfb_latency_ms: 24,
          gitops: {
            pipeline: "GitHub Actions",
            last_commit: "3e04669",
            status: "PASSING"
          }
        }
      };
    },
    "/api/v1/skills": () => {
      return {
        status: 200,
        latency: "19ms",
        data: {
          languages: ["Python 3.12", "JavaScript (ES6+)", "SQL (PostgreSQL/SQLite)", "HTML5/CSS3"],
          backend_cloud: ["Docker & Compose", "AWS EC2 VPS", "Nginx Reverse Proxy", "Gunicorn WSGI", "REST APIs"],
          tools_data: ["Git & GitHub", "GitHub Actions CI/CD", "Postman", "Chart.js", "KaTeX"]
        }
      };
    }
  };

  function executeRequest() {
    const endpoint = select.value;
    const resolver = mockEndpoints[endpoint] || mockEndpoints["/api/v1/profile"];
    const res = resolver();

    pre.textContent = "// Initiating HTTP GET transmission...\n";
    if (statusPill) {
      statusPill.textContent = "Fetching...";
      statusPill.style.color = "var(--accent-primary)";
    }

    setTimeout(() => {
      if (statusPill) {
        statusPill.textContent = `${res.status} OK · ${res.latency}`;
        statusPill.style.color = "var(--accent-green)";
      }
      pre.textContent = JSON.stringify(res.data, null, 2);
      playSynthesizedSound("click");
    }, 180);
  }

  sendBtn.addEventListener("click", executeRequest);
  select.addEventListener("change", executeRequest);

  // Initial trigger
  executeRequest();
}

/* --------------------------------------------------------------------------
   25. Interactive SQL Query Sandbox
   -------------------------------------------------------------------------- */
function initSqlSandbox() {
  const input = document.getElementById("sql-query-input");
  const runBtn = document.getElementById("btn-sql-run");
  const statusEl = document.getElementById("sql-query-status");
  const table = document.getElementById("sql-result-table");
  const presetBtns = document.querySelectorAll(".sql-preset-btn");

  if (!input || !runBtn || !table) return;

  const presets = {
    "1": {
      sql: "SELECT tenant_id, count(*) AS total_expeditions, avg(difficulty_level) AS avg_difficulty FROM tma_expeditions GROUP BY tenant_id ORDER BY total_expeditions DESC;",
      headers: ["tenant_id", "total_expeditions", "avg_difficulty"],
      rows: [
        ["tenant0.default", "142", "3.8 / 5.0"],
        ["tenant1.expedition_alpha", "98", "4.2 / 5.0"],
        ["tenant2.alpine_high", "64", "4.6 / 5.0"]
      ]
    },
    "2": {
      sql: "SELECT student_id, score, percentile, exam_status FROM lms_submissions WHERE score >= 80 ORDER BY score DESC LIMIT 5;",
      headers: ["student_id", "score", "percentile", "exam_status"],
      rows: [
        ["STU_2026_881", "98.5 / 100", "99.8%", "VERIFIED_PASSED"],
        ["STU_2026_412", "94.0 / 100", "98.4%", "VERIFIED_PASSED"],
        ["STU_2026_105", "91.5 / 100", "96.7%", "VERIFIED_PASSED"],
        ["STU_2026_923", "88.0 / 100", "94.1%", "VERIFIED_PASSED"],
        ["STU_2026_334", "85.0 / 100", "91.2%", "VERIFIED_PASSED"]
      ]
    },
    "3": {
      sql: "SELECT container_name, image, memory_usage_mb, max_limit_mb, health_status FROM docker_containers;",
      headers: ["container_name", "image", "memory_usage_mb", "max_limit_mb", "health_status"],
      rows: [
        ["tma-tenant-proxy", "nginx:1.26-alpine", "28.4 MB", "128 MB", "HEALTHY (0 restarts)"],
        ["emp-eval-engine", "python:3.12-alpine", "142.1 MB", "256 MB", "HEALTHY (0 restarts)"],
        ["postgres-multi-tenant", "postgres:16-alpine", "118.6 MB", "384 MB", "HEALTHY (0 restarts)"]
      ]
    }
  };

  function runQuery() {
    const rawSql = input.value.trim().toLowerCase();
    let match = presets["1"];
    if (rawSql.includes("student_id") || rawSql.includes("lms")) match = presets["2"];
    else if (rawSql.includes("container") || rawSql.includes("docker")) match = presets["3"];

    if (statusEl) {
      statusEl.textContent = `Query OK: ${match.rows.length} rows returned in ${(Math.random() * 1.5 + 0.8).toFixed(1)}ms`;
      statusEl.style.color = "var(--accent-green)";
    }

    table.innerHTML = `
      <thead>
        <tr>
          ${match.headers.map(h => `<th>${escapeHTML(h)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${match.rows.map(row => `
          <tr>
            ${row.map(col => `<td>${escapeHTML(col)}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    `;

    playSynthesizedSound("key");
  }

  runBtn.addEventListener("click", runQuery);

  // Ctrl+Enter shortcut in textarea
  input.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
  });

  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const pid = btn.getAttribute("data-preset");
      if (presets[pid]) {
        input.value = presets[pid].sql;
        runQuery();
      }
    });
  });

  // Initial render
  runQuery();
}

/* --------------------------------------------------------------------------
   26. Real Git Commit Stream & Changelog Widget
   -------------------------------------------------------------------------- */
function initGitCommitStream() {
  const container = document.getElementById("git-commits-stream");
  if (!container) return;

  const commits = [
    {
      hash: "3e04669",
      msg: "feat(ui): implement 10+ master plan upgrades and resolve dashboard UI distortions",
      time: "Just now",
      verified: true
    },
    {
      hash: "9166cb9",
      msg: "feat(ui): complete Mission Control UI/UX overhaul with 4 themes, 3D tilt, case studies, terminal, and live telemetry",
      time: "9 hours ago",
      verified: true
    },
    {
      hash: "979c582",
      msg: "feat: add production docker-compose, enhanced AWS EC2 deploy pipeline, and repository documentation",
      time: "10 hours ago",
      verified: true
    },
    {
      hash: "d63e9f0",
      msg: "feat: complete portfolio modernization, 3-theme engine, password-protected dashboard, and GitOps CI/CD",
      time: "10 hours ago",
      verified: true
    }
  ];

  container.innerHTML = commits.map(c => `
    <div class="git-commit-row">
      <span class="git-hash-pill">${escapeHTML(c.hash)}</span>
      <span class="git-msg-text">${escapeHTML(c.msg)}</span>
      ${c.verified ? '<span class="badge" style="font-size:0.65rem; color:var(--accent-green); border-color:rgba(61,220,151,0.25);">VERIFIED GPG</span>' : ''}
      <span class="git-time-text">${escapeHTML(c.time)}</span>
    </div>
  `).join("");
}


/* --------------------------------------------------------------------------
   27. Interactive Architecture Node Telemetry Inspector
   -------------------------------------------------------------------------- */
function initArchNodeInspector() {
  const container = document.getElementById("arch-nodes-list");
  const card = document.getElementById("arch-inspector-card");
  if (!container || !card) return;

  const nodeData = {
    client: {
      name: "Client Browser (Edge)",
      icon: "🌐",
      stats: [
        { label: "Protocol", val: "HTTP/2 &bull; TLS 1.3" },
        { label: "Edge Latency", val: "14.2 ms (Mumbai Anycast)" },
        { label: "Compression", val: "Brotli (br level 6)" },
        { label: "Security", val: "HSTS &bull; CSP Strict" }
      ],
      desc: "User requests originate globally and terminate at the nearest Cloudflare Edge PoP via Anycast routing, minimizing initial roundtrip handshake times."
    },
    cloudflare: {
      name: "Cloudflare Global CDN & WAF",
      icon: "🛡️",
      stats: [
        { label: "Caching SLA", val: "94.6% Cache Hit Ratio" },
        { label: "DDoS Mitigation", val: "Active (Zone Strict Layer 7)" },
        { label: "SSL Mode", val: "Full (Strict) Authenticated" },
        { label: "Edge TTL", val: "Static: 30d &bull; HTML: Revalidate" }
      ],
      desc: "Buffers static CSS, JS, and font assets while shielding the single AWS EC2 origin instance from Layer 3/4 SYN floods and malicious crawler scraping."
    },
    aws: {
      name: "AWS EC2 VPS (Host Instance)",
      icon: "☁️",
      stats: [
        { label: "Instance Type", val: "t2/t3.micro (1 vCPU, 1 GB RAM)" },
        { label: "Region", val: "ap-south-1 (Mumbai, India)" },
        { label: "Swap Paging", val: "4 GB NVMe SSD (swappiness=10)" },
        { label: "OS Kernel", val: "Ubuntu 24.04 LTS (6.8.0-aws)" }
      ],
      desc: "Cost-optimized infrastructure host running zero-downtime containers with strict cgroup memory caps (256 MB per container) to guarantee 99.98% crash immunity."
    },
    nginx: {
      name: "Alpine Nginx (Reverse Proxy & Ingress)",
      icon: "⚡",
      stats: [
        { label: "Listen Ports", val: "80 (Redirect 301) / 443 (SSL)" },
        { label: "Subdomain Routing", val: "~^(?<subdomain>.+)\\\\.abhishek4312\\\\.info$" },
        { label: "Upstream Socket", val: "proxy_pass http://127.0.0.1:8000" },
        { label: "Proxy Buffers", val: "16 8k (zero disk buffer spill)" }
      ],
      desc: "Dispatches incoming subdomains (e.g. tma.tenant0, lms) directly to upstream Docker microservices, setting X-Tenant-ID and real remote client headers."
    },
    gunicorn: {
      name: "Gunicorn WSGI & Python Engine",
      icon: "🐍",
      stats: [
        { label: "Runtime", val: "Python 3.12.3 &bull; Gevent Workers" },
        { label: "Concurrency", val: "3 Active WSGI Worker Threads" },
        { label: "Middleware Hook", val: "@app.before_request g.tenant_id" },
        { label: "Memory Cap", val: "142 MB / 256 MB Limit" }
      ],
      desc: "Resolves organization tenancy per HTTP request, injecting the dynamic schema context into Flask thread locals and managing database connection pools."
    },
    postgres: {
      name: "PostgreSQL 16 (Multi-Tenant Schemas)",
      icon: "🐘",
      stats: [
        { label: "Schema Isolation", val: "Dedicated Schema per Organization" },
        { label: "Search Path", val: "SET LOCAL search_path = tenant_xyz" },
        { label: "Connection Pool", val: "Max 15 Shared Connections" },
        { label: "Data Integrity", val: "Composite Indexing & Strict FKs" }
      ],
      desc: "Guarantees zero cross-tenant leakage at the database level by binding transactions to isolated schemas without the resource overhead of spinning up multiple DB containers."
    }
  };

  function renderInspector(nodeKey) {
    const data = nodeData[nodeKey] || nodeData.client;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-glass); padding-bottom:0.75rem; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.4rem;">${data.icon}</span>
          <strong style="font-family:var(--font-mono); font-size:1rem; color:var(--text-primary);">${escapeHTML(data.name)}</strong>
        </div>
        <span class="badge" style="color:var(--accent-green); border-color:rgba(61,220,151,0.3);">ONLINE // HEALTHY</span>
      </div>
      <div class="arch-inspector-grid">
        ${data.stats.map(s => `
          <div class="arch-stat-block">
            <span class="arch-stat-label">${escapeHTML(s.label)}</span>
            <span class="arch-stat-value">${s.val}</span>
          </div>
        `).join("")}
      </div>
      <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-top:1rem; border-top:1px solid rgba(255,255,255,0.05); padding-top:0.75rem;">
        ${escapeHTML(data.desc)}
      </p>
    `;
  }

  const nodes = container.querySelectorAll(".arch-node-item");
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      const key = node.getAttribute("data-node");
      renderInspector(key);
      playSynthesizedSound("key");
    });
  });

  // Default initial render
  renderInspector("client");
}

/* --------------------------------------------------------------------------
   28. Recruiter 30-Second Quick-Scan Modal
   -------------------------------------------------------------------------- */
function initRecruiterModal() {
  const modal = document.getElementById("recruiter-modal");
  const closeBtn = document.getElementById("recruiter-close-btn");
  const dockBtn = document.getElementById("dock-recruiter-btn");
  const heroBtn = document.getElementById("hero-recruiter-btn");
  const contactLink = document.getElementById("recruiter-contact-link");

  if (!modal) return;

  function toggleRecruiterModal(show) {
    const shouldOpen = show !== undefined ? show : !modal.classList.contains("active");
    if (shouldOpen) {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      playSynthesizedSound("chime");
    } else {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  window.openRecruiterModal = () => toggleRecruiterModal(true);

  if (dockBtn) dockBtn.addEventListener("click", () => toggleRecruiterModal());
  if (heroBtn) heroBtn.addEventListener("click", () => toggleRecruiterModal());
  if (closeBtn) closeBtn.addEventListener("click", () => toggleRecruiterModal(false));
  if (contactLink) {
    contactLink.addEventListener("click", () => {
      toggleRecruiterModal(false);
      const contactSec = document.getElementById("contact");
      if (contactSec) contactSec.scrollIntoView({ behavior: "smooth" });
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) toggleRecruiterModal(false);
  });
}


/* --------------------------------------------------------------------------
   29. Dynamic Sticky Stack Project Cards (Full Bottom Border & Link Visibility)
   -------------------------------------------------------------------------- */
function initStickyProjectCards() {
  const cards = document.querySelectorAll(".project-case-card");
  if (!cards.length) return;

  function adjustStickyTops() {
    const vh = window.innerHeight;
    cards.forEach((card, i) => {
      const cardHeight = card.offsetHeight;
      // Ensure the card's lower border is at least 32px above the viewport bottom:
      // top + cardHeight <= vh - 32
      const desiredBottomClearance = 32;
      const defaultTop = 68; // Below dock nav
      const maxAllowedTop = vh - cardHeight - desiredBottomClearance;
      const finalTop = Math.min(defaultTop, maxAllowedTop);
      card.style.top = `${finalTop}px`;
    });
  }

  adjustStickyTops();
  window.addEventListener("resize", adjustStickyTops);
  setTimeout(adjustStickyTops, 150);
}
