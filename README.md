# 🚀 Sage X3 Advanced Language Support Extension

An advanced VS Code extension providing comprehensive Language Server Protocol (LSP) support for **Sage X3 .src files** with **live database connection** capabilities. This extension offers intelligent code completion, syntax highlighting, error diagnostics, and **Sage X3 Studio-like autocomplete** for tables and fields.

## ✨ Features

### 🎯 **Sage X3 Specific Support**

- **Native .src file support** - Proper recognition of Sage X3 source files
- **Sage X3 syntax highlighting** - Accurate highlighting for Subprog, Variable, Call, etc.
- **X3-specific keywords** - Complete support for Sage X3 language constructs
- **Database operations** - Read, Write, Trbegin, Trcommit, etc.

### 🔗 **Live Database Connection** *(NEW)*

- **Real-time table autocomplete** - Type `[BPC|` and get BPCUSTOMER, BPCSUPPLIER suggestions
- **Field autocomplete** - Type `BPCUSTOMER.BPC|` and get BPCNUM, BPCNAM, BPCTYP, etc.
- **Context-aware suggestions** in Read, Write, For statements
- **Schema introspection** with field types and descriptions
- **Connection to Sage X3 compiler server** for live data access
- **Caching for performance** - Schema information cached for fast access

### 🚀 **Advanced Code Completion**

- **Smart IntelliSense** for Sage X3 keywords and functions
- **Function snippets** - Pre-built templates for common Sage X3 patterns
- **Variable completion** - Context-aware variable suggestions
- **Built-in function library** - GESTCRE, GESADD, AFFZO, GDAT, etc.
- **Database-driven autocomplete** - Live table and field suggestions

### 🔍 **Real-time Diagnostics**

- **Syntax error detection** with precise error locations
- **Semantic validation** for Sage X3 code structures
- **Real-time feedback** as you type

### 🎨 **Enhanced Development Experience**

- **Syntax highlighting** optimized for Sage X3 .src files
- **Bracket matching** and auto-completion
- **Comment support** for # single-line and #** multi-line comments
- **Code folding** for better navigation

## 📁 **File Support**

This extension specifically supports:

- **`.src`** files (Sage X3 source code)
- Proper recognition of Sage X3 syntax patterns
- Integration with Sage X3 development workflows

## 🚀 **Quick Start**

### **Basic Usage**
1. Install the extension from VS Code Marketplace
2. Open any `.src` file  
3. Start coding with full Sage X3 language support!

### **Enhanced Live Database Connection** 
1. Set up the [Sage X3 compiler server](https://github.com/azatakmyradov/sagex3-compiler-server)
2. Configure connection settings in VS Code:
   ```json
   {
       "sage-x3.connection.enabled": true,
       "sage-x3.connection.serverUrl": "http://localhost:3000",
       "sage-x3.connection.folder": "SEED"
   }
   ```
3. Enjoy **Sage X3 Studio-like autocomplete** for tables and fields!

## ⚙️ **Configuration**

Configure your connection to Sage X3 in VS Code settings (File → Preferences → Settings → search for "sage-x3"):

- `sage-x3.connection.enabled`: Enable live database connection
- `sage-x3.connection.serverUrl`: URL of your Sage X3 compiler server
- `sage-x3.connection.folder`: X3 folder to connect to (e.g., "SEED")
- `sage-x3.connection.username`: X3 username
- `sage-x3.connection.password`: X3 password

## 📚 **Documentation**

- **[Connection Setup Guide](SAGE_X3_CONNECTION_GUIDE.md)** - Detailed setup for live database features
- **[LSP Completion Guide](LSP_COMPLETION_GUIDE.md)** - Technical details about autocomplete
- **[Quick Start Guide](QUICKSTART.md)** - Get started quickly

## 🤝 **Contributing**

This extension is designed to enhance Sage X3 development productivity. Contributions welcome for:

- Additional Sage X3 syntax support
- Enhanced database schema integration  
- Performance optimizations
- Additional code completion features

## 📄 **License**

MIT License - see LICENSE file for details.