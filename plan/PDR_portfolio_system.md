# PROJECT DEFINITION REPORT (PDR): Personal Portfolio & Developer Management System

**Target Identity:** Abhishek Pathak  
**Academics:** Dual-Degree Student — BS in Data Science & Applications (IIT Madras) & B.Tech in CSE with AI Specialization (CSVTU Bhilai)  
**Production Domain:** `abhishek4312.info` (Hosted on AWS Student VPS — 1 GB EC2 Instance)  
**Version:** 1.0.0 (Master Engineering Release)  

---

## 1. Executive Summary

This Project Definition Report defines the architecture, operational scope, and lifecycle for Abhishek Pathak’s production-grade developer portfolio website and accompanying local content management dashboard. 

The system transitions the portfolio from a fragile, static template riddled with jQuery plugins and hardcoded data into a **modern, decoupled, data-driven web application**. Content (projects, credentials, skills, education, and contact metadata) is decoupled into a structured schema (`portfolio.json`), managed locally via an intuitive **Developer Content Dashboard**, and rendered through a high-performance, accessible (WCAG AA), zero-dependency Vanilla JavaScript engine.

Furthermore, this report outlines the **GitOps CI/CD delivery loop**: any modification made locally in code or via the local dashboard is verified through automated pre-commit / testing hooks, pushed to GitHub, validated via a multi-stage GitHub Actions CI pipeline, and upon merging into `main`, automatically deployed with zero downtime to an AWS Student EC2 instance protected with Let's Encrypt SSL (`https://abhishek4312.info`).

---

## 2. Project Objectives

### Primary Objectives
1. **Professional Identity & Dual-Degree Elevation:** Highlight Abhishek Pathak’s dual credentials at IIT Madras and CSVTU Bhilai, clearly demonstrating skills in Full-Stack Backend, AI, and DevOps.
2. **Prominent Showcase of Cloud Deployments:** Present dedicated showcase cards for:
   - **TMA (Trekking Management Application):** Role-based multi-tenant SaaS application with isolated tenant endpoints (`tma.tenant0.abhishek4312.info` & `tma.tenant1.abhishek4312.info`).
   - **LMS / EMP (Examination Management Portal):** Academic viva & proctored MCQ evaluation portal with analytics (`lms.abhishek4312.info`).
   - **Cloud CI/CD & EC2 Infrastructure:** Visual architecture breakdown of the 1 GB AWS VPS deployment.
3. **Zero-Friction Recruiter Experience:** Integrated **one-click copyable demo credentials** (`examiner@demo.com | Demo@123`) so recruiters and evaluators can test live applications without registration barriers.
4. **Local Content Dashboard System:** Provide a standalone, local management dashboard (`dashboard.html`) allowing Abhishek to update projects, tech stack, bio, and credentials without manually editing HTML or CSS.
5. **3-Theme System:** Support 3 switchable visual themes:
   - **Theme 1 (Cyber Dark):** Deep obsidian with electric gold/amber accents.
   - **Theme 2 (GitHub Slate Dark):** Modern developer charcoal with electric blue accents.
   - **Theme 3 (Modern Clean Light):** Minimalist high-contrast light theme for accessibility and traditional document review.
6. **Automated GitOps CI/CD Loop:** 
   $$\text{Local Edit \& Dashboard Update} \longrightarrow \text{Local Test} \longrightarrow \text{Git Push} \longrightarrow \text{GitHub Actions CI} \longrightarrow \text{Merge to Main} \longrightarrow \text{Automated EC2 Deploy} \longrightarrow \text{Live at abhishek4312.info}$$

---

## 3. Scope of Work

### In-Scope
- **Frontend Architecture:** Clean semantic HTML5, modern CSS with CSS Custom Properties (variables), CSS Grid & Flexbox, and modular ES6+ Vanilla JavaScript (0% jQuery, 0% external bloat).
- **Decoupled Data Store (`assets/data/portfolio.json`):** Central source of truth for all dynamic content.
- **Local Developer Content Dashboard (`dashboard.html`):** Local GUI tool with live JSON schema validation, editing forms for bio/education/skills/projects, live visual preview, and one-click JSON export/save.
- **Multi-Theme Engine:** CSS token-based theme engine with smooth transition effects and `localStorage` persistence.
- **Verified Showcase Cards:** Deep-linked cards for TMA, LMS, and Portfolio with direct GitHub links, live domain links, architecture badges, and one-click demo logins.
- **Repository Standards:** Semantic `.gitignore`, comprehensive developer `README.md`, MIT `LICENSE`.
- **Automated CI/CD:** GitHub Actions `.github/workflows/ci.yml` (HTML/CSS linting, link checking, JSON schema verification) and `.github/workflows/deploy.yml` (SSH/rsync deploy to AWS EC2).
- **VPS Deployment Engine:** Lightweight Alpine Nginx `Dockerfile` and `nginx.conf` tuned specifically for 1 GB RAM / 4 GB Swap AWS EC2 instances.

