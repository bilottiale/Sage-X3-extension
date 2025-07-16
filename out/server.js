"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const fourgl_parser_1 = require("./parser/fourgl-parser");
const symbol_provider_1 = require("./language/symbol-provider");
const completion_provider_1 = require("./language/completion-provider");
const diagnostics_provider_1 = require("./language/diagnostics-provider");
const hover_provider_1 = require("./language/hover-provider");
// Create a connection for the server
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
// Initialize language services
const parser = new fourgl_parser_1.FourGLParser();
const symbolProvider = new symbol_provider_1.FourGLSymbolProvider();
const completionProvider = new completion_provider_1.FourGLCompletionProvider(symbolProvider);
const diagnosticsProvider = new diagnostics_provider_1.FourGLDiagnosticsProvider(parser);
const hoverProvider = new hover_provider_1.FourGLHoverProvider(symbolProvider);
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    // Does the client support the `workspace/configuration` request?
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['.', ' ', '(']
            },
            // Tell the client that this server supports hover information
            hoverProvider: true,
            // Tell the client that this server supports go to definition
            definitionProvider: true,
            // Tell the client that this server supports find references
            referencesProvider: true
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// The global settings, used when the `workspace/configuration` request is not supported by the client
const defaultSettings = {
    maxNumberOfProblems: 1000,
    enableDiagnostics: true,
    enableCompletion: true
};
let globalSettings = defaultSettings;
// Cache the settings of all open documents
const documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.fourglLanguageServer || defaultSettings));
    }
    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'fourglLanguageServer'
        });
        documentSettings.set(resource, result);
    }
    return result;
}
// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});
// The content of a text document has changed
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
    // Update symbol table when document changes
    symbolProvider.updateDocument(change.document);
});
async function validateTextDocument(textDocument) {
    const settings = await getDocumentSettings(textDocument.uri);
    if (!settings.enableDiagnostics) {
        return;
    }
    const diagnostics = diagnosticsProvider.getDiagnostics(textDocument);
    // Send the computed diagnostics to VSCode
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});
// This handler provides the initial list of the completion items
connection.onCompletion(async (textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    if (!document) {
        return [];
    }
    const settings = await getDocumentSettings(textDocumentPosition.textDocument.uri);
    if (!settings.enableCompletion) {
        return [];
    }
    return completionProvider.getCompletionItems(document, textDocumentPosition.position);
});
// This handler resolves additional information for the item selected in
// the completion list
connection.onCompletionResolve((item) => {
    return completionProvider.resolveCompletionItem(item);
});
// Hover provider
connection.onHover((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) {
        return undefined;
    }
    return hoverProvider.getHover(document, params.position);
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
connection.console.log('4GL Language Server started');
//# sourceMappingURL=server.js.map