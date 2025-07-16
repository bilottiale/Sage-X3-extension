import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  // Server options
  const serverModule = context.asAbsolutePath('../out/server.js');
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // Server is started in the directory of the extension
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
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
  client = new LanguageClient(
    'fourglLanguageServer',
    '4GL Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();

  // Register commands
  const disposable = vscode.commands.registerCommand(
    'fourgl.restart',
    async () => {
      await client.stop();
      client.start();
      vscode.window.showInformationMessage('4GL Language Server restarted');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
