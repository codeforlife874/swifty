from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time

from utils.order_generator import generate_random_orders, generate_catalog, create_order_from_product
from algorithms.merge_sort import merge_sort_tracked
from algorithms.scheduling import fcfs_schedule, sjf_schedule, hybrid_schedule

app = Flask(__name__)
CORS(app)

# Global State for the Application
GLOBAL_STATE = {
    "catalog": generate_catalog(20),
    "orders": [],
    "users": {
        "admin": {"password": "password", "role": "admin"}
    },
    "current_time": 0 # Track arrival time baseline
}

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
        
    if username in GLOBAL_STATE["users"]:
        return jsonify({"error": "User already exists"}), 409
        
    GLOBAL_STATE["users"][username] = {"password": password, "role": "customer"}
    return jsonify({"message": "User registered successfully", "role": "customer", "username": username})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = GLOBAL_STATE["users"].get(username)
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401
        
    return jsonify({"message": "Login successful", "role": user["role"], "username": username})

@app.route('/api/catalog', methods=['GET'])
def get_catalog():
    return jsonify({"catalog": GLOBAL_STATE["catalog"]})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    username = request.args.get('username')
    if username:
        user_orders = [o for o in GLOBAL_STATE["orders"] if o.get('customer_username') == username]
        return jsonify({"orders": user_orders})
    return jsonify({"orders": GLOBAL_STATE["orders"]})

@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.json
    product_id = data.get('product_id')
    delivery_type = data.get('delivery_type')
    username = data.get('username')
    
    product = next((p for p in GLOBAL_STATE["catalog"] if p["product_id"] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
        
    GLOBAL_STATE["current_time"] += 1
    order = create_order_from_product(product, delivery_type, GLOBAL_STATE["current_time"], username)
    GLOBAL_STATE["orders"].append(order)
    
    return jsonify({"message": "Order placed successfully", "order": order})

@app.route('/api/orders', methods=['DELETE'])
def clear_orders():
    GLOBAL_STATE["orders"] = []
    GLOBAL_STATE["current_time"] = 0
    return jsonify({"message": "Order queue cleared"})

@app.route('/api/generate-orders', methods=['POST'])
def generate_bulk_orders():
    count = int(request.args.get('count', 50))
    new_orders = generate_random_orders(count)
    # Fix arrival times relative to current global time
    for order in new_orders:
        order['arrival_time'] += GLOBAL_STATE["current_time"]
    
    GLOBAL_STATE["orders"].extend(new_orders)
    # Update current time past max arrival time of generated
    if new_orders:
        max_arr = max(o['arrival_time'] for o in new_orders)
        GLOBAL_STATE["current_time"] = max(GLOBAL_STATE["current_time"], max_arr)
        
    return jsonify({"orders": GLOBAL_STATE["orders"]})

@app.route('/api/merge-sort', methods=['POST'])
def run_merge_sort():
    data = request.json
    # Optionally sort passed orders, else sort global state
    orders = data.get('orders', GLOBAL_STATE["orders"])
    sorted_orders, frames = merge_sort_tracked(orders)
    return jsonify({
        "sorted_orders": sorted_orders,
        "frames": frames
    })

@app.route('/api/schedule/fcfs', methods=['POST'])
def run_fcfs():
    data = request.json
    orders = data.get('orders', GLOBAL_STATE["orders"])
    result = fcfs_schedule(orders)
    return jsonify(result)

@app.route('/api/schedule/sjf', methods=['POST'])
def run_sjf():
    data = request.json
    orders = data.get('orders', GLOBAL_STATE["orders"])
    result = sjf_schedule(orders)
    return jsonify(result)

@app.route('/api/schedule/hybrid', methods=['POST'])
def run_hybrid():
    data = request.json
    orders = data.get('orders', GLOBAL_STATE["orders"])
    result = hybrid_schedule(orders)
    return jsonify(result)

@app.route('/api/analytics', methods=['POST'])
def get_analytics():
    data = request.json
    orders = data.get('orders', GLOBAL_STATE["orders"])
    
    fcfs = fcfs_schedule(orders)
    sjf = sjf_schedule(orders)
    hybrid = hybrid_schedule(orders)
    
    return jsonify({
        "algorithms": {
            "FCFS": fcfs,
            "SJF": sjf,
            "Hybrid": hybrid
        },
        "insights": generate_insights(fcfs, sjf, hybrid)
    })

def generate_insights(fcfs, sjf, hybrid):
    insights = []
    
    best_turnaround = min([
        ("FCFS", fcfs["avg_turnaround_time"]),
        ("SJF", sjf["avg_turnaround_time"]),
        ("Hybrid", hybrid["avg_turnaround_time"])
    ], key=lambda x: x[1])
    insights.append(f"{best_turnaround[0]} achieved the lowest average turnaround time of {best_turnaround[1]:.2f}s.")
    
    # Calculate fast lane wait time (15 mins and 60 mins delivery)
    def get_fast_wait(gantt):
        fast = [x for x in gantt if x['type'] in ['15 mins delivery', '60 mins delivery']]
        if not fast: return 0
        return sum([x['waiting_time'] for x in fast]) / len(fast)
        
    fcfs_fast_wait = get_fast_wait(fcfs["gantt"])
    hybrid_fast_wait = get_fast_wait(hybrid["express_gantt"])
    
    if fcfs_fast_wait > 0:
        reduction = ((fcfs_fast_wait - hybrid_fast_wait) / fcfs_fast_wait) * 100
        if reduction > 0:
            insights.append(f"Hybrid scheduling reduced average fast-lane (15/60 min) delivery delay by {reduction:.1f}%.")
        else:
            insights.append("Hybrid scheduling had similar fast-lane delivery delay to FCFS in this run.")
    
    best_throughput = max([
        ("FCFS", fcfs["throughput"]),
        ("SJF", sjf["throughput"]),
        ("Hybrid", hybrid["throughput"])
    ], key=lambda x: x[1])
    insights.append(f"Highest throughput was observed in {best_throughput[0]} algorithm ({best_throughput[1]:.2f} orders/time).")
    
    return insights

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
