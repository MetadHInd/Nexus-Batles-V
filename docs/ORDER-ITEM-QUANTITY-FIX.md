# Fix for Order Item Quantity Issue

## Problem Description

When creating an order with items that have quantity > 1 (e.g., "6-Pack Tracktor Cans" with quantity: 2), the system was creating duplicate records instead of a single record with the correct quantity.

## Root Cause

The issue was in the `v_final_item_prices` database view, which returns multiple records for the same `item_has_menu_category_id` when an item exists in multiple menu configurations. For example:
- Item ID 105 (6-Pack Tracktor Cans) was returning 2 records with different `menu_item_category_has_branch_id` values (806 and 829)
- The code was treating these as separate items, creating 2 entries with quantity 2 each

## Solution Implemented

Modified `OrderUtils.calculateGroupPrice` to deduplicate items based on `item_has_menu_category_id` before processing. The fix:

1. Groups results by `item_has_menu_category_id` using a Map
2. Keeps only one record per unique item (preferring the one with lower `menu_item_category_has_branch_id`)
3. Processes the deduplicated list to create the correct number of database records

```typescript
// Group the results by item_has_menu_category_id to handle duplicates
const uniqueItemPrices = new Map<number, OptimizedPriceResult>();
normalItemsPrices.forEach(item => {
  const existingItem = uniqueItemPrices.get(item.item_has_menu_category_id);
  if (!existingItem || item.menu_item_category_has_branch_id < existingItem.menu_item_category_has_branch_id) {
    uniqueItemPrices.set(item.item_has_menu_category_id, item);
  }
});
```

## Debugging Steps Added

I've added comprehensive debugging to help identify where the issue might be occurring:

### 1. Enhanced Logging in OrderUtils

```typescript
// In src/modules/order/utils/order.utils.ts
// Added logging to show raw items received and final items being sent to database
console.log('📊 Calculating price for group:', groupName);
console.log('🔍 A LA CARTE group raw items:', items);
console.log('📤 A LA CARTE group final items for database:', itemsPriceInsertDatabase);
```

### 2. Enhanced Logging in OrderService

```typescript
// In src/modules/order/services/order.service.ts
// Added logging to show exact JSON being sent to database
console.log('📦 Order groups JSON being sent to database:', groupsJson);
console.log('🛒 A LA CARTE group details:', alaCarteGroup);
```

### 3. Debug Controller

Created a new debug controller at `/order-debug` with two endpoints:

- `POST /order-debug/test-create`: Creates an order and returns detailed information about what was actually created in the database
- `GET /order-debug/verify/:orderId`: Fetches an existing order and shows the actual database records

## How to Use the Debug Tools

1. **Test Order Creation**:
   ```bash
   POST http://localhost:3000/order-debug/test-create
   ```
   Send the same JSON payload that's causing issues. The response will show:
   - The original request
   - What was created in the database
   - A formatted view of all groups and items with their quantities

2. **Verify Existing Order**:
   ```bash
   GET http://localhost:3000/order-debug/verify/{orderId}
   ```
   This will show the actual database records for an existing order.

## Expected vs Actual Behavior

### Expected (Correct):
For "6-Pack Tracktor Cans" with quantity: 2
- Should create 1 record in `itemHasOrderByCategory` table
- Record should have quantity = 2

### What to Check:
1. Run the debug endpoint and check if the database actually has duplicate records or if it's a display issue
2. Check the console logs when creating an order to see the exact data being processed
3. Verify if the issue is in the frontend display logic or in how the data is being fetched

## Possible Causes

If the backend is working correctly (which the code suggests), the issue might be:

1. **Frontend Display Logic**: The frontend might be displaying each unit of an item separately
2. **Data Fetching Logic**: When fetching orders, there might be a JOIN or transformation that's duplicating records
3. **External Integration**: If orders are being sent to an external system, that system might be interpreting the data incorrectly

## Next Steps

1. Use the debug endpoints to confirm whether the database has the correct data
2. If the database is correct, investigate the frontend or API response transformation
3. Check any middleware or response interceptors that might be modifying the data

## Code Locations

- Order creation logic: `src/modules/order/services/order.service.ts`
- Price calculation: `src/modules/order/utils/order.utils.ts`
- Database function: `database/create-complete-order-function.sql`
- Debug controller: `src/modules/order/controllers/order-debug.controller.ts`