### Out-of-Scope (Deferred to Future Revisions)
- Publicly accessible server-side admin login with database (avoiding unnecessary database maintenance and security vulnerabilities on the public static site).
- Paid third-party CMS integrations (Strapi, Contentful).

---

## 4. User Personas & User Stories

### Persona 1: Abhishek Pathak (Owner & Lead Developer)
- **Story 1.1:** As the owner, I want to update my latest projects, live demo links, and newly acquired skills in an intuitive local dashboard so I don't have to risk breaking HTML formatting.
- **Story 1.2:** As the developer, I want to test my changes locally, push them to GitHub, and have them automatically deployed to my live VPS upon PR merge without manual SSH commands.
- **Story 1.3:** As a designer, I want to switch between Cyber Dark, GitHub Slate, and Light themes instantly to present the best visual style for different audiences.

### Persona 2: Tech Recruiter / Hiring Manager
- **Story 2.1:** As a recruiter, I want to see Abhishek's education at IIT Madras and CSVTU immediately on the hero section so I can verify his qualifications in 5 seconds.
- **Story 2.2:** As an engineering manager, I want to click live demo links with pre-seeded demo accounts for TMA and LMS so I can evaluate his actual code and systems architecture immediately.
- **Story 2.3:** As an evaluator on a mobile device, I want a fast, responsive, and readable interface that loads in under 1 second.

---

## 5. Functional Requirements (FR)

| Req ID | Category | Description | Verification Method |
| :--- | :--- | :--- | :--- |
| **FR-01** | Content Data | All personal details, projects, skills, education, and social links must be driven from `assets/data/portfolio.json`. | Automated JSON Schema Validation |
| **FR-02** | Local Dashboard | A local dashboard (`dashboard.html`) must load `portfolio.json`, provide intuitive form fields, validate schemas, and export/save updates. | Manual & Unit Test in Browser |
| **FR-03** | 3-Theme Engine | The UI must support Cyber Dark, GitHub Slate, and Clean Light, toggled via a persistent dropdown/button stored in `localStorage`. | Browser State Inspection |
| **FR-04** | Project Showcase | TMA (Tenant 0 & Tenant 1) and LMS must display live status badges, tech stack tags, demo credentials with one-click copy, and GitHub links. | Link & Clipboard Verification |
| **FR-05** | Zero jQuery | The client bundle must contain 0 KB of jQuery or obsolete third-party animation libraries. | Automated Bundle Inspection |
| **FR-06** | CV Download | Hero and Resume sections must include a direct download link to `assets/docs/ABHISHEKPATHAK_CV.pdf`. | HTTP 200 File Existence Check |
| **FR-07** | GitOps Pipeline | Pushing to a branch triggers CI linting; merging to `main` triggers automated rsync/deploy to AWS EC2 VPS. | GitHub Actions Run Status |

---

## 6. Non-Functional Requirements (NFR)

1. **Performance:** 
   - First Contentful Paint (FCP) < 0.8s on 4G connections.
   - Total initial page weight (HTML + CSS + JS) < 40 KB (excluding compressed imagery).
   - Image optimization: all image assets compressed to WebP/optimized JPG.
2. **Accessibility (WCAG 2.1 AA):**
   - High text-to-background contrast ratio ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large headings) across all 3 themes.
   - All interactive elements must have visible focus indicators (`:focus-visible`) and ARIA labels.
3. **Reliability & Low-Memory VPS Footprint:**
   - The production container (Alpine Nginx) must run under **15 MB RAM** consumption, preserving the remaining memory for the LMS and TMA applications on the 1 GB EC2 instance.
4. **Security:**
   - Zero hardcoded passwords or API keys in the client repository.
   - Security headers enforced via Nginx (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`).
