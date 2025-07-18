# 🚀 Sage X3 Developer Tools

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/SageX3helper.sage-x3-language-support)](https://marketplace.visualstudio.com/items?itemName=SageX3helper.sage-x3-language-support)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/SageX3helper.sage-x3-language-support)](https://marketplace.visualstudio.com/items?itemName=SageX3helper.sage-x3-language-support)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/SageX3helper.sage-x3-language-support)](https://marketplace.visualstudio.com/items?itemName=SageX3helper.sage-x3-language-support)

A comprehensive **Language Server Protocol (LSP)** extension for **Sage X3 .src files** with **live database connection** and **intelligent bracket field completion**.

## ✨ Features

### 🔗 **Live Database Connection** *(NEW in v1.2)*
- **Real-time table autocomplete** - Connect to live Sage X3 servers for dynamic completions
- **VPN + Browser support** - Works with corporate VPN connections and web-based Sage X3 access
- **Syracuse integration** - Compatible with Sage X3 Syracuse web client architecture
- **Connection caching** - Optimized performance with intelligent schema caching

### 🎯 **Enhanced Bracket Field Completion** *(NEW in v1.2)*
- **Smart abbreviation mapping** - Type `[BPC]` and get BPCUSTOMER field suggestions
- **Intelligent field completion** - After `[BPC]` press Ctrl+Space to see all customer fields
- **Rich field information** - Shows field types, lengths, descriptions, and primary key indicators
- **Table abbreviation support**: `[BPC]` → BPCUSTOMER, `[SOH]` → SORDER, `[ITM]` → ITEMMASTER, and more

### 🚀 **Intelligent Code Completion**
- **Keywords**: Complete Sage X3 specific keywords and constructs
- **Built-in Functions**: Over 50+ pre-defined functions with documentation (GESTCRE, GESADD, AFFZO, GDAT, etc.)
- **Code Snippets**: Ready-to-use templates for common Sage X3 patterns
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
