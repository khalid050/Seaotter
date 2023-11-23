"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path_1 = __importDefault(require("path"));
const vscode_1 = __importDefault(require("vscode"));
const node_1 = require("vscode-languageclient/node");
const expect_1 = require("./expect");
let client;
let outputChannel;
function activate(context) {
    try {
        outputChannel = vscode_1.default.window.createOutputChannel('otter-lsp');
        outputChannel.show();
        const serverModule = context.asAbsolutePath(`${path_1.default.join('out', 'server', 'server.js')}`);
        const serverOptions = {
            run: { module: serverModule, transport: node_1.TransportKind.ipc, options: { cwd: process.cwd() } },
            debug: { module: serverModule, transport: node_1.TransportKind.ipc, options: { cwd: process.cwd() } }
        };
        const clientOptions = {
            documentSelector: [{ scheme: 'file', language: 'typescript' }],
            synchronize: {
                fileEvents: vscode_1.default.workspace.createFileSystemWatcher('**/*.ts'),
            },
        };
        client = new node_1.LanguageClient('otterServer', 'Otter Server', serverOptions, clientOptions);
        client.onDidChangeState((event) => {
            if (event.newState === node_1.State.Running) {
                outputChannel.appendLine('Server initialization complete');
            }
        });
        client.onNotification('custom/expect/match/error', (errorInfo) => {
            outputChannel.appendLine(`Error on line ${errorInfo.lineNumber}: ${errorInfo.errorMessage}`);
        });
        vscode_1.default.languages.registerDocumentFormattingEditProvider({ language: 'typescript' }, expect_1.ExpectFormatterProvider);
        vscode_1.default.languages.registerCompletionItemProvider({ language: 'typescript' }, new expect_1.ExpectCompletionItemProvider(), ...['`', 't']);
        client.start();
        console.log('Client connection open');
    }
    catch (error) {
        outputChannel.appendLine('Error during activation:');
        vscode_1.default.window.showErrorMessage('Error activating your extension. Check the output channel for details.');
    }
}
exports.activate = activate;
function deactivate() {
    if (client) {
        return client.stop();
    }
}
exports.deactivate = deactivate;
