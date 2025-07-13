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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// src/extension.ts
const vscode = __importStar(require("vscode"));
const jpkConverter_1 = require("./jpkConverter");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('jpk.openAsJson', async (uri) => {
        const buffer = await vscode.workspace.fs.readFile(uri);
        const decoded = (0, jpkConverter_1.decodeJpkToJson)(buffer);
        if (decoded.msg !== "") {
            if (decoded.errored === true) {
                vscode.window.showErrorMessage(decoded.msg);
            }
            else {
                vscode.window.showInformationMessage(decoded.msg);
            }
        }
        if (decoded.errored !== true) {
            const doc = await vscode.workspace.openTextDocument({
                content: JSON.stringify(decoded.data, null, 2),
                language: 'json',
            });
            await vscode.window.showTextDocument(doc);
        }
        else {
            vscode.window.showErrorMessage(`Error converting ${uri.fsPath} to JSON`);
        }
    }), vscode.commands.registerCommand('jpk.convertToJson', async (uri) => {
        const buffer = await vscode.workspace.fs.readFile(uri);
        const decoded = (0, jpkConverter_1.decodeJpkToJson)(buffer);
        if (decoded.msg !== "") {
            if (decoded.errored === true) {
                vscode.window.showErrorMessage(decoded.msg);
            }
            else {
                vscode.window.showInformationMessage(decoded.msg);
            }
        }
        if (decoded.errored !== true) {
            const outputUri = uri.with({ path: uri.path.replace(/\.jpk$/, '.json') });
            await vscode.workspace.fs.writeFile(outputUri, Buffer.from(JSON.stringify(decoded.data, null, 2)));
            vscode.window.showInformationMessage(`Converted ${uri.fsPath} to JSON`);
        }
        else {
            vscode.window.showErrorMessage(`Error converting ${uri.fsPath} to JSON`);
        }
    }), vscode.commands.registerCommand('jpk.convertToJpk', async (uri) => {
        const text = (await vscode.workspace.fs.readFile(uri)).toString();
        const json = JSON.parse(text);
        const encoded = (0, jpkConverter_1.encodeJsonToJpk)(json);
        if (encoded.msg !== "") {
            if (encoded.errored === true) {
                vscode.window.showErrorMessage(encoded.msg);
            }
            else {
                vscode.window.showInformationMessage(encoded.msg);
            }
        }
        if (encoded.errored !== true) {
            const outputUri = uri.with({ path: uri.path.replace(/\.json$/, '.jpk') });
            await vscode.workspace.fs.writeFile(outputUri, encoded.data);
            vscode.window.showInformationMessage(`Converted ${uri.fsPath} to JPK`);
        }
        else {
            vscode.window.showErrorMessage(`Error converting ${uri.fsPath} to JPK`);
        }
    }));
}
function deactivate() { }
