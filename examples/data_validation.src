# Sample 4GL Program - Data Validation and Utilities

FUNCTION validate_email(email VARCHAR(255)) RETURNING INTEGER
    DEFINE at_position INTEGER
    DEFINE dot_position INTEGER
    
    # Check if email contains @ symbol
    LET at_position = email.getIndexOf("@", 1)
    
    IF at_position <= 1 THEN
        RETURN 0  # Invalid: @ not found or at beginning
    ENDIF
    
    # Check if email contains . after @
    LET dot_position = email.getIndexOf(".", at_position)
    
    IF dot_position <= at_position + 1 THEN
        RETURN 0  # Invalid: . not found after @ or immediately after @
    ENDIF
    
    # Basic validation passed
    RETURN 1
ENDFUNCTION

FUNCTION format_phone_number(phone VARCHAR(20)) RETURNING VARCHAR(20)
    DEFINE clean_phone VARCHAR(20)
    DEFINE formatted_phone VARCHAR(20)
    
    # Remove non-numeric characters
    LET clean_phone = phone.trimWhiteSpace()
    LET clean_phone = clean_phone.replaceAll("-", "")
    LET clean_phone = clean_phone.replaceAll("(", "")
    LET clean_phone = clean_phone.replaceAll(")", "")
    LET clean_phone = clean_phone.replaceAll(" ", "")
    
    # Format as (XXX) XXX-XXXX if 10 digits
    IF LENGTH(clean_phone) = 10 THEN
        LET formatted_phone = "(" + SUBSTR(clean_phone, 1, 3) + ") " +
                             SUBSTR(clean_phone, 4, 3) + "-" +
                             SUBSTR(clean_phone, 7, 4)
        RETURN formatted_phone
    ELSE
        RETURN phone  # Return original if not 10 digits
    ENDIF
ENDFUNCTION

PROCEDURE validate_customer_data(customer_id INTEGER)
    DEFINE name VARCHAR(100)
    DEFINE email VARCHAR(255)
    DEFINE phone VARCHAR(20)
    DEFINE birth_date DATE
    DEFINE validation_errors INTEGER
    
    LET validation_errors = 0
    
    # Get customer data
    SELECT name, email, phone, birth_date
    FROM customers
    WHERE customer_id = customer_id
    INTO name, email, phone, birth_date
    
    # Validate name
    IF LENGTH(TRIM(name)) < 2 THEN
        DISPLAY "Error: Customer name must be at least 2 characters"
        LET validation_errors = validation_errors + 1
    ENDIF
    
    # Validate email
    IF NOT validate_email(email) THEN
        DISPLAY "Error: Invalid email format: ", email
        LET validation_errors = validation_errors + 1
    ENDIF
    
    # Validate phone
    IF LENGTH(TRIM(phone)) < 10 THEN
        DISPLAY "Error: Phone number must be at least 10 digits"
        LET validation_errors = validation_errors + 1
    ENDIF
    
    # Validate birth date
    IF birth_date > TODAY() THEN
        DISPLAY "Error: Birth date cannot be in the future"
        LET validation_errors = validation_errors + 1
    ENDIF
    
    IF validation_errors = 0 THEN
        DISPLAY "Customer data validation passed"
        
        # Update phone number format
        UPDATE customers
        SET phone = format_phone_number(phone)
        WHERE customer_id = customer_id
    ELSE
        DISPLAY "Customer data validation failed with ", validation_errors, " errors"
    ENDIF
ENDPROCEDURE

FUNCTION calculate_age(birth_date DATE) RETURNING INTEGER
    DEFINE current_date DATE
    DEFINE age INTEGER
    DEFINE birth_year INTEGER
    DEFINE current_year INTEGER
    
    LET current_date = TODAY()
    LET birth_year = YEAR(birth_date)
    LET current_year = YEAR(current_date)
    
    LET age = current_year - birth_year
    
    # Adjust if birthday hasn't occurred this year
    IF MONTH(birth_date) > MONTH(current_date) OR
       (MONTH(birth_date) = MONTH(current_date) AND DAY(birth_date) > DAY(current_date)) THEN
        LET age = age - 1
    ENDIF
    
    RETURN age
ENDFUNCTION

PROCEDURE update_customer_ages()
    DEFINE customer_id INTEGER
    DEFINE birth_date DATE
    DEFINE calculated_age INTEGER
    
    # Declare cursor for customers with birth dates
    DECLARE age_cursor CURSOR FOR
    SELECT customer_id, birth_date
    FROM customers
    WHERE birth_date IS NOT NULL
    
    FOREACH age_cursor INTO customer_id, birth_date
        LET calculated_age = calculate_age(birth_date)
        
        UPDATE customers
        SET age = calculated_age
        WHERE customer_id = customer_id
        
        DISPLAY "Updated age for customer ", customer_id, " to ", calculated_age
    ENDFOR
    
    DISPLAY "Age update process completed"
ENDPROCEDURE
