import random
import uuid

# The 4 delivery tiers and their priority mapping
DELIVERY_TYPES = {
    "15 mins delivery": 1,
    "60 mins delivery": 2,
    "1 day delivery": 3,
    "Standard delivery": 4
}

def generate_catalog(count=20):
    catalog = []
    adjectives = ["Wireless", "Smart", "Ergonomic", "Portable", "Heavy-Duty", "Quantum", "Magnetic", "Ultra"]
    nouns = ["Headphones", "Speaker", "Monitor", "Keyboard", "Mouse", "Charger", "Laptop Stand", "Webcam"]
    
    for _ in range(count):
        name = f"{random.choice(adjectives)} {random.choice(nouns)}"
        product_id = f"PRD-{str(uuid.uuid4())[:6].upper()}"
        catalog.append({
            "product_id": product_id,
            "name": name,
            "price": round(random.uniform(10.0, 500.0), 2),
            "weight": round(random.uniform(0.1, 15.0), 2), # kg
            "packing_time_base": random.randint(1, 10),
            "image_url": f"https://picsum.photos/seed/{product_id}/300/300"
        })
    return catalog

def create_order_from_product(product, delivery_type, arrival_time, customer_username=None):
    return {
        "order_id": f"ORD-{str(uuid.uuid4())[:8].upper()}",
        "product_id": product["product_id"],
        "product_name": product["name"],
        "weight": product["weight"],
        "type": delivery_type,
        "arrival_time": arrival_time,
        "packing_time": product["packing_time_base"] + random.randint(0, 5), # add slight variance
        "priority_score": DELIVERY_TYPES[delivery_type],
        "customer_username": customer_username
    }

def generate_random_orders(count):
    orders = []
    types_list = list(DELIVERY_TYPES.keys())
    # Weights for random generation (favor standard/1day)
    weights = [0.1, 0.2, 0.3, 0.4] 
    
    for _ in range(count):
        dtype = random.choices(types_list, weights=weights)[0]
        orders.append({
            "order_id": f"ORD-{str(uuid.uuid4())[:8].upper()}",
            "product_id": "RANDOM",
            "product_name": "Random Bulk Item",
            "weight": round(random.uniform(0.5, 20.0), 2),
            "type": dtype,
            "arrival_time": random.randint(0, 100),
            "packing_time": random.randint(1, 15),
            "priority_score": DELIVERY_TYPES[dtype],
            "customer_username": "MockSystem"
        })
    return orders
