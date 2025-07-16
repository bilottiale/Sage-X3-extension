# Sage X3 4GL Programming Language - Complete Reference Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Basic Syntax](#basic-syntax)
3. [Data Types](#data-types)
4. [Variables and Constants](#variables-and-constants)
5. [Control Structures](#control-structures)
6. [Functions and Procedures](#functions-and-procedures)
7. [Database Operations](#database-operations)
8. [String Functions](#string-functions)
9. [Numeric Functions](#numeric-functions)
10. [Date and Time Functions](#date-and-time-functions)
11. [Array Operations](#array-operations)
12. [File Operations](#file-operations)
13. [Error Handling](#error-handling)
14. [Screen and Form Management](#screen-and-form-management)
15. [Advanced Features](#advanced-features)
16. [Best Practices](#best-practices)
17. [Complete Examples](#complete-examples)

---

## Introduction

Sage X3's 4GL (Fourth Generation Language) is a powerful, business-oriented programming language designed specifically for ERP applications. It combines the simplicity of high-level languages with the power needed for complex business logic.

### Key Features
- **Database Integration**: Native database operations
- **Business Logic**: Built-in functions for common business calculations
- **Screen Management**: Integrated form and screen handling
- **Transaction Control**: Built-in transaction management
- **Error Handling**: Comprehensive error management system

---

## Basic Syntax

### Comments
```4gl
# Single line comment
# This is a comment explaining the code below

##############################################################################
# Block comment for major sections
##############################################################################

Subprog EXAMPLE_FUNCTION()
  # Function-level comment
  Local Char LRESULT(50)    # Inline comment
End
```

### Line Continuation
```4gl
# Long lines can be continued
Subprog LONG_FUNCTION_NAME(VERY_LONG_PARAMETER_NAME, 
                           ANOTHER_LONG_PARAMETER,
                           THIRD_PARAMETER)
  # Function body
End
```

### Case Sensitivity
```4gl
# 4GL is case-insensitive for keywords but case-sensitive for variables
Subprog TEST_CASE()
  Local Char MYVAR(10)     # Different from myvar
  Local Char myvar(10)     # Different from MYVAR
  
  MYVAR = "Hello"
  myvar = "World"
End
```

---

## Data Types

### Character Types
```4gl
# Fixed-length character strings
Local Char CUSTOMER_CODE(15)        # Exactly 15 characters
Local Char STATUS_FLAG(1)           # Single character flag
Local Char DESCRIPTION(100)         # 100-character description

# Variable-length strings (Sage X3 specific)
Local Char LONG_TEXT(*)             # Variable length
Local Char MESSAGE_TEXT(500)        # Up to 500 characters

# Examples of usage
CUSTOMER_CODE = "CUST001"           # Will be padded to 15 chars
STATUS_FLAG = "A"                   # Active status
DESCRIPTION = "Product description"  # Will be padded to 100 chars
```

### Numeric Types
```4gl
# Integer types
Local Integer QUANTITY              # Whole numbers (-2,147,483,648 to 2,147,483,647)
Local Integer COUNTER              # Commonly used for loops
Local Integer ERROR_CODE           # Error codes

# Decimal types
Local Decimal UNIT_PRICE           # Decimal numbers with precision
Local Decimal AMOUNT(15,2)         # 15 digits total, 2 after decimal
Local Decimal PERCENTAGE(5,4)      # 5 digits total, 4 after decimal (0.9999 max)

# Examples
QUANTITY = 100
COUNTER = 0
ERROR_CODE = -1
UNIT_PRICE = 123.45
AMOUNT = 1234567890123.45
PERCENTAGE = 0.1234
```

### Date and Time Types
```4gl
# Date types
Local Date ORDER_DATE              # Date only (YYYY-MM-DD format)
Local Date DELIVERY_DATE           # Another date field
Local Date BIRTH_DATE              # Birth date example

# DateTime types (Sage X3 extension)
Local DateTime TIMESTAMP           # Date and time combined
Local DateTime LAST_UPDATE         # Last update timestamp

# Time representation
Local Char TIME_STRING(8)          # "HH:MM:SS" format

# Examples
ORDER_DATE = [2024/12/25]          # Christmas 2024
DELIVERY_DATE = [0/0/0]            # Null date
BIRTH_DATE = [1990/5/15]           # May 15, 1990
TIMESTAMP = [2024/12/25 14:30:00]  # Christmas afternoon
TIME_STRING = "09:30:15"           # Morning time
```

### Boolean Logic
```4gl
# 4GL doesn't have a native boolean type, uses Integer instead
Local Integer IS_ACTIVE            # 0 = false, 1 = true
Local Integer HAS_DISCOUNT         # Boolean flag
Local Integer IS_VALID             # Validation flag

# Constants for clarity
Const Integer TRUE = 1
Const Integer FALSE = 0

# Usage examples
IS_ACTIVE = TRUE
HAS_DISCOUNT = FALSE
If IS_ACTIVE = TRUE
  # Do something
Endif
```

---

## Variables and Constants

### Variable Declaration
```4gl
# Local variables (function scope)
Subprog VARIABLE_EXAMPLES()
  Local Char CUSTOMER_NAME(50)
  Local Integer ITEM_COUNT
  Local Decimal TOTAL_AMOUNT
  Local Date PROCESS_DATE
  
  # Variable initialization
  CUSTOMER_NAME = "John Smith"
  ITEM_COUNT = 0
  TOTAL_AMOUNT = 0.00
  PROCESS_DATE = date$           # Current system date
End

# Global variables (program scope)
Global Char GLOBAL_USER(20)
Global Char GLOBAL_COMPANY(5)
Global Integer GLOBAL_ERROR_CODE
Global Date GLOBAL_PROCESS_DATE

# Variable scope example
Subprog SCOPE_EXAMPLE()
  Local Char LOCAL_VAR(10)
  
  LOCAL_VAR = "Local"            # Only visible in this function
  GLOBAL_USER = "ADMIN"          # Visible throughout the program
End
```

### Constants
```4gl
# Constants declaration
Const Char COMPANY_NAME(30) = "ACME Corporation"
Const Integer MAX_ITEMS = 1000
Const Decimal TAX_RATE = 0.20          # 20% tax rate
Const Char STATUS_ACTIVE(1) = "A"
Const Char STATUS_INACTIVE(1) = "I"
Const Date SYSTEM_START_DATE = [2024/1/1]

# Using constants in calculations
Subprog CALCULATE_TAX(AMOUNT)
Variable Decimal AMOUNT
  Local Decimal TAX_AMOUNT
  
  TAX_AMOUNT = AMOUNT * TAX_RATE
  Return TAX_AMOUNT
End

# Constants for error codes
Const Integer ERR_SUCCESS = 0
Const Integer ERR_NOT_FOUND = -1
Const Integer ERR_INVALID_DATA = -2
Const Integer ERR_PERMISSION_DENIED = -3
```

### Arrays
```4gl
# Single dimension arrays
Subprog ARRAY_EXAMPLES()
  Local Char MONTH_NAMES(12)(10)        # 12 months, 10 chars each
  Local Integer SALES_FIGURES(12)       # 12 monthly sales figures
  Local Decimal QUARTERLY_TOTALS(4)     # 4 quarters
  
  # Array initialization
  MONTH_NAMES(1) = "January"
  MONTH_NAMES(2) = "February"
  MONTH_NAMES(3) = "March"
  # ... continue for all months
  
  # Loop through array
  Local Integer I
  For I = 1 To 12
    SALES_FIGURES(I) = 0              # Initialize to zero
  Next I
  
  # Calculate quarterly totals
  QUARTERLY_TOTALS(1) = SALES_FIGURES(1) + SALES_FIGURES(2) + SALES_FIGURES(3)
  QUARTERLY_TOTALS(2) = SALES_FIGURES(4) + SALES_FIGURES(5) + SALES_FIGURES(6)
  QUARTERLY_TOTALS(3) = SALES_FIGURES(7) + SALES_FIGURES(8) + SALES_FIGURES(9)
  QUARTERLY_TOTALS(4) = SALES_FIGURES(10) + SALES_FIGURES(11) + SALES_FIGURES(12)
End

# Multi-dimensional arrays
Subprog MULTI_ARRAY_EXAMPLE()
  Local Decimal SALES_MATRIX(12)(5)     # 12 months x 5 regions
  Local Integer MONTH, REGION
  
  # Initialize all values
  For MONTH = 1 To 12
    For REGION = 1 To 5
      SALES_MATRIX(MONTH)(REGION) = 0
    Next REGION
  Next MONTH
  
  # Set specific values
  SALES_MATRIX(1)(1) = 15000.00        # January, Region 1
  SALES_MATRIX(1)(2) = 12000.00        # January, Region 2
End
```

---

## Control Structures

### If-Then-Else Statements
```4gl
# Simple if statement
Subprog IF_EXAMPLES(CUSTOMER_TYPE, ORDER_AMOUNT)
Variable Char CUSTOMER_TYPE(10)
Variable Decimal ORDER_AMOUNT
  Local Decimal DISCOUNT
  
  # Simple if
  If ORDER_AMOUNT > 1000
    DISCOUNT = ORDER_AMOUNT * 0.10     # 10% discount for large orders
  Endif
  
  # If-else
  If CUSTOMER_TYPE = "PREMIUM"
    DISCOUNT = ORDER_AMOUNT * 0.15     # 15% for premium customers
  Else
    DISCOUNT = ORDER_AMOUNT * 0.05     # 5% for regular customers
  Endif
  
  # Nested if statements
  If CUSTOMER_TYPE = "PREMIUM"
    If ORDER_AMOUNT > 5000
      DISCOUNT = ORDER_AMOUNT * 0.20   # 20% for large premium orders
    Elsif ORDER_AMOUNT > 1000
      DISCOUNT = ORDER_AMOUNT * 0.15   # 15% for medium premium orders
    Else
      DISCOUNT = ORDER_AMOUNT * 0.10   # 10% for small premium orders
    Endif
  Elsif CUSTOMER_TYPE = "REGULAR"
    If ORDER_AMOUNT > 2000
      DISCOUNT = ORDER_AMOUNT * 0.08   # 8% for large regular orders
    Else
      DISCOUNT = ORDER_AMOUNT * 0.03   # 3% for small regular orders
    Endif
  Else
    DISCOUNT = 0                       # No discount for new customers
  Endif
  
  Return DISCOUNT
End
```

### Logical Operators
```4gl
Subprog LOGICAL_EXAMPLES(AGE, INCOME, CREDIT_SCORE)
Variable Integer AGE, CREDIT_SCORE
Variable Decimal INCOME
  Local Integer APPROVED
  
  # AND operator
  If AGE >= 18 And INCOME > 30000 And CREDIT_SCORE > 650
    APPROVED = 1                       # Loan approved
  Endif
  
  # OR operator
  If CREDIT_SCORE > 750 Or INCOME > 100000 Or AGE > 65
    APPROVED = 1                       # Auto-approved categories
  Endif
  
  # NOT operator
  If Not (CREDIT_SCORE < 500)
    # Credit score is 500 or above
    APPROVED = 1
  Endif
  
  # Complex combinations
  If (AGE >= 25 And AGE <= 65) And (INCOME > 40000 Or CREDIT_SCORE > 700)
    APPROVED = 1
  Endif
  
  Return APPROVED
End
```

### Case Statements
```4gl
Subprog CASE_EXAMPLES(DAY_OF_WEEK, MONTH_NUMBER)
Variable Integer DAY_OF_WEEK, MONTH_NUMBER
  Local Char DAY_NAME(10)
  Local Char MONTH_NAME(12)
  Local Integer DAYS_IN_MONTH
  
  # Simple case statement
  Case DAY_OF_WEEK
    When 1
      DAY_NAME = "Monday"
    When 2
      DAY_NAME = "Tuesday"
    When 3
      DAY_NAME = "Wednesday"
    When 4
      DAY_NAME = "Thursday"
    When 5
      DAY_NAME = "Friday"
    When 6
      DAY_NAME = "Saturday"
    When 7
      DAY_NAME = "Sunday"
    Default
      DAY_NAME = "Invalid"
  Endcase
  
  # Case with multiple actions
  Case MONTH_NUMBER
    When 1
      MONTH_NAME = "January"
      DAYS_IN_MONTH = 31
    When 2
      MONTH_NAME = "February"
      DAYS_IN_MONTH = 28           # Simplified, not handling leap years
    When 3
      MONTH_NAME = "March"
      DAYS_IN_MONTH = 31
    When 4
      MONTH_NAME = "April"
      DAYS_IN_MONTH = 30
    When 5
      MONTH_NAME = "May"
      DAYS_IN_MONTH = 31
    When 6
      MONTH_NAME = "June"
      DAYS_IN_MONTH = 30
    When 7
      MONTH_NAME = "July"
      DAYS_IN_MONTH = 31
    When 8
      MONTH_NAME = "August"
      DAYS_IN_MONTH = 31
    When 9
      MONTH_NAME = "September"
      DAYS_IN_MONTH = 30
    When 10
      MONTH_NAME = "October"
      DAYS_IN_MONTH = 31
    When 11
      MONTH_NAME = "November"
      DAYS_IN_MONTH = 30
    When 12
      MONTH_NAME = "December"
      DAYS_IN_MONTH = 31
    Default
      MONTH_NAME = "Invalid"
      DAYS_IN_MONTH = 0
  Endcase
End
```

### Loops
```4gl
# For loops
Subprog LOOP_EXAMPLES()
  Local Integer I, J
  Local Decimal TOTAL, VALUES(10)
  Local Char RESULT(100)
  
  # Simple for loop
  For I = 1 To 10
    VALUES(I) = I * 10               # Fill array with multiples of 10
  Next I
  
  # For loop with step
  For I = 1 To 100 Step 5
    # Process every 5th number
    TOTAL += I
  Next I
  
  # Nested for loops
  For I = 1 To 5
    For J = 1 To 5
      # Create multiplication table
      RESULT = string$(I) + " x " + string$(J) + " = " + string$(I * J)
    Next J
  Next I
  
  # While loop
  I = 1
  TOTAL = 0
  While I <= 100 And TOTAL < 1000
    TOTAL += I
    I += 1
  Endwhile
  
  # Do-while equivalent (using Repeat-Until)
  I = 1
  Repeat
    TOTAL += I
    I += 1
  Until I > 100 Or TOTAL >= 1000
End
```

---

## Functions and Procedures

### Function Definition
```4gl
# Function with return value
Function CALCULATE_DISCOUNT(CUSTOMER_TYPE, ORDER_AMOUNT) Returning Decimal
Variable Char CUSTOMER_TYPE(10)
Variable Decimal ORDER_AMOUNT
  Local Decimal DISCOUNT_RATE
  Local Decimal DISCOUNT_AMOUNT
  
  # Determine discount rate based on customer type
  Case CUSTOMER_TYPE
    When "PREMIUM"
      DISCOUNT_RATE = 0.15
    When "GOLD"
      DISCOUNT_RATE = 0.12
    When "SILVER"
      DISCOUNT_RATE = 0.08
    When "REGULAR"
      DISCOUNT_RATE = 0.05
    Default
      DISCOUNT_RATE = 0.00
  Endcase
  
  # Apply volume discount
  If ORDER_AMOUNT > 10000
    DISCOUNT_RATE += 0.05            # Additional 5% for large orders
  Elsif ORDER_AMOUNT > 5000
    DISCOUNT_RATE += 0.03            # Additional 3% for medium orders
  Elsif ORDER_AMOUNT > 1000
    DISCOUNT_RATE += 0.01            # Additional 1% for small orders
  Endif
  
  # Ensure discount doesn't exceed 25%
  If DISCOUNT_RATE > 0.25
    DISCOUNT_RATE = 0.25
  Endif
  
  DISCOUNT_AMOUNT = ORDER_AMOUNT * DISCOUNT_RATE
  Return DISCOUNT_AMOUNT
End

# Procedure (no return value)
Subprog UPDATE_CUSTOMER_STATUS(CUSTOMER_CODE, NEW_STATUS)
Variable Char CUSTOMER_CODE(15), NEW_STATUS(1)
  Local Date UPDATE_DATE
  Local Char UPDATE_USER(20)
  
  UPDATE_DATE = date$
  UPDATE_USER = GUSER                # Global user variable
  
  # Update customer record
  Trbegin CUSTOMER
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat = 0
    CUSTOMER.STATUS = NEW_STATUS
    CUSTOMER.LASTUPDATE = UPDATE_DATE
    CUSTOMER.UPDATEUSER = UPDATE_USER
    Rewrite [CUSTOMER]
    
    # Log the status change
    Call LOG_CUSTOMER_CHANGE(CUSTOMER_CODE, "STATUS", NEW_STATUS) From LOGGING
  Else
    # Customer not found
    Call GESTCRE From GESADD With "UPDATE_CUSTOMER_STATUS", 
         "Customer not found: " + CUSTOMER_CODE, 1
  Endif
  Trcommit
End
```

### Function Parameters
```4gl
# Function with multiple parameter types
Function PROCESS_ORDER(ORDER_NUMBER, CUSTOMER_CODE, ORDER_LINES(), 
                      SPECIAL_INSTRUCTIONS, PRIORITY_FLAG) Returning Integer
Variable Char ORDER_NUMBER(20), CUSTOMER_CODE(15)
Variable Char ORDER_LINES(*)         # Array parameter
Variable Char SPECIAL_INSTRUCTIONS(500)
Variable Integer PRIORITY_FLAG
  
  Local Integer RESULT_CODE
  Local Integer LINE_COUNT
  Local Decimal TOTAL_AMOUNT
  
  # Validate parameters
  If ORDER_NUMBER = ""
    Return -1                        # Invalid order number
  Endif
  
  If CUSTOMER_CODE = ""
    Return -2                        # Invalid customer code
  Endif
  
  # Count order lines
  LINE_COUNT = 0
  Local Integer I
  I = 1
  While ORDER_LINES(I) <> ""
    LINE_COUNT += 1
    I += 1
  Endwhile
  
  If LINE_COUNT = 0
    Return -3                        # No order lines
  Endif
  
  # Process the order
  Call CREATE_ORDER_HEADER(ORDER_NUMBER, CUSTOMER_CODE, PRIORITY_FLAG) From ORDERS
  If GERROR <> 0
    Return -4                        # Error creating header
  Endif
  
  # Process each line
  For I = 1 To LINE_COUNT
    Call PROCESS_ORDER_LINE(ORDER_NUMBER, ORDER_LINES(I)) From ORDERS
    If GERROR <> 0
      Return -5                      # Error processing line
    Endif
  Next I
  
  # Add special instructions if provided
  If SPECIAL_INSTRUCTIONS <> ""
    Call ADD_ORDER_NOTES(ORDER_NUMBER, SPECIAL_INSTRUCTIONS) From ORDERS
  Endif
  
  Return 0                           # Success
End
```

### Recursive Functions
```4gl
# Recursive factorial calculation
Function FACTORIAL(N) Returning Integer
Variable Integer N
  If N <= 1
    Return 1
  Else
    Return N * FACTORIAL(N - 1)
  Endif
End

# Recursive file tree processing
Subprog PROCESS_DIRECTORY_TREE(DIRECTORY_PATH, LEVEL)
Variable Char DIRECTORY_PATH(255)
Variable Integer LEVEL
  Local Char FILES(100)(50)         # Array to hold file names
  Local Integer FILE_COUNT, I
  Local Char INDENT_STRING(20)
  
  # Create indentation for display
  INDENT_STRING = ""
  For I = 1 To LEVEL
    INDENT_STRING = INDENT_STRING + "  "
  Next I
  
  # Get list of files in directory (pseudo-code)
  Call GET_DIRECTORY_FILES(DIRECTORY_PATH, FILES, FILE_COUNT) From FILESYSTEM
  
  # Process each file
  For I = 1 To FILE_COUNT
    If IS_DIRECTORY(FILES(I))
      # Recursive call for subdirectories
      Call PROCESS_DIRECTORY_TREE(DIRECTORY_PATH + "/" + FILES(I), LEVEL + 1) From CURRENT
    Else
      # Process regular file
      Call PROCESS_FILE(DIRECTORY_PATH + "/" + FILES(I)) From CURRENT
    Endif
  Next I
End
```

---

## Database Operations

### Reading Records
```4gl
# Simple record read
Subprog READ_CUSTOMER(CUSTOMER_CODE)
Variable Char CUSTOMER_CODE(15)
  Local Char CUSTOMER_NAME(50)
  Local Char CUSTOMER_STATUS(1)
  Local Decimal CREDIT_LIMIT
  
  # Read customer record
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat = 0
    # Record found
    CUSTOMER_NAME = CUSTOMER.NAME
    CUSTOMER_STATUS = CUSTOMER.STATUS
    CREDIT_LIMIT = CUSTOMER.CREDITLIMIT
    
    # Display customer information
    Call INFBOX("Customer Information", 
               "Name: " + CUSTOMER_NAME + chr$(10) +
               "Status: " + CUSTOMER_STATUS + chr$(10) +
               "Credit Limit: " + string$(CREDIT_LIMIT, "###,##0.00"), 0)
  Else
    # Record not found
    Call ERRBOX("Customer " + CUSTOMER_CODE + " not found")
  Endif
End

# Reading with multiple key fields
Subprog READ_ORDER_LINE(ORDER_NUMBER, LINE_NUMBER)
Variable Char ORDER_NUMBER(20)
Variable Integer LINE_NUMBER
  
  # Read specific order line
  Read [ORDERLINE]ORDNUM = ORDER_NUMBER, LINENUM = LINE_NUMBER
  If fstat = 0
    # Process the order line
    Local Char PRODUCT_CODE(20)
    Local Decimal QUANTITY, UNIT_PRICE, LINE_TOTAL
    
    PRODUCT_CODE = ORDERLINE.PRODUCT
    QUANTITY = ORDERLINE.QTY
    UNIT_PRICE = ORDERLINE.PRICE
    LINE_TOTAL = QUANTITY * UNIT_PRICE
    
    # Update line total if needed
    If ORDERLINE.TOTAL <> LINE_TOTAL
      ORDERLINE.TOTAL = LINE_TOTAL
      Rewrite [ORDERLINE]
    Endif
  Endif
End
```

### Writing Records
```4gl
# Creating new records
Subprog CREATE_CUSTOMER(CUSTOMER_CODE, CUSTOMER_NAME, CUSTOMER_TYPE)
Variable Char CUSTOMER_CODE(15), CUSTOMER_NAME(50), CUSTOMER_TYPE(10)
  
  # Check if customer already exists
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat = 0
    Call ERRBOX("Customer " + CUSTOMER_CODE + " already exists")
    Return
  Endif
  
  # Create new customer record
  Trbegin CUSTOMER
  
  CUSTOMER.CUSTCODE = CUSTOMER_CODE
  CUSTOMER.NAME = CUSTOMER_NAME
  CUSTOMER.TYPE = CUSTOMER_TYPE
  CUSTOMER.STATUS = "A"              # Active
  CUSTOMER.CREDITLIMIT = 10000.00    # Default credit limit
  CUSTOMER.BALANCE = 0.00            # Starting balance
  CUSTOMER.CREATEDATE = date$
  CUSTOMER.CREATEUSER = GUSER
  CUSTOMER.UPDATEDATE = date$
  CUSTOMER.UPDATEUSER = GUSER
  
  Write [CUSTOMER]
  If fstat = 0
    Trcommit
    Call INFBOX("Customer " + CUSTOMER_CODE + " created successfully")
    
    # Log the creation
    Call LOG_CUSTOMER_ACTIVITY(CUSTOMER_CODE, "CREATED", 
                               "Customer created by " + GUSER) From LOGGING
  Else
    Trrollback
    Call ERRBOX("Error creating customer: " + mess(255, fstat, 1))
  Endif
End

# Updating existing records
Subprog UPDATE_CUSTOMER_CREDIT_LIMIT(CUSTOMER_CODE, NEW_LIMIT)
Variable Char CUSTOMER_CODE(15)
Variable Decimal NEW_LIMIT
  Local Decimal OLD_LIMIT
  
  Trbegin CUSTOMER
  
  # Read and lock the customer record
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat = 0
    OLD_LIMIT = CUSTOMER.CREDITLIMIT
    CUSTOMER.CREDITLIMIT = NEW_LIMIT
    CUSTOMER.UPDATEDATE = date$
    CUSTOMER.UPDATEUSER = GUSER
    
    Rewrite [CUSTOMER]
    If fstat = 0
      Trcommit
      
      # Log the change
      Call LOG_CUSTOMER_ACTIVITY(CUSTOMER_CODE, "CREDIT_LIMIT_CHANGED",
                                 "Changed from " + string$(OLD_LIMIT) + 
                                 " to " + string$(NEW_LIMIT)) From LOGGING
    Else
      Trrollback
      Call ERRBOX("Error updating customer: " + mess(255, fstat, 1))
    Endif
  Else
    Trrollback
    Call ERRBOX("Customer not found: " + CUSTOMER_CODE)
  Endif
End
```

### Looping Through Records
```4gl
# For loop through table
Subprog PROCESS_ALL_ACTIVE_CUSTOMERS()
  Local Integer CUSTOMER_COUNT
  Local Decimal TOTAL_BALANCE
  
  CUSTOMER_COUNT = 0
  TOTAL_BALANCE = 0
  
  # Loop through all active customers
  For [CUSTOMER] Where STATUS = "A"
    CUSTOMER_COUNT += 1
    TOTAL_BALANCE += CUSTOMER.BALANCE
    
    # Process each customer
    Call CALCULATE_CUSTOMER_AGING(CUSTOMER.CUSTCODE) From AGING
    
    # Send statements if balance > 0
    If CUSTOMER.BALANCE > 0
      Call SEND_CUSTOMER_STATEMENT(CUSTOMER.CUSTCODE) From STATEMENTS
    Endif
  Next
  
  # Display summary
  Call INFBOX("Processing Complete", 
             "Processed " + string$(CUSTOMER_COUNT) + " customers" + chr$(10) +
             "Total balance: " + string$(TOTAL_BALANCE, "###,##0.00"), 0)
End

# Filtered record processing
Subprog PROCESS_OVERDUE_INVOICES(DAYS_OVERDUE)
Variable Integer DAYS_OVERDUE
  Local Date CUTOFF_DATE
  Local Integer INVOICE_COUNT
  Local Decimal OVERDUE_AMOUNT
  
  # Calculate cutoff date
  CUTOFF_DATE = date$ - DAYS_OVERDUE
  
  INVOICE_COUNT = 0
  OVERDUE_AMOUNT = 0
  
  # Process overdue invoices
  For [INVOICES] Where DUEDATE < CUTOFF_DATE And STATUS = "OPEN"
    INVOICE_COUNT += 1
    OVERDUE_AMOUNT += INVOICES.AMOUNT
    
    # Update invoice status
    INVOICES.STATUS = "OVERDUE"
    INVOICES.OVERDUEDATE = date$
    Rewrite [INVOICES]
    
    # Send overdue notice
    Call SEND_OVERDUE_NOTICE(INVOICES.INVNUM, INVOICES.CUSTOMER) From NOTICES
  Next
  
  # Generate overdue report
  Call GENERATE_OVERDUE_REPORT(INVOICE_COUNT, OVERDUE_AMOUNT) From REPORTS
End
```

### Transaction Management
```4gl
# Complex transaction with error handling
Subprog PROCESS_SALES_ORDER(ORDER_DATA())
Variable Char ORDER_DATA(*)
  Local Integer TRANSACTION_LEVEL
  Local Char ORDER_NUMBER(20)
  Local Integer LINE_COUNT, I
  Local Integer ERROR_OCCURRED
  
  ORDER_NUMBER = ORDER_DATA("ORDER_NUMBER")
  ERROR_OCCURRED = 0
  
  # Start main transaction
  Trbegin ORDERS
  TRANSACTION_LEVEL = 1
  
  # Create order header
  Call CREATE_ORDER_HEADER(ORDER_DATA) From ORDERS
  If GERROR <> 0
    ERROR_OCCURRED = 1
    Goto TRANSACTION_ERROR
  Endif
  
  # Process order lines
  LINE_COUNT = val(ORDER_DATA("LINE_COUNT"))
  For I = 1 To LINE_COUNT
    # Start nested transaction for each line
    Trbegin ORDERLINES
    TRANSACTION_LEVEL = 2
    
    Call PROCESS_ORDER_LINE(ORDER_NUMBER, I, ORDER_DATA) From ORDERS
    If GERROR <> 0
      ERROR_OCCURRED = 1
      Goto TRANSACTION_ERROR
    Endif
    
    # Check inventory availability
    Call CHECK_INVENTORY_AVAILABILITY(ORDER_NUMBER, I) From INVENTORY
    If GERROR <> 0
      ERROR_OCCURRED = 1
      Goto TRANSACTION_ERROR
    Endif
    
    # Reserve inventory
    Call RESERVE_INVENTORY(ORDER_NUMBER, I) From INVENTORY
    If GERROR <> 0
      ERROR_OCCURRED = 1
      Goto TRANSACTION_ERROR
    Endif
    
    Trcommit                         # Commit line transaction
    TRANSACTION_LEVEL = 1
  Next I
  
  # Update customer statistics
  Call UPDATE_CUSTOMER_ORDER_STATS(ORDER_DATA("CUSTOMER_CODE")) From CUSTOMERS
  If GERROR <> 0
    ERROR_OCCURRED = 1
    Goto TRANSACTION_ERROR
  Endif
  
  # All successful - commit main transaction
  Trcommit
  Call INFBOX("Order " + ORDER_NUMBER + " processed successfully")
  Return
  
  # Error handling
  TRANSACTION_ERROR:
  If TRANSACTION_LEVEL = 2
    Trrollback                       # Rollback line transaction
  Endif
  Trrollback                         # Rollback main transaction
  
  Call ERRBOX("Error processing order " + ORDER_NUMBER + ": " + 
             GET_LAST_ERROR_MESSAGE())
End
```

---

## String Functions

### Basic String Operations
```4gl
Subprog STRING_EXAMPLES()
  Local Char SOURCE_STRING(100)
  Local Char RESULT_STRING(100)
  Local Integer STRING_LENGTH
  Local Integer POSITION
  
  SOURCE_STRING = "Hello, World! Welcome to Sage X3 Programming."
  
  # String length
  STRING_LENGTH = len(SOURCE_STRING)
  # Result: 46
  
  # Substring extraction
  RESULT_STRING = mid$(SOURCE_STRING, 1, 5)        # "Hello"
  RESULT_STRING = mid$(SOURCE_STRING, 8, 5)        # "World"
  RESULT_STRING = mid$(SOURCE_STRING, 15)          # "Welcome to Sage X3 Programming."
  
  # Left and right functions
  RESULT_STRING = left$(SOURCE_STRING, 10)         # "Hello, Wor"
  RESULT_STRING = right$(SOURCE_STRING, 12)        # "Programming."
  
  # Finding substrings
  POSITION = instr(SOURCE_STRING, "World")         # Returns 8
  POSITION = instr(SOURCE_STRING, "X3")            # Returns 30
  POSITION = instr(SOURCE_STRING, "NotFound")      # Returns 0
  
  # Case conversion
  RESULT_STRING = ucase$(SOURCE_STRING)            # "HELLO, WORLD! WELCOME TO SAGE X3 PROGRAMMING."
  RESULT_STRING = lcase$(SOURCE_STRING)            # "hello, world! welcome to sage x3 programming."
  
  # String trimming
  Local Char PADDED_STRING(20)
  PADDED_STRING = "  Trimmed  "
  RESULT_STRING = ltrim$(PADDED_STRING)            # "Trimmed  "
  RESULT_STRING = rtrim$(PADDED_STRING)            # "  Trimmed"
  RESULT_STRING = trim$(PADDED_STRING)             # "Trimmed"
End
```

### Advanced String Functions
```4gl
# String replacement and manipulation
Function CLEAN_CUSTOMER_NAME(RAW_NAME) Returning Char
Variable Char RAW_NAME(100)
  Local Char CLEANED_NAME(100)
  Local Char TEMP_STRING(100)
  
  CLEANED_NAME = trim$(RAW_NAME)
  
  # Replace multiple spaces with single space
  Repeat
    TEMP_STRING = CLEANED_NAME
    CLEANED_NAME = replace$(CLEANED_NAME, "  ", " ")
  Until CLEANED_NAME = TEMP_STRING
  
  # Remove special characters
  CLEANED_NAME = replace$(CLEANED_NAME, "&", "AND")
  CLEANED_NAME = replace$(CLEANED_NAME, "@", "")
  CLEANED_NAME = replace$(CLEANED_NAME, "#", "")
  CLEANED_NAME = replace$(CLEANED_NAME, "$", "")
  CLEANED_NAME = replace$(CLEANED_NAME, "%", "")
  
  # Convert to proper case
  CLEANED_NAME = proper$(CLEANED_NAME)
  
  Return CLEANED_NAME
End

# String parsing and tokenization
Subprog PARSE_CSV_LINE(CSV_LINE, FIELDS(), FIELD_COUNT)
Variable Char CSV_LINE(500)
Variable Char FIELDS(*)
Variable Integer FIELD_COUNT
  Local Integer CURRENT_POS, NEXT_COMMA, FIELD_INDEX
  Local Char CURRENT_FIELD(100)
  
  FIELD_COUNT = 0
  CURRENT_POS = 1
  FIELD_INDEX = 1
  
  While CURRENT_POS <= len(CSV_LINE)
    NEXT_COMMA = instr(CSV_LINE, ",", CURRENT_POS)
    
    If NEXT_COMMA = 0
      # Last field
      CURRENT_FIELD = mid$(CSV_LINE, CURRENT_POS)
      CURRENT_POS = len(CSV_LINE) + 1
    Else
      # Extract field between commas
      CURRENT_FIELD = mid$(CSV_LINE, CURRENT_POS, NEXT_COMMA - CURRENT_POS)
      CURRENT_POS = NEXT_COMMA + 1
    Endif
    
    # Clean the field
    CURRENT_FIELD = trim$(CURRENT_FIELD)
    If left$(CURRENT_FIELD, 1) = chr$(34)        # Remove quotes
      CURRENT_FIELD = mid$(CURRENT_FIELD, 2, len(CURRENT_FIELD) - 2)
    Endif
    
    FIELDS(FIELD_INDEX) = CURRENT_FIELD
    FIELD_INDEX += 1
    FIELD_COUNT += 1
  Endwhile
End

# String formatting
Function FORMAT_CURRENCY(AMOUNT, CURRENCY_CODE) Returning Char
Variable Decimal AMOUNT
Variable Char CURRENCY_CODE(3)
  Local Char FORMATTED_AMOUNT(20)
  Local Char CURRENCY_SYMBOL(5)
  
  # Determine currency symbol
  Case CURRENCY_CODE
    When "USD"
      CURRENCY_SYMBOL = "$"
    When "EUR"
      CURRENCY_SYMBOL = "€"
    When "GBP"
      CURRENCY_SYMBOL = "£"
    When "JPY"
      CURRENCY_SYMBOL = "¥"
    Default
      CURRENCY_SYMBOL = CURRENCY_CODE + " "
  Endcase
  
  # Format the amount
  If AMOUNT < 0
    FORMATTED_AMOUNT = "-" + CURRENCY_SYMBOL + string$(abs(AMOUNT), "###,##0.00")
  Else
    FORMATTED_AMOUNT = CURRENCY_SYMBOL + string$(AMOUNT, "###,##0.00")
  Endif
  
  Return FORMATTED_AMOUNT
End
```

### String Validation
```4gl
# Email validation
Function IS_VALID_EMAIL(EMAIL_ADDRESS) Returning Integer
Variable Char EMAIL_ADDRESS(100)
  Local Integer AT_POSITION, DOT_POSITION
  Local Char LOCAL_PART(50), DOMAIN_PART(50)
  
  # Basic structure check
  AT_POSITION = instr(EMAIL_ADDRESS, "@")
  If AT_POSITION <= 1 Or AT_POSITION = len(EMAIL_ADDRESS)
    Return 0                         # Invalid: @ missing or at beginning/end
  Endif
  
  LOCAL_PART = left$(EMAIL_ADDRESS, AT_POSITION - 1)
  DOMAIN_PART = mid$(EMAIL_ADDRESS, AT_POSITION + 1)
  
  # Check for multiple @ symbols
  If instr(DOMAIN_PART, "@") > 0
    Return 0                         # Invalid: multiple @ symbols
  Endif
  
  # Check domain has at least one dot
  DOT_POSITION = instr(DOMAIN_PART, ".")
  If DOT_POSITION <= 1 Or DOT_POSITION = len(DOMAIN_PART)
    Return 0                         # Invalid: no dot or dot at beginning/end
  Endif
  
  # Basic character validation (simplified)
  If len(LOCAL_PART) = 0 Or len(DOMAIN_PART) < 3
    Return 0                         # Invalid: too short
  Endif
  
  Return 1                           # Valid email format
End

# Phone number formatting
Function FORMAT_PHONE_NUMBER(RAW_PHONE, COUNTRY_CODE) Returning Char
Variable Char RAW_PHONE(20), COUNTRY_CODE(3)
  Local Char CLEAN_PHONE(15)
  Local Char FORMATTED_PHONE(25)
  Local Integer I
  Local Char CURRENT_CHAR(1)
  
  # Remove non-numeric characters
  CLEAN_PHONE = ""
  For I = 1 To len(RAW_PHONE)
    CURRENT_CHAR = mid$(RAW_PHONE, I, 1)
    If CURRENT_CHAR >= "0" And CURRENT_CHAR <= "9"
      CLEAN_PHONE = CLEAN_PHONE + CURRENT_CHAR
    Endif
  Next I
  
  # Format based on country
  Case COUNTRY_CODE
    When "USA"
      If len(CLEAN_PHONE) = 10
        FORMATTED_PHONE = "(" + left$(CLEAN_PHONE, 3) + ") " +
                         mid$(CLEAN_PHONE, 4, 3) + "-" +
                         right$(CLEAN_PHONE, 4)
      Else
        FORMATTED_PHONE = CLEAN_PHONE  # Return as-is if not 10 digits
      Endif
    When "FRA"
      If len(CLEAN_PHONE) = 10
        FORMATTED_PHONE = left$(CLEAN_PHONE, 2) + "." +
                         mid$(CLEAN_PHONE, 3, 2) + "." +
                         mid$(CLEAN_PHONE, 5, 2) + "." +
                         mid$(CLEAN_PHONE, 7, 2) + "." +
                         right$(CLEAN_PHONE, 2)
      Else
        FORMATTED_PHONE = CLEAN_PHONE
      Endif
    Default
      FORMATTED_PHONE = CLEAN_PHONE
  Endcase
  
  Return FORMATTED_PHONE
End
```

---

## Numeric Functions

### Basic Math Operations
```4gl
Subprog NUMERIC_EXAMPLES()
  Local Decimal VALUE1, VALUE2, RESULT
  Local Integer INT_RESULT
  
  VALUE1 = 123.456
  VALUE2 = 67.89
  
  # Basic arithmetic
  RESULT = VALUE1 + VALUE2          # Addition: 191.346
  RESULT = VALUE1 - VALUE2          # Subtraction: 55.566
  RESULT = VALUE1 * VALUE2          # Multiplication: 8380.27
  RESULT = VALUE1 / VALUE2          # Division: 1.818...
  
  # Modulo operation
  INT_RESULT = 17 Mod 5             # Result: 2
  
  # Power operation
  RESULT = VALUE1 ** 2              # Square: 15,241.384
  
  # Absolute value
  RESULT = abs(-123.45)             # Result: 123.45
  
  # Rounding functions
  RESULT = round(VALUE1, 2)         # Round to 2 decimals: 123.46
  RESULT = round(VALUE1, 0)         # Round to integer: 123
  RESULT = round(VALUE1, -1)        # Round to tens: 120
  
  # Floor and ceiling
  INT_RESULT = int(VALUE1)          # Floor: 123
  RESULT = VALUE1 - int(VALUE1)     # Fractional part: 0.456
  
  # Sign function
  INT_RESULT = sgn(VALUE1)          # Result: 1 (positive)
  INT_RESULT = sgn(-VALUE1)         # Result: -1 (negative)
  INT_RESULT = sgn(0)               # Result: 0 (zero)
End
```

### Advanced Mathematical Functions
```4gl
# Trigonometric functions
Function CALCULATE_DISTANCE(LAT1, LON1, LAT2, LON2) Returning Decimal
Variable Decimal LAT1, LON1, LAT2, LON2
  Local Decimal EARTH_RADIUS, DELTA_LAT, DELTA_LON
  Local Decimal A, C, DISTANCE
  
  EARTH_RADIUS = 6371.0            # Earth radius in kilometers
  
  # Convert degrees to radians
  LAT1 = LAT1 * 3.14159265359 / 180
  LON1 = LON1 * 3.14159265359 / 180
  LAT2 = LAT2 * 3.14159265359 / 180
  LON2 = LON2 * 3.14159265359 / 180
  
  DELTA_LAT = LAT2 - LAT1
  DELTA_LON = LON2 - LON1
  
  # Haversine formula
  A = sin(DELTA_LAT / 2) ** 2 + cos(LAT1) * cos(LAT2) * sin(DELTA_LON / 2) ** 2
  C = 2 * atan2(sqr(A), sqr(1 - A))
  DISTANCE = EARTH_RADIUS * C
  
  Return DISTANCE
End

# Financial calculations
Function CALCULATE_COMPOUND_INTEREST(PRINCIPAL, RATE, TIME, COMPOUNDS_PER_YEAR) Returning Decimal
Variable Decimal PRINCIPAL, RATE, TIME
Variable Integer COMPOUNDS_PER_YEAR
  Local Decimal RESULT
  
  # A = P(1 + r/n)^(nt)
  RESULT = PRINCIPAL * (1 + RATE / COMPOUNDS_PER_YEAR) ** (COMPOUNDS_PER_YEAR * TIME)
  
  Return RESULT
End

# Statistical functions
Subprog CALCULATE_STATISTICS(VALUES(), COUNT, MEAN, MEDIAN, STDDEV)
Variable Decimal VALUES(*)
Variable Integer COUNT
Variable Decimal MEAN, MEDIAN, STDDEV
  Local Decimal SUM, VARIANCE
  Local Integer I, J
  Local Decimal TEMP_VALUE
  
  # Calculate mean
  SUM = 0
  For I = 1 To COUNT
    SUM += VALUES(I)
  Next I
  MEAN = SUM / COUNT
  
  # Sort array for median calculation (bubble sort)
  For I = 1 To COUNT - 1
    For J = I + 1 To COUNT
      If VALUES(I) > VALUES(J)
        TEMP_VALUE = VALUES(I)
        VALUES(I) = VALUES(J)
        VALUES(J) = TEMP_VALUE
      Endif
    Next J
  Next I
  
  # Calculate median
  If COUNT Mod 2 = 1
    MEDIAN = VALUES((COUNT + 1) / 2)
  Else
    MEDIAN = (VALUES(COUNT / 2) + VALUES(COUNT / 2 + 1)) / 2
  Endif
  
  # Calculate standard deviation
  VARIANCE = 0
  For I = 1 To COUNT
    VARIANCE += (VALUES(I) - MEAN) ** 2
  Next I
  VARIANCE = VARIANCE / COUNT
  STDDEV = sqr(VARIANCE)
End
```

### Number Formatting and Conversion
```4gl
# Number to text conversion with various formats
Function FORMAT_NUMBER(NUMBER_VALUE, FORMAT_TYPE) Returning Char
Variable Decimal NUMBER_VALUE
Variable Char FORMAT_TYPE(20)
  Local Char FORMATTED_NUMBER(50)
  
  Case FORMAT_TYPE
    When "CURRENCY"
      FORMATTED_NUMBER = "$" + string$(NUMBER_VALUE, "###,##0.00")
    When "PERCENTAGE"
      FORMATTED_NUMBER = string$(NUMBER_VALUE * 100, "##0.00") + "%"
    When "SCIENTIFIC"
      # Simplified scientific notation
      Local Integer EXPONENT
      Local Decimal MANTISSA
      EXPONENT = 0
      MANTISSA = NUMBER_VALUE
      
      While abs(MANTISSA) >= 10
        MANTISSA = MANTISSA / 10
        EXPONENT += 1
      Endwhile
      
      While abs(MANTISSA) < 1 And MANTISSA <> 0
        MANTISSA = MANTISSA * 10
        EXPONENT -= 1
      Endwhile
      
      FORMATTED_NUMBER = string$(MANTISSA, "0.00") + "E" + string$(EXPONENT)
    When "ACCOUNTING"
      If NUMBER_VALUE < 0
        FORMATTED_NUMBER = "(" + string$(abs(NUMBER_VALUE), "###,##0.00") + ")"
      Else
        FORMATTED_NUMBER = " " + string$(NUMBER_VALUE, "###,##0.00") + " "
      Endif
    When "FRACTION"
      Local Integer WHOLE_PART, NUMERATOR, DENOMINATOR
      WHOLE_PART = int(NUMBER_VALUE)
      NUMERATOR = int((NUMBER_VALUE - WHOLE_PART) * 16)  # Sixteenths
      DENOMINATOR = 16
      
      # Simplify fraction
      While NUMERATOR Mod 2 = 0 And DENOMINATOR Mod 2 = 0
        NUMERATOR = NUMERATOR / 2
        DENOMINATOR = DENOMINATOR / 2
      Endwhile
      
      If NUMERATOR = 0
        FORMATTED_NUMBER = string$(WHOLE_PART)
      Elsif WHOLE_PART = 0
        FORMATTED_NUMBER = string$(NUMERATOR) + "/" + string$(DENOMINATOR)
      Else
        FORMATTED_NUMBER = string$(WHOLE_PART) + " " + 
                          string$(NUMERATOR) + "/" + string$(DENOMINATOR)
      Endif
    Default
      FORMATTED_NUMBER = string$(NUMBER_VALUE)
  Endcase
  
  Return FORMATTED_NUMBER
End

# Random number generation
Function GENERATE_RANDOM_NUMBER(MIN_VALUE, MAX_VALUE) Returning Decimal
Variable Decimal MIN_VALUE, MAX_VALUE
  Local Decimal RANDOM_VALUE
  
  # Generate random number between 0 and 1 (pseudo-random)
  RANDOM_VALUE = rnd(1)
  
  # Scale to desired range
  RANDOM_VALUE = MIN_VALUE + (MAX_VALUE - MIN_VALUE) * RANDOM_VALUE
  
  Return RANDOM_VALUE
End
```

---

## Date and Time Functions

### Basic Date Operations
```4gl
Subprog DATE_EXAMPLES()
  Local Date TODAY_DATE, FUTURE_DATE, PAST_DATE
  Local Integer DAYS_DIFFERENCE
  Local Char DATE_STRING(10)
  Local Integer DAY_OF_WEEK, DAY_OF_YEAR
  
  # Current date
  TODAY_DATE = date$               # System date
  
  # Date arithmetic
  FUTURE_DATE = TODAY_DATE + 30    # 30 days from today
  PAST_DATE = TODAY_DATE - 90      # 90 days ago
  
  # Calculate difference in days
  DAYS_DIFFERENCE = FUTURE_DATE - TODAY_DATE    # Result: 30
  
  # Date formatting
  DATE_STRING = string$(TODAY_DATE, "MM/DD/YYYY")
  DATE_STRING = string$(TODAY_DATE, "DD-MMM-YYYY")
  DATE_STRING = string$(TODAY_DATE, "YYYY-MM-DD")
  
  # Extract date parts
  Local Integer YEAR, MONTH, DAY
  YEAR = year(TODAY_DATE)
  MONTH = month(TODAY_DATE)
  DAY = day(TODAY_DATE)
  
  # Day of week (1=Sunday, 2=Monday, etc.)
  DAY_OF_WEEK = dow(TODAY_DATE)
  
  # Day of year (1-366)
  DAY_OF_YEAR = doy(TODAY_DATE)
  
  # Create specific dates
  Local Date CHRISTMAS, NEW_YEAR
  CHRISTMAS = [2024/12/25]
  NEW_YEAR = [2025/1/1]
  
  # Check if date is valid
  Local Date TEST_DATE
  TEST_DATE = [2024/2/29]          # Valid leap year date
  If TEST_DATE <> [0/0/0]
    # Date is valid
  Endif
  
  TEST_DATE = [2023/2/29]          # Invalid - not a leap year
  If TEST_DATE = [0/0/0]
    # Date is invalid
  Endif
End
```

### Advanced Date Calculations
```4gl
# Business day calculations
Function ADD_BUSINESS_DAYS(START_DATE, BUSINESS_DAYS) Returning Date
Variable Date START_DATE
Variable Integer BUSINESS_DAYS
  Local Date CURRENT_DATE
  Local Integer DAYS_ADDED, DAY_OF_WEEK
  
  CURRENT_DATE = START_DATE
  DAYS_ADDED = 0
  
  While DAYS_ADDED < BUSINESS_DAYS
    CURRENT_DATE = CURRENT_DATE + 1
    DAY_OF_WEEK = dow(CURRENT_DATE)
    
    # Skip weekends (Saturday=7, Sunday=1)
    If DAY_OF_WEEK <> 1 And DAY_OF_WEEK <> 7
      # Check if it's not a holiday
      If Not IS_HOLIDAY(CURRENT_DATE)
        DAYS_ADDED += 1
      Endif
    Endif
  Endwhile
  
  Return CURRENT_DATE
End

# Holiday checking function
Function IS_HOLIDAY(CHECK_DATE) Returning Integer
Variable Date CHECK_DATE
  Local Integer MONTH_NUM, DAY_NUM, YEAR_NUM
  Local Date EASTER_DATE, MEMORIAL_DAY, LABOR_DAY, THANKSGIVING
  
  MONTH_NUM = month(CHECK_DATE)
  DAY_NUM = day(CHECK_DATE)
  YEAR_NUM = year(CHECK_DATE)
  
  # Fixed holidays
  If (MONTH_NUM = 1 And DAY_NUM = 1) Or          # New Year's Day
     (MONTH_NUM = 7 And DAY_NUM = 4) Or          # Independence Day
     (MONTH_NUM = 12 And DAY_NUM = 25)           # Christmas
    Return 1
  Endif
  
  # Calculate floating holidays
  # Memorial Day (last Monday in May)
  MEMORIAL_DAY = [YEAR_NUM/5/31]
  While dow(MEMORIAL_DAY) <> 2                   # Find last Monday
    MEMORIAL_DAY = MEMORIAL_DAY - 1
  Endwhile
  
  # Labor Day (first Monday in September)
  LABOR_DAY = [YEAR_NUM/9/1]
  While dow(LABOR_DAY) <> 2                      # Find first Monday
    LABOR_DAY = LABOR_DAY + 1
  Endwhile
  
  # Thanksgiving (fourth Thursday in November)
  THANKSGIVING = [YEAR_NUM/11/1]
  Local Integer THURSDAY_COUNT
  THURSDAY_COUNT = 0
  While THURSDAY_COUNT < 4
    If dow(THANKSGIVING) = 5                     # Thursday
      THURSDAY_COUNT += 1
      If THURSDAY_COUNT < 4
        THANKSGIVING = THANKSGIVING + 7
      Endif
    Else
      THANKSGIVING = THANKSGIVING + 1
    Endif
  Endwhile
  
  If CHECK_DATE = MEMORIAL_DAY Or CHECK_DATE = LABOR_DAY Or CHECK_DATE = THANKSGIVING
    Return 1
  Endif
  
  Return 0                                       # Not a holiday
End

# Age calculation
Function CALCULATE_AGE(BIRTH_DATE, REFERENCE_DATE) Returning Integer
Variable Date BIRTH_DATE, REFERENCE_DATE
  Local Integer YEARS, BIRTH_MONTH, BIRTH_DAY
  Local Integer REF_MONTH, REF_DAY
  
  YEARS = year(REFERENCE_DATE) - year(BIRTH_DATE)
  BIRTH_MONTH = month(BIRTH_DATE)
  BIRTH_DAY = day(BIRTH_DATE)
  REF_MONTH = month(REFERENCE_DATE)
  REF_DAY = day(REFERENCE_DATE)
  
  # Adjust if birthday hasn't occurred this year
  If REF_MONTH < BIRTH_MONTH Or (REF_MONTH = BIRTH_MONTH And REF_DAY < BIRTH_DAY)
    YEARS = YEARS - 1
  Endif
  
  Return YEARS
End
```

### Time Functions
```4gl
# Time manipulation and formatting
Subprog TIME_EXAMPLES()
  Local Char CURRENT_TIME(8)
  Local Char FORMATTED_TIME(20)
  Local Integer HOURS, MINUTES, SECONDS
  Local Integer TOTAL_SECONDS
  
  # Get current time
  CURRENT_TIME = time$             # Format: "HH:MM:SS"
  
  # Extract time components
  HOURS = val(left$(CURRENT_TIME, 2))
  MINUTES = val(mid$(CURRENT_TIME, 4, 2))
  SECONDS = val(right$(CURRENT_TIME, 2))
  
  # Convert to total seconds since midnight
  TOTAL_SECONDS = HOURS * 3600 + MINUTES * 60 + SECONDS
  
  # Format time in different ways
  If HOURS = 0
    FORMATTED_TIME = "12:" + mid$(CURRENT_TIME, 4, 5) + " AM"
  Elsif HOURS < 12
    FORMATTED_TIME = string$(HOURS) + ":" + mid$(CURRENT_TIME, 4, 5) + " AM"
  Elsif HOURS = 12
    FORMATTED_TIME = "12:" + mid$(CURRENT_TIME, 4, 5) + " PM"
  Else
    FORMATTED_TIME = string$(HOURS - 12) + ":" + mid$(CURRENT_TIME, 4, 5) + " PM"
  Endif
  
  # Calculate elapsed time
  Local Char START_TIME(8), END_TIME(8)
  START_TIME = "09:30:00"
  END_TIME = "17:45:30"
  
  Call CALCULATE_ELAPSED_TIME(START_TIME, END_TIME, FORMATTED_TIME) From CURRENT
End

# Calculate elapsed time between two times
Subprog CALCULATE_ELAPSED_TIME(START_TIME, END_TIME, ELAPSED_TIME)
Variable Char START_TIME(8), END_TIME(8)
Variable Char ELAPSED_TIME(20)
  Local Integer START_SECONDS, END_SECONDS, DIFF_SECONDS
  Local Integer ELAPSED_HOURS, ELAPSED_MINUTES, ELAPSED_SECS
  
  # Convert times to seconds
  START_SECONDS = val(left$(START_TIME, 2)) * 3600 +
                  val(mid$(START_TIME, 4, 2)) * 60 +
                  val(right$(START_TIME, 2))
  
  END_SECONDS = val(left$(END_TIME, 2)) * 3600 +
                val(mid$(END_TIME, 4, 2)) * 60 +
                val(right$(END_TIME, 2))
  
  # Handle overnight periods
  If END_SECONDS < START_SECONDS
    END_SECONDS += 86400           # Add 24 hours in seconds
  Endif
  
  DIFF_SECONDS = END_SECONDS - START_SECONDS
  
  # Convert back to hours, minutes, seconds
  ELAPSED_HOURS = DIFF_SECONDS / 3600
  ELAPSED_MINUTES = (DIFF_SECONDS Mod 3600) / 60
  ELAPSED_SECS = DIFF_SECONDS Mod 60
  
  ELAPSED_TIME = string$(ELAPSED_HOURS, "00") + ":" +
                 string$(ELAPSED_MINUTES, "00") + ":" +
                 string$(ELAPSED_SECS, "00")
End
```

### DateTime Operations
```4gl
# Working with DateTime values
Function CALCULATE_PROCESSING_TIME(START_DATETIME, END_DATETIME) Returning Decimal
Variable DateTime START_DATETIME, END_DATETIME
  Local Decimal TOTAL_HOURS
  Local Date START_DATE, END_DATE
  Local Char START_TIME(8), END_TIME(8)
  Local Integer DAYS_DIFF, TIME_DIFF_SECONDS
  
  # Extract date and time components
  START_DATE = date(START_DATETIME)
  END_DATE = date(END_DATETIME)
  START_TIME = time(START_DATETIME)
  END_TIME = time(END_DATETIME)
  
  # Calculate difference in days
  DAYS_DIFF = END_DATE - START_DATE
  
  # Calculate time difference in seconds
  Local Integer START_SECS, END_SECS
  START_SECS = val(left$(START_TIME, 2)) * 3600 +
               val(mid$(START_TIME, 4, 2)) * 60 +
               val(right$(START_TIME, 2))
  
  END_SECS = val(left$(END_TIME, 2)) * 3600 +
             val(mid$(END_TIME, 4, 2)) * 60 +
             val(right$(END_TIME, 2))
  
  TIME_DIFF_SECONDS = END_SECS - START_SECS
  
  # Convert to total hours
  TOTAL_HOURS = DAYS_DIFF * 24 + TIME_DIFF_SECONDS / 3600.0
  
  Return TOTAL_HOURS
End

# Format datetime for display
Function FORMAT_DATETIME(DATETIME_VALUE, FORMAT_TYPE) Returning Char
Variable DateTime DATETIME_VALUE
Variable Char FORMAT_TYPE(20)
  Local Date DATE_PART
  Local Char TIME_PART(8)
  Local Char FORMATTED_RESULT(30)
  
  DATE_PART = date(DATETIME_VALUE)
  TIME_PART = time(DATETIME_VALUE)
  
  Case FORMAT_TYPE
    When "LONG"
      FORMATTED_RESULT = string$(DATE_PART, "MMMM DD, YYYY") + " at " + TIME_PART
    When "SHORT"
      FORMATTED_RESULT = string$(DATE_PART, "MM/DD/YY") + " " + 
                        left$(TIME_PART, 5)
    When "ISO"
      FORMATTED_RESULT = string$(DATE_PART, "YYYY-MM-DD") + "T" + TIME_PART
    When "TIMESTAMP"
      FORMATTED_RESULT = string$(DATE_PART, "YYYYMMDD") + "_" +
                        replace$(TIME_PART, ":", "")
    Default
      FORMATTED_RESULT = string$(DATE_PART) + " " + TIME_PART
  Endcase
  
  Return FORMATTED_RESULT
End
```

---

## Array Operations

### Single Dimension Arrays
```4gl
# Array declaration and initialization
Subprog ARRAY_OPERATIONS_EXAMPLES()
  Local Char EMPLOYEE_NAMES(50)(30)     # 50 employees, 30 chars each
  Local Decimal EMPLOYEE_SALARIES(50)   # 50 salary values
  Local Integer EMPLOYEE_COUNT
  Local Decimal TOTAL_PAYROLL, AVERAGE_SALARY
  
  EMPLOYEE_COUNT = 0
  TOTAL_PAYROLL = 0
  
  # Load employee data
  EMPLOYEE_NAMES(1) = "John Smith"
  EMPLOYEE_SALARIES(1) = 65000.00
  EMPLOYEE_NAMES(2) = "Jane Doe"
  EMPLOYEE_SALARIES(2) = 72000.00
  EMPLOYEE_NAMES(3) = "Bob Johnson"
  EMPLOYEE_SALARIES(3) = 58000.00
  EMPLOYEE_COUNT = 3
  
  # Calculate totals
  Local Integer I
  For I = 1 To EMPLOYEE_COUNT
    TOTAL_PAYROLL += EMPLOYEE_SALARIES(I)
  Next I
  
  AVERAGE_SALARY = TOTAL_PAYROLL / EMPLOYEE_COUNT
  
  # Sort employees by salary (bubble sort)
  Call SORT_EMPLOYEES_BY_SALARY(EMPLOYEE_NAMES, EMPLOYEE_SALARIES, EMPLOYEE_COUNT) From CURRENT
End

# Array sorting function
Subprog SORT_EMPLOYEES_BY_SALARY(NAMES(), SALARIES(), COUNT)
Variable Char NAMES(*)
Variable Decimal SALARIES(*)
Variable Integer COUNT
  Local Integer I, J
  Local Char TEMP_NAME(30)
  Local Decimal TEMP_SALARY
  
  # Bubble sort implementation
  For I = 1 To COUNT - 1
    For J = I + 1 To COUNT
      If SALARIES(I) < SALARIES(J)  # Sort descending
        # Swap salaries
        TEMP_SALARY = SALARIES(I)
        SALARIES(I) = SALARIES(J)
        SALARIES(J) = TEMP_SALARY
        
        # Swap corresponding names
        TEMP_NAME = NAMES(I)
        NAMES(I) = NAMES(J)
        NAMES(J) = TEMP_NAME
      Endif
    Next J
  Next I
End
```

### Multi-dimensional Arrays
```4gl
# Working with 2D arrays for sales data
Subprog SALES_MATRIX_EXAMPLE()
  Local Decimal SALES_DATA(12)(5)       # 12 months x 5 regions
  Local Decimal MONTHLY_TOTALS(12)
  Local Decimal REGIONAL_TOTALS(5)
  Local Decimal GRAND_TOTAL
  Local Integer MONTH, REGION
  
  # Initialize sample data
  For MONTH = 1 To 12
    For REGION = 1 To 5
      SALES_DATA(MONTH)(REGION) = MONTH * 1000 + REGION * 500
    Next REGION
  Next MONTH
  
  # Calculate monthly totals
  For MONTH = 1 To 12
    MONTHLY_TOTALS(MONTH) = 0
    For REGION = 1 To 5
      MONTHLY_TOTALS(MONTH) += SALES_DATA(MONTH)(REGION)
    Next REGION
  Next MONTH
  
  # Calculate regional totals
  For REGION = 1 To 5
    REGIONAL_TOTALS(REGION) = 0
    For MONTH = 1 To 12
      REGIONAL_TOTALS(REGION) += SALES_DATA(MONTH)(REGION)
    Next MONTH
  Next REGION
  
  # Calculate grand total
  GRAND_TOTAL = 0
  For MONTH = 1 To 12
    GRAND_TOTAL += MONTHLY_TOTALS(MONTH)
  Next MONTH
End

# Dynamic array processing
Function FIND_ARRAY_MAX(VALUES(), COUNT) Returning Decimal
Variable Decimal VALUES(*)
Variable Integer COUNT
  Local Decimal MAX_VALUE
  Local Integer I
  
  If COUNT <= 0
    Return 0
  Endif
  
  MAX_VALUE = VALUES(1)
  For I = 2 To COUNT
    If VALUES(I) > MAX_VALUE
      MAX_VALUE = VALUES(I)
    Endif
  Next I
  
  Return MAX_VALUE
End
```

---

## File Operations

### Text File Processing
```4gl
# Reading and writing text files
Subprog FILE_PROCESSING_EXAMPLE()
  Local Integer FILE_HANDLE
  Local Char FILE_NAME(100)
  Local Char LINE_BUFFER(500)
  Local Integer LINE_COUNT
  
  FILE_NAME = "customer_export.txt"
  
  # Open file for writing
  Open FILE_NAME For Output As FILE_HANDLE
  If fstat <> 0
    Call ERRBOX("Cannot create file: " + FILE_NAME)
    Return
  Endif
  
  # Write header
  Print #FILE_HANDLE, "Customer Code,Name,Balance,Status"
  
  # Export customer data
  For [CUSTOMER] Where STATUS = "A"
    Print #FILE_HANDLE, CUSTOMER.CUSTCODE + "," +
                       CUSTOMER.NAME + "," +
                       string$(CUSTOMER.BALANCE) + "," +
                       CUSTOMER.STATUS
  Next
  
  Close #FILE_HANDLE
  
  # Read file back for verification
  LINE_COUNT = 0
  Open FILE_NAME For Input As FILE_HANDLE
  If fstat = 0
    While Not eof(FILE_HANDLE)
      Line Input #FILE_HANDLE, LINE_BUFFER
      LINE_COUNT += 1
      # Process each line if needed
    Endwhile
    Close #FILE_HANDLE
    
    Call INFBOX("File processed successfully. " + string$(LINE_COUNT) + " lines written.")
  Endif
End

# CSV file import processing
Subprog IMPORT_CSV_FILE(FILE_NAME, IMPORT_COUNT, ERROR_COUNT)
Variable Char FILE_NAME(100)
Variable Integer IMPORT_COUNT, ERROR_COUNT
  Local Integer FILE_HANDLE
  Local Char LINE_BUFFER(1000)
  Local Char FIELDS(10)(50)
  Local Integer FIELD_COUNT
  Local Integer LINE_NUMBER
  
  IMPORT_COUNT = 0
  ERROR_COUNT = 0
  LINE_NUMBER = 0
  
  Open FILE_NAME For Input As FILE_HANDLE
  If fstat <> 0
    Call ERRBOX("Cannot open file: " + FILE_NAME)
    Return
  Endif
  
  # Skip header line
  Line Input #FILE_HANDLE, LINE_BUFFER
  LINE_NUMBER = 1
  
  While Not eof(FILE_HANDLE)
    Line Input #FILE_HANDLE, LINE_BUFFER
    LINE_NUMBER += 1
    
    # Parse CSV line
    Call PARSE_CSV_LINE(LINE_BUFFER, FIELDS, FIELD_COUNT) From UTILITIES
    
    If FIELD_COUNT >= 4
      # Process valid record
      Call IMPORT_CUSTOMER_RECORD(FIELDS(1), FIELDS(2), FIELDS(3), FIELDS(4))
      If GERROR = 0
        IMPORT_COUNT += 1
      Else
        ERROR_COUNT += 1
        Call LOG_IMPORT_ERROR(LINE_NUMBER, LINE_BUFFER, "Import failed") From LOGGING
      Endif
    Else
      ERROR_COUNT += 1
      Call LOG_IMPORT_ERROR(LINE_NUMBER, LINE_BUFFER, "Invalid format") From LOGGING
    Endif
  Endwhile
  
  Close #FILE_HANDLE
End
```

### Binary File Operations
```4gl
# Working with binary files for data export/import
Subprog BINARY_FILE_EXAMPLE()
  Local Integer FILE_HANDLE
  Local Char FILE_NAME(100)
  Local Char RECORD_BUFFER(500)
  Local Integer RECORD_COUNT
  
  FILE_NAME = "customer_data.dat"
  
  # Write binary data
  Open FILE_NAME For Binary As FILE_HANDLE
  If fstat <> 0
    Call ERRBOX("Cannot create binary file")
    Return
  Endif
  
  RECORD_COUNT = 0
  For [CUSTOMER]
    # Pack record into buffer
    RECORD_BUFFER = CUSTOMER.CUSTCODE + 
                   string$(len(CUSTOMER.NAME), "000") + CUSTOMER.NAME +
                   string$(CUSTOMER.BALANCE, "000000000.00") +
                   CUSTOMER.STATUS
    
    Put #FILE_HANDLE, RECORD_BUFFER
    RECORD_COUNT += 1
  Next
  
  Close #FILE_HANDLE
  
  Call INFBOX("Binary export complete. " + string$(RECORD_COUNT) + " records written.")
End
```

---

## Error Handling

### Exception Management
```4gl
# Comprehensive error handling framework
Global Integer GLOBAL_ERROR_CODE
Global Char GLOBAL_ERROR_MESSAGE(255)

Subprog ERROR_HANDLING_EXAMPLE()
  Local Integer OPERATION_RESULT
  
  # Clear previous errors
  GLOBAL_ERROR_CODE = 0
  GLOBAL_ERROR_MESSAGE = ""
  
  # Perform operation with error handling
  Call RISKY_OPERATION("CUSTOMER001") From CURRENT Returning OPERATION_RESULT
  
  If GLOBAL_ERROR_CODE <> 0
    # Handle error based on type
    Case GLOBAL_ERROR_CODE
      When -1
        Call ERRBOX("Record not found: " + GLOBAL_ERROR_MESSAGE)
      When -2
        Call ERRBOX("Database error: " + GLOBAL_ERROR_MESSAGE)
      When -3
        Call ERRBOX("Validation error: " + GLOBAL_ERROR_MESSAGE)
      Default
        Call ERRBOX("Unknown error (" + string$(GLOBAL_ERROR_CODE) + "): " + GLOBAL_ERROR_MESSAGE)
    Endcase
    
    # Log error for debugging
    Call LOG_ERROR("ERROR_HANDLING_EXAMPLE", GLOBAL_ERROR_MESSAGE, GLOBAL_ERROR_CODE) From LOGGING
  Else
    Call INFBOX("Operation completed successfully")
  Endif
End

# Function with structured error handling
Function RISKY_OPERATION(CUSTOMER_CODE) Returning Integer
Variable Char CUSTOMER_CODE(15)
  Local Decimal CREDIT_LIMIT
  Local Char CUSTOMER_STATUS(1)
  
  # Clear error state
  GLOBAL_ERROR_CODE = 0
  GLOBAL_ERROR_MESSAGE = ""
  
  # Validate input
  If CUSTOMER_CODE = ""
    GLOBAL_ERROR_CODE = -3
    GLOBAL_ERROR_MESSAGE = "Customer code is required"
    Return -1
  Endif
  
  # Try database operation
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat <> 0
    GLOBAL_ERROR_CODE = -1
    GLOBAL_ERROR_MESSAGE = "Customer " + CUSTOMER_CODE + " not found"
    Return -1
  Endif
  
  # Business logic validation
  CUSTOMER_STATUS = CUSTOMER.STATUS
  CREDIT_LIMIT = CUSTOMER.CREDITLIMIT
  
  If CUSTOMER_STATUS <> "A"
    GLOBAL_ERROR_CODE = -3
    GLOBAL_ERROR_MESSAGE = "Customer is not active"
    Return -1
  Endif
  
  If CREDIT_LIMIT <= 0
    GLOBAL_ERROR_CODE = -3
    GLOBAL_ERROR_MESSAGE = "Customer has no credit limit"
    Return -1
  Endif
  
  # Perform actual operation
  Trbegin CUSTOMER
  CUSTOMER.LASTACCESS = date$
  Rewrite [CUSTOMER]
  If fstat <> 0
    Trrollback
    GLOBAL_ERROR_CODE = -2
    GLOBAL_ERROR_MESSAGE = "Database update failed: " + mess(255, fstat, 1)
    Return -1
  Endif
  Trcommit
  
  Return 0  # Success
End

# Error logging system
Subprog LOG_ERROR(MODULE_NAME, ERROR_MESSAGE, ERROR_CODE)
Variable Char MODULE_NAME(30), ERROR_MESSAGE(255)
Variable Integer ERROR_CODE
  Local Char LOG_ENTRY(500)
  Local Date LOG_DATE
  Local Char LOG_TIME(8)
  
  LOG_DATE = date$
  LOG_TIME = time$
  
  LOG_ENTRY = string$(LOG_DATE, "YYYY-MM-DD") + " " + LOG_TIME + " [" +
             MODULE_NAME + "] ERROR " + string$(ERROR_CODE) + ": " + ERROR_MESSAGE
  
  # Write to error log table
  ERRORLOG.LOGDATE = LOG_DATE
  ERRORLOG.LOGTIME = LOG_TIME
  ERRORLOG.MODULE = MODULE_NAME
  ERRORLOG.ERRORCODE = ERROR_CODE
  ERRORLOG.MESSAGE = ERROR_MESSAGE
  ERRORLOG.USERID = GUSER
  
  Write [ERRORLOG]
  
  # Also write to system log file
  Call SYSTEM_LOG_WRITE(LOG_ENTRY) From SYSTEM
End
```

### Validation Framework
```4gl
# Comprehensive data validation
Function VALIDATE_CUSTOMER_DATA(CUSTOMER_DATA()) Returning Integer
Variable Char CUSTOMER_DATA(*)
  Local Integer VALIDATION_ERRORS
  Local Char ERROR_LIST(1000)
  
  VALIDATION_ERRORS = 0
  ERROR_LIST = ""
  
  # Validate customer code
  If CUSTOMER_DATA("CUSTCODE") = ""
    VALIDATION_ERRORS += 1
    ERROR_LIST = ERROR_LIST + "Customer code is required; "
  Elsif len(trim$(CUSTOMER_DATA("CUSTCODE"))) < 3
    VALIDATION_ERRORS += 1
    ERROR_LIST = ERROR_LIST + "Customer code must be at least 3 characters; "
  Elsif Not IS_VALID_CUSTOMER_CODE_FORMAT(CUSTOMER_DATA("CUSTCODE"))
    VALIDATION_ERRORS += 1
    ERROR_LIST = ERROR_LIST + "Customer code contains invalid characters; "
  Endif
  
  # Validate customer name
  If CUSTOMER_DATA("NAME") = ""
    VALIDATION_ERRORS += 1
    ERROR_LIST = ERROR_LIST + "Customer name is required; "
  Elsif len(trim$(CUSTOMER_DATA("NAME"))) < 2
    VALIDATION_ERRORS += 1
    ERROR_LIST = ERROR_LIST + "Customer name too short; "
  Endif
  
  # Validate email if provided
  If CUSTOMER_DATA("EMAIL") <> ""
    If Not IS_VALID_EMAIL(CUSTOMER_DATA("EMAIL"))
      VALIDATION_ERRORS += 1
      ERROR_LIST = ERROR_LIST + "Invalid email format; "
    Endif
  Endif
  
  # Validate credit limit
  Local Decimal CREDIT_LIMIT
  CREDIT_LIMIT = val(CUSTOMER_DATA("CREDITLIMIT"))
  If CREDIT_LIMIT < 0
    VALIDATION_ERRORS += 1
    ERROR_LIST = ERROR_LIST + "Credit limit cannot be negative; "
  Elsif CREDIT_LIMIT > 1000000
    VALIDATION_ERRORS += 1
    ERROR_LIST = ERROR_LIST + "Credit limit exceeds maximum allowed; "
  Endif
  
  # Store validation results
  If VALIDATION_ERRORS > 0
    GLOBAL_ERROR_CODE = -3
    GLOBAL_ERROR_MESSAGE = "Validation failed: " + ERROR_LIST
  Endif
  
  Return VALIDATION_ERRORS
End

# Custom validation functions
Function IS_VALID_CUSTOMER_CODE_FORMAT(CUSTOMER_CODE) Returning Integer
Variable Char CUSTOMER_CODE(15)
  Local Integer I
  Local Char CURRENT_CHAR(1)
  
  # Customer code should be alphanumeric only
  For I = 1 To len(CUSTOMER_CODE)
    CURRENT_CHAR = mid$(CUSTOMER_CODE, I, 1)
    If Not ((CURRENT_CHAR >= "A" And CURRENT_CHAR <= "Z") Or
            (CURRENT_CHAR >= "0" And CURRENT_CHAR <= "9"))
      Return 0  # Invalid character found
    Endif
  Next I
  
  Return 1  # Valid format
End
```

---

## Screen and Form Management

### Form Creation and Handling
```4gl
# Customer entry form
Form CUSTOMER_ENTRY_FORM
  Screen CUSTOMER_SCREEN
    Fields
      CUSTOMER.CUSTCODE [1,1] Length 15 Color RED Reverse
      CUSTOMER.NAME [1,17] Length 40 Color BLUE
      CUSTOMER.ADDRESS1 [2,1] Length 40
      CUSTOMER.ADDRESS2 [3,1] Length 40
      CUSTOMER.CITY [4,1] Length 25
      CUSTOMER.STATE [4,27] Length 2
      CUSTOMER.ZIP [4,30] Length 10
      CUSTOMER.PHONE [5,1] Length 15
      CUSTOMER.EMAIL [5,17] Length 40
      CUSTOMER.CREDITLIMIT [6,1] Format "###,##0.00"
      CUSTOMER.STATUS [6,20] Length 1
    End Fields
    
    Text
      [1,1] "Customer Code:"
      [1,16] "Name:"
      [2,1] "Address 1:"
      [3,1] "Address 2:"
      [4,1] "City:"
      [4,26] "St:"
      [4,29] "ZIP:"
      [5,1] "Phone:"
      [5,16] "Email:"
      [6,1] "Credit Limit:"
      [6,19] "Status:"
    End Text
  End Screen
End Form

# Form processing logic
Subprog PROCESS_CUSTOMER_FORM(OPERATION)
Variable Char OPERATION(10)
  Local Integer FORM_RESULT
  Local Char PREVIOUS_CUSTCODE(15)
  
  Case OPERATION
    When "CREATE"
      # Initialize new customer
      CUSTOMER.CUSTCODE = ""
      CUSTOMER.NAME = ""
      CUSTOMER.ADDRESS1 = ""
      CUSTOMER.ADDRESS2 = ""
      CUSTOMER.CITY = ""
      CUSTOMER.STATE = ""
      CUSTOMER.ZIP = ""
      CUSTOMER.PHONE = ""
      CUSTOMER.EMAIL = ""
      CUSTOMER.CREDITLIMIT = 0
      CUSTOMER.STATUS = "A"
      
    When "UPDATE"
      # Load existing customer
      Call LOAD_CUSTOMER_FOR_EDIT() From CURRENT
      PREVIOUS_CUSTCODE = CUSTOMER.CUSTCODE
      
    When "DELETE"
      # Load customer for deletion confirmation
      Call LOAD_CUSTOMER_FOR_DELETE() From CURRENT
  Endcase
  
  # Display form
  Display CUSTOMER_ENTRY_FORM
  Input CUSTOMER_ENTRY_FORM
  
  FORM_RESULT = fstat
  
  Case FORM_RESULT
    When 0  # Normal exit (Enter or OK)
      Call VALIDATE_CUSTOMER_FORM_DATA() From CURRENT
      If GERROR = 0
        Call SAVE_CUSTOMER_DATA(OPERATION) From CURRENT
      Endif
      
    When 1  # Escape pressed
      Call INFBOX("Operation cancelled")
      
    When 2  # Function key pressed
      # Handle function key actions
      Call HANDLE_FUNCTION_KEYS() From CURRENT
  Endcase
End
```

### Input Validation and Field Events
```4gl
# Field-level validation
Subprog VALIDATE_CUSTOMER_FORM_DATA()
  GERROR = 0
  
  # Validate customer code
  If CUSTOMER.CUSTCODE = ""
    Call ERRBOX("Customer code is required")
    GERROR = 1
    Return
  Endif
  
  # Check for duplicate customer code (in CREATE mode)
  Local Char TEST_CUSTCODE(15)
  TEST_CUSTCODE = CUSTOMER.CUSTCODE
  Read [CUSTOMER]CUSTCODE = TEST_CUSTCODE
  If fstat = 0 And FORM_MODE = "CREATE"
    Call ERRBOX("Customer code already exists")
    GERROR = 1
    Return
  Endif
  
  # Validate required fields
  If trim$(CUSTOMER.NAME) = ""
    Call ERRBOX("Customer name is required")
    GERROR = 1
    Return
  Endif
  
  If CUSTOMER.CREDITLIMIT < 0
    Call ERRBOX("Credit limit cannot be negative")
    GERROR = 1
    Return
  Endif
  
  # Validate email format if provided
  If CUSTOMER.EMAIL <> ""
    If Not IS_VALID_EMAIL(CUSTOMER.EMAIL)
      Call ERRBOX("Invalid email format")
      GERROR = 1
      Return
    Endif
  Endif
  
  # Format postal code
  If CUSTOMER.ZIP <> ""
    CUSTOMER.ZIP = FORMAT_POSTAL_CODE(CUSTOMER.ZIP, CUSTOMER.STATE)
  Endif
End

# Custom field events
Subprog CUSTOMER_CUSTCODE_AFTER()
  # Auto-fill customer data if code exists
  If CUSTOMER.CUSTCODE <> ""
    Local Char LOOKUP_CODE(15)
    LOOKUP_CODE = CUSTOMER.CUSTCODE
    Read [CUSTOMER]CUSTCODE = LOOKUP_CODE
    If fstat = 0
      # Customer exists - load data
      Display CUSTOMER_ENTRY_FORM
      Call INFBOX("Existing customer loaded")
    Endif
  Endif
End

Subprog CUSTOMER_STATE_AFTER()
  # Auto-format ZIP code based on state
  If CUSTOMER.STATE <> "" And CUSTOMER.ZIP <> ""
    CUSTOMER.ZIP = FORMAT_POSTAL_CODE(CUSTOMER.ZIP, CUSTOMER.STATE)
    Display CUSTOMER_ENTRY_FORM
  Endif
End
```

---

## Advanced Features

### Object-Oriented Programming Concepts
```4gl
# Pseudo-OOP implementation using structured programming
# Customer class simulation
Subprog CUSTOMER_CLASS_INIT(CUSTOMER_OBJECT())
Variable Char CUSTOMER_OBJECT(*)
  CUSTOMER_OBJECT("TYPE") = "CUSTOMER"
  CUSTOMER_OBJECT("VERSION") = "1.0"
  CUSTOMER_OBJECT("CUSTCODE") = ""
  CUSTOMER_OBJECT("NAME") = ""
  CUSTOMER_OBJECT("BALANCE") = "0.00"
  CUSTOMER_OBJECT("STATUS") = "A"
  CUSTOMER_OBJECT("INITIALIZED") = "TRUE"
End

# Customer methods
Function CUSTOMER_GET_BALANCE(CUSTOMER_OBJECT()) Returning Decimal
Variable Char CUSTOMER_OBJECT(*)
  If CUSTOMER_OBJECT("INITIALIZED") <> "TRUE"
    Return 0
  Endif
  Return val(CUSTOMER_OBJECT("BALANCE"))
End

Subprog CUSTOMER_SET_BALANCE(CUSTOMER_OBJECT(), NEW_BALANCE)
Variable Char CUSTOMER_OBJECT(*)
Variable Decimal NEW_BALANCE
  If CUSTOMER_OBJECT("INITIALIZED") = "TRUE"
    CUSTOMER_OBJECT("BALANCE") = string$(NEW_BALANCE)
    CUSTOMER_OBJECT("LAST_UPDATED") = string$(date$)
  Endif
End

Function CUSTOMER_IS_ACTIVE(CUSTOMER_OBJECT()) Returning Integer
Variable Char CUSTOMER_OBJECT(*)
  If CUSTOMER_OBJECT("INITIALIZED") <> "TRUE"
    Return 0
  Endif
  Return If(CUSTOMER_OBJECT("STATUS") = "A", 1, 0)
End

# Usage example
Subprog OOP_EXAMPLE()
  Local Char MY_CUSTOMER(20)(100)
  
  # Initialize customer object
  Call CUSTOMER_CLASS_INIT(MY_CUSTOMER) From CURRENT
  MY_CUSTOMER("CUSTCODE") = "CUST001"
  MY_CUSTOMER("NAME") = "ABC Corporation"
  
  # Use customer methods
  Call CUSTOMER_SET_BALANCE(MY_CUSTOMER, 15000.00) From CURRENT
  
  Local Decimal CURRENT_BALANCE
  CURRENT_BALANCE = CUSTOMER_GET_BALANCE(MY_CUSTOMER)
  
  If CUSTOMER_IS_ACTIVE(MY_CUSTOMER)
    Call INFBOX("Customer " + MY_CUSTOMER("NAME") + 
               " has balance: " + string$(CURRENT_BALANCE))
  Endif
End
```

### Dynamic SQL Generation
```4gl
# Dynamic query builder
Function BUILD_CUSTOMER_QUERY(FILTER_CRITERIA()) Returning Char
Variable Char FILTER_CRITERIA(*)
  Local Char SQL_QUERY(1000)
  Local Char WHERE_CLAUSE(500)
  Local Integer CONDITION_COUNT
  
  SQL_QUERY = "SELECT CUSTCODE, NAME, BALANCE, STATUS FROM CUSTOMER"
  WHERE_CLAUSE = ""
  CONDITION_COUNT = 0
  
  # Build WHERE clause dynamically
  If FILTER_CRITERIA("CUSTCODE") <> ""
    WHERE_CLAUSE = WHERE_CLAUSE + "CUSTCODE LIKE '" + FILTER_CRITERIA("CUSTCODE") + "%'"
    CONDITION_COUNT += 1
  Endif
  
  If FILTER_CRITERIA("NAME") <> ""
    If CONDITION_COUNT > 0
      WHERE_CLAUSE = WHERE_CLAUSE + " AND "
    Endif
    WHERE_CLAUSE = WHERE_CLAUSE + "UPPER(NAME) LIKE '%" + ucase$(FILTER_CRITERIA("NAME")) + "%'"
    CONDITION_COUNT += 1
  Endif
  
  If FILTER_CRITERIA("STATUS") <> ""
    If CONDITION_COUNT > 0
      WHERE_CLAUSE = WHERE_CLAUSE + " AND "
    Endif
    WHERE_CLAUSE = WHERE_CLAUSE + "STATUS = '" + FILTER_CRITERIA("STATUS") + "'"
    CONDITION_COUNT += 1
  Endif
  
  If val(FILTER_CRITERIA("MIN_BALANCE")) > 0
    If CONDITION_COUNT > 0
      WHERE_CLAUSE = WHERE_CLAUSE + " AND "
    Endif
    WHERE_CLAUSE = WHERE_CLAUSE + "BALANCE >= " + FILTER_CRITERIA("MIN_BALANCE")
    CONDITION_COUNT += 1
  Endif
  
  If val(FILTER_CRITERIA("MAX_BALANCE")) > 0
    If CONDITION_COUNT > 0
      WHERE_CLAUSE = WHERE_CLAUSE + " AND "
    Endif
    WHERE_CLAUSE = WHERE_CLAUSE + "BALANCE <= " + FILTER_CRITERIA("MAX_BALANCE")
    CONDITION_COUNT += 1
  Endif
  
  # Add WHERE clause if conditions exist
  If CONDITION_COUNT > 0
    SQL_QUERY = SQL_QUERY + " WHERE " + WHERE_CLAUSE
  Endif
  
  # Add ORDER BY if specified
  If FILTER_CRITERIA("ORDER_BY") <> ""
    SQL_QUERY = SQL_QUERY + " ORDER BY " + FILTER_CRITERIA("ORDER_BY")
  Else
    SQL_QUERY = SQL_QUERY + " ORDER BY CUSTCODE"
  Endif
  
  Return SQL_QUERY
End

# Execute dynamic query
Subprog EXECUTE_CUSTOMER_SEARCH(FILTER_CRITERIA(), RESULTS(), RESULT_COUNT)
Variable Char FILTER_CRITERIA(*)
Variable Char RESULTS(*)
Variable Integer RESULT_COUNT
  Local Char SQL_QUERY(1000)
  Local Integer QUERY_HANDLE
  
  # Build dynamic query
  SQL_QUERY = BUILD_CUSTOMER_QUERY(FILTER_CRITERIA)
  
  # Prepare and execute query
  Prepare CUSTOMER_SEARCH From SQL_QUERY
  Declare CUSTOMER_CURSOR Cursor For CUSTOMER_SEARCH
  Open CUSTOMER_CURSOR
  
  RESULT_COUNT = 0
  
  # Fetch results
  While fstat = 0 And RESULT_COUNT < 100  # Limit to 100 results
    Fetch CUSTOMER_CURSOR Into RESULTS((RESULT_COUNT + 1) * 4 - 3),
                               RESULTS((RESULT_COUNT + 1) * 4 - 2),
                               RESULTS((RESULT_COUNT + 1) * 4 - 1),
                               RESULTS((RESULT_COUNT + 1) * 4)
    If fstat = 0
      RESULT_COUNT += 1
    Endif
  Endwhile
  
  Close CUSTOMER_CURSOR
End
```

---

## Best Practices

### Code Organization
```4gl
# 1. Use consistent naming conventions
# - Constants: ALL_CAPS with underscores
# - Global variables: Start with G (GUSER, GCOMPANY)
# - Local variables: Start with L (LCUSTOMER, LTOTAL)
# - Parameters: Use descriptive names
# - Functions: Use verbs (CALCULATE_, VALIDATE_, PROCESS_)

# 2. Structure your code in logical sections
##############################################################################
# CONSTANTS AND GLOBAL VARIABLES
##############################################################################
Global Char GUSER(20)
Global Char GCOMPANY(5)
Const Integer MAX_RECORDS = 1000
Const Decimal DEFAULT_TAX_RATE = 0.20

##############################################################################
# MAIN PROCESSING FUNCTIONS
##############################################################################
# [Main business logic functions here]

##############################################################################
# VALIDATION FUNCTIONS  
##############################################################################
# [All validation functions here]

##############################################################################
# UTILITY FUNCTIONS
##############################################################################
# [Helper and utility functions here]

##############################################################################
# ERROR HANDLING
##############################################################################
# [Error handling functions here]

# 3. Use meaningful function and variable names
# Good:
Function CALCULATE_ORDER_TOTAL(ORDER_NUMBER) Returning Decimal
Local Decimal SUBTOTAL, TAX_AMOUNT, SHIPPING_COST, TOTAL_AMOUNT

# Bad:
Function CALC(X) Returning Decimal
Local Decimal A, B, C, T
```

### Error Handling Best Practices
```4gl
# 1. Always check fstat after database operations
Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
If fstat <> 0
  # Handle error appropriately
  Call LOG_ERROR("READ_CUSTOMER", "Customer not found: " + CUSTOMER_CODE, fstat)
  Return -1
Endif

# 2. Use transactions for multi-step operations
Subprog UPDATE_ORDER_AND_INVENTORY(ORDER_NUMBER)
Variable Char ORDER_NUMBER(20)
  
  Trbegin ORDERS
  
  # Step 1: Update order
  Read [ORDERS]ORDNUM = ORDER_NUMBER
  If fstat <> 0
    Trrollback
    GERROR = 1
    Return
  Endif
  
  ORDERS.STATUS = "PROCESSED"
  Rewrite [ORDERS]
  If fstat <> 0
    Trrollback
    GERROR = 1
    Return
  Endif
  
  # Step 2: Update inventory
  Call UPDATE_INVENTORY_FOR_ORDER(ORDER_NUMBER) From INVENTORY
  If GERROR <> 0
    Trrollback
    Return
  Endif
  
  Trcommit
End

# 3. Validate input parameters
Function CALCULATE_DISCOUNT(AMOUNT, CUSTOMER_TYPE) Returning Decimal
Variable Decimal AMOUNT
Variable Char CUSTOMER_TYPE(10)
  
  # Validate parameters
  If AMOUNT <= 0
    GERROR = 1
    GLOBAL_ERROR_MESSAGE = "Amount must be positive"
    Return 0
  Endif
  
  If CUSTOMER_TYPE = ""
    GERROR = 1
    GLOBAL_ERROR_MESSAGE = "Customer type is required"
    Return 0
  Endif
  
  # Proceed with calculation...
End
```

### Performance Optimization
```4gl
# 1. Use appropriate indexes and avoid unnecessary loops
# Good: Use direct database reads when possible
Read [CUSTOMER]CUSTCODE = SEARCH_CODE
If fstat = 0
  # Process customer
Endif

# Bad: Loop through all records
For [CUSTOMER]
  If CUSTOMER.CUSTCODE = SEARCH_CODE
    # Process customer
    Break
  Endif
Next

# 2. Minimize database I/O in loops
# Good: Read once, process multiple operations
Trbegin CUSTOMER
Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
CUSTOMER.BALANCE += AMOUNT1
CUSTOMER.BALANCE += AMOUNT2
CUSTOMER.BALANCE += AMOUNT3
CUSTOMER.LASTUPDATE = date$
Rewrite [CUSTOMER]
Trcommit

# Bad: Multiple database operations
Trbegin CUSTOMER
Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
CUSTOMER.BALANCE += AMOUNT1
Rewrite [CUSTOMER]
Trcommit

Trbegin CUSTOMER
Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
CUSTOMER.BALANCE += AMOUNT2
Rewrite [CUSTOMER]
Trcommit

# 3. Use appropriate data types
# Good: Use appropriate precision for decimals
Local Decimal UNIT_PRICE(10,4)      # 4 decimal places for currency
Local Decimal PERCENTAGE(5,4)       # 4 decimal places for percentages

# 4. Cache frequently used data
Global Char GCACHED_TAX_RATES(50)(20)  # Cache tax rates
Global Integer GTAX_RATE_COUNT

Subprog LOAD_TAX_RATE_CACHE()
  GTAX_RATE_COUNT = 0
  For [TAXRATES] Where STATUS = "A"
    GTAX_RATE_COUNT += 1
    GCACHED_TAX_RATES(GTAX_RATE_COUNT) = TAXRATES.CODE + "|" + 
                                        string$(TAXRATES.RATE)
  Next
End
```

---

## Complete Examples

### Customer Management System
```4gl
##############################################################################
# COMPLETE CUSTOMER MANAGEMENT SYSTEM
# This example demonstrates a full customer management implementation
# with CRUD operations, validation, and error handling
##############################################################################

# Global variables
Global Char GUSER(20)
Global Integer GERROR
Global Char GERROR_MESSAGE(255)

# Constants
Const Char STATUS_ACTIVE(1) = "A"
Const Char STATUS_INACTIVE(1) = "I"
Const Char STATUS_SUSPENDED(1) = "S"
Const Decimal DEFAULT_CREDIT_LIMIT = 10000.00

##############################################################################
# MAIN ENTRY POINTS
##############################################################################

# Main customer processing function
Subprog PROCESS_CUSTOMER(OPERATION, CUSTOMER_DATA())
Variable Char OPERATION(10)
Variable Char CUSTOMER_DATA(*)
  
  # Initialize
  GERROR = 0
  GERROR_MESSAGE = ""
  
  Case OPERATION
    When "CREATE"
      Call CREATE_CUSTOMER(CUSTOMER_DATA) From CURRENT
    When "READ"
      Call READ_CUSTOMER(CUSTOMER_DATA) From CURRENT
    When "UPDATE"
      Call UPDATE_CUSTOMER(CUSTOMER_DATA) From CURRENT
    When "DELETE"
      Call DELETE_CUSTOMER(CUSTOMER_DATA) From CURRENT
    When "SEARCH"
      Call SEARCH_CUSTOMERS(CUSTOMER_DATA) From CURRENT
    Default
      GERROR = -1
      GERROR_MESSAGE = "Invalid operation: " + OPERATION
  Endcase
End

##############################################################################
# CRUD OPERATIONS
##############################################################################

# Create new customer
Subprog CREATE_CUSTOMER(CUSTOMER_DATA())
Variable Char CUSTOMER_DATA(*)
  Local Char CUSTOMER_CODE(15)
  
  # Extract customer code
  CUSTOMER_CODE = CUSTOMER_DATA("CUSTCODE")
  
  # Validate input
  Call VALIDATE_CUSTOMER_CREATE(CUSTOMER_DATA) From CURRENT
  If GERROR <> 0 : Return : Endif
  
  # Check for duplicates
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat = 0
    GERROR = -2
    GERROR_MESSAGE = "Customer already exists: " + CUSTOMER_CODE
    Return
  Endif
  
  # Create customer record
  Trbegin CUSTOMER
  
  CUSTOMER.CUSTCODE = CUSTOMER_DATA("CUSTCODE")
  CUSTOMER.NAME = CUSTOMER_DATA("NAME")
  CUSTOMER.ADDRESS1 = CUSTOMER_DATA("ADDRESS1")
  CUSTOMER.ADDRESS2 = CUSTOMER_DATA("ADDRESS2")
  CUSTOMER.CITY = CUSTOMER_DATA("CITY")
  CUSTOMER.STATE = CUSTOMER_DATA("STATE")
  CUSTOMER.ZIP = CUSTOMER_DATA("ZIP")
  CUSTOMER.PHONE = CUSTOMER_DATA("PHONE")
  CUSTOMER.EMAIL = CUSTOMER_DATA("EMAIL")
  CUSTOMER.STATUS = If(CUSTOMER_DATA("STATUS") = "", STATUS_ACTIVE, CUSTOMER_DATA("STATUS"))
  CUSTOMER.CREDITLIMIT = If(val(CUSTOMER_DATA("CREDITLIMIT")) = 0, DEFAULT_CREDIT_LIMIT, val(CUSTOMER_DATA("CREDITLIMIT")))
  CUSTOMER.BALANCE = 0.00
  CUSTOMER.CREATEDATE = date$
  CUSTOMER.CREATEUSER = GUSER
  CUSTOMER.UPDATEDATE = date$
  CUSTOMER.UPDATEUSER = GUSER
  
  Write [CUSTOMER]
  If fstat <> 0
    Trrollback
    GERROR = -3
    GERROR_MESSAGE = "Database error creating customer: " + mess(255, fstat, 1)
    Return
  Endif
  
  # Create customer audit record
  Call CREATE_CUSTOMER_AUDIT(CUSTOMER_CODE, "CREATED", "Customer created by " + GUSER) From CURRENT
  
  Trcommit
  
  # Return success data
  CUSTOMER_DATA("RESULT") = "SUCCESS"
  CUSTOMER_DATA("MESSAGE") = "Customer " + CUSTOMER_CODE + " created successfully"
End

# Read customer data
Subprog READ_CUSTOMER(CUSTOMER_DATA())
Variable Char CUSTOMER_DATA(*)
  Local Char CUSTOMER_CODE(15)
  
  CUSTOMER_CODE = CUSTOMER_DATA("CUSTCODE")
  
  If CUSTOMER_CODE = ""
    GERROR = -1
    GERROR_MESSAGE = "Customer code is required"
    Return
  Endif
  
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat <> 0
    GERROR = -2
    GERROR_MESSAGE = "Customer not found: " + CUSTOMER_CODE
    Return
  Endif
  
  # Return customer data
  CUSTOMER_DATA("NAME") = CUSTOMER.NAME
  CUSTOMER_DATA("ADDRESS1") = CUSTOMER.ADDRESS1
  CUSTOMER_DATA("ADDRESS2") = CUSTOMER.ADDRESS2
  CUSTOMER_DATA("CITY") = CUSTOMER.CITY
  CUSTOMER_DATA("STATE") = CUSTOMER.STATE
  CUSTOMER_DATA("ZIP") = CUSTOMER.ZIP
  CUSTOMER_DATA("PHONE") = CUSTOMER.PHONE
  CUSTOMER_DATA("EMAIL") = CUSTOMER.EMAIL
  CUSTOMER_DATA("STATUS") = CUSTOMER.STATUS
  CUSTOMER_DATA("CREDITLIMIT") = string$(CUSTOMER.CREDITLIMIT)
  CUSTOMER_DATA("BALANCE") = string$(CUSTOMER.BALANCE)
  CUSTOMER_DATA("CREATEDATE") = string$(CUSTOMER.CREATEDATE)
  CUSTOMER_DATA("CREATEUSER") = CUSTOMER.CREATEUSER
  CUSTOMER_DATA("UPDATEDATE") = string$(CUSTOMER.UPDATEDATE)
  CUSTOMER_DATA("UPDATEUSER") = CUSTOMER.UPDATEUSER
End

# Update existing customer
Subprog UPDATE_CUSTOMER(CUSTOMER_DATA())
Variable Char CUSTOMER_DATA(*)
  Local Char CUSTOMER_CODE(15)
  Local Char OLD_STATUS(1)
  Local Decimal OLD_CREDIT_LIMIT
  
  CUSTOMER_CODE = CUSTOMER_DATA("CUSTCODE")
  
  # Validate input
  Call VALIDATE_CUSTOMER_UPDATE(CUSTOMER_DATA) From CURRENT
  If GERROR <> 0 : Return : Endif
  
  Trbegin CUSTOMER
  
  # Read and lock customer record
  Read [CUSTOMER]CUSTCODE = CUSTOMER_CODE
  If fstat <> 0
    Trrollback
    GERROR = -2
    GERROR_MESSAGE = "Customer not found: " + CUSTOMER_CODE
    Return
  Endif
  
  # Store old values for audit
  OLD_STATUS = CUSTOMER.STATUS
  OLD_CREDIT_LIMIT = CUSTOMER.CREDITLIMIT
  
  # Update fields
  If CUSTOMER_DATA("NAME") <> "" : CUSTOMER.NAME = CUSTOMER_DATA("NAME") : Endif
  If CUSTOMER_DATA("ADDRESS1") <> "" : CUSTOMER.ADDRESS1 = CUSTOMER_DATA("ADDRESS1") : Endif
  If CUSTOMER_DATA("ADDRESS2") <> "" : CUSTOMER.ADDRESS2 = CUSTOMER_DATA("ADDRESS2") : Endif
  If CUSTOMER_DATA("CITY") <> "" : CUSTOMER.CITY = CUSTOMER_DATA("CITY") : Endif
  If CUSTOMER_DATA("STATE") <> "" : CUSTOMER.STATE = CUSTOMER_DATA("STATE") : Endif
  If CUSTOMER_DATA("ZIP") <> "" : CUSTOMER.ZIP = CUSTOMER_DATA("ZIP") : Endif
  If CUSTOMER_DATA("PHONE") <> "" : CUSTOMER.PHONE = CUSTOMER_DATA("PHONE") : Endif
  If CUSTOMER_DATA("EMAIL") <> "" : CUSTOMER.EMAIL = CUSTOMER_DATA("EMAIL") : Endif
  If CUSTOMER_DATA("STATUS") <> "" : CUSTOMER.STATUS = CUSTOMER_DATA("STATUS") : Endif
  If val(CUSTOMER_DATA("CREDITLIMIT")) > 0 : CUSTOMER.CREDITLIMIT = val(CUSTOMER_DATA("CREDITLIMIT")) : Endif
  
  CUSTOMER.UPDATEDATE = date$
  CUSTOMER.UPDATEUSER = GUSER
  
  Rewrite [CUSTOMER]
  If fstat <> 0
    Trrollback
    GERROR = -3
    GERROR_MESSAGE = "Database error updating customer: " + mess(255, fstat, 1)
    Return
  Endif
  
  # Create audit records for significant changes
  If OLD_STATUS <> CUSTOMER.STATUS
    Call CREATE_CUSTOMER_AUDIT(CUSTOMER_CODE, "STATUS_CHANGED", 
                              "Status changed from " + OLD_STATUS + " to " + CUSTOMER.STATUS) From CURRENT
  Endif
  
  If OLD_CREDIT_LIMIT <> CUSTOMER.CREDITLIMIT
    Call CREATE_CUSTOMER_AUDIT(CUSTOMER_CODE, "CREDIT_LIMIT_CHANGED",
                              "Credit limit changed from " + string$(OLD_CREDIT_LIMIT) + 
                              " to " + string$(CUSTOMER.CREDITLIMIT)) From CURRENT
  Endif
  
  Trcommit
  
  CUSTOMER_DATA("RESULT") = "SUCCESS"
  CUSTOMER_DATA("MESSAGE") = "Customer " + CUSTOMER_CODE + " updated successfully"
End

# Search customers with filters
Subprog SEARCH_CUSTOMERS(SEARCH_CRITERIA())
Variable Char SEARCH_CRITERIA(*)
  Local Char FILTER_NAME(50)
  Local Char FILTER_STATUS(1)
  Local Decimal FILTER_MIN_BALANCE, FILTER_MAX_BALANCE
  Local Integer RESULT_COUNT
  Local Char RESULT_LIST(100)(200)  # Up to 100 results
  
  # Extract search criteria
  FILTER_NAME = SEARCH_CRITERIA("NAME")
  FILTER_STATUS = SEARCH_CRITERIA("STATUS")
  FILTER_MIN_BALANCE = val(SEARCH_CRITERIA("MIN_BALANCE"))
  FILTER_MAX_BALANCE = val(SEARCH_CRITERIA("MAX_BALANCE"))
  
  RESULT_COUNT = 0
  
  # Search customers based on criteria
  For [CUSTOMER] Order By CUSTCODE
    # Apply filters
    If FILTER_NAME <> "" And instr(ucase$(CUSTOMER.NAME), ucase$(FILTER_NAME)) = 0
      Continue  # Name doesn't match
    Endif
    
    If FILTER_STATUS <> "" And CUSTOMER.STATUS <> FILTER_STATUS
      Continue  # Status doesn't match
    Endif
    
    If FILTER_MIN_BALANCE > 0 And CUSTOMER.BALANCE < FILTER_MIN_BALANCE
      Continue  # Balance too low
    Endif
    
    If FILTER_MAX_BALANCE > 0 And CUSTOMER.BALANCE > FILTER_MAX_BALANCE
      Continue  # Balance too high
    Endif
    
    # Customer matches criteria
    RESULT_COUNT += 1
    If RESULT_COUNT <= 100
      RESULT_LIST(RESULT_COUNT) = CUSTOMER.CUSTCODE + "|" +
                                  CUSTOMER.NAME + "|" +
                                  string$(CUSTOMER.BALANCE) + "|" +
                                  CUSTOMER.STATUS
    Endif
  Next
  
  # Return results
  SEARCH_CRITERIA("RESULT_COUNT") = string$(RESULT_COUNT)
  Local Integer I
  For I = 1 To RESULT_COUNT
    SEARCH_CRITERIA("RESULT_" + string$(I)) = RESULT_LIST(I)
  Next I
End

##############################################################################
# VALIDATION FUNCTIONS
##############################################################################

Subprog VALIDATE_CUSTOMER_CREATE(CUSTOMER_DATA())
Variable Char CUSTOMER_DATA(*)
  GERROR = 0
  
  # Validate customer code
  If CUSTOMER_DATA("CUSTCODE") = ""
    GERROR = -1
    GERROR_MESSAGE = "Customer code is required"
    Return
  Endif
  
  If len(trim$(CUSTOMER_DATA("CUSTCODE"))) < 3
    GERROR = -1
    GERROR_MESSAGE = "Customer code must be at least 3 characters"
    Return
  Endif
  
  # Validate customer name
  If CUSTOMER_DATA("NAME") = ""
    GERROR = -1
    GERROR_MESSAGE = "Customer name is required"
    Return
  Endif
  
  # Validate email format if provided
  If CUSTOMER_DATA("EMAIL") <> ""
    If Not IS_VALID_EMAIL(CUSTOMER_DATA("EMAIL"))
      GERROR = -1
      GERROR_MESSAGE = "Invalid email format"
      Return
    Endif
  Endif
  
  # Validate credit limit
  Local Decimal CREDIT_LIMIT
  CREDIT_LIMIT = val(CUSTOMER_DATA("CREDITLIMIT"))
  If CREDIT_LIMIT < 0
    GERROR = -1
    GERROR_MESSAGE = "Credit limit cannot be negative"
    Return
  Endif
End

##############################################################################
# UTILITY FUNCTIONS
##############################################################################

Subprog CREATE_CUSTOMER_AUDIT(CUSTOMER_CODE, ACTION, DESCRIPTION)
Variable Char CUSTOMER_CODE(15), ACTION(20), DESCRIPTION(255)
  
  CUSTOMER_AUDIT.CUSTCODE = CUSTOMER_CODE
  CUSTOMER_AUDIT.ACTION = ACTION
  CUSTOMER_AUDIT.DESCRIPTION = DESCRIPTION
  CUSTOMER_AUDIT.AUDITDATE = date$
  CUSTOMER_AUDIT.AUDITTIME = time$
  CUSTOMER_AUDIT.USERID = GUSER
  
  Write [CUSTOMER_AUDIT]
End

# This completes the comprehensive customer management system example
# demonstrating best practices for 4GL development in Sage X3
```

---

## Conclusion

This comprehensive guide covers the essential aspects of Sage X3 4GL programming, from basic syntax to advanced features. The language provides powerful tools for business application development with its integrated database operations, form management, and business logic capabilities.

### Key Takeaways:
1. **Database Integration**: 4GL provides seamless database operations with built-in transaction management
2. **Business Focus**: The language is designed specifically for business applications with relevant data types and functions
3. **Error Handling**: Comprehensive error management is crucial for robust applications
4. **Code Organization**: Structure your code logically with consistent naming conventions
5. **Performance**: Use appropriate indexing and minimize unnecessary database operations

### Next Steps:
- Practice with the provided examples
- Explore the Sage X3 technical documentation for platform-specific features
- Develop your own applications using these patterns and best practices
- Join the Sage developer community for additional resources and support

This documentation serves as both a learning resource and a reference guide for developing robust, maintainable applications in Sage X3's 4GL environment.
