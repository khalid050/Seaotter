"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiagnosticsToClient = exports.clearDiagnostics = exports.updateDiagnostics = exports.diagnostics = void 0;
exports.diagnostics = {};
function updateDiagnostics({ uri, contentChanges, func, }) {
    const newDiagnostics = func(uri, contentChanges);
    exports.diagnostics[uri] = newDiagnostics;
}
exports.updateDiagnostics = updateDiagnostics;
function clearDiagnostics(uri, connection) {
    exports.diagnostics[uri] = [];
    connection.sendDiagnostics({ uri, diagnostics: [] });
}
exports.clearDiagnostics = clearDiagnostics;
function sendDiagnosticsToClient(uri, newDiagnostics, connection) {
    connection.sendDiagnostics({ uri, diagnostics: newDiagnostics });
}
exports.sendDiagnosticsToClient = sendDiagnosticsToClient;
