# Swifty

A modern full-stack application built with JavaScript and Python, combining a responsive React frontend with a robust Python backend.

## About

Swifty is a scalable web application that leverages JavaScript for client-side interactivity and Python for server-side operations. The project uses React with Vite for fast development and builds, while the backend provides API services and business logic.

## Tech Stack

- **Frontend**: JavaScript, React, Vite, CSS, HTML
- **Backend**: Python
- **Frontend Build**: Vite with HMR (Hot Module Replacement)
- **Code Distribution**: JavaScript (75.6%), Python (19.4%), CSS (4.6%), HTML (0.4%)

## Features

- React-based UI with Vite for optimized development and production builds
- Hot Module Replacement for instant feedback during development
- Python backend for business logic and data processing
- Modular architecture for maintainability and scalability
- ESLint integration for code quality
- Cross-platform support with standardized setup procedures

## Prerequisites

- Node.js (v16 or higher) for frontend
- npm or yarn package manager
- Python (v3.8 or higher) for backend
- pip for Python package management
- Git for version control

## Setup

### Windows (PowerShell)

#### Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```

#### Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Linux

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
swifty/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── venv/
└── README.md
```

## Development

### Frontend Development

The frontend uses Vite for fast development builds and Hot Module Replacement. After running `npm run dev`, the application will be available at `http://localhost:5173`.

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development

The backend runs as a Python application. Ensure the virtual environment is activated before running.

```bash
cd backend
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\Activate.ps1  # Windows

python app.py
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
Ensure all dependencies in `requirements.txt` are installed and the application is configured for production deployment.

## Contributing

Contributions are welcome. Please follow the existing code structure and style conventions when submitting changes.

## Support

For issues, questions, or contributions, please open an issue or pull request in the repository.
