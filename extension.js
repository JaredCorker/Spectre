const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('spectre.spectre', function () {
		const currentFile = vscode.window.activeTextEditor.document.fileName
		if (!currentFile) return;

		if (currentFile.includes("spec")) {
			const codeFile = currentFile.replace("spec.", "").replace("__tests__/", "")
			vscode.window.showTextDocument(vscode.Uri.file(codeFile), { preview: false })
		} else {
			const match = currentFile.match(/\/([a-zA-Z]*).(ts|tsx)$/)
			if (!match) return;

			const specFileName = `__tests__/${match[1]}.spec.${match[2]}`
			const specFilePath = currentFile.replace(match[0], specFileName)
			vscode.window.showTextDocument(vscode.Uri.file(specFilePath), { preview: false }).then(() => {}, async () => {
				const answer = await vscode.window.showErrorMessage(`Could not find ${specFileName}`, "Create", "Cancel")	
				if (answer === "Create") {
					const wsEdit = new vscode.WorkspaceEdit()
					wsEdit.createFile(vscode.Uri.file(specFilePath), { ignoreIfExists: true })
					vscode.workspace.applyEdit(wsEdit).then(() => {
						vscode.window.showTextDocument(vscode.Uri.file(specFilePath), { preview: false })
					})
				}
			})
		}

	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
