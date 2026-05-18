# SwiftShip 
## E-Commerce Order Fulfillment Engine

SwiftShip is a web application designed to simulate how modern e-commerce warehouses intelligently process and ship orders. It visualizes the entire logistics pipeline—from customer order placement to priority sorting and warehouse packing—using core computer science algorithms like **Merge Sort** and **CPU Scheduling** (FCFS, SJF, and Hybrid).

---

##  Features

*   **Role-Based Access Control (RBAC):** Separate portals for Customers (to browse products and place orders) and Admins (to oversee the global queue and run warehouse simulations).
*   **Customer Storefront:** A dynamic product catalog featuring automated placeholder images, pricing, and 4 distinct delivery SLAs (15 Mins, 60 Mins, 1 Day, and Standard).
*   **Personalized Order Tracking:** Customers can view their specific order history and track fulfillment status.
*   **Merge Sort Visualization:** Step-by-step animation of O(n log n) Merge Sort prioritizing the global order queue based on SLA tiers and packing time efficiency.
*   **Multi-Queue Packing Simulation (CPU Scheduling):** Real-time Gantt-style simulation of warehouse packing stations.
    *   **FCFS (First Come First Serve):** Simple but prone to convoy effects.
    *   **SJF (Shortest Job First):** Optimal turnaround for fast orders but risks starvation.
    *   **Hybrid Scheduler:** A multi-level queue routing high-priority orders (15/60 mins) to an SJF "fast lane" and standard orders to an FCFS queue, parallelized across stations.
*   **Real-time Analytics:** Interactive charts powered by Recharts comparing algorithm throughput, waiting times, and turnaround efficiency.

---

## Setup Instructions

The project is split into a Python Flask backend and a Vite + React frontend. You will need to run both concurrently.

### 1. Backend Setup

The backend handles the global state, order logic, and sorting/scheduling algorithms.

**Prerequisites:** Python 3.8+

Navigate to the backend directory:
```bash
cd backend
```

**Option A: Windows (PowerShell)**
```powershell
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server (runs on port 5000)
python app.py
```

**Option B: Linux / macOS**
```bash
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server (runs on port 5000)
python3 app.py
```

### 2. Frontend Setup

The frontend provides the interactive UI, animations, and data visualization.

**Prerequisites:** Node.js 18+

Open a **new terminal** window/tab and navigate to the frontend directory:
```bash
cd frontend
```

**For both Windows and Linux:**
```bash
# Install NPM dependencies
npm install

# Start the Vite development server
npm run dev
```

### 3. Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Click **Get Started**.
3. **Admin Access:** Log in using username `admin` and password `password` to access the Control Center.
4. **Customer Access:** Register a new account to access the Shop, place orders with varying priorities, and view your personal order history.
5. Watch the Admin Control Center process your newly placed customer orders in real-time.
