import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionItem, Position } from 'vscode-languageserver/node';
import { FourGLSymbolProvider } from './symbol-provider';
import { SageX3Config } from './sage-x3-connection';
export declare class FourGLCompletionProvider {
    private symbolProvider;
    private sageX3Connection;
    private keywords;
    private builtInFunctions;
    private codeSnippets;
    constructor(symbolProvider: FourGLSymbolProvider, sageX3Config?: SageX3Config);
    getCompletionItems(document: TextDocument, position: Position): Promise<CompletionItem[]>;
    resolveCompletionItem(item: CompletionItem): CompletionItem;
    private getCurrentWord;
    private shouldIncludeCompletion;
    private isInSqlContext;
    private isInFormContext;
    private isInDatabaseContext;
}
//# sourceMappingURL=completion-provider.d.ts.map