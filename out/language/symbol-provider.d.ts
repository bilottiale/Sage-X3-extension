import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position, Range } from 'vscode-languageserver/node';
export interface Symbol {
    name: string;
    type: 'function' | 'procedure' | 'variable' | 'parameter';
    dataType?: string;
    range: Range;
    documentUri: string;
    detail?: string;
}
export declare class FourGLSymbolProvider {
    private symbols;
    private parser;
    updateDocument(document: TextDocument): void;
    getSymbolsInDocument(uri: string): Symbol[];
    getAllSymbols(): Symbol[];
    findSymbolAt(document: TextDocument, position: Position): Symbol | undefined;
    findSymbolByName(name: string, type?: string): Symbol[];
    getVariablesInScope(document: TextDocument, position: Position): Symbol[];
    getFunctions(): Symbol[];
    getProcedures(): Symbol[];
    private extractSymbols;
    private extractSymbolsFromNode;
    private isPositionInRange;
}
//# sourceMappingURL=symbol-provider.d.ts.map