# Technical Documentation: MathQuest Gamified Math Lab

This document provides a comprehensive technical overview of the **MathQuest** gamified learning platform architecture, technologies, data flow, and components.

---

## 1. System Architecture Overview

MathQuest is built using a modern decoupled architecture consisting of a **React + TypeScript + Vite** frontend integrated with a **Phaser 3** physics/graphics canvas, connected to an **Express + Node.js** backend using **MySQL** for persistence.

```mermaid
graph TD
    subgraph Client (Frontend)
        React[React UI Shell]
        Zustand[Zustand State Stores]
        Phaser[Phaser 3 Canvas]
        EventBus[EventBus Bridge]
    end
    
    subgraph Server (Backend)
        Express[Express REST API]
        JWT[JWT Authentication]
    end
    
    subgraph Database
        MySQL[(MySQL database)]
    end

    React <--> EventBus
    Phaser <--> EventBus
    React <--> Zustand
    React -- HTTP Requests --> Express
    Express <--> MySQL
```

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Graphics Engine**: Phaser 3 (for rendering interactive coordinate grids, trigonometry triangles, shapes, and animations)
- **State Management**: Zustand (for reactive, lightweight state storage)
- **Animations**: Framer Motion (for premium UI micro-animations and screen transitions)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express (TypeScript)
- **Database Driver**: `mysql2/promise` (for async-await MySQL connection pooling)
- **Authentication**: Google OAuth2 (`google-auth-library`), JSON Web Tokens (`jsonwebtoken`), and `bcrypt` for local credential hashing.

### Database
- **Engine**: MySQL 8.x
- **Schema**: Structured user profiling, curriculum progress, and reward tracking.

---

## 3. Frontend Architecture & Integration

### The Phaser-React Bridge (EventBus)
Since Phaser and React run as separate systems (Canvas rendering loop vs. Virtual DOM reconciliation), they communicate asynchronously using a unified Event-Driven architecture powered by a custom **EventBus** ([EventBus.ts](file:///c:/Users/Smit/OneDrive/Desktop/Projects/startup/gamified_math/src/game/EventBus.ts)).

#### Major Events Triggers:
1. `load-level`: Triggered by React when a user selects a level. Phaser clears the active scene and spins up the appropriate interactive scene.
2. `user-input-changed`: Triggered by either React (slider/numeric typing) or Phaser (node coordinate drag) to update dimensions in real-time.
3. `board-exam-input-changed`: Triggered to sync multi-step board exam blanks between React worksheets and Phaser visual components.
4. `coordinate-point-dragged`: Emitted by Phaser's grid handles when dragged, enabling React to calculate active mathematical answers instantly.

---

## 4. State Management (Zustand)

Global state is split into two specialized stores:

### A. Auth Store (`authStore.ts`)
Tracks authentication status, user session token, and basic profile parameters. It persists credentials to `localStorage` automatically to preserve sessions.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  stars: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}
```

### B. Game Store (`gameStore.ts`)
Manages gamified statistics (Experience Points, stars accumulated, currently selected level, and list of unlocked levels).

```typescript
interface GameState {
  xp: number;
  stars: number;
  currentLevelId: string | null;
  unlockedLevels: string[];
  addXp: (amount: number) => void;
  addStars: (amount: number) => void;
  setCurrentLevel: (levelId: string) => void;
  unlockLevel: (levelId: string) => void;
}
```

---

## 5. Phaser Interactive Scenes

Phaser is utilized for visual learning modules. It is structured into three main scenes loaded via the primary [PhaserGame.tsx](file:///c:/Users/Smit/OneDrive/Desktop/Projects/startup/gamified_math/src/game/PhaserGame.tsx) container:

### A. Coordinate Scene (`CoordinateScene.ts`)
- **Render Engine**: Draws dynamic Cartesian systems with adaptive grid lines and custom bold primary axes.
- **Dragging Mechanics**: Configures draggable nodes with circular physics and mathematical boundary clamping (snaps to clean integer coordinate vectors).
- **Visual Triggers**: Projects dashed indicator guidelines (`projectionX`, `projectionY`) perpendicular to the axes. Draws green laser sights for vector lines connecting vertices (e.g., distances, midpoints, or polygonal boundaries).

### B. Trigonometry Scene (`TrigonometryScene.ts`)
- **Mode Foundations**: Handles multiple interactive modes:
  1. *Angle Foundations*: Sweeps vector beams in Quadrant I, with magnetic snapping to standard trigonometric angles ($0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$).
  2. *Trigonometric Ratios*: Models a scalable right-angled triangle with three colored neon lasers highlighting the opposite (pink), adjacent (indigo), and hypotenuse (cyan) sides.
  3. *Identity Lab*: Unit circle unit projection displaying $\sin\theta$, $\cos\theta$, and validating the identity $\sin^2\theta + \cos^2\theta = 1$ dynamically.
  4. *Heights & Distances*: Renders vector-landscape silhouettes (observation towers, mountains, ladders) to visually teach trigonometric applications in real-world scenarios.

### C. Level Scene (`LevelScene.ts`)
Manages standard three-dimensional space models for **Surface Area and Volumes** (Cubes, Cuboids, Cylinders, Cones, Spheres, and combination solids) with real-time scaling physics as input dimensions fluctuate.

---

## 6. Backend API & Routing

The Express server exposes authentication endpoints and user profile synchronization routes:

### Authentication Route Endpoints (`routes/auth.ts`)
- **`POST /auth/register`**: Hashes user passwords using `bcrypt` and inserts them into the MySQL table, generating a JWT session.
- **`POST /auth/login`**: Authenticates user credentials, validating email and password hashes.
- **`POST /auth/google`**: Handles Google OAuth SSO token verification using Google's Client Library.
- **`POST /auth/forgot-password`**: Generates cryptographic reset tokens expiring in 1 hour and sends email reset triggers.
- **`POST /auth/reset-password`**: Consumes reset tokens to update stored password hashes.

---

## 7. Database Architecture

MySQL stores credentials, overall levels, and progress metrics inside a simple, highly optimized single-table model (scaling to a relational module in subsequent stages).

### Schema Structure (`schema.sql`):
```sql
CREATE DATABASE IF NOT EXISTS gamified_math;
USE gamified_math;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NULL,       -- Null for Google SSO users
  google_id VARCHAR(255) UNIQUE,     -- Populated for Google Auth
  xp INT DEFAULT 0,                  -- Accumulative experience
  level INT DEFAULT 1,               -- Current user avatar rank
  stars INT DEFAULT 0,               -- Core reward currency
  reset_token VARCHAR(255) NULL,     -- Recovery credentials
  reset_token_expiry DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 8. Deployment and Configuration Setup

### Prerequisites
- Node.js installed (v18+)
- MySQL Server running

### Environment Configuration

#### Frontend (`.env` in root)
```env
VITE_API_URL=http://localhost:5000
```

#### Backend (`server/.env`)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gamified_math
JWT_SECRET=supersecretjwttoken
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Installation Commands
To boot the development workspace:

```bash
# Install root (Frontend) dependencies
npm install

# Run Frontend in dev mode
npm run dev

# Install Backend dependencies
cd server
npm install

# Run backend server
npm run dev
```
