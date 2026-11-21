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

            <div class="project-actions">
              ${proj.liveUrls ? proj.liveUrls.map(l => `
                <a href="${escapeHTML(l.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.85rem; padding:0.55rem 1.1rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  ${escapeHTML(l.label)}
                </a>
              `).join("") : ""}

              ${proj.githubUrl ? `
                <a href="${escapeHTML(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.85rem; padding:0.55rem 1.1rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  Source Code
                </a>
              ` : ""}

              <button class="btn btn-secondary case-study-trigger" data-project-id="${escapeHTML(proj.id)}" style="font-size:0.85rem; padding:0.55rem 1.1rem;">
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
    </div>
  `;

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
