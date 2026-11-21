/**
 * Abhishek Pathak - Personal Portfolio Engine
 * Pure Vanilla JavaScript (ES6+) / Zero jQuery / 3-Theme State Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeEngine();
  initNavigation();
  loadPortfolioData();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Theme Engine (Cyber / Slate / Light)
   -------------------------------------------------------------------------- */
const THEME_STORAGE_KEY = "ap_portfolio_theme";
const VALID_THEMES = ["cyber", "slate", "light"];

function initThemeEngine() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "cyber";
  applyTheme(savedTheme);

  const themeButtons = document.querySelectorAll(".theme-btn");
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-set-theme");
      applyTheme(theme);
    });
  });
}

function applyTheme(theme) {
  if (!VALID_THEMES.includes(theme)) theme = "cyber";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  document.querySelectorAll(".theme-btn").forEach((btn) => {
    const isTarget = btn.getAttribute("data-set-theme") === theme;
    btn.classList.toggle("active", isTarget);
    btn.setAttribute("aria-pressed", isTarget ? "true" : "false");
  });
}

/* --------------------------------------------------------------------------
   2. Navigation, Scroll Spy & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll Spy using IntersectionObserver
  const sections = document.querySelectorAll("section[id]");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isActive);
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* --------------------------------------------------------------------------
   3. Content Hydration from portfolio.json
   -------------------------------------------------------------------------- */
async function loadPortfolioData() {
  try {
    const response = await fetch("assets/data/portfolio.json");
    if (!response.ok) {
      throw new Error(`Failed to load portfolio.json: ${response.status}`);
    }
    const data = await response.json();
    renderProfile(data.profile);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderEducation(data.education);
    renderAchievements(data.achievements);
    renderContact(data.contact);
  } catch (err) {
    console.error("Portfolio Hydration Error:", err);
  }
}

function renderProfile(profile) {
  if (!profile) return;

  // Tagline & Bio
  const taglineEl = document.getElementById("hero-tagline");
  if (taglineEl && profile.tagline) {
    taglineEl.textContent = profile.tagline;
  }

  const bioEl = document.getElementById("hero-bio");
  if (bioEl && profile.bio && profile.bio.length) {
    bioEl.innerHTML = profile.bio.map(p => `<p>${escapeHTML(p)}</p>`).join("");
  }

  // Typewriter effect
  if (profile.titles && profile.titles.length) {
    initTypewriter(profile.titles);
  }

  // CV Links
  if (profile.resumeUrl) {
    document.querySelectorAll(".cv-download-link").forEach(link => {
      link.setAttribute("href", profile.resumeUrl);
    });
  }

  // Social Links
  const githubLink = document.getElementById("social-github");
  if (githubLink && profile.github) githubLink.setAttribute("href", profile.github);

  const linkedinLink = document.getElementById("social-linkedin");
  if (linkedinLink && profile.linkedin) linkedinLink.setAttribute("href", profile.linkedin);

  const emailLink = document.getElementById("social-email");
  if (emailLink && profile.email) emailLink.setAttribute("href", `mailto:${profile.email}`);
}

