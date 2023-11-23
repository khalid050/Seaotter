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
exports.ExpectFormatterProvider = exports.ExpectCompletionItemProvider = void 0;
const vscode = __importStar(require("vscode"));
const validateExpect_1 = require("../server/validateExpect");
class ExpectCompletionItemProvider {
    provideCompletionItems(document, position, token) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const startPosition = new vscode.Position(position.line, position.character);
        const lineText = document.lineAt(position.line).text;
        const isInsideTemplate = lineText.includes('`') && lineText.indexOf('`') < position.character;
        // if (isInsideTemplate) {
        //   return [
        //     new vscode.CompletionItem('toEqual', vscode.CompletionItemKind.Method),
        //     new vscode.CompletionItem('toBeGreaterThan', vscode.CompletionItemKind.Method),
        //     new vscode.CompletionItem('toBeLessThan', vscode.CompletionItemKind.Method),
        //   ].map(item => {
        //     const snippet = `\${\${1:expression}} ${item.label} \${\${2:expected}}\`;`;
        //     item.insertText = new vscode.SnippetString(snippet);
        //     item.range = new vscode.Range(position, position);
        //     return item;
        //   });
        // }
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
        }
        else if (linePrefix.endsWith('expect`')) {
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
exports.ExpectCompletionItemProvider = ExpectCompletionItemProvider;
exports.ExpectFormatterProvider = {
    provideDocumentFormattingEdits: (document) => {
        const textEdits = [];
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const formattedLine = (0, validateExpect_1.formatExpect)(line.text);
            if (line.text !== formattedLine) {
                const range = new vscode.Range(line.range.start, line.range.end);
                textEdits.push(vscode.TextEdit.replace(range, formattedLine));
            }
        }
        return textEdits;
    }
};
function createCompletionItem(item) {
    return new vscode.CompletionItem(item, vscode.CompletionItemKind.Method);
}
