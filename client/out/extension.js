"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    // Server options
    const serverModule = context.asAbsolutePath('../out/server.js');
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // Server is started in the directory of the extension
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions,
        },
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for 4GL documents
        documentSelector: [
            { scheme: 'file', language: 'fourgl' },
            { scheme: 'file', pattern: '**/*.4gl' },
            { scheme: 'file', pattern: '**/*.src' }
        ],
        synchronize: {
            // Notify the server about file changes to '.4gl' and '.src' files in the workspace
            fileEvents: [
                vscode.workspace.createFileSystemWatcher('**/*.4gl'),
                vscode.workspace.createFileSystemWatcher('**/*.src')
            ],
        },
    };
    // Create the language client and start the client.
    client = new node_1.LanguageClient('fourglLanguageServer', '4GL Language Server', serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
    // Register commands
    const disposable = vscode.commands.registerCommand('fourgl.restart', async () => {
        await client.stop();
        client.start();
        vscode.window.showInformationMessage('4GL Language Server restarted');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map