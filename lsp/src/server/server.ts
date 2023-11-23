// server.ts
import {
  CompletionItem,
  createConnection,
  InitializeParams,
  InitializeResult,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { provideAssertionSuggestion, validateAssertionFormat } from './validateExpect';
import { sendDiagnosticsToClient } from './diagnosticsManager';

const connection = createConnection();

async function initializeServer(params: InitializeParams): Promise<InitializeResult> {
  try {
    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Full,
        completionProvider: {
          resolveProvider: true,
        },
      },
    };
  } catch (error) {
    console.error('Error during server initialization:', error);
    throw error;
  }
}

connection.onInitialize(initializeServer);

connection.onDidOpenTextDocument((params) => {
  const { textDocument } = params;
  const uri = textDocument.uri;
  const newDiagnostics = validateAssertionFormat(uri, [{ text: textDocument.text }]);
  sendDiagnosticsToClient(uri, newDiagnostics, connection);
});

connection.onDidChangeTextDocument((params) => {
  const { textDocument, contentChanges } = params;
  const uri = textDocument.uri;
  const newDiagnostics = validateAssertionFormat(uri, contentChanges);
  sendDiagnosticsToClient(uri, newDiagnostics, connection);
});

connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
  return provideAssertionSuggestion(params)
});

connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
  console.log('Complted->', {params})
  return provideAssertionSuggestion(params)
});

connection.onCompletionResolve((params): CompletionItem => {
  console.log('Resolved-->');
  return {label: 'RESOLVED'}
});

try {
  connection.listen();
  console.log('Server listening');
} catch (error) {
  console.log('error', error);
}
