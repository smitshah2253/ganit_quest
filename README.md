# GanitQuest: Gamified Math Lab (Class X NCERT/CBSE)

GanitQuest is an interactive, gamified math learning platform that translates abstract Class X NCERT syllabus concepts into visual, manipulable geometry laboratories. 

Developed with a React + TypeScript frontend, a Phaser 3 interactive engine, and a Node.js/Express + MySQL backend, the platform bridges the gap between spatial intuition and formal symbolic worksheets.

---

## 🚀 Quick Start (How to Run)

GanitQuest is structured as an **npm workspaces monorepo** containing both the frontend (`apps/web`) and backend (`apps/server`).

### Prerequisites
- Node.js (v18+ recommended)
- MySQL (running locally on port 3306 for the backend database)

### 1. Install Dependencies
Run the following command from the **root** of the project. This will automatically install and link dependencies for all workspaces:
```bash
npm install
```

### 2. Environment Variables
You will need a `.env` file in the `apps/server/` directory for the database connection. Create `apps/server/.env` with the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ganitquest
JWT_SECRET=your_secret_key
```

### 3. Run the Development Servers
You can run the frontend and backend servers simultaneously from the root using npm workspace scripts:

**Run the Frontend (React + Vite):**
```bash
npm run dev:web
```
*The web app will be available at http://localhost:5173*

**Run the Backend (Express + TypeORM):**
```bash
npm run dev:server
```
*The API will be available at http://localhost:5000*

### 4. Build for Production
To build all packages and apps (shared, server, web) for production, run:
```bash
npm run build
```

---

## 📖 Key Documentation Modules

We have compiled comprehensive guides detailing the architecture, pedagogy, mobile roadmap, and commercial scaling vectors of the startup:

1. 🛠️ **[Technical Documentation](./docs/architecture/technical_documentation.md)**
   - Deploys the complete system architecture, frontend Phaser-React EventBus bridge, Zustand state stores, MySQL schema, Express REST API, and deployment instructions.
   
2. 📐 **[Business Logic & Pedagogy](./docs/business/business_logic.md)**
   - Maps out the core learning loops, NCERT curriculum mapping, star/XP rewards formulas, and details the step-by-step intermediate verification engine designed to mirror Class X board exam formats.
   
3. 🚀 **[Launch, Marketing & Monetization Strategy (Indian Localized)](./docs/business/launch_marketing_monetization.md)**
   - Sets up a Go-To-Market roadmap, Indian-localized saffron/indigo theme tokens, logo concept, freemium pricing structures, school B2B licensing targets, and a detailed market analysis (potential, competition, student appeal).

4. 📱 **[React Native Mobile Conversion Guide](./docs/guides/react_native_conversion.md)**
   - Outlines the step-by-step roadmap to migrate the web application into a React Native (Expo) mobile app, covering Phaser WebView bridging, native Skia layouts, gesture handlers, and secure local storage.

---

## ⚡ Core Features

- **Real-Time Interactive Canvas**: Students manipulate vertices, angles, heights, and radii directly in the browser to watch calculations update dynamically.
- **CBSE Step-by-Step Hint System**: Converts simple input boxes into interactive worksheets with step-by-step mathematical statements, preparing students for written board exam formats.
- **NCERT Alignment**: Custom levels targeting Quadrant Cartesian plotting, coordinate distance formulas, trigonometry identities, heights & distances observer towers, and volumes/surface areas of combination solids.
- **Secure Authentication**: Supports JWT-based email registration/login, password recovery workflows, and Google OAuth Single-Sign-On integrations.
