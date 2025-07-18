# Change Log

All notable changes to the "spectre" extension will be documented in this file.

## [Unreleased]

- 1.0.0: Initial release
- 1.0.1: Fix file path bug, update README, add logo
- 1.0.2: Add publisher to package.json

## [Released]

- 1.0.3: Update README and image paths
- 1.0.4: Add repository to package.json
- 1.0.5: Add commands to run test on the currently opened test file, or it's associated file - in either normal or watch mode
- 1.0.6: Add command to open mock file for code/spec file
- 1.0.7:
  - Make default test commands `pnpm test` and `pnpm test-watch`
  - Give the option for a user to set different test commands in their repo's `.vscode/settings.json` file
  - Support `js` and `jsx` files
  - Watch mode now works more consistently across multiple package managers (npm, pnpm, yarn etc)
- 1.0.8: Add number support to the filename regex
- 1.0.9: Add dash and underscore support to the filename regex
