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
    
    # Map nouns to specific Unsplash images for consistency
    noun_images = {
        "Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
        "Speaker": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
        "Monitor": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80",
        "Keyboard": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&q=80",
        "Mouse": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&q=80",
        "Charger": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80",
        "Laptop Stand": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&q=80",
        "Webcam": "https://images.unsplash.com/photo-1623949556303-b0d17d198863?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
    nouns = list(noun_images.keys())
    
    for _ in range(count):
        chosen_noun = random.choice(nouns)
        name = f"{random.choice(adjectives)} {chosen_noun}"
        product_id = f"PRD-{str(uuid.uuid4())[:6].upper()}"
        catalog.append({
            "product_id": product_id,
            "name": name,
            "price": round(random.uniform(800.0, 40000.0), 2),
            "weight": round(random.uniform(0.1, 15.0), 2), # kg
            "packing_time_base": random.randint(1, 10),
            "image_url": noun_images[chosen_noun]
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
