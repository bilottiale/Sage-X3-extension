import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionItem, Position } from 'vscode-languageserver/node';
import { FourGLSymbolProvider } from './symbol-provider';
export declare class FourGLCompletionProvider {
    private symbolProvider;
    private keywords;
    private builtInFunctions;
    private codeSnippets;
    constructor(symbolProvider: FourGLSymbolProvider);
    getCompletionItems(document: TextDocument, position: Position): CompletionItem[];
    resolveCompletionItem(item: CompletionItem): CompletionItem;
    private getCurrentWord;
    private shouldIncludeCompletion;
    private isInSqlContext;
    private isInFormContext;
}
//# sourceMappingURL=completion-provider.d.ts.map