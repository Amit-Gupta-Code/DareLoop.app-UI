# ChainLoop

ChainLoop is a full-stack application composed of a decoupled frontend and backend architecture.

## Project Structure

The repository is divided into two distinct parts:

- **`backend/`**: A robust **Laravel (PHP)** application. It provides the RESTful API, database management, background queues, and data logic required by the application.
- **`chainloop-ui/`**: A modern **Vite + React (TypeScript)** frontend. It handles the user interface, Google authentication integrations, and API interactions.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Backend:** PHP >= 8.1, Composer, and a supported database (MySQL, PostgreSQL, or SQLite).
- **Frontend:** Node.js (>= 18) and NPM.

## Local Development Setup

### 1. Backend (Laravel)

Navigate to the backend directory and set up the application:

    cd backend
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate
    php artisan serve

### 2. Frontend (Vite / React)

Open a new terminal window, navigate to the frontend directory, and start the development server:

    cd chainloop-ui
    npm install
    cp .env.example .env

*Note: Make sure to populate required environment variables in your new frontend `.env` file, such as `VITE_GOOGLE_CLIENT_ID`.*

    npm run dev

## Deployment

Continuous Integration and Continuous Deployment (CI/CD) is mapped out via GitHub Actions.
A baseline workflow is located at `.github/workflows/deploy.yml`. 

Because deployment requirements vary by hosting provider (e.g., AWS, Laravel Forge, Vercel), you will need to add the specific commands to transfer the built files and run production scripts to the end of each job in the deployment file.