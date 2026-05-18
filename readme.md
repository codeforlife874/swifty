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

### 4. Explanation
A breakdown of how scheduling and sorting work, what the metrics mean in this specific context, and the underlying computer science concepts:

### How Sorting and Scheduling Work
**1. Sorting (Merge Sort):**
Before orders are sent to the packing stations, the system needs to prioritize them. It uses **Merge Sort** to sort the global order queue. The sorting logic ranks orders based on their Service Level Agreement (SLA) tiers (e.g., "15 mins delivery" vs "Standard delivery") and their packing time efficiency. Merge sort ensures this is done quickly and reliably with an O(n log n) time complexity.

**2. Scheduling (CPU Scheduling Algorithms):**
Once sorted/queued, the orders are assigned to warehouse packing stations using models inspired by Operating System CPU schedulers:
*   **FCFS (First Come First Serve):** The packing station processes orders strictly based on their `arrival_time`. It is simple and fair but can cause the "convoy effect," where quick express orders get stuck waiting behind large, slow standard orders.
*   **SJF (Shortest Job First):** Out of all currently arrived orders, the packing station always picks the one with the shortest `packing_time`. This minimizes the overall average waiting time but risks "starvation" (very large standard orders might never get packed if short express orders keep arriving).
*   **Hybrid (Multi-Level Queue):** The system mimics a multi-core processor by running two parallel packing stations:
    *   **Queue 1 (Express Station):** Handles high-priority orders (15 min / 60 min deliveries) using **SJF** to get them out as fast as possible.
    *   **Queue 2 (Standard Station):** Handles normal priority orders (1 Day / Standard) using **FCFS** to ensure fairness and prevent starvation.

### What the Metrics Depict (Context vs. OS Definition)
In operating systems, these metrics measure process execution on a CPU. In SwiftShip, they measure warehouse fulfillment efficiency:

*   **Waiting Time (`start_time - arrival_time`):** 
    *   **Context:** The time an order sits idle in the warehouse queue before a worker actually starts packing it.
    *   **CS Meaning:** The total time a process spends waiting in the ready queue before getting CPU time.
*   **Turnaround Time (`end_time - arrival_time`):** 
    *   **Context:** The total elapsed time from the exact moment a customer clicks "Place Order" to the moment the box is packed and ready to ship.
    *   **CS Meaning:** The total time taken from the submission of a process to its completion (Wait Time + Execution Time).
*   **Throughput (`number of orders / total_time`):** 
    *   **Context:** The packing rate of the warehouse (e.g., how many orders the station can successfully pack per hour/minute). 
    *   **CS Meaning:** The number of processes completed per time unit.

### The Core CS and Logical Parts
The application essentially frames a real-world logistics and supply chain problem as a classic Computer Science resource allocation problem:
*   **Processes (Tasks) =** Customer Orders
*   **CPU (Processor) =** Warehouse Packing Station
*   **Burst Time (Execution Time) =** Packing Time
*   **Arrival Time =** Order Placement Time
*   **Priority =** Delivery SLA (15 min vs Standard)

By mapping e-commerce fulfillment directly to OS scheduling, it visually proves why advanced OS algorithms (like Multi-Level Queues / Hybrid SJF) are mathematically superior at handling fast-lane priority streams compared to basic chronological (FCFS) processing.