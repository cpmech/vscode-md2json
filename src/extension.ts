// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as ws from "ws";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "md2json" is now active!');

  // connect
  const wss = new ws("ws://localhost:4444");
  wss.onopen = (_) => {
    wss.send(
      JSON.stringify({ isGreetings: true, message: "Hello from VS Code" })
    );
  };

  // send json
  vscode.workspace.onDidSaveTextDocument((e) => {
    if (!e.fileName.endsWith(".md")) {
      console.log("skip ", e.fileName);
      return;
    }
    wss.send(
      JSON.stringify({
        filename: e.fileName,
        text: e.getText(),
      })
    );
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("md2json.connect", () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("md2json: connected");
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
