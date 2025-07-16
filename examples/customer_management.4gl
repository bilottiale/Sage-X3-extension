# Sample 4GL Program - Customer Management

FUNCTION calculate_discount(amount DECIMAL, customer_type CHAR(10)) RETURNING DECIMAL
    DEFINE discount DECIMAL
    
    IF customer_type = "PREMIUM" THEN
        IF amount > 5000 THEN
            LET discount = amount * 0.15
        ELSE
            LET discount = amount * 0.10
        ENDIF
    ELSE
        IF amount > 1000 THEN
            LET discount = amount * 0.05
        ELSE
            LET discount = 0
        ENDIF
    ENDIF
    
    RETURN discount
ENDFUNCTION

PROCEDURE process_customer_order(customer_id INTEGER, order_amount DECIMAL)
    DEFINE customer_name VARCHAR(100)
    DEFINE customer_type CHAR(10)
    DEFINE final_amount DECIMAL
    DEFINE discount_amount DECIMAL
    DEFINE order_date DATE
    
    # Get customer information
    SELECT name, customer_type
    FROM customers
    WHERE customer_id = customer_id
    INTO customer_name, customer_type
    
    # Calculate discount
    LET discount_amount = calculate_discount(order_amount, customer_type)
    LET final_amount = order_amount - discount_amount
    LET order_date = TODAY()
    
    # Insert order record
    INSERT INTO orders (customer_id, order_date, original_amount, discount, final_amount)
    VALUES (customer_id, order_date, order_amount, discount_amount, final_amount)
    
    # Update customer last order date
    UPDATE customers
    SET last_order_date = order_date
    WHERE customer_id = customer_id
    
    # Display confirmation
    DISPLAY "Order processed for ", customer_name
    DISPLAY "Original amount: ", order_amount
    DISPLAY "Discount: ", discount_amount
    DISPLAY "Final amount: ", final_amount
ENDPROCEDURE

FUNCTION get_customer_orders(customer_id INTEGER) RETURNING INTEGER
    DEFINE order_count INTEGER
    
    SELECT COUNT(*)
    FROM orders
    WHERE customer_id = customer_id
    INTO order_count
    
    RETURN order_count
ENDFUNCTION

PROCEDURE generate_customer_report()
    DEFINE customer_id INTEGER
    DEFINE customer_name VARCHAR(100)
    DEFINE order_count INTEGER
    DEFINE total_spent DECIMAL
    
    # Cursor for all customers
    DECLARE customer_cursor CURSOR FOR
    SELECT customer_id, name
    FROM customers
    ORDER BY name
    
    FOREACH customer_cursor INTO customer_id, customer_name
        LET order_count = get_customer_orders(customer_id)
        
        SELECT SUM(final_amount)
        FROM orders
        WHERE customer_id = customer_id
        INTO total_spent
        
        IF total_spent IS NULL THEN
            LET total_spent = 0
        ENDIF
        
        DISPLAY customer_name, " - Orders: ", order_count, " - Total: ", total_spent
    ENDFOR
ENDPROCEDURE