function initTypewriter(words) {
  const target = document.getElementById("typewriter-text");
  if (!target) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseTime = 2000;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      charIndex--;
      target.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      target.textContent = currentWord.substring(0, charIndex);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

function renderProjects(projects) {
  const container = document.getElementById("projects-container");
  if (!container || !projects) return;

  container.innerHTML = projects.map(project => `
    <article class="project-card" data-category="${escapeHTML(project.category)}">
      <div class="project-thumb">
        <img src="${escapeHTML(project.image || 'assets/img/infra-preview.jpg')}" alt="${escapeHTML(project.title)}" loading="lazy" />
        <span class="project-category-tag">${escapeHTML(project.category)}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHTML(project.title)}</h3>
        <p class="project-tagline">${escapeHTML(project.tagline)}</p>
        <p class="project-description">${escapeHTML(project.description)}</p>

        ${project.architectureHighlights ? `
          <ul class="project-highlights-list">
            ${project.architectureHighlights.map(h => `<li>${escapeHTML(h)}</li>`).join("")}
          </ul>
        ` : ""}

        <div class="tech-tag-row">
          ${project.techStack.map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`).join("")}
        </div>

        <div class="project-actions-row">
          ${project.liveUrls ? project.liveUrls.map(l => `
            <a href="${escapeHTML(l.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              ${escapeHTML(l.label)}
            </a>
          `).join("") : ""}

          ${project.githubUrl ? `
            <a href="${escapeHTML(project.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Source Code
            </a>
          ` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

function renderSkills(skills) {
  if (!skills) return;

  const renderGroup = (id, list) => {
    const el = document.getElementById(id);
    if (el && list) {
      el.innerHTML = list.map(item => `<span class="skill-pill">${escapeHTML(item)}</span>`).join("");
    }
  };

  renderGroup("skills-languages", skills.languagesAndFrameworks);
  renderGroup("skills-backend", skills.backendAndCloud);
  renderGroup("skills-tools", skills.toolsAndData);
}

function renderEducation(educationList) {
  const container = document.getElementById("education-container");
  if (!container || !educationList) return;

  container.innerHTML = educationList.map(edu => `
    <div class="timeline-card">
      <span class="timeline-period">${escapeHTML(edu.period)}</span>
      <h3 class="timeline-title">${escapeHTML(edu.degree)}</h3>
      <div class="timeline-subtitle">${escapeHTML(edu.institution)}</div>
      <span class="timeline-grade">${escapeHTML(edu.grade)}</span>
      ${edu.description ? `<p class="timeline-desc">${escapeHTML(edu.description)}</p>` : ""}
    </div>
  `).join("");
}

function renderAchievements(achievements) {
  const container = document.getElementById("achievements-container");
  if (!container || !achievements) return;

  container.innerHTML = achievements.map(ach => `
    <div class="achieve-card">
      <div class="achieve-icon-box">★</div>
      <div>
        <h4 style="font-size:1.05rem; font-weight:700;">${escapeHTML(ach.title)}</h4>
        <div style="font-size:0.85rem; color:var(--accent-primary); font-weight:600; margin-bottom:0.25rem;">${escapeHTML(ach.organization)} · ${escapeHTML(ach.year)}</div>
        <p style="font-size:0.88rem; color:var(--text-secondary);">${escapeHTML(ach.description)}</p>
      </div>
    </div>
  `).join("");
}

function renderContact(contact) {
  if (!contact) return;
  const emailEl = document.getElementById("contact-email-val");
  if (emailEl) emailEl.textContent = contact.email;

  const phoneEl = document.getElementById("contact-phone-val");
  if (phoneEl) phoneEl.textContent = contact.phone;

  const locEl = document.getElementById("contact-location-val");
  if (locEl) locEl.textContent = contact.location;
}

/* --------------------------------------------------------------------------
   4. Contact Form Handler & Copy Clipboard
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("portfolio-contact-form");
  const alertBox = document.getElementById("form-status-alert");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("form-name")?.value.trim();
      const email = document.getElementById("form-email")?.value.trim();
      const subject = document.getElementById("form-subject")?.value.trim();
      const message = document.getElementById("form-message")?.value.trim();

      if (!name || !email || !message) {
        showStatus("Please fill in all required fields.", "error");
        return;
      }

      // Persist inquiry locally so it appears in the Developer Dashboard
      try {
        const storedInquiries = JSON.parse(localStorage.getItem("ap_inquiries") || "[]");
        storedInquiries.unshift({
          id: "inq_" + Date.now(),
          date: new Date().toISOString(),
          name: name,
          email: email,
          subject: subject || "Portfolio Connect Inquiry",
          message: message,
          status: "unread"
        });
        localStorage.setItem("ap_inquiries", JSON.stringify(storedInquiries));
      } catch (err) {
        console.warn("Could not save inquiry locally:", err);
      }

      // Prepare mailto link as zero-risk static handler
      const mailtoUrl = `mailto:abhishekpathak4312@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      try {
        const mailAnchor = document.createElement("a");
        mailAnchor.href = mailtoUrl;
        mailAnchor.style.display = "none";
        document.body.appendChild(mailAnchor);
        mailAnchor.click();
        setTimeout(() => mailAnchor.remove(), 500);
      } catch (err) {
        console.warn("Mail client popup skipped or handled by system:", err);
      }

      showStatus("Thank you! Message recorded and opening your email client...", "success");
      form.reset();
    });
  }

  function showStatus(msg, type) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.style.display = "block";
    alertBox.style.color = type === "error" ? "#ef4444" : "#10b981";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 6000);
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
