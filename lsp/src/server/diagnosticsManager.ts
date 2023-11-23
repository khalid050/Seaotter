import {
  Connection,
  Diagnostic,
  TextDocumentContentChangeEvent
} from 'vscode-languageserver/node';

export const diagnostics: Record<string, Diagnostic[]> = {};

export function updateDiagnostics({
  uri,
  contentChanges,
  func,
}: {
  uri: string;
  contentChanges: TextDocumentContentChangeEvent[];
  func: (uri: string, contentChanges: TextDocumentContentChangeEvent[]) => Diagnostic[];
}): void {
  const newDiagnostics = func(uri, contentChanges);
  diagnostics[uri] = newDiagnostics;
}


export function clearDiagnostics(uri: string, connection: Connection): void {
  diagnostics[uri] = [];
  connection.sendDiagnostics({ uri, diagnostics: [] });
}

export function sendDiagnosticsToClient(uri: string, newDiagnostics: Diagnostic[], connection: Connection): void {
  connection.sendDiagnostics({ uri, diagnostics: newDiagnostics });
}
