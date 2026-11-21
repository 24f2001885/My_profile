/**
 * Abhishek Pathak - Developer Dashboard Engine
 * Cryptographic Authentication Gate, Content Management & Inquiries Tracker
 */

// --------------------------------------------------------------------------
// 1. Security & Authentication Configuration
// --------------------------------------------------------------------------
const AUTH_CONFIG = {
  salt: "ap_sec_salt_2026",
  // SHA-256 Hash of (salt + password). Default password: Abhishek@Dev2026!
  hash: "38952231177e0c0326f4228f0cc07f4b5b3711ecc8df2cd327213bfe4af3207f",
  sessionKey: "ap_dash_session",
  sessionHours: 4,
  maxFailedAttempts: 5,
  lockoutMinutes: 10
};

let portfolioData = null;
let inquiriesList = [];
let currentInquiryFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  initDashboardTheme();
  initAuthGate();
  initDashboardTabs();
  setupActionButtons();
  setupSecurityTool();
  setupInquiriesActions();
});

// --------------------------------------------------------------------------
// 2. Authentication Gate Logic (Web Crypto API)
// --------------------------------------------------------------------------
function initAuthGate() {
  const authScreen = document.getElementById("dash-auth-screen");
  const mainContent = document.getElementById("dashboard-main-content");
  const loginForm = document.getElementById("dash-login-form");
  const pwdInput = document.getElementById("auth-password-input");
  const togglePwdBtn = document.getElementById("btn-toggle-pwd");
  const errorBox = document.getElementById("auth-error-msg");
  const logoutBtn = document.getElementById("btn-logout");

  // Toggle password visibility
  if (togglePwdBtn && pwdInput) {
    togglePwdBtn.addEventListener("click", () => {
      const isPwd = pwdInput.getAttribute("type") === "password";
      pwdInput.setAttribute("type", isPwd ? "text" : "password");
      togglePwdBtn.textContent = isPwd ? "🔒" : "👁️";
    });
  }

  // Check existing session
  if (isSessionValid()) {
    unlockDashboard();
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const enteredPassword = pwdInput.value;

      if (isLockedOut()) {
        showAuthError("Too many failed attempts. Console locked for 10 minutes.");
        return;
      }

      const isValid = await verifyPassword(enteredPassword);
      if (isValid) {
        resetFailedAttempts();
        createSession();
        unlockDashboard();
      } else {
        recordFailedAttempt();
        showAuthError("Invalid developer password. Access denied.");
        pwdInput.value = "";
        pwdInput.focus();
      }
    });
  }

  // Logout / Lock
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
      authScreen.style.display = "flex";
      mainContent.style.display = "none";
      if (pwdInput) pwdInput.value = "";
      showToast("Dashboard locked. Session terminated.");
    });
  }

  function unlockDashboard() {
    authScreen.style.display = "none";
    mainContent.style.display = "block";
    loadDashboardData();
    loadInquiriesData();
  }

  function showAuthError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = "block";
    setTimeout(() => {
      errorBox.style.display = "none";
    }, 5000);
  }
}

async function verifyPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(AUTH_CONFIG.salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex === AUTH_CONFIG.hash;
}

function createSession() {
  const session = {
    authenticated: true,
    expiresAt: Date.now() + (AUTH_CONFIG.sessionHours * 60 * 60 * 1000)
  };
  sessionStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
}

function isSessionValid() {
  try {
    const raw = sessionStorage.getItem(AUTH_CONFIG.sessionKey);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (session.authenticated && session.expiresAt > Date.now()) {
      return true;
    }
  } catch (err) {
    // Malformed session
  }
  return false;
}

function recordFailedAttempt() {
  const key = "ap_dash_failed_attempts";
  let data = JSON.parse(localStorage.getItem(key) || '{"count":0,"lockUntil":0}');
  data.count += 1;
  if (data.count >= AUTH_CONFIG.maxFailedAttempts) {
    data.lockUntil = Date.now() + (AUTH_CONFIG.lockoutMinutes * 60 * 1000);
  }
  localStorage.setItem(key, JSON.stringify(data));
}

function isLockedOut() {
  const key = "ap_dash_failed_attempts";
  const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"lockUntil":0}');
  return data.lockUntil > Date.now();
}

