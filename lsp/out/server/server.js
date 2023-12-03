"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const node_1 = require("vscode-languageserver/node");
const validateExpect_1 = require("./validateExpect");
const diagnosticsManager_1 = require("./diagnosticsManager");
const connection = (0, node_1.createConnection)();
function initializeServer(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return {
                capabilities: {
                    textDocumentSync: node_1.TextDocumentSyncKind.Full,
                    completionProvider: {
                        resolveProvider: true,
                    },
                },
            };
        }
        catch (error) {
            console.error('Error during server initialization:', error);
            throw error;
        }
    });
}
connection.onInitialize(initializeServer);
connection.onDidOpenTextDocument((params) => {
    const { textDocument } = params;
    const uri = textDocument.uri;
    const newDiagnostics = (0, validateExpect_1.validateAssertionFormat)(uri, [{ text: textDocument.text }]);
    (0, diagnosticsManager_1.sendDiagnosticsToClient)(uri, newDiagnostics, connection);
});
connection.onDidChangeTextDocument((params) => {
    const { textDocument, contentChanges } = params;
    const uri = textDocument.uri;
    const newDiagnostics = (0, validateExpect_1.validateAssertionFormat)(uri, contentChanges);
    (0, diagnosticsManager_1.sendDiagnosticsToClient)(uri, newDiagnostics, connection);
});
connection.onCompletion((params) => {
    return (0, validateExpect_1.provideAssertionSuggestion)(params);
});
connection.onCompletion((params) => {
    console.log('Complted->', { params });
    return (0, validateExpect_1.provideAssertionSuggestion)(params);
});
connection.onCompletionResolve((params) => {
    console.log('Resolved-->');
    return { label: 'RESOLVED' };
});
try {
    connection.listen();
    console.log('Server listening');
}
catch (error) {
    console.log('error', error);
}
