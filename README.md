# spectre README

This is a simple extension that allows you to instantly open a corresponding test file and run it

## Features

### Spectre Test Open

`spectre.spectre`

- From a code file, open the corresponding spec file

![open-test-file](/assets/open-test-file.gif)

- If no spec file is found, offer to create one

![test-file-not-found](/assets/test-file-not-found.gif)

### Spectre Test Run

`spectre.test` & `spectre.test-watch`

- Run test on currently opened code/spec file

![run-tests](/assets/run-tests.gif)

- Run test on currently opened code/spec file in watch mode

![run-tests-watch](/assets/run-tests-watch.gif)

**NOTE** the default test commands are `pnpm test` and `pnpm test-watch`. If your project uses different test commands in the `scripts` section of your `package.json` file, you can configure by following the below steps

#### Configuring a custom test command

1. Open your VSCode project/workspace
2. Using the command palette (Cmd+Shift+P on Mac) select `Preferences: Open Workspace Settings (JSON)`
3. Type your custom command in the following format `"spectre.testCommand": "<your test command>"`. This will save your command in the `.vscode/settings.json` file
4. (Optional) add the `.vscode` workspace to your `.gitignore` if you do not wish to version control this file

example `settings.json`
```
{
    "spectre.testCommand": "yarn client-test",
    "spectre.testCommandWatch": "yarn client-test-watch"
}
```

### Spectre Mock Open

`spectre.mock`

- Open a mock file from a code/spec file
- Open a spec file from a mock file

![mock-file](/assets/mock-file.gif)

**NOTE**
I strongly suggest you bind these commands to keyboard shortcuts in vscode

e.g. ![shortcuts](/assets/shortcuts.png)

## Limitations

- File system must use unix style paths (i.e. my/current/path)
- Only works for files with extensions `.ts`, `.tsx`, `.js`, `.jsx`, `.spec.ts`, `.spec.tsx`, `.spec.js`, `.spec.jsx`
- Spec file must be located in a `__tests__/` folder in the same folder as the code file

```
├── __tests__
│   └── spectre.spec.tsx
└── spectre.tsx
```
