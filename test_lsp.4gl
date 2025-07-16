# Test your 4GL Language Server
FUNCTION test_completion() RETURNING INTEGER
    DEFINE customer_name CHAR(50)
    DEFINE customer_age INTEGER
    
    # Try typing these and see the completion:
    # Type "FUNC" and press Ctrl+Space
    # Type "SELECT" and see SQL completion
    # Type "INTE" for INTEGER completion
    
    LET customer_name = "John Doe"
    LET customer_age = 25
    
    # Type "customer_" and see variable completion
    IF customer_age > 18 THEN
        RETURN 1
    ELSE
        RETURN 0
    ENDIF
END FUNCTION

MAIN
    DEFINE result INTEGER
    
    # Call the function - you should see completion for "test_completion"
    CALL test_completion() RETURNING result
    
    # Try typing built-in functions like:
    # TODAY(), LENGTH(), UPPER()
END MAIN
