# spectre README

This is a simple extension to make switching between `code` and `spec` files easier

## Features

### Spectre Test Open

`spectre.spectre`

- From a ts/tsx file, open the corresponding spec file
![code-to-spec](/assets/code-to-spec.gif)
- From a spec file, open the corresponding ts/tsx file
![spec-to-code](/assets/spec-to-code.gif)
- If no spec file is found, offer to create one
![create-spec](/assets/create-spec.gif)

### Spectre Test Run

`spectre.test` & `spectre.test-watch`

- Run test on currently opened spec file
- Run test on the corresponding spec file for a currently opened ts/tsx file

**NOTE**
I strongly suggest you bind the `spectre.spectre`, `spectre.test` and `spectre.test-watch` commands to a keyboard shortcut in vscode

## Limitatations

- File system must use unix style paths (i.e. my/current/path)
- Only works for files with extensions `.ts`, `.tsx`, `.spec.tsx`
- Spec file must be located in a `__tests__/` folder in the same folder as the code file
- Yarn is installed with jest
- Yarn script is setup to run tests with `yarn run test`

```
├── __tests__
│   └── spectre.spec.tsx
└── spectre.tsx
```

## Release Notes

### 1.0.0

Initial release of `Spectre`
