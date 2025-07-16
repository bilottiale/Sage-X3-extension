# How to Install and Use the 4GL LSP

## Installation Steps

### 1. Install Dependencies
```bash
cd /Users/alessandrobilotti/Desktop/fun/comma
npm install
```

### 2. Build the LSP Server
```bash
npm run build
```

### 3. Install the VS Code Extension
```bash
cd client
npm install
npm run vscode:prepublish
code --install-extension .
```

## Usage

### 1. Open 4GL/Sage X3 Files
- Create or open files with `.4gl` or `.src` extensions
- The LSP will automatically activate

### 2. Code Completion
Type any of these to see completions:
- **Keywords**: `func`, `if`, `while`, `select`
- **Functions**: `len`, `substr`, `date`, `adxium`
- **Snippets**: `function-template`, `validate-customer`, `calculate-totals`

### 3. Code Snippets in Action

#### Function Template
Type: `function-template` → Press Tab → Get:
```4gl
Function MY_FUNCTION(PARAM1, PARAM2) 
Local Decimal LRESULT
  # Function implementation
  LRESULT = 0
  
End LRESULT
```

#### Customer Validation  
Type: `validate-customer` → Press Tab → Get:
```4gl
# Validate customer exists and is active
If [CUSTOMER] <> [CUSTOMER] Where CUSTOMER_CODE = "CUSTOMER123"
  GERROR = 1
  Call GESTCRE From GESADD With "MODULE", "Customer not found: " + CUSTOMER_CODE, 1
  Return
Endif

If CUSTOMER.STATUS <> "A"
  GERROR = 1
  Call GESTCRE From GESADD With "MODULE_NAME", "Customer not active: " + CUSTOMER_CODE, 1
  Return
Endif
```

### 4. Features Available

✅ **Syntax Highlighting**: 4GL and Sage X3 keywords  
✅ **Code Completion**: Keywords, functions, variables  
✅ **Code Snippets**: Complete code templates  
✅ **Error Detection**: Basic syntax validation  
✅ **Hover Information**: Function documentation  
✅ **Go to Definition**: Navigate to symbols  

### 5. Supported File Types
- `.4gl` - Standard 4GL files
- `.src` - Sage X3 source files (like SPESDH.src)

### 6. Snippet Navigation
- Use **Tab** to move between placeholders: `${1:placeholder}`
- Press **Escape** to exit snippet mode
- Modify placeholder values as needed

## Testing

Create a test file:
```bash
touch test.4gl
```

Open in VS Code and try typing:
- `func` (should show function-template)
- `validate` (should show validate-customer)
- `calculate` (should show calculate-totals)
- `len` (should show LEN function)

The LSP provides intelligent code completion that significantly speeds up 4GL and Sage X3 development!
