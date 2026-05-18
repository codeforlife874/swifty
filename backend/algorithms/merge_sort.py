def compare_orders(o1, o2):
    # Priority:
    # 1. Express orders first (priority_score: 1 is Express, 2 is Standard)
    if o1['priority_score'] != o2['priority_score']:
        return o1['priority_score'] < o2['priority_score']
    
    # 2. Lower packing time
    if o1['packing_time'] != o2['packing_time']:
        return o1['packing_time'] < o2['packing_time']
    
    # 3. Earlier arrival time
    return o1['arrival_time'] <= o2['arrival_time']

def merge_sort_tracked(arr):
    """
    Returns (sorted_array, animation_frames)
    Each frame is a dict containing the current state or the action taking place.
    """
    frames = []
    
    # Create a copy so we don't mutate the original input directly
    array = list(arr)
    
    def merge(arr, l, m, r):
        n1 = m - l + 1
        n2 = r - m
        
        L = arr[l:m+1]
        R = arr[m+1:r+1]
        
        i = 0
        j = 0
        k = l
        
        while i < n1 and j < n2:
            # Record comparison
            frames.append({
                "type": "compare",
                "indices": [l + i, m + 1 + j],
                "array": list(arr)
            })
            
            if compare_orders(L[i], R[j]):
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            
            # Record overwrite
            frames.append({
                "type": "overwrite",
                "index": k,
                "value": arr[k],
                "array": list(arr)
            })
            k += 1
            
        while i < n1:
            arr[k] = L[i]
            frames.append({
                "type": "overwrite",
                "index": k,
                "value": arr[k],
                "array": list(arr)
            })
            i += 1
            k += 1
            
        while j < n2:
            arr[k] = R[j]
            frames.append({
                "type": "overwrite",
                "index": k,
                "value": arr[k],
                "array": list(arr)
            })
            j += 1
            k += 1
            
        frames.append({
            "type": "merge_complete",
            "range": [l, r],
            "array": list(arr)
        })

    def mergeSort(arr, l, r):
        if l < r:
            m = l + (r - l) // 2
            
            frames.append({
                "type": "divide",
                "range": [l, r],
                "mid": m,
                "array": list(arr)
            })
            
            mergeSort(arr, l, m)
            mergeSort(arr, m + 1, r)
            merge(arr, l, m, r)

    frames.append({
        "type": "start",
        "array": list(array)
    })
    
    mergeSort(array, 0, len(array) - 1)
    
    frames.append({
        "type": "complete",
        "array": list(array)
    })
    
    return array, frames
