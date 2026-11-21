# Abhishek Pathak - Personal Portfolio & GitOps Delivery System

Official developer portfolio, password-protected content console, and automated GitOps deployment system for **Abhishek Pathak**.

- **Owner:** Abhishek Pathak
- **Academics:** Dual-Degree Student
  - BS in Data Science & Applications, Indian Institute of Technology, Madras (IIT Madras - Roll: `24F2001885`)
  - B.Tech in Computer Science & Engineering (Honours in AI), CSVTU Bhilai
- **GitHub Repository:** [https://github.com/24f2001885/My_profile](https://github.com/24f2001885/My_profile)
- **Production Domain:** [https://abhishek4312.info](https://abhishek4312.info)
- **VPS Target:** AWS EC2 Ubuntu VPS (1 GB RAM low-memory configuration + 4 GB swap)

---

## 🏗️ Architecture & Key Features

1. **Decoupled Data Architecture:**
   - Content is stored in `assets/data/portfolio.json` and validated by `assets/data/schema.json` via JSON Schema Draft-07.
   - Dynamic client-side hydration via modern, zero-dependency Vanilla JavaScript (ES6+).
2. **3 Switchable Design Themes:**
   - **Cyber Dark:** Deep obsidian canvas with electric gold accents (`data-theme="cyber"`).
   - **GitHub Slate:** Developer charcoal with electric blue highlights (`data-theme="slate"`).
   - **Modern Clean Light:** Paper slate with royal blue typography (`data-theme="light"`).
   - Persistent theme selection via `localStorage`.
3. **Password-Protected Developer Management Console (`dashboard.html`):**
   - Secured client-side via **Web Crypto salted SHA-256 hashing** (`ap_sec_salt_2026`) with 4-hour `sessionStorage` token isolation and 5-attempt rate-limiting.
   - Dual-gated on VPS via **Nginx HTTP Basic Auth (`auth_basic`)** generated dynamically in CI/CD.
   - Manage bio, headline, skills, education, awards, and raw JSON directly from the UI.
4. **📬 Inbound Inquiries & Connect Messages Module:**
   - Directly integrated into `dashboard.html`.
   - Captures recruiter queries and opportunity messages sent via `index.html#contact`.
   - Real-time unread badges, filter controls (`All`, `Unread`, `Read`), 1-click email replies (`mailto:`), status toggles, deletion, and JSON export.
5. **GitOps Push-to-Deploy CI/CD:**
   - `.github/workflows/ci.yml`: Runs JSON schema validation, asset integrity checks, and Docker container compilation tests on every push and PR.
   - `.github/workflows/deploy.yml`: Deploys static files and Docker Compose services to the AWS EC2 instance webroot over SSH and reloads Nginx with zero downtime upon merge to `main`.
6. **Low-Memory Cloud Footprint (< 15 MB RAM):**
   - Minimal Alpine Nginx container consuming under 15 MB of RAM, leaving memory free for backend services on the 1 GB EC2 VPS.

---

## 📁 Repository Structure

```
My_profile/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI test, schema & container validation
│       └── deploy.yml             # Automated AWS EC2 SSH deployment pipeline
├── assets/
│   ├── css/
│   │   └── style.css              # 3-Theme CSS token engine & responsive layout
│   ├── js/
│   │   ├── main.js                # Dynamic rendering, theme engine & navigation
│   │   └── dashboard.js           # Password gate, inquiries feed & JSON manager
│   ├── data/
│   │   ├── portfolio.json         # Single source of truth for portfolio content
│   │   ├── schema.json            # JSON schema validation definition
│   │   └── inquiries.json         # Seeded inquiries feed
│   ├── docs/
│   │   └── ABHISHEKPATHAK_CV.pdf  # Verified downloadable resume
│   └── img/
│       ├── profile.jpg            # Professional portrait
│       ├── tma-preview.jpg        # TMA project thumbnail
│       ├── lms-preview.jpg        # LMS project thumbnail
│       └── infra-preview.jpg      # Cloud infrastructure thumbnail
├── index.html                     # Semantic, accessible portfolio homepage
├── dashboard.html                 # Password-protected developer console
├── Dockerfile                     # Alpine Nginx production image (< 15 MB RAM)
├── docker-compose.yml             # Low-memory compose service with healthchecks
├── nginx.conf                     # Production web server configuration with auth_basic
├── .env.example                   # Environment variable template
├── .gitignore                     # Repository hygiene & secret exclusion rules
└── README.md                      # Project documentation
```

---

## 💻 Local Development & Testing

### 1. Run with Python Static Server:
```bash
# Start local static server on port 8085
python -m http.server 8085
```
- **Main Portfolio:** `http://localhost:8085/`
- **Developer Console:** `http://localhost:8085/dashboard.html` (Password: `Abhishek@Dev2026!`)

### 2. Run with Docker Compose:
```bash
# Build and start container on port 80 (or PORT=8080)
docker compose up -d --build

# View logs and container health
docker compose logs -f portfolio
```

### 3. Run Content Validation:
```bash
python -c "import json, jsonschema; jsonschema.validate(instance=json.load(open('assets/data/portfolio.json')), schema=json.load(open('assets/data/schema.json'))); print('✅ Schema Valid!')"
```

---

## 🚀 AWS EC2 VPS Setup & GitHub Secrets

To enable automated push-to-deploy to your AWS EC2 instance, configure the following secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

| Secret Name | Value Description | Example |
| :--- | :--- | :--- |
| `AWS_HOST` | Public IP or DNS of your AWS EC2 instance | `13.xxx.xxx.xxx` |
| `AWS_USER` | EC2 SSH username | `ubuntu` |
| `AWS_SSH_KEY` | Private SSH key (`.pem` format) for EC2 access | `-----BEGIN RSA PRIVATE KEY-----...` |
| `AWS_SSH_PORT` | SSH port (defaults to 22) | `22` |
| `DASHBOARD_PASSWORD` | Production password for Nginx `auth_basic` gate | `Abhishek@Dev2026!` |
| `DASHBOARD_USERNAME` | Production username for Nginx `auth_basic` | `admin` |

### The Push-to-Deploy Cycle:
```mermaid
flowchart LR
    A["Local Edit in Final/"] --> B["Local Test<br/>http://localhost:8085"]
    B --> C["git commit & git push<br/>origin main"]
    C --> D["GitHub Actions CI<br/>(Linter, Schema, Assets)"]
    D --> E["GitHub Actions CD<br/>(SSH rsync & Docker/Nginx Reload)"]
    E --> F["Live on VPS Domain<br/>https://abhishek4312.info"]
```
