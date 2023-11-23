import * as vscode from 'vscode';
import { formatExpect } from '../server/validateExpect';

export class ExpectCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    const startPosition = new vscode.Position(position.line, position.character);
        
    if (linePrefix.endsWith('expect')) {
      // to fix this 
      return [
        new vscode.CompletionItem('`${} toEqual ${}`', vscode.CompletionItemKind.Method),
        new vscode.CompletionItem('`${} toBeGreaterThan ${}`', vscode.CompletionItemKind.Method),
        new vscode.CompletionItem('`${} toBeLessThan ${}`', vscode.CompletionItemKind.Method),
      ].map(item => {
        item.insertText = new vscode.SnippetString(item.label);
        item.range = new vscode.Range(startPosition, startPosition);
        return item;
      });
    } else if (linePrefix.endsWith('expect`')) {
      return [
        createCompletionItem('toEqual'),
        createCompletionItem('toNotEqual'),
        createCompletionItem('toBeGreaterThan'),
        createCompletionItem('toBeLessThan'),
    ].map(item => {
        const snippet = `\${\${1:valA}} ${item.label} \${\${2:valB}}`;
        item.insertText = new vscode.SnippetString(snippet);
        item.range = new vscode.Range(startPosition, startPosition);
        return item;
    });
    } 
    return [];
  }
}

export const ExpectFormatterProvider: vscode.DocumentFormattingEditProvider = {
  provideDocumentFormattingEdits: (document) => {
    const textEdits: vscode.TextEdit[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const formattedLine = formatExpect(line.text);
      if (line.text !== formattedLine) {
        const range = new vscode.Range(line.range.start, line.range.end);
        textEdits.push(vscode.TextEdit.replace(range, formattedLine));
      }
    }
    return textEdits;
  }
}

function createCompletionItem(item: string) {
  return new vscode.CompletionItem(item, vscode.CompletionItemKind.Method)
}