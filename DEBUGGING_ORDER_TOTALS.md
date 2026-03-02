# Debugging Order Total Calculation Issue

## Problem

Orders are showing totals at 1/100th of expected value. For example:

- Product price: 25 taka
- Quantity: 4
- VAT: 5%
- Expected total: 105 taka
- Actual showing: 1.05 taka

## Logging Added

The following console logs have been added to trace the issue:

### 1. Product Fetching (productsApi.ts)

When the Orders page loads and fetches products:

```
normalizeProduct - Shows for EACH product:
- Which price field was used (selling_price_taka, selling_price, or selling_price_paisa)
- The raw values from the backend
- The resolved price in taka format

getProducts completed - Summary
- Shows first product's selling_price_taka value
- Shows exact type (string) and parsed value (number)
- Lists prices of first 5 products
```

### 2. Line Item Addition (OrdersList.tsx)

When you add a product to the order:

```
"Adding line item - Product data"
- Shows product.selling_price_taka value
- Shows parsed numeric value
- Shows calculated unit_price_paisa (should be price * 100)

"Price calculation"
- unitPriceTaka: should be 25
- unitPricePaisa: should be 2500 (for 25 taka)
- Expected line total with VAT
```

### 3. Order Submission (OrdersList.tsx)

When creating the order:

```
"Creating order with payload"
- Shows exact unit_price being sent (should be "25.00" if price is correct)
- Shows parsed back value
- Shows calculated line total in backend terms
```

### 4. Order Confirmation (ordersApi.ts)

After backend processes the order:

```
"Order created successfully"
- Shows unit_price_paisa returned from backend (should be 2500 for 25 taka)
- Shows line_total_paisa (should be 10000 for qty 4)
- Shows total_paisa (should be 10500 with 5% VAT)
```

## Steps to Debug

1. **Open Browser DevTools**:
    - Press F12 on Windows or Cmd+Option+I on Mac
    - Go to Console tab

2. **Clear Console**:
    - Type `clear()` and press Enter

3. **Trigger Product Fetch**:
    - Go to Orders page
    - Watch for logs starting with:
        - "Product X price resolution"
        - "getProducts completed"

4. **Create an Order**:
    - Add the problem product (price should show as 25)
    - Watch for log "Adding line item"
    - Click Create Order button
    - Watch for "Creating order with payload" and "Order created successfully"

5. **Collect Console Output**:
    - Right-click in console → Select All
    - Copy the output
    - Share it

## What to Look For

**If price shows as 0.25 instead of 25:**

- The issue is in product fetching
- Check "Product X price resolution" logs
- See which field is being used and what value it contains

**If unit_price sent is "0.25" instead of "25.00":**

- The product price in the Order page is wrong
- Could be different API response than inventory page
- Check "Creating order with payload" log

**If backend returns paisa as 105 instead of 10500:**

- The unit_price was parsed correctly as "0.25" by mistake
- This means frontend is sending wrong value

## Expected Log Values (for 25 taka product)

All these should show **25** or **"25.00"** or **2500**:

```
normalizeProduct - selling_price_taka: "25.00"
getProducts - selling_price_taka: "25.00"
Adding line item - selling_price_taka: "25.00"
Price calculation - unitPriceTaka: 25
Price calculation - unitPricePaisa: 2500
Creating order - unit_price: "25.00"
Order created - unit_price_paisa_returned: 2500 (or "2500" after backend conversion)
```

## Next Action

Share the console logs from these steps so we can identify exactly where the factor-of-100 error is occurring.