function resetFailedAttempts() {
  localStorage.removeItem("ap_dash_failed_attempts");
}

// --------------------------------------------------------------------------
// 3. Security Tool: Password Hash Generator
// --------------------------------------------------------------------------
function setupSecurityTool() {
  const btn = document.getElementById("btn-generate-hash");
  const input = document.getElementById("sec-new-password");
  const outputWrap = document.getElementById("sec-hash-output");
  const codeBox = document.getElementById("sec-hash-code");

  if (btn && input) {
    btn.addEventListener("click", async () => {
      const pwd = input.value.trim();
      if (!pwd) {
        alert("Please enter a new password first.");
        return;
      }
      const randomSalt = "ap_sec_" + Math.random().toString(36).substring(2, 10);
      const encoder = new TextEncoder();
      const data = encoder.encode(randomSalt + pwd);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      outputWrap.style.display = "flex";
      codeBox.value = `salt: "${randomSalt}",\nhash: "${hashHex}"`;
      showToast("New hash calculated! Update AUTH_CONFIG in assets/js/dashboard.js to apply.");
    });
  }
}

// --------------------------------------------------------------------------
// 4. Inquiries & Connect Messages Tracker
// --------------------------------------------------------------------------
async function loadInquiriesData() {
  try {
    let baseInquiries = [];
    try {
      const res = await fetch("assets/data/inquiries.json");
      if (res.ok) baseInquiries = await res.json();
    } catch (e) {
      // Fallback
    }

    const localInquiries = JSON.parse(localStorage.getItem("ap_inquiries") || "[]");
    
    // Merge and deduplicate by id
    const map = new Map();
    baseInquiries.forEach(item => map.set(item.id, item));
    localInquiries.forEach(item => map.set(item.id, item));

    inquiriesList = Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem("ap_inquiries", JSON.stringify(inquiriesList));

    renderInquiriesList();
    updateInquiryCounts();
  } catch (err) {
    console.error("Inquiries loading error:", err);
  }
}

function updateInquiryCounts() {
  const total = inquiriesList.length;
  const unread = inquiriesList.filter(i => i.status === "unread").length;

  const countAll = document.getElementById("inq-count-all");
  if (countAll) countAll.textContent = total;

  const countUnread = document.getElementById("inq-count-unread");
  if (countUnread) countUnread.textContent = unread;

  const sidebarBadge = document.getElementById("dash-unread-badge");
  if (sidebarBadge) {
    if (unread > 0) {
      sidebarBadge.textContent = unread;
      sidebarBadge.style.display = "inline-flex";
    } else {
      sidebarBadge.style.display = "none";
    }
  }
}

