# Vinayaga Glass & Plywoods - Project Documentation

## Project Overview
This project is a split-service application consisting of:
- **Frontend Admin Panel**: React-based dashboard for managing inventory and orders.
- **Frontend User App**: Customer-facing e-commerce site for browsing and estimating costs.
- **Backend Admin Service**: Node.js service for admin-related API logic.
- **Backend User Service**: Node.js service for customer-facing API logic.
- **Database**: Shared JSON-based storage for product information.

## Directory Structure
- `frontend/`: Contains the React applications for Admin and User.
- `backend/`: Contains the microservices for Admin and User logic.
- `database/`: Shared data storage.
- `docs/`: Project documentation and guides.

## Running the Project
Use the npm scripts in the root directory:
- `npm run dev:user`: Start User Frontend (Port 3000)
- `npm run dev:admin`: Start Admin Frontend (Port 3001)
- `npm run backend:user`: Start User Backend (Port 5000)
- `npm run backend:admin`: Start Admin Backend (Port 5001)
