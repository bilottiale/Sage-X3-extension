"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourGLSymbolProvider = void 0;
const fourgl_parser_1 = require("../parser/fourgl-parser");
class FourGLSymbolProvider {
    constructor() {
        this.symbols = new Map();
        this.parser = new fourgl_parser_1.FourGLParser();
    }
    updateDocument(document) {
        const uri = document.uri;
        const { ast } = this.parser.parse(document);
        const documentSymbols = [];
        this.extractSymbols(ast, documentSymbols, uri);
        this.symbols.set(uri, documentSymbols);
    }
    getSymbolsInDocument(uri) {
        return this.symbols.get(uri) || [];
    }
    getAllSymbols() {
        const allSymbols = [];
        for (const symbols of this.symbols.values()) {
            allSymbols.push(...symbols);
        }
        return allSymbols;
    }
    findSymbolAt(document, position) {
        const symbols = this.getSymbolsInDocument(document.uri);
        for (const symbol of symbols) {
            if (this.isPositionInRange(position, symbol.range)) {
                return symbol;
            }
        }
        return undefined;
    }
    findSymbolByName(name, type) {
        const allSymbols = this.getAllSymbols();
        return allSymbols.filter(symbol => symbol.name === name && (!type || symbol.type === type));
    }
    getVariablesInScope(document, position) {
        const symbols = this.getSymbolsInDocument(document.uri);
        // Find the function/procedure containing the position
        const containingFunction = symbols.find(symbol => (symbol.type === 'function' || symbol.type === 'procedure') &&
            this.isPositionInRange(position, symbol.range));
        if (containingFunction) {
            // Return variables and parameters in the same function
            return symbols.filter(symbol => (symbol.type === 'variable' || symbol.type === 'parameter') &&
                this.isPositionInRange(position, symbol.range));
        }
        // Return global variables
        return symbols.filter(symbol => symbol.type === 'variable');
    }
    getFunctions() {
        return this.getAllSymbols().filter(symbol => symbol.type === 'function');
    }
    getProcedures() {
        return this.getAllSymbols().filter(symbol => symbol.type === 'procedure');
    }
    extractSymbols(nodes, symbols, documentUri) {
        for (const node of nodes) {
            this.extractSymbolsFromNode(node, symbols, documentUri);
        }
    }
    extractSymbolsFromNode(node, symbols, documentUri) {
        switch (node.type) {
            case 'function':
                const funcNode = node;
                symbols.push({
                    name: funcNode.name,
                    type: 'function',
                    dataType: funcNode.returnType,
                    range: funcNode.range,
                    documentUri,
                    detail: `function ${funcNode.name}(${funcNode.parameters.map(p => `${p.name}: ${p.dataType}`).join(', ')})${funcNode.returnType ? `: ${funcNode.returnType}` : ''}`
                });
                // Add parameters
                for (const param of funcNode.parameters) {
                    symbols.push({
                        name: param.name,
                        type: 'parameter',
                        dataType: param.dataType,
                        range: param.range,
                        documentUri,
                        detail: `parameter ${param.name}: ${param.dataType}`
                    });
                }
                // Extract symbols from function body
                this.extractSymbols(funcNode.body, symbols, documentUri);
                break;
            case 'procedure':
                const procNode = node;
                symbols.push({
                    name: procNode.name,
                    type: 'procedure',
                    range: procNode.range,
                    documentUri,
                    detail: `procedure ${procNode.name}(${procNode.parameters.map(p => `${p.name}: ${p.dataType}`).join(', ')})`
                });
                // Add parameters
                for (const param of procNode.parameters) {
                    symbols.push({
                        name: param.name,
                        type: 'parameter',
                        dataType: param.dataType,
                        range: param.range,
                        documentUri,
                        detail: `parameter ${param.name}: ${param.dataType}`
                    });
                }
                // Extract symbols from procedure body
                this.extractSymbols(procNode.body, symbols, documentUri);
                break;
            case 'define':
                const defineNode = node; // DefineNode
                if (defineNode.variables) {
                    for (const variable of defineNode.variables) {
                        symbols.push({
                            name: variable.name,
                            type: 'variable',
                            dataType: variable.dataType,
                            range: variable.range,
                            documentUri,
                            detail: `variable ${variable.name}: ${variable.dataType}`
                        });
                    }
                }
                break;
            default:
                // Recursively process child nodes
                if (node.children) {
                    this.extractSymbols(node.children, symbols, documentUri);
                }
                break;
        }
    }
    isPositionInRange(position, range) {
        if (position.line < range.start.line || position.line > range.end.line) {
            return false;
        }
        if (position.line === range.start.line && position.character < range.start.character) {
            return false;
        }
        if (position.line === range.end.line && position.character > range.end.character) {
            return false;
        }
        return true;
    }
}
exports.FourGLSymbolProvider = FourGLSymbolProvider;
//# sourceMappingURL=symbol-provider.js.map