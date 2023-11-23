"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideAssertionSuggestion = exports.validateAssertionFormat = exports.formatExpect = void 0;
const node_1 = require("vscode-languageserver/node");
const diagnosticsManager_1 = require("./diagnosticsManager");
function isInsideExpectTaggedTemplate(lineText) {
    return lineText.includes('expect`');
}
function correctFormat(lineText) {
    return lineText.match(/expect\s*`(\${[^}]*})\s+(\w+)\s(\${[^}]*})`\s*;?\s*$/);
}
function formatExpect(lineText) {
    const formattedLine = lineText.replace(/expect\s*`\s*(\${[^}]*})\s*(toEqual|toNotEqual|toBeGreaterThan|toBeLessThan)\s*(\${[^}]*})\s*`\s*;?/g, 'expect`$1 $2 $3`;');
    return formattedLine;
}
exports.formatExpect = formatExpect;
function validateAssertionFormat(uri, contentChanges) {
    diagnosticsManager_1.diagnostics[uri] = [];
    const text = contentChanges[0].text;
    const lines = text.split('\n');
    const newDiagnostics = [];
    for (let line = 0; line < lines.length; line++) {
        const lineText = lines[line].trim();
        if (isInsideExpectTaggedTemplate(lineText)) {
            const match = correctFormat(lineText);
            if (!match) {
                const errorMessage = 'No trailing spaces: expect should take the form "expect`${a} toEqual ${b}`"';
                const diagnostic = {
                    range: {
                        start: node_1.Position.create(line, 0),
                        end: node_1.Position.create(line, lineText.length),
                    },
                    severity: node_1.DiagnosticSeverity.Error,
                    message: errorMessage,
                    source: 'Otter LSP server',
                };
                newDiagnostics.push(diagnostic);
            }
        }
    }
    return newDiagnostics;
}
exports.validateAssertionFormat = validateAssertionFormat;
function provideAssertionSuggestion(params) {
    const suggestions = [
        {
            label: 'toEqual',
            kind: node_1.CompletionItemKind.Method,
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: 'Asserts that two values are equal.',
            },
        },
        {
            label: 'toBeGreaterThan',
            kind: node_1.CompletionItemKind.Method,
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: 'Asserts that a value is greater than another.',
            },
        },
        {
            label: 'toBeLessThan',
            kind: node_1.CompletionItemKind.Method,
            documentation: {
                kind: node_1.MarkupKind.Markdown,
                value: 'Asserts that a value is less than another.',
            },
        },
    ];
    return suggestions;
}
exports.provideAssertionSuggestion = provideAssertionSuggestion;
