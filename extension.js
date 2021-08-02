// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "open-twig" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

    let disposable = vscode.commands.registerCommand('open-twig.openTwig', async function () {
		// The code you place here will be executed every time your command is executed
        let templateFilePath = vscode.workspace.getConfiguration('openTwig').get("templateFile"),
            regexes = vscode.workspace.getConfiguration('openTwig').get("regexes") || [];

        if (!templateFilePath) {
            vscode.window.showErrorMessage('Missing template file path. Please, fill it in settings, "openTwig.templateFile"');
            return;
        }

        if (!Array.isArray(regexes)) {
            vscode.window.showErrorMessage('Regexes configuration "openTwig.regexes" must be a array.');
            return;
        }

        if (regexes.length) {
            let invalidConfigFormat = regexes.some(item => {
                return !item.hasOwnProperty('regex') || !item.hasOwnProperty('replace');
            });

            if (invalidConfigFormat) {
                vscode.window.showErrorMessage('Regexes configuration "openTwig.regexes" have the format: [{"regex": "regexToReplace", "replace": "replaceString"}]');
                return;
            }
        }

        const folderUri = vscode.workspace.workspaceFolders[0].uri;
		const fileUri = folderUri.with({ path: path.join(folderUri.path, templateFilePath) });

		const readData = await vscode.workspace.fs.readFile(fileUri);

        let twigFiles = {};

        Buffer.from(readData).toString('utf8').split("\n").forEach(item => {
            if (!item.includes('=>') || item.includes('vendor'))
                return;
            let[key,value] = item.split('=>');
            key = key.split(':').join('/').trim();
            key = key.substring(1, key.length - 1);
            twigFiles[key] = value.replace(/__DIR__.'(\/..)+\//g, '')
                .trim()
                .split('.twig')
                .shift()
                + '.twig';
        });

        let twigName = await vscode.window.showInputBox({
            prompt: "Please enter twig name",
            ignoreFocusOut: true
        });

        if (!twigName) {
            vscode.window.showInformationMessage(`Twig name cannot be empty`);
            return;
        }

        twigName = twigName.trim()
            .replace('@', '')
            .split(':')
            .join('/');

        regexes.forEach(item => {
            let { regex, replace } = item;
            twigName = twigName.replace(new RegExp(regex), replace);
        })

        if (twigFiles[twigName]) {
		    const twigFileUri = folderUri.with({ path: path.join(folderUri.path, twigFiles[twigName]) });

            const twigFileDocument = await vscode.window.showTextDocument(twigFileUri);
            console.log(twigFileDocument);
            return;
        }

        vscode.window.showInformationMessage(`Template '${twigName}' não encontrado.`);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
