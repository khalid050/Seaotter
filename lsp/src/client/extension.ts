
import path from 'path';
import vscode, { CompletionItem } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, State as ClientState } from 'vscode-languageclient/node';
import { formatExpect } from '../server/validateExpect';
import { ExpectCompletionItemProvider, ExpectFormatterProvider } from './expect';

let client: LanguageClient;
let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  try {
    outputChannel = vscode.window.createOutputChannel('otter-lsp');
    outputChannel.show();

    const serverModule = context.asAbsolutePath(`${path.join('out', 'server', 'server.js')}`);
    const serverOptions: ServerOptions = {
      run: { module: serverModule, transport: TransportKind.ipc, options: { cwd: process.cwd() } },
      debug: { module: serverModule, transport: TransportKind.ipc, options: { cwd: process.cwd() } }
    };
    
    const clientOptions: LanguageClientOptions = {
      documentSelector: [{ scheme: 'file', language: 'typescript' }],
      synchronize: {
        fileEvents: vscode.workspace.createFileSystemWatcher('**/*.ts'),
      },
    };

    client = new LanguageClient(
      'otterServer',
      'Otter Server',
      serverOptions,
      clientOptions
    );

    client.onDidChangeState((event) => {
      if (event.newState === ClientState.Running) {
        outputChannel.appendLine('Server initialization complete');
      }
    });

    client.onNotification('custom/expect/match/error', (errorInfo: { lineNumber: number, errorMessage: string }) => {
      outputChannel.appendLine(`Error on line ${errorInfo.lineNumber}: ${errorInfo.errorMessage}`);
    });

    vscode.languages.registerDocumentFormattingEditProvider({ language: 'typescript' }, ExpectFormatterProvider);
    vscode.languages.registerCompletionItemProvider(
      { language: 'typescript' },
      new ExpectCompletionItemProvider(),
      ...['`', 't']
    );

    client.start();
    console.log('Client connection open');
  } catch (error) {
    outputChannel.appendLine('Error during activation:');
    vscode.window.showErrorMessage('Error activating your extension. Check the output channel for details.');
  }
}

export function deactivate() {
  if (client) {
    return client.stop();
  }
}
