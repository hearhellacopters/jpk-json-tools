// src/extension.ts
import * as vscode from 'vscode';
import { decodeJpkToJson, encodeJsonToJpk } from './jpkConverter';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('jpk.openAsJson', async (uri: vscode.Uri) => {
      const buffer = await vscode.workspace.fs.readFile(uri);
      const decoded = decodeJpkToJson(buffer);
      if(decoded.msg !== ""){
        if(decoded.errored === true){
          vscode.window.showErrorMessage(decoded.msg);
        } else {
          vscode.window.showInformationMessage(decoded.msg);
        } 
      }
      if(decoded.errored !== true){
        const doc = await vscode.workspace.openTextDocument({
          content: JSON.stringify(decoded.data, null, 2),
          language: 'json',
        });
        await vscode.window.showTextDocument(doc);
      } else {
        vscode.window.showErrorMessage(`Error converting ${uri.fsPath} to JSON`);
      }
    }),

    vscode.commands.registerCommand('jpk.convertToJson', async (uri: vscode.Uri) => {
      const buffer = await vscode.workspace.fs.readFile(uri);
      const decoded = decodeJpkToJson(buffer);
      if(decoded.msg !== ""){
        if(decoded.errored === true){
          vscode.window.showErrorMessage(decoded.msg);
        } else {
          vscode.window.showInformationMessage(decoded.msg);
        } 
      }
      if(decoded.errored !== true){
        const outputUri = uri.with({ path: uri.path.replace(/\.jpk$/, '.json') });
        await vscode.workspace.fs.writeFile(outputUri, Buffer.from(JSON.stringify(decoded.data, null, 2)));
        vscode.window.showInformationMessage(`Converted ${uri.fsPath} to JSON`);
      } else {
        vscode.window.showErrorMessage(`Error converting ${uri.fsPath} to JSON`);
      }
    }),

    vscode.commands.registerCommand('jpk.convertToJpk', async (uri: vscode.Uri) => {
      const text = (await vscode.workspace.fs.readFile(uri)).toString();
      const json = JSON.parse(text);
      const encoded = encodeJsonToJpk(json);
      if(encoded.msg !== ""){
        if(encoded.errored === true){
          vscode.window.showErrorMessage(encoded.msg);
        } else {
          vscode.window.showInformationMessage(encoded.msg);
        } 
      }
      if(encoded.errored !== true){
        const outputUri = uri.with({ path: uri.path.replace(/\.json$/, '.jpk') });
        await vscode.workspace.fs.writeFile(outputUri, encoded.data);
        vscode.window.showInformationMessage(`Converted ${uri.fsPath} to JPK`);
      } else {
        vscode.window.showErrorMessage(`Error converting ${uri.fsPath} to JPK`);
      }
    })
  );
}

export function deactivate() {}
