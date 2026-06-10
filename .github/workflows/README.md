# GitHub Actions CI/CD Guide

## Files in this folder

| File | Purpose |
|---|---|
| `ci.yml` | Main CI pipeline — runs on every push/PR to `main` |

---

## What the CI pipeline does

### Trigger
- **Push** to `main`
- **Pull Request** opened/updated against `main`

### Jobs (3 parallel + 1 dependent)

#### 1. `frontend` — Build & Lint
```
checkout → setup Node 22 → npm ci → npm run lint → npm run build → upload dist/
```
- Runs `eslint` to catch code style / unused variables
- Runs `tsc -b && vite build` to verify TypeScript compiles and Vite bundles cleanly
- Uploads the `dist/` folder as a GitHub artifact (useful for deploy previews)

#### 2. `backend` — Compile
```
checkout → setup Node 22 → cd server && npm ci && npm run build
```
- Installs server dependencies from `server/package-lock.json`
- Runs `tsc` to compile Express + MySQL backend to `server/dist/`

#### 3. `smoke-test` — Sanity check
```
checkout → setup Node → cd server && npm ci && npm run build → node -e "require('./dist/index.js')"
```
- Depends on `backend` job finishing successfully
- Only verifies the compiled server JS loads without syntax errors
- **Does NOT test DB connections** (MySQL is not available in this job)

> For real DB integration tests, add a `services:` MySQL container block to the job.

---

## How to add Deployment

### Option A: Deploy Frontend (Netlify / Vercel)
Add a 4th job after `frontend`:

```yaml
  deploy-frontend:
    needs: frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: frontend-dist
          path: dist/
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

### Option B: Deploy Backend (Render / Railway / Fly.io)
- Render and Railway auto-deploy from `main` on push — no GitHub Actions needed.
- For Fly.io, add `fly deploy --dockerfile ./server/Dockerfile` in a job.

---

## Should you separate the `server/` folder into its own repo?

### Short answer: **Keep it together for now.**

Your project is a **fullstack monorepo** with one React frontend + one Express backend. This is a very common, productive setup for indie/small teams.

### Reasons to keep it together
| Benefit | Why it matters for you |
|---|---|
| **Single PR** | Adding a new chapter? You update frontend levels, Phaser scenes, AND backend analytics in one PR with one review. |
| **Shared types** | You can share TypeScript interfaces between frontend and backend (e.g., `LevelData`, `UserProgress`). |
| **Easier onboarding** | One `git clone`, one repo to understand. |
| **Atomic deploys** | Frontend and backend ship together — no version mismatch drift. |
| **Cost** | GitHub Actions minutes are cheaper when you run both builds in one workflow. |

### When you SHOULD split into two repos
| Signal | Action |
|---|---|
| Backend becomes a standalone API used by a mobile app or another frontend | Extract `server/` → `ganitquest-api` |
| You hire a backend team that never touches React/Phaser | Separate repo + independent CI |
| You want independent deploy lifecycles (backend deploys daily, frontend weekly) | Split repos or use a monorepo tool (Turborepo / Nx / pnpm workspaces) |
| The server grows into 3+ microservices | Definitely split — one repo per service |

### Middle ground (recommended if you scale)
Keep one repo but add **Turborepo / pnpm workspaces** so you get:
- Cached builds (don't rebuild frontend when only backend changed)
- Independent deploy pipelines per app
- Still one `git clone`

```
├── apps/
│   ├── web/          ← Vite + React + Phaser (current root src/)
│   └── server/       ← Express + MySQL (current server/)
├── packages/
│   └── shared-types/ ← shared TS interfaces
├── turbo.json
└── package.json
```

### Bottom line
Your current setup (`server/` inside the same repo) is **perfectly fine**. Don't refactor prematurely. If you later need to split, it's a 1-day migration.

---

## Required GitHub Secrets (for deployment only)

If you add the deploy jobs above, add these in **Settings → Secrets and variables → Actions**:

| Secret | Used by |
|---|---|
| `NETLIFY_SITE_ID` | Netlify deploy |
| `NETLIFY_AUTH_TOKEN` | Netlify deploy |
| `RENDER_API_KEY` | Render deploy |
| `FLY_API_TOKEN` | Fly.io deploy |

---

## Local testing of the workflow

You can test the workflow logic locally with [`act`](https://github.com/nektos/act):

```bash
# Run the default job (frontend)
act

# Run a specific job
act -j backend

# Run with a local artifact server
act --artifact-server-path /tmp/artifacts
```
