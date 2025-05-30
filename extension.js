const vscode = require('vscode');
const fs = require('fs');

const fileNameRegex = /\/([a-zA-Z]*).(ts|tsx|js|jsx)$/;

async function openFileWithFallback(filePath, fileName) {
  vscode.window.showTextDocument(vscode.Uri.file(filePath), { preview: false }).then(() => { }, async () => {
    const answer = await vscode.window.showErrorMessage(`Could not find ${fileName}`, "Create", "Cancel")
    if (answer === "Create") {
      const wsEdit = new vscode.WorkspaceEdit()
      wsEdit.createFile(vscode.Uri.file(filePath), { ignoreIfExists: true })
      vscode.workspace.applyEdit(wsEdit).then(() => {
        vscode.window.showTextDocument(vscode.Uri.file(filePath), { preview: false })
      })
    }
  })
}

function specFileToCodeFile(filePath) {
  return filePath.replace("spec.", "").replace("__tests__/", "")
}

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
      const codeFile = specFileToCodeFile(currentFile)
      vscode.window.showTextDocument(vscode.Uri.file(codeFile), { preview: false })
    } else {
      const match = currentFile.match(fileNameRegex)
      if (!match) return;

      let specFilePath = currentFile;

      if (specFilePath.includes("__mocks__/")) {
        specFilePath = specFilePath.replace("__mocks__/", "")
      }
      const specFileName = `/__tests__/${match[1]}.spec.${match[2]}`
      specFilePath = specFilePath.replace(match[0], specFileName)
      openFileWithFallback(specFilePath, specFileName)
    }
  });

  async function runTest(watch) {
    const currentFile = vscode.window.activeTextEditor.document.fileName;
    if (!currentFile) return;

    let terminalCommand;
    if (currentFile.includes(".spec")) {
      terminalCommand = await getTestCommand(currentFile, watch);
    } else {
      const match = currentFile.match(fileNameRegex);
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

  let disposableMock = vscode.commands.registerCommand('spectre.mock', function () {
    const currentFile = vscode.window.activeTextEditor.document.fileName
    if (!currentFile) return;

    if (currentFile.includes("__mocks__")) {
      const match = currentFile.match(fileNameRegex)
      if (!match) return;

      const specFileName = `/__tests__/${match[1]}.spec.${match[2]}`
      const specFilePath = currentFile.replace("__mocks__/", "").replace(match[0], specFileName)
      openFileWithFallback(specFilePath, specFileName);
    } else {
      let mockFilePath = currentFile;

      if (mockFilePath.includes(".spec.")) {
        mockFilePath = specFileToCodeFile(mockFilePath)
      }
      const mockFileName = mockFilePath.match(fileNameRegex)?.[0]
      if (!mockFileName) return;
      mockFilePath = mockFilePath.replace(mockFileName, `/__mocks__/${mockFileName}`)
      openFileWithFallback(mockFilePath, mockFileName)
    }
  });

  context.subscriptions.push(disposableSpectre);
  context.subscriptions.push(disposableTest);
  context.subscriptions.push(disposableTestWatch);
  context.subscriptions.push(disposableMock);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
