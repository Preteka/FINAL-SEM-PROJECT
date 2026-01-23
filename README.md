# Vinayaga Glass & Plywoods

A modern e-commerce application for plywood and glass products.

## Project Structure
```text
├── frontend/
│   ├── admin-panel/   - Admin dashboard (Port 3001)
│   └── user-app/      - Customer e-commerce (Port 3000)
│
├── backend/
│   ├── admin-service/ - Admin API (Port 5001)
│   └── user-service/  - User API (Port 5000)
│
├── database/         - Shared JSON data storage
│
├── docs/             - Project documentation
│
└── README.md         - Root project guide
```

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation
Go to each directory and run:
```bash
npm install
```

### Running the Services
From the root directory:
- `npm run dev:user`: Start User App
- `npm run dev:admin`: Start Admin Panel
- `npm run backend:user`: Start User Backend
- `npm run backend:admin`: Start Admin Backend

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (Vanilla CSS modules)
- **Backend**: Node.js, Express
- **Database**: Firestore (for dynamic products), local JSON (for static/backup)
