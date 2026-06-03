# Device Monitoring Frontend

A modern **Next.js 16** frontend for the Device Monitoring System. It provides real-time device monitoring, analytics, and management features with a responsive UI and WebSocket-based live updates.

---

# Tech Stack

* Next.js 16.2.7
* React 19.2.4
* TypeScript 5
* Tailwind CSS 4
* Axios 1.16.1
* Socket.IO Client 4.8.3
* Recharts 3.8.1 (charts & analytics)
* date-fns 4.4.0
* Lucide React (icons)

---

# Features

* JWT-based authentication
* Protected routes
* Device dashboard with live updates
* Device detail page (`/device/[id]`)
* Add device modal workflow
* Real-time updates via Socket.IO
* Device analytics with charts (Recharts)
* Responsive modern UI
* Centralized API layer (Axios)
* Utility-based date formatting
* Scalable component architecture

---

# Project Structure

```text id="q1k9fd"
app/
├── (pages)/
│   ├── dashboard/
│   │   └── page.tsx
│   └── device/
│       └── [id]/
│           └── page.tsx
│
├── auth/
│   └── login/
│       └── page.tsx
│
├── components/
│   ├── AddDeviceModal.tsx
│   ├── DeviceCard.tsx
│   ├── Logo.tsx
│   ├── ProtectedRoute.tsx
│   └── StatusBadge.tsx
│
├── contexts/
│   └── AuthContext.tsx
│
├── services/
│   ├── api.ts
│   └── auth.ts
│
├── types/
│   └── index.ts
│
├── utils/
│   └── formatDate.ts
│
├── globals.css
├── layout.tsx
└── page.tsx
```

---

# Getting Started

## 1. Clone the repository

```bash id="k8h2qp"
git clone https://github.com/isaacrabin/device-monitoring-service_BCS.git
cd device-monitoring-service_BCS/frontend
```

---

## 2. Install dependencies

```bash id="v9l2ds"
npm install
```

---

## 3. Environment Variables

Create a `.env.local` file:

```env id="e3n9ak"
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

> Note: Socket.IO typically uses the base backend URL (not `/ws` unless you explicitly configured it).

---

## 4. Run development server

```bash id="p2q8xz"
npm run dev
```

Open:

```text id="m8v1la"
http://localhost:3000
```

---

## 5. Build & Production

```bash id="c4t9wy"
npm run build
npm run start
```

---

## 6. Linting

```bash id="z1r7hb"
npm run lint
```

---

## 7. Docker Support

Build image:

```bash id="x6d3pq"
docker build -t device-monitoring-frontend .
```

Run container:

```bash id="u9k2cn"
docker run -p 3000:3000 device-monitoring-frontend
```

---

# Backend Dependency

The frontend depends on the backend service:

```text id="f3n8qw"
http://localhost:8080
```

Backend repository:

```text id="r7m2xa"
https://github.com/isaacrabin/device-monitoring-service_BCS.git
```

Make sure:

* Backend is running
* PostgreSQL is running via Docker
* Socket.IO / WebSocket endpoint is active
* API endpoints are reachable

---

# Architecture

```text id="t5k9op"
Frontend (Next.js 16)
        ↓
Axios (REST API)
        ↓
Spring Boot Backend
        ↓
PostgreSQL

Real-time layer:
Frontend ↔ Socket.IO ↔ Backend
```

---

# Available Scripts

```bash id="b8n1cd"
npm run dev       # Start development server
npm run build     # Build production app
npm run start     # Run production build
npm run lint      # Run ESLint
```

---

# Notes

* Uses Next.js App Router (`app/`)
* Socket.IO is used for real-time updates (not raw WebSockets)
* Authentication handled via React Context (`AuthContext`)
* API layer centralized in `services/`
* Charts powered by Recharts
* Backend must be running for full functionality

---

# Future Improvements

* Refresh token rotation
* Role-based access control (admin/user)
* Advanced analytics dashboard
* Dark mode support
* Unit + integration tests
* GitHub Actions CI/CD pipeline
* PWA support
