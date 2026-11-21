# Abhishek Pathak - Personal Portfolio & GitOps Delivery System

Official developer portfolio and local content management dashboard for **Abhishek Pathak**.

- **Owner:** Abhishek Pathak
- **Academics:** Dual-Degree Student
  - BS in Data Science & Applications, Indian Institute of Technology, Madras (IIT Madras)
  - B.Tech in Computer Science & Engineering (Honours - AI), CSVTU Bhilai
- **Production Domain:** [https://abhishek4312.info](https://abhishek4312.info)
- **VPS Target:** AWS EC2 Ubuntu VPS (1 GB RAM low-memory configuration with 4 GB swap)

---

## Architecture Highlights

1. **Decoupled Data Architecture:**
   - Content is stored in `assets/data/portfolio.json` and validated by `assets/data/schema.json`.
   - Dynamic hydration via modern, zero-dependency Vanilla JavaScript (ES6+).
2. **3 Switchable Design Themes:**
   - **Cyber Dark:** Deep obsidian canvas with electric gold accents (`data-theme="cyber"`).
   - **GitHub Slate:** Developer charcoal with electric blue highlights (`data-theme="slate"`).
   - **Modern Clean Light:** Paper slate with royal blue typography (`data-theme="light"`).
   - Persistent theme selection via `localStorage`.
3. **Local Developer Content Dashboard:**
   - Accessible locally via `dashboard.html`.
   - Edit personal details, featured projects (TMA, LMS, Cloud Infrastructure), skills, and education without modifying HTML markup.
   - Generates and downloads updated, validated `portfolio.json` files on demand.
4. **GitOps Push-to-Deploy CI/CD:**
   - `.github/workflows/ci.yml`: Runs JSON schema validation, asset integrity checks, and Docker container compilation tests on pull requests.
   - `.github/workflows/deploy.yml`: Deploys static files to the AWS EC2 instance webroot over SSH and reloads Nginx with zero downtime upon merge to `main`.
5. **Low-Memory Cloud Footprint:**
   - Minimal Alpine Nginx container consuming under 15 MB of RAM, leaving memory free for backend services on the 1 GB EC2 VPS.

---

## Directory Structure

```
Final/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI test & validation pipeline
│       └── deploy.yml             # Automated VPS deployment pipeline
├── assets/
│   ├── css/
│   │   └── style.css              # 3-Theme CSS token engine & responsive layout
│   ├── js/
│   │   ├── main.js                # Dynamic rendering, theme engine & navigation
│   │   └── dashboard.js           # Local content dashboard logic & JSON exporter
│   ├── data/
│   │   ├── portfolio.json         # Single source of truth for portfolio content
│   │   └── schema.json            # JSON schema validation definition
│   ├── docs/
│   │   └── ABHISHEKPATHAK_CV.pdf  # Verified downloadable resume
│   └── img/
│       ├── profile.jpg            # Professional portrait
│       ├── tma-preview.jpg        # TMA project thumbnail
│       ├── lms-preview.jpg        # LMS project thumbnail
│       └── infra-preview.jpg      # Cloud infrastructure thumbnail
├── index.html                     # Semantic, accessible portfolio homepage
├── dashboard.html                 # Local developer content management tool
├── Dockerfile                     # Alpine Nginx container build
├── nginx.conf                     # Production web server configuration
├── .gitignore                     # Repository hygiene rules
└── README.md                      # Project documentation
```

---

## Local Development & Testing

To preview the portfolio locally:

```bash
# Start local static server
python -m http.server 8085
```

- Main Portfolio: `http://localhost:8085/`
- Content Dashboard: `http://localhost:8085/dashboard.html`

To validate the content schema:

```bash
python -c "import json, jsonschema; jsonschema.validate(instance=json.load(open('assets/data/portfolio.json')), schema=json.load(open('assets/data/schema.json'))); print('Valid!')"
```