function renderInquiriesList() {
  const container = document.getElementById("dash-inquiries-list");
  if (!container) return;

  const filtered = inquiriesList.filter(item => {
    if (currentInquiryFilter === "unread") return item.status === "unread";
    if (currentInquiryFilter === "read") return item.status === "read" || item.status === "replied";
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted); background:var(--bg-surface-elevated); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">📭</div>
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.25rem;">No Inquiries Found</h3>
        <p style="font-size:0.9rem;">There are no messages matching the '${escapeHTML(currentInquiryFilter)}' filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isUnread = item.status === "unread";
    const formattedDate = new Date(item.date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    return `
      <div class="dash-card" style="padding:1.5rem; background:var(--bg-surface-elevated); border-color:${isUnread ? 'var(--accent-primary)' : 'var(--border-subtle)'};" data-inq-id="${item.id}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div style="width:2.5rem; height:2.5rem; border-radius:50%; background:var(--accent-soft); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1rem; flex-shrink:0;">
              ${escapeHTML((item.name || 'U').charAt(0).toUpperCase())}
            </div>
            <div>
              <div style="font-weight:700; font-size:1.05rem; color:var(--text-primary);">
                ${escapeHTML(item.name)}
                ${isUnread ? '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ef4444; margin-left:6px;" title="Unread Message"></span>' : ''}
              </div>
              <div style="font-size:0.85rem; color:var(--text-muted); display:flex; align-items:center; gap:0.4rem;">
                <span>${escapeHTML(item.email)}</span>
                <button type="button" class="btn-copy-email-mini" style="background:none; border:none; color:var(--accent-primary); cursor:pointer; font-size:0.8rem; padding:0 2px;" title="Copy email address" onclick="navigator.clipboard.writeText('${escapeHTML(item.email)}'); showToast('Email copied!');">📋</button>
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size:0.8rem; color:var(--text-muted);">${escapeHTML(formattedDate)}</span>
            <span class="badge" style="background:${isUnread ? 'rgba(239,68,68,0.15)' : 'var(--bg-surface)'}; color:${isUnread ? '#ef4444' : 'var(--text-secondary)'}; border-color:${isUnread ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)'};">
              ${isUnread ? 'Unread' : 'Read'}
            </span>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-subtle); padding-top:0.75rem; margin-top:0.25rem;">
          <div style="font-weight:600; font-size:0.95rem; color:var(--text-primary); margin-bottom:0.35rem;">
            Subject: ${escapeHTML(item.subject)}
          </div>
          <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; white-space:pre-wrap; background:var(--bg-card); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            ${escapeHTML(item.message)}
          </p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; padding-top:0.25rem;">
          <a href="mailto:${escapeHTML(item.email)}?subject=Re: ${encodeURIComponent(item.subject)}" class="btn btn-primary btn-sm" onclick="markInquiryRead('${item.id}', true)">
            ✉️ Reply via Email
          </a>

          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="toggleInquiryStatus('${item.id}')">
              ${isUnread ? '✓ Mark as Read' : '↺ Mark as Unread'}
            </button>
            <button type="button" class="btn btn-secondary btn-sm" style="color:#ef4444;" onclick="deleteInquiry('${item.id}')">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

window.toggleInquiryStatus = function(id) {
  const item = inquiriesList.find(i => i.id === id);
  if (item) {
    item.status = item.status === "unread" ? "read" : "unread";
    localStorage.setItem("ap_inquiries", JSON.stringify(inquiriesList));
    renderInquiriesList();
    updateInquiryCounts();
    showToast(`Marked inquiry as ${item.status}.`);
  }
};

window.markInquiryRead = function(id, silent = false) {
  const item = inquiriesList.find(i => i.id === id);
  if (item && item.status === "unread") {
    item.status = "read";
    localStorage.setItem("ap_inquiries", JSON.stringify(inquiriesList));
    renderInquiriesList();
    updateInquiryCounts();
    if (!silent) showToast("Marked as read.");
  }
};

window.deleteInquiry = function(id) {
  if (!confirm("Are you sure you want to delete this message?")) return;
  inquiriesList = inquiriesList.filter(i => i.id !== id);
  localStorage.setItem("ap_inquiries", JSON.stringify(inquiriesList));
  renderInquiriesList();
  updateInquiryCounts();
  showToast("Inquiry deleted.");
};

function setupInquiriesActions() {
  // Filter buttons
  document.querySelectorAll(".inq-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".inq-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentInquiryFilter = btn.getAttribute("data-filter");
      renderInquiriesList();
    });
  });

  // Mark all read
  const markAllBtn = document.getElementById("btn-mark-all-read");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      inquiriesList.forEach(i => i.status = "read");
      localStorage.setItem("ap_inquiries", JSON.stringify(inquiriesList));
      renderInquiriesList();
      updateInquiryCounts();
      showToast("All inquiries marked as read!");
    });
  }

  // Export inquiries
  const exportBtn = document.getElementById("btn-export-inquiries");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const jsonStr = JSON.stringify(inquiriesList, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inquiries.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Exported inquiries.json successfully!");
    });
  }
}

// --------------------------------------------------------------------------
// 5. Theme & Tabs Management
// --------------------------------------------------------------------------
function initDashboardTheme() {
  const THEME_KEY = "ap_portfolio_theme";
  const saved = localStorage.getItem(THEME_KEY) || "cyber";
  setTheme(saved);

  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-set-theme");
      setTheme(theme);
    });
  });

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll(".theme-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-set-theme") === theme);
    });
  }
}

function initDashboardTabs() {
  const navBtns = document.querySelectorAll(".dash-nav-btn");
  const panels = document.querySelectorAll(".dash-tab-panel");

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      navBtns.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => (p.style.display = "none"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = "block";
        if (targetId === "tab-json") {
          updateRawJsonView();
        }
        if (targetId === "tab-messages") {
          renderInquiriesList();
          updateInquiryCounts();
        }
      }
    });
  });
}

// --------------------------------------------------------------------------
// 6. Portfolio Data Loading & Hydration
// --------------------------------------------------------------------------
async function loadDashboardData() {
  try {
    const res = await fetch("assets/data/portfolio.json");
    if (!res.ok) throw new Error("Could not load portfolio.json");
    portfolioData = await res.json();
    hydrateForm();
    updateRawJsonView();
  } catch (err) {
    showToast("Error loading data: " + err.message, true);
  }
}

function hydrateForm() {
  if (!portfolioData) return;

  // Profile
  const p = portfolioData.profile || {};
  setValue("dash-name", p.name);
  setValue("dash-location", p.location);
  setValue("dash-email", p.email);
  setValue("dash-phone", p.phone);
  setValue("dash-github", p.github);
  setValue("dash-linkedin", p.linkedin);
  setValue("dash-tagline", p.tagline);
  setValue("dash-titles", (p.titles || []).join(", "));
  setValue("dash-bio", (p.bio || []).join("\n\n"));

  // Skills
  const s = portfolioData.skills || {};
  setValue("dash-skills-lang", (s.languagesAndFrameworks || []).join(", "));
  setValue("dash-skills-backend", (s.backendAndCloud || []).join(", "));
  setValue("dash-skills-tools", (s.toolsAndData || []).join(", "));

  // Projects
  renderProjectsList();

  // Education
  renderEducationList();

  // Achievements
  renderAchievementsList();
}

function renderProjectsList() {
  const container = document.getElementById("dash-projects-list");
  if (!container || !portfolioData || !portfolioData.projects) return;

  container.innerHTML = portfolioData.projects.map((proj, idx) => `
    <div class="dash-card" style="padding:1.5rem; background:var(--bg-surface-elevated);" data-project-idx="${idx}">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4 style="font-weight:700;">#${idx + 1}: ${escapeHTML(proj.title)}</h4>
        <span class="badge">${escapeHTML(proj.category)}</span>
      </div>

      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Project Title</label>
          <input type="text" class="form-control proj-field-title" value="${escapeHTML(proj.title)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <input type="text" class="form-control proj-field-category" value="${escapeHTML(proj.category)}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Tagline</label>
        <input type="text" class="form-control proj-field-tagline" value="${escapeHTML(proj.tagline)}" />
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control proj-field-desc" rows="2">${escapeHTML(proj.description)}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Tech Stack (comma-separated)</label>
        <input type="text" class="form-control proj-field-tech" value="${escapeHTML((proj.techStack || []).join(', '))}" />
      </div>

      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">GitHub Repository URL</label>
          <input type="url" class="form-control proj-field-github" value="${escapeHTML(proj.githubUrl || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Primary Live URL</label>
          <input type="url" class="form-control proj-field-liveurl" value="${escapeHTML((proj.liveUrls && proj.liveUrls[0]) ? proj.liveUrls[0].url : '')}" />
        </div>
      </div>
    </div>
  `).join("");
}

function renderEducationList() {
  const container = document.getElementById("dash-education-list");
  if (!container || !portfolioData || !portfolioData.education) return;

  container.innerHTML = portfolioData.education.map((edu, idx) => `
    <div class="dash-card" style="padding:1.5rem; background:var(--bg-surface-elevated);" data-edu-idx="${idx}">
      <h4 style="font-weight:700;">${escapeHTML(edu.institution)}</h4>
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Degree</label>
          <input type="text" class="form-control edu-field-degree" value="${escapeHTML(edu.degree)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Period</label>
          <input type="text" class="form-control edu-field-period" value="${escapeHTML(edu.period)}" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Grade / GPA</label>
        <input type="text" class="form-control edu-field-grade" value="${escapeHTML(edu.grade)}" />
      </div>
    </div>
  `).join("");
}

function renderAchievementsList() {
  const container = document.getElementById("dash-achievements-list");
  if (!container || !portfolioData || !portfolioData.achievements) return;

  container.innerHTML = portfolioData.achievements.map((ach, idx) => `
    <div class="dash-card" style="padding:1.5rem; background:var(--bg-surface-elevated);" data-ach-idx="${idx}">
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Award / Honor Title</label>
          <input type="text" class="form-control ach-field-title" value="${escapeHTML(ach.title)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Organization</label>
          <input type="text" class="form-control ach-field-org" value="${escapeHTML(ach.organization)}" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <input type="text" class="form-control ach-field-desc" value="${escapeHTML(ach.description)}" />
      </div>
    </div>
  `).join("");
}

// --------------------------------------------------------------------------
// 7. Action Handlers (Download & Export)
// --------------------------------------------------------------------------
function collectFormData() {
  if (!portfolioData) return null;

  // Profile
  portfolioData.profile.name = getValue("dash-name");
  portfolioData.profile.location = getValue("dash-location");
  portfolioData.profile.email = getValue("dash-email");
  portfolioData.profile.phone = getValue("dash-phone");
  portfolioData.profile.github = getValue("dash-github");
  portfolioData.profile.linkedin = getValue("dash-linkedin");
  portfolioData.profile.tagline = getValue("dash-tagline");
  portfolioData.profile.titles = splitComma(getValue("dash-titles"));
  portfolioData.profile.bio = getValue("dash-bio").split("\n\n").map(s => s.trim()).filter(Boolean);

  // Skills
  portfolioData.skills.languagesAndFrameworks = splitComma(getValue("dash-skills-lang"));
  portfolioData.skills.backendAndCloud = splitComma(getValue("dash-skills-backend"));
  portfolioData.skills.toolsAndData = splitComma(getValue("dash-skills-tools"));

  // Projects
  document.querySelectorAll("[data-project-idx]").forEach((card) => {
    const idx = parseInt(card.getAttribute("data-project-idx"), 10);
    if (portfolioData.projects[idx]) {
      portfolioData.projects[idx].title = card.querySelector(".proj-field-title")?.value || "";
      portfolioData.projects[idx].category = card.querySelector(".proj-field-category")?.value || "";
      portfolioData.projects[idx].tagline = card.querySelector(".proj-field-tagline")?.value || "";
      portfolioData.projects[idx].description = card.querySelector(".proj-field-desc")?.value || "";
      portfolioData.projects[idx].techStack = splitComma(card.querySelector(".proj-field-tech")?.value || "");
      portfolioData.projects[idx].githubUrl = card.querySelector(".proj-field-github")?.value || "";
      const live = card.querySelector(".proj-field-liveurl")?.value;
      if (live && portfolioData.projects[idx].liveUrls && portfolioData.projects[idx].liveUrls[0]) {
        portfolioData.projects[idx].liveUrls[0].url = live;
      }
    }
  });

  return portfolioData;
}

function setupActionButtons() {
  // Download updated JSON
  const saveBtn = document.getElementById("btn-save-json");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const updated = collectFormData();
      if (!updated) return;

      const jsonStr = JSON.stringify(updated, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      updateRawJsonView();
      showToast("Downloaded updated portfolio.json! Move it into assets/data/ to apply.");
    });
  }

  // Copy JSON
  const copyBtn = document.getElementById("btn-copy-json");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const updated = collectFormData();
      if (!updated) return;
      const jsonStr = JSON.stringify(updated, null, 2);
      navigator.clipboard.writeText(jsonStr).then(() => {
        showToast("portfolio.json copied to clipboard!");
      });
    });
  }
}

function updateRawJsonView() {
  const jsonView = document.getElementById("dash-raw-json");
  if (jsonView && portfolioData) {
    jsonView.value = JSON.stringify(portfolioData, null, 2);
  }
}

function showToast(msg, isError = false) {
  const t = document.getElementById("dash-toast");
  if (!t) return;
  t.textContent = msg;
  t.style.display = "block";
  t.style.borderColor = isError ? "#ef4444" : "var(--accent-primary)";
  t.style.color = isError ? "#ef4444" : "var(--accent-primary)";
  setTimeout(() => {
    t.style.display = "none";
  }, 4000);
}

function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function splitComma(str) {
  if (!str) return [];
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
