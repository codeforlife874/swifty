def fcfs_schedule(orders):
    # FCFS: Sort by arrival time
    orders = sorted(orders, key=lambda x: x['arrival_time'])
    
    time = 0
    gantt = []
    stats = {
        "turnaround_times": [],
        "waiting_times": []
    }
    
    for order in orders:
        if time < order['arrival_time']:
            time = order['arrival_time']
            
        start_time = time
        waiting_time = start_time - order['arrival_time']
        time += order['packing_time']
        end_time = time
        turnaround_time = end_time - order['arrival_time']
        
        gantt.append({
            "order_id": order["order_id"],
            "type": order["type"],
            "start_time": start_time,
            "end_time": end_time,
            "packing_time": order['packing_time'],
            "waiting_time": waiting_time
        })
        
        stats["waiting_times"].append(waiting_time)
        stats["turnaround_times"].append(turnaround_time)
        
    avg_waiting_time = sum(stats["waiting_times"]) / len(orders) if orders else 0
    avg_turnaround_time = sum(stats["turnaround_times"]) / len(orders) if orders else 0
    
    return {
        "algorithm": "FCFS",
        "gantt": gantt,
        "avg_waiting_time": avg_waiting_time,
        "avg_turnaround_time": avg_turnaround_time,
        "total_time": time,
        "throughput": len(orders) / time if time > 0 else 0
    }


def sjf_schedule(orders):
    # Shortest Job First (Non-preemptive)
    # At any given time, out of all arrived orders, pick the one with shortest packing time
    orders = sorted(orders, key=lambda x: x['arrival_time'])
    
    time = 0
    completed = 0
    n = len(orders)
    
    is_completed = [False] * n
    
    gantt = []
    waiting_times = []
    turnaround_times = []
    
    while completed != n:
        # Find all available orders at current time
        available = []
        for i in range(n):
            if not is_completed[i] and orders[i]['arrival_time'] <= time:
                available.append((orders[i], i))
                
        if not available:
            # If no orders available, advance time to next arrival
            next_arrival = min([orders[i]['arrival_time'] for i in range(n) if not is_completed[i]])
            time = next_arrival
            continue
            
        # Pick the one with shortest packing time
        available.sort(key=lambda x: x[0]['packing_time'])
        chosen_order, idx = available[0]
        
        start_time = time
        waiting_time = start_time - chosen_order['arrival_time']
        time += chosen_order['packing_time']
        end_time = time
        turnaround_time = end_time - chosen_order['arrival_time']
        
        gantt.append({
            "order_id": chosen_order["order_id"],
            "type": chosen_order["type"],
            "start_time": start_time,
            "end_time": end_time,
            "packing_time": chosen_order['packing_time'],
            "waiting_time": waiting_time
        })
        
        waiting_times.append(waiting_time)
        turnaround_times.append(turnaround_time)
        is_completed[idx] = True
        completed += 1
        
    avg_waiting_time = sum(waiting_times) / n if n else 0
    avg_turnaround_time = sum(turnaround_times) / n if n else 0
    
    return {
        "algorithm": "SJF",
        "gantt": gantt,
        "avg_waiting_time": avg_waiting_time,
        "avg_turnaround_time": avg_turnaround_time,
        "total_time": time,
        "throughput": n / time if time > 0 else 0
    }


def hybrid_schedule(orders):
    # Hybrid: 2 queues. 
    # Queue 1: Express (SJF)
    # Queue 2: Standard (FCFS)
    # Run in parallel on two separate packing stations (CPUs)
    # Queue 1: Fast (SJF) -> 15 mins delivery, 60 mins delivery
    # Queue 2: Normal (FCFS) -> 1 day delivery, Standard delivery
    
    express_types = ["15 mins delivery", "60 mins delivery"]
    express_orders = [o for o in orders if o['type'] in express_types]
    standard_orders = [o for o in orders if o['type'] not in express_types]
    
    # Process Express using SJF
    express_result = sjf_schedule(express_orders) if express_orders else {"gantt": [], "avg_waiting_time": 0, "avg_turnaround_time": 0, "total_time": 0}
    
    # Process Standard using FCFS
    standard_result = fcfs_schedule(standard_orders) if standard_orders else {"gantt": [], "avg_waiting_time": 0, "avg_turnaround_time": 0, "total_time": 0}
    
    # Combine results
    all_gantt = express_result["gantt"] + standard_result["gantt"]
    # Sort by start time for overall visualization
    all_gantt = sorted(all_gantt, key=lambda x: x["start_time"])
    
    total_time = max(express_result.get("total_time", 0), standard_result.get("total_time", 0))
    n = len(orders)
    
    total_wait = sum(item['waiting_time'] for item in all_gantt)
    total_turnaround = sum((item['end_time'] - (item['start_time'] - item['waiting_time'])) for item in all_gantt)
    
    avg_waiting_time = total_wait / n if n else 0
    avg_turnaround_time = total_turnaround / n if n else 0
    
    return {
        "algorithm": "Hybrid",
        "gantt": all_gantt,
        "express_gantt": express_result["gantt"],
        "standard_gantt": standard_result["gantt"],
        "avg_waiting_time": avg_waiting_time,
        "avg_turnaround_time": avg_turnaround_time,
        "total_time": total_time,
        "throughput": n / total_time if total_time > 0 else 0
    }
