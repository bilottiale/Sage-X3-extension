# Sage X3 4GL Developer Tools

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/SageX3helper.fourgl-language-support)](https://marketplace.visualstudio.com/items?itemName=SageX3helper.fourgl-language-support)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/SageX3helper.fourgl-language-support)](https://marketplace.visualstudio.com/items?itemName=SageX3helper.fourgl-language-support)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/SageX3helper.fourgl-language-support)](https://marketplace.visualstudio.com/items?itemName=SageX3helper.fourgl-language-support)

A comprehensive **Language Server Protocol (LSP)** extension for **4GL** and **Sage X3** development in Visual Studio Code.

## ✨ Features

### 🚀 **Intelligent Code Completion**
- **Keywords**: Complete 4GL, SQL, and Sage X3 specific keywords
- **Built-in Functions**: Over 50+ pre-defined functions with documentation
- **Code Snippets**: Ready-to-use templates for common patterns
- **Variables & Functions**: Context-aware suggestions from your code

### 📝 **Code Snippets**
- **`function-template`**: Complete function definition with parameters
- **`validate-customer`**: Customer validation with error handling
- **`calculate-totals`**: Order totals calculation with tax and discounts

### 🎨 **Language Features**
- **Syntax Highlighting**: Rich syntax coloring for 4GL and Sage X3
- **Error Detection**: Real-time syntax validation
- **Hover Information**: Function documentation on hover
- **Go to Definition**: Navigate to symbol definitions

### 📁 **File Support**
- **`.4gl`** - Standard 4GL files
- **`.src`** - Sage X3 source files (like SPESDH.src, GESADD.src)

## 🛠️ Installation

1. **From VS Code Marketplace**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Sage X3 4GL Developer Tools"
   - Click Install

2. **From Command Line**:
   ```bash
   code --install-extension SageX3helper.fourgl-language-support
   ```

## 🚦 Quick Start

1. **Create or open** a `.4gl` or `.src` file
2. **Start typing** to see intelligent completions
3. **Try snippets**:
   - Type `function-template` for a complete function
   - Type `validate-customer` for validation logic
   - Type `calculate-totals` for calculation patterns

## 📋 Code Snippets Examples

### Function Template
Type: `function-template` → Press Tab
```4gl
Function MY_FUNCTION(PARAM1, PARAM2) 
Local Decimal LRESULT
  # Function implementation
  LRESULT = 0
  
End LRESULT
```

### Customer Validation
Type: `validate-customer` → Press Tab
```4gl
# Validate customer exists and is active
If [CUSTOMER] <> [CUSTOMER] Where CUSTOMER_CODE = "CUSTOMER123"
  GERROR = 1
  Call GESTCRE From GESADD With "MODULE", "Customer not found: " + CUSTOMER_CODE, 1
  Return
Endif
```

## ⚙️ Configuration

The extension provides the following configuration options:

- **`fourgl.maxNumberOfProblems`**: Maximum number of problems reported (default: 100)
- **`fourgl.trace.server`**: LSP communication tracing (off/messages/verbose)

## 🎯 Use Cases

Perfect for developers working with:
- **Sage X3 ERP** development
- **4GL programming** languages
- **Business application** development
- **Database-driven** applications

## 🤝 Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/SageX3helper/fourgl-language-support) for:
- 🐛 Bug reports
- 💡 Feature requests
- 🔧 Code contributions
- 📖 Documentation improvements

## 📜 License

This extension is licensed under the [MIT License](LICENSE).

## 🆕 Release Notes

### 1.0.0
- Initial release
- Complete LSP implementation
- Code completion for keywords, functions, and variables
- Code snippets for common patterns
- Syntax highlighting for .4gl and .src files
- Support for Sage X3 development

---

**Enjoy coding with Sage X3 4GL Developer Tools!** 🎉

For support and feedback, please visit our [GitHub repository](https://github.com/SageX3helper/fourgl-language-support).
