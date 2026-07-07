# AI Job Copilot

![CI](https://github.com/rimshashafique99/ai-job-copilot/actions/workflows/ci.yml/badge.svg)

An AI-powered job application assistant. Paste a job description and Copilot generates a tailored **cover letter**, **cold email**, **gap analysis**, and **CV rewrite** — then helps you track every application through a drag-and-drop pipeline.

> Frontend built with React + TypeScript + Vite. AI generation streams from a backend API over Server-Sent Events (SSE).

---

## ✨ Features

- **AI Analyze** — generate four tailored outputs (cover letter, cold email, gap analysis, CV rewrite) from a job description, streamed token-by-token.
- **Application Tracker** — a Kanban board (Applied → Interviewing → Offer → Rejected) with drag-and-drop, inline add/edit/delete, and a live activity feed.
- **Dashboard** — an at-a-glance view of your pipeline and recent activity.
- **Auth flow** — login, signup, email verification, forgot/reset password (protected routes gate the app).
- **Profile & Settings** — manage your account and preferences.
- **Dark mode** — system-aware theme with a manual toggle, persisted to `localStorage`.

## 🛠️ Tech Stack

| Area | Tools |
|------|-------|
| Framework | React 18, TypeScript, Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS, `tailwind-merge`, `class-variance-authority` |
| UI primitives | Radix UI + shadcn-style components, `lucide-react` icons |
| Forms & validation | React Hook Form, Zod |
| Backend / data | Supabase JS client, REST + SSE API |
| Testing | Vitest, Testing Library, jsdom |
| Linting | ESLint (typescript-eslint) |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm

### Installation

```bash
git clone https://github.com/rimshashafique99/ai-job-copilot.git
cd ai-job-copilot
npm install
```

### Environment variables

Create a `.env` file in the project root:

```bash
# Base URL of the backend API (defaults to http://localhost:5000/api)
VITE_API_URL=http://localhost:5000/api
```

### Run the dev server

```bash
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check without emitting |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with the Vitest UI |

## 🧪 Testing

Tests use **Vitest** + **Testing Library** in a jsdom environment. Current coverage focuses on the app's core logic:

- `auth` — session persistence in `localStorage`
- `use-toast` — the toast reducer (add/update/dismiss/remove)
- `ThemeContext` — dark-mode toggle, persistence, and provider guard
- `ProtectedRoute` — redirect vs. render based on auth state
- `ApplicationFormModal` — validation, trimming, URL normalization
- `Tracker` — add / edit / delete application flows

```bash
npm test
```

## 🔄 Continuous Integration

Every push to `master` and every pull request runs the CI pipeline in
[`.github/workflows/ci.yml`](.github/workflows/ci.yml): **typecheck → lint → test → build**.
A pull request can't be merged if any step fails.

## 📁 Project Structure

```
src/
├── components/       # Reusable components (layouts, modals, tracker cards)
│   ├── sections/     # Landing-page sections
│   └── ui/           # shadcn-style Radix UI primitives
├── contexts/         # React context providers (ThemeContext)
├── hooks/            # Custom hooks (use-toast)
├── lib/              # Utilities (auth, cn helper)
├── pages/            # Route pages (Dashboard, Analyze, Tracker, auth, ...)
└── test/             # Test setup
```

## 📄 License

This project is private and not currently licensed for redistribution.
