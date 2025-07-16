# 4GL Language Server Protocol (LSP)

A comprehensive Language Server Protocol implementation for Fourth Generation Languages (4GL), providing intelligent code editing features for 4GL developers.

## Features

- **Syntax Highlighting**: Full syntax support for 4GL keywords, operators, and constructs
- **Code Completion**: Intelligent auto-completion for:
  - 4GL keywords (FUNCTION, PROCEDURE, IF, WHILE, etc.)
  - Built-in functions (TODAY, LENGTH, SUBSTR, etc.)
  - User-defined functions and procedures
  - Variables and parameters in scope
  - SQL keywords and constructs
  - Form-specific keywords
- **Diagnostics**: Real-time error detection and warnings for:
  - Syntax errors
  - SQL statement validation
  - Form construct validation
  - Data type checking
  - Control flow validation
- **Hover Information**: Detailed documentation on:
  - Built-in functions with syntax and return types
  - Keywords with descriptions
  - User-defined symbols with type information
  - Variable and parameter details
- **Symbol Navigation**: Find and navigate to:
  - Function definitions
  - Procedure definitions
  - Variable declarations
  - Parameter definitions

## Supported 4GL Constructs

### Language Features
- Functions and procedures with parameters
- Variable declarations with data types
- Control flow statements (IF/THEN/ELSE, WHILE, FOR)
- Expression evaluation
- Function calls and procedure calls

### Data Types
- INTEGER: Whole numbers
- DECIMAL: Fixed-point decimal numbers
- CHAR: Fixed-length character strings
- VARCHAR: Variable-length character strings
- DATE: Date values (YYYY-MM-DD)
- DATETIME: Date and time values

### SQL Support
- SELECT statements with FROM, WHERE clauses
- INSERT statements with VALUES
- UPDATE statements with SET and WHERE
- DELETE statements with WHERE
- Basic SQL syntax validation

### Form Support
- FORM definitions
- INPUT statements
- DISPLAY statements
- CONSTRUCT statements
- MENU definitions

### Built-in Functions
- **Date/Time**: TODAY(), NOW()
- **String**: LENGTH(), SUBSTR(), UPPER(), LOWER(), TRIM()
- **Math**: ABS(), ROUND(), FLOOR(), CEIL()
- **Utility**: ISNULL(), NVL()

## Installation

### Prerequisites
- Node.js 16.0.0 or higher
- TypeScript 5.0.0 or higher

### Build from Source

```bash
# Clone the repository
git clone <repository-url>
cd fourgl-language-server

# Install dependencies
npm install

# Build the project
npm run build

# Start the language server
npm start
```

### Development

```bash
# Watch mode for development
npm run watch

# Run in development mode with ts-node
npm run dev

# Clean build artifacts
npm run clean
```

## VS Code Integration

To integrate with VS Code, you'll need to create a VS Code extension that communicates with this language server. The extension should:

1. Activate when 4GL files are opened
2. Start the language server process
3. Handle client-server communication via LSP

### Example VS Code Extension Package.json

```json
{
  "name": "fourgl-vscode",
  "displayName": "4GL Language Support",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": ["Programming Languages"],
  "activationEvents": [
    "onLanguage:fourgl"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "languages": [{
      "id": "fourgl",
      "aliases": ["4GL", "fourgl"],
      "extensions": [".4gl", ".per", ".inc"],
      "configuration": "./language-configuration.json"
    }],
    "grammars": [{
      "language": "fourgl",
      "scopeName": "source.fourgl",
      "path": "./syntaxes/fourgl.tmGrammar.json"
    }]
  }
}
```

## Architecture

The language server is built with a modular architecture:

```
src/
├── server.ts              # Main LSP server implementation
├── parser/
│   ├── lexer.ts           # 4GL lexical analyzer
│   └── fourgl-parser.ts   # 4GL syntax parser and AST
└── language/
    ├── symbol-provider.ts     # Symbol table and scope management
    ├── completion-provider.ts # Code completion logic
    ├── diagnostics-provider.ts # Error detection and validation
    └── hover-provider.ts      # Hover information provider
```

### Key Components

- **Lexer**: Tokenizes 4GL source code into meaningful tokens
- **Parser**: Builds Abstract Syntax Tree (AST) from tokens
- **Symbol Provider**: Manages symbol tables and scope resolution
- **Completion Provider**: Generates context-aware completions
- **Diagnostics Provider**: Validates code and reports errors
- **Hover Provider**: Provides documentation and type information

## Example 4GL Code

```4gl
FUNCTION calculate_discount(amount DECIMAL, rate DECIMAL) RETURNING DECIMAL
    DEFINE discount DECIMAL
    
    IF amount > 1000 THEN
        LET discount = amount * rate
    ELSE
        LET discount = 0
    ENDIF
    
    RETURN discount
ENDFUNCTION

PROCEDURE process_order(order_id INTEGER)
    DEFINE customer_name VARCHAR(50)
    DEFINE order_total DECIMAL
    
    SELECT customer_name, total 
    FROM orders 
    WHERE order_id = order_id
    INTO customer_name, order_total
    
    LET order_total = order_total - calculate_discount(order_total, 0.1)
    
    UPDATE orders 
    SET total = order_total 
    WHERE order_id = order_id
ENDPROCEDURE
```

## Configuration

The language server can be configured through LSP client settings:

```json
{
  "fourglLanguageServer": {
    "maxNumberOfProblems": 1000,
    "enableDiagnostics": true,
    "enableCompletion": true
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Include test cases for new features
- Update documentation for changes

## Testing

The language server can be tested with various 4GL code samples:

```bash
# Run tests (when implemented)
npm test

# Test with sample 4GL files
npm run dev
# Then connect a LSP client to test features
```

## Troubleshooting

### Common Issues

1. **Server won't start**: Check Node.js version and dependencies
2. **No completions**: Verify LSP client is properly connected
3. **Syntax errors**: Check 4GL code against supported syntax
4. **Performance issues**: Adjust maxNumberOfProblems setting

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=1 npm start
```

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Enhanced SQL support with table schema validation
- [ ] Form designer integration
- [ ] Report builder support
- [ ] Advanced refactoring tools
- [ ] Debugging protocol support
- [ ] Multiple 4GL dialect support
- [ ] Performance optimizations
- [ ] Comprehensive test suite

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review example 4GL code samples

---

*This language server provides a solid foundation for 4GL development tools and can be extended to support specific 4GL dialects and additional features.*