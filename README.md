# spectre README

This is a simple extension to make switching between `code` and `spec` files easier

## Features

- From a ts/tsx file, open the corresponding spec file
![code-to-spec](https://github.com/JaredCorker/Spectre/blob/main/assets/code-to-spec.gif)
- From a spec file, open the corresponding ts/tsx file
![spec-to-code](https://github.com/JaredCorker/Spectre/blob/main/assets/spec-to-code.gif)
- If no spec file is found, offer to create one
![create-spec](https://github.com/JaredCorker/Spectre/blob/main/assets/create-spec.gif)

**NOTE**
I strongly suggest you bind the `spectre.spectre` command to a keyboard shortcut in vscode

## Limitatations

- File system must use unix style paths (i.e. my/current/path)
- Only works for files with extensions `.ts`, `.tsx`, `.spec.tsx`
- Spec file must be located in a `__tests__/` folder in the same folder as the code file
```
├── __tests__
│   └── spectre.spec.tsx
└── spectre.tsx
```

## Release Notes

### 1.0.0

Initial release of `Spectre`
