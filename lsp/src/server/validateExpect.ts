import {
  Position,
  Diagnostic,
  DiagnosticSeverity,
  TextDocumentContentChangeEvent,
  TextDocumentPositionParams,
  CompletionItemKind,
  MarkupContent,
  CompletionItem,
  MarkupKind,
} from 'vscode-languageserver/node';
import { diagnostics } from './diagnosticsManager';

function isInsideExpectTaggedTemplate(lineText: string) : boolean {
  return lineText.includes('expect`');
}

function correctFormat(lineText: string) {
  return lineText.match(/expect\s*`(\${[^}]*})\s+(\w+)\s(\${[^}]*})`\s*;?\s*$/);
}

export function formatExpect(lineText: string): string {
  const formattedLine = lineText.replace(/expect\s*`\s*(\${[^}]*})\s*(toEqual|toNotEqual|toBeGreaterThan|toBeLessThan)\s*(\${[^}]*})\s*`\s*;?/g,
  'expect`$1 $2 $3`;');
  return formattedLine;
}

export function validateAssertionFormat(
  uri: string,
  contentChanges: TextDocumentContentChangeEvent[]
): Diagnostic[] {
  diagnostics[uri] = [];

  const text = contentChanges[0].text;
  const lines = text.split('\n');
  const newDiagnostics: Diagnostic[] = [];
  for (let line = 0; line < lines.length; line++) {
    const lineText = lines[line].trim();
    if (isInsideExpectTaggedTemplate(lineText)) {
      const match = correctFormat(lineText);

      if (!match) {
        const errorMessage = 'No trailing spaces: expect should take the form "expect`${a} toEqual ${b}`"';
        const diagnostic: Diagnostic = {
          range: {
            start: Position.create(line, 0),
            end: Position.create(line, lineText.length),
          },
          severity: DiagnosticSeverity.Error,
          message: errorMessage,
          source: 'Otter LSP server',
        };
        newDiagnostics.push(diagnostic);
      }
    }
  }

  return newDiagnostics;
}

export function provideAssertionSuggestion(params: TextDocumentPositionParams): CompletionItem[] {
  const suggestions: CompletionItem[] = [
    {
      label: 'toEqual',
      kind: CompletionItemKind.Method,
      documentation: {
        kind: MarkupKind.Markdown,
        value: 'Asserts that two values are equal.',
      },
    },
    {
      label: 'toBeGreaterThan',
      kind: CompletionItemKind.Method,
      documentation: {
        kind: MarkupKind.Markdown,
        value: 'Asserts that a value is greater than another.',
      },
    },
    {
      label: 'toBeLessThan',
      kind: CompletionItemKind.Method,
      documentation: {
        kind: MarkupKind.Markdown,
        value: 'Asserts that a value is less than another.',
      },
    },
  ];

  return suggestions;
}