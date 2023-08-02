const vscode = require('vscode');
const fs = require('fs');

async function getTestCommand(filePath, watch) {
  const packageJsonPath = vscode.workspace.rootPath + '/package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const repoName = packageJson.name;
  const isExpectedRepo = repoName === "pca-core-web";

  let testCommand = isExpectedRepo ? `yarn run client-test` : 'yarn run test';
  if (watch) testCommand += ' --watch';
  return `${testCommand} -- ${filePath}`;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposableSpectre = vscode.commands.registerCommand('spectre.spectre', function () {
		const currentFile = vscode.window.activeTextEditor.document.fileName
		if (!currentFile) return;

		if (currentFile.includes(".spec.")) {
			const codeFile = currentFile.replace("spec.", "").replace("__tests__/", "")
			vscode.window.showTextDocument(vscode.Uri.file(codeFile), { preview: false })
		} else {
			const match = currentFile.match(/\/([a-zA-Z]*).(ts|tsx)$/)
			if (!match) return;

			const specFileName = `/__tests__/${match[1]}.spec.${match[2]}`
			const specFilePath = currentFile.replace(match[0], specFileName)
			vscode.window.showTextDocument(vscode.Uri.file(specFilePath), { preview: false }).then(() => { }, async () => {
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

	context.subscriptions.push(disposableSpectre);


  async function runTest(watch) {
    const currentFile = vscode.window.activeTextEditor.document.fileName;
    if (!currentFile) return;

    let terminalCommand;
    if (currentFile.includes(".spec")) {
      terminalCommand = await getTestCommand(currentFile, watch);
    } else {
      const match = currentFile.match(/\/([a-zA-Z]*).(ts|tsx)$/);
      if (!match) return;

      const specFileName = `/__tests__/${match[1]}.spec.${match[2]}`;
      terminalCommand = await getTestCommand(specFileName, watch);
    }

    const defaultShellName = vscode.env.shell.split('/').pop();
    const defaultTerminal = vscode.window.terminals.find(t => t.name === defaultShellName);

    if (defaultTerminal) {
      defaultTerminal.show();
      defaultTerminal.sendText(terminalCommand);
    } else {
      const newTerminal = vscode.window.createTerminal(defaultShellName);
      newTerminal.show();
      newTerminal.sendText(terminalCommand);
    }
  }

  let disposableTest = vscode.commands.registerCommand('spectre.test', async function () {
    await runTest(false);
  });

  let disposableTestWatch = vscode.commands.registerCommand('spectre.test-watch', async function () {
    await runTest(true);
  });

  context.subscriptions.push(disposableSpectre);
  context.subscriptions.push(disposableTest);
  context.subscriptions.push(disposableTestWatch);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
