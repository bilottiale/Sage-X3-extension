"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourGLDiagnosticsProvider = void 0;
const node_1 = require("vscode-languageserver/node");
class FourGLDiagnosticsProvider {
    constructor(parser) {
        this.parser = parser;
    }
    getDiagnostics(document) {
        const { diagnostics: parserDiagnostics } = this.parser.parse(document);
        const semanticDiagnostics = this.getSemanticDiagnostics(document);
        return [...parserDiagnostics, ...semanticDiagnostics];
    }
    getSemanticDiagnostics(document) {
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i;
            // Check for common 4GL issues
            this.checkUndeclaredVariables(line, lineNumber, diagnostics);
            this.checkSqlSyntax(line, lineNumber, diagnostics);
            this.checkFormSyntax(line, lineNumber, diagnostics);
            this.checkDataTypes(line, lineNumber, diagnostics);
            this.checkControlFlow(line, lineNumber, diagnostics);
        }
        return diagnostics;
    }
    checkUndeclaredVariables(line, lineNumber, diagnostics) {
        // Simple pattern matching for variable usage
        const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
        let match;
        while ((match = variablePattern.exec(line)) !== null) {
            const variableName = match[1];
            const startChar = match.index;
            const endChar = startChar + variableName.length;
            // Check if it's a keyword or built-in
            const keywords = ['LET', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'PROCEDURE'];
            if (keywords.includes(variableName.toUpperCase())) {
                continue;
            }
            // For demonstration, we'll warn about potentially undeclared variables
            // In a real implementation, you'd check against the symbol table
            if (variableName.length === 1) {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Warning,
                    range: {
                        start: { line: lineNumber, character: startChar },
                        end: { line: lineNumber, character: endChar }
                    },
                    message: `Single-character variable '${variableName}' may be unclear`,
                    source: '4gl-semantic'
                });
            }
        }
    }
    checkSqlSyntax(line, lineNumber, diagnostics) {
        const upperLine = line.toUpperCase().trim();
        // Check for SELECT statements without FROM
        if (upperLine.startsWith('SELECT') && !upperLine.includes('FROM') && !upperLine.includes('INTO')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'SELECT statement missing FROM clause',
                source: '4gl-sql'
            });
        }
        // Check for INSERT without VALUES or SELECT
        if (upperLine.startsWith('INSERT') && !upperLine.includes('VALUES') && !upperLine.includes('SELECT')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'INSERT statement missing VALUES or SELECT clause',
                source: '4gl-sql'
            });
        }
        // Check for UPDATE without SET
        if (upperLine.startsWith('UPDATE') && !upperLine.includes('SET')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'UPDATE statement missing SET clause',
                source: '4gl-sql'
            });
        }
    }
    checkFormSyntax(line, lineNumber, diagnostics) {
        const upperLine = line.toUpperCase().trim();
        // Check for FORM without proper structure
        if (upperLine.startsWith('FORM') && !upperLine.includes('(')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Warning,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'FORM statement may be missing field definitions',
                source: '4gl-form'
            });
        }
        // Check for INPUT without proper structure
        if (upperLine.startsWith('INPUT') && !upperLine.includes('FROM')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Warning,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'INPUT statement may be missing FROM clause',
                source: '4gl-form'
            });
        }
    }
    checkDataTypes(line, lineNumber, diagnostics) {
        // Check for potential data type mismatches
        const datePattern = /\b(\d{4}-\d{2}-\d{2})\b/g;
        let match;
        while ((match = datePattern.exec(line)) !== null) {
            const dateString = match[1];
            const startChar = match.index;
            const endChar = startChar + dateString.length;
            // Simple date validation
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: lineNumber, character: startChar },
                        end: { line: lineNumber, character: endChar }
                    },
                    message: `Invalid date format: ${dateString}`,
                    source: '4gl-datatype'
                });
            }
        }
        // Check for deprecated data types
        const deprecatedTypes = ['MONEY', 'SMALLFLOAT', 'BYTE', 'TEXT'];
        for (const type of deprecatedTypes) {
            const typeIndex = line.toUpperCase().indexOf(type);
            if (typeIndex !== -1) {
                diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Warning,
                    range: {
                        start: { line: lineNumber, character: typeIndex },
                        end: { line: lineNumber, character: typeIndex + type.length }
                    },
                    message: `Data type '${type}' is deprecated, consider using modern alternatives`,
                    source: '4gl-datatype'
                });
            }
        }
    }
    checkControlFlow(line, lineNumber, diagnostics) {
        const upperLine = line.toUpperCase().trim();
        // Check for IF without THEN
        if (upperLine.startsWith('IF') && !upperLine.includes('THEN')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'IF statement missing THEN clause',
                source: '4gl-controlflow'
            });
        }
        // Check for WHILE without loop body indicator
        if (upperLine.startsWith('WHILE') && upperLine.endsWith('WHILE')) {
            diagnostics.push({
                severity: node_1.DiagnosticSeverity.Warning,
                range: {
                    start: { line: lineNumber, character: 0 },
                    end: { line: lineNumber, character: line.length }
                },
                message: 'WHILE loop may be missing loop body',
                source: '4gl-controlflow'
            });
        }
        // Check for unmatched blocks (simplified)
        const blockStarters = ['IF', 'WHILE', 'FOR', 'FUNCTION', 'PROCEDURE'];
        const blockEnders = ['ENDIF', 'ENDWHILE', 'ENDFOR', 'ENDFUNCTION', 'ENDPROCEDURE', 'END'];
        for (const starter of blockStarters) {
            if (upperLine.includes(starter) && !upperLine.includes('END')) {
                // This is a simplified check - a real implementation would track block nesting
                if (starter === 'IF' && !upperLine.includes('ENDIF')) {
                    // Could add more sophisticated block matching logic here
                }
            }
        }
    }
}
exports.FourGLDiagnosticsProvider = FourGLDiagnosticsProvider;
//# sourceMappingURL=diagnostics-provider.js.map