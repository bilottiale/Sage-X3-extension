import { TextDocument } from 'vscode-languageserver-textdocument';
import { Hover, Position } from 'vscode-languageserver/node';
import { FourGLSymbolProvider } from './symbol-provider';
export declare class FourGLHoverProvider {
    private symbolProvider;
    private builtInFunctions;
    private keywords;
    constructor(symbolProvider: FourGLSymbolProvider);
    getHover(document: TextDocument, position: Position): Hover | undefined;
    private getWordAtPosition;
}
//# sourceMappingURL=hover-provider.d.ts.map