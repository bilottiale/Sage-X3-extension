# Change Log

All notable changes to the "Sage X3 Developer Tools" extension will be documented in this file.

## [1.1.0] - 2025-07-16

### Added
- **Native Sage X3 .src file support** - Complete rewrite to focus on Sage X3 instead of generic 4GL
- **Authentic Sage X3 syntax highlighting** - Updated with proper Sage X3 keywords (Subprog, Variable, Call, etc.)
- **Sage X3 code completion** - Real Sage X3 functions like GESTCRE, GESADD, AFFZO, GDAT
- **Database operation snippets** - Read, Write, Trbegin, Trcommit patterns
- **Sage X3 function templates** - Pre-built snippets for common Sage X3 development patterns
- **Enhanced error handling** - Sage X3-specific error checking patterns

### Changed
- **File extension focus** - Now specifically targets .src files (Sage X3 source files)
- **Language ID** - Changed from "fourgl" to "sage-x3" for proper recognition
- **Extension name** - Now "Sage X3 Developer Tools" instead of generic 4GL
- **Syntax grammar** - Completely rewritten for authentic Sage X3 syntax
- **Keywords and functions** - Updated to match real Sage X3 language constructs

### Fixed
- **Proper comment support** - Added # single-line and #** multi-line comment patterns
- **Case sensitivity** - Proper case handling for Sage X3 keywords
- **Function signatures** - Accurate function patterns for Sage X3 development
  - Real-time error detection and diagnostics
  - Hover information for functions
  - Go to definition support
- **File Support**:
  - `.4gl` - Standard 4GL files
  - `.src` - Sage X3 source files
- **Configuration Options**:
  - Maximum number of problems setting
  - LSP server tracing options

### Technical Details
- TypeScript-based LSP server
- Modular architecture with separate parser, lexer, and language services
- Comprehensive Sage X3 4GL support with business logic patterns
- VS Code extension with proper language registration

---

**Note**: This is the initial release. Future versions will include additional features based on community feedback.

Check the [README](README.md) for detailed usage instructions and examples.
