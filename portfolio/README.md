# Jai Nandan — Portfolio

A premium, futuristic Data Science / AI portfolio for **Jai Nandan** (Data Scientist | Data Analyst | AI/ML Enthusiast), built as a fully static multi-page site with HTML5, CSS3, vanilla JavaScript and Bootstrap 5, plus one optional Vercel Python serverless function for the contact form.

## ✨ Features

- 10 real, separate HTML pages sharing one navbar, footer, theme and animation system
- Dark navy / electric blue / cyan / purple futuristic design with glassmorphism cards and neon glow
- Dark mode (default) and light mode, persisted with `localStorage`
- Animated network/particle background (`<canvas>`), scroll-reveal via `IntersectionObserver`, count-up stats, skill progress bars
- Fully responsive: 360px → 1400px+, with a mobile hamburger nav
- Projects dashboard with live search + category/technology filters
- Certificate grid with a modal preview
- Contact form with client-side validation and a `/api/contact` serverless endpoint (the site still works fully if the API is unreachable)
- Semantic HTML5, `alt` text, keyboard-accessible controls, and per-page SEO metadata

## 📁 Project structure

```
portfolio/
├── index.html            Home
├── about.html             About + workflow timeline
├── education.html         Academic background
├── skills.html            Technical skills
├── experience.html        Professional journey (timeline)
├── projects.html          Projects dashboard (search + filters)
├── project-details.html   Sample detailed project page (tabs)
├── certificates.html      Certificates grid + modal
├── contact.html           Contact form
├── 404.html               Custom not-found page
├── css/
│   ├── style.css          Design tokens, layout, components
│   ├── animations.css     Keyframes + scroll-reveal system
│   └── responsive.css     Breakpoints (1400/1200/992/768/480/360)
├── js/
│   ├── main.js            Nav, theme, loader, particles, modal, tabs
│   ├── animations.js      IntersectionObserver reveal, counters, skill bars
│   ├── projects.js        Projects search/filter logic
│   └── contact.js         Contact form validation + submit
├── api/
│   └── contact.py         Vercel Python serverless function
├── assets/
│   ├── images/            Profile photo, project thumbnails (add your own)
│   ├── icons/             Extra icon assets (Bootstrap Icons used by default)
│   └── certificates/      Certificate images
├── vercel.json
└── README.md
```

## 🔧 Placeholders to replace

Search for these before deploying:

| Placeholder | Where | Replace with |
|---|---|---|
| `https://github.com/jai-nandan` | every page | your real GitHub URL |
| `https://linkedin.com/in/jai-nandan` | every page | your real LinkedIn URL |
| `hello@jainandan.dev` | every page | your real email |
| `assets/Jai_Nandan_Resume.pdf` | `index.html`, `about.html` | your actual resume PDF, added to `assets/` |
| Profile photo | `about.html` (`.profile-photo`) | your photo, or an `<img>` inside that div |
| Certificate images | `certificates.html` | real certificate images/links |
| Live Demo link on `project-details.html` | that page | your deployed project URL |

## 🚀 Run locally

No build step or dependencies — just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## ☁️ Deploy to Vercel

**Option A — CLI**
```bash
npm i -g vercel
vercel
```

**Option B — GitHub → Vercel**
1. Push this folder to a GitHub repository.
2. Import the repo at vercel.com → New Project.
3. Framework preset: **Other** (static site). No build command needed.
4. Deploy.

`vercel.json` configures the `api/contact.py` Python serverless function; everything else is served as static files automatically.

## 📬 Wiring up the contact form for real

`api/contact.py` validates and accepts submissions but does not send email by default (that needs provider credentials). To actually deliver messages, add an email/webhook call inside `contact.py` using an API key stored as a Vercel Environment Variable (e.g. Resend, SendGrid, or a Slack/Discord webhook).

## 🎨 Design tokens

All colors, radii and fonts live as CSS variables in `css/style.css` (`:root` and `[data-theme="light"]`) — change the palette from one place.
