# Contributing to BruceEmu

Thank you for your interest in contributing to BruceEmu! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/BruceEmu.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Description of changes"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run a script with the Node.js runtime
node bruce_runtime.js examples/test_script.js

# Open the browser emulator
# Simply open index.html in a web browser
```

## Code Style Guidelines

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add comments for complex logic
- Follow existing code patterns in the repository
- Keep functions small and focused
- Use meaningful variable and function names

## Testing

- All changes should include tests when applicable
- Run `npm test` before submitting a pull request
- Tests are located in the `test/` directory
- Example scripts are in the `examples/` directory
- Ensure all existing tests pass

### Writing Tests

Tests use a simple custom test framework. Example:

```javascript
const BruceRuntime = require('../bruce_runtime.js');

test('Test description', () => {
  const runtime = new BruceRuntime();
  assert(condition, 'Error message if condition is false');
  assertEquals(actual, expected, 'Values should match');
});
```

## Adding New Modules

When adding new modules to the `modules/` directory:

1. Follow one of the supported patterns:
   - **onDevice pattern**: `module.exports = { onDevice: function() {} }`
   - **Callback pattern**: `module.exports = function(callback) {}`
   - **Standard CommonJS**: `module.exports = { /* functions */ }`

2. Document the module with JSDoc comments
3. Add an example script demonstrating the module
4. Update README.md with module documentation
5. Consider security implications (see SECURITY.md)

## Adding Example Scripts

Example scripts should:

- Be self-contained and runnable
- Demonstrate specific features clearly
- Include comments explaining what the code does
- Follow the code style guidelines
- Use meaningful variable names

## Documentation

- Update README.md for user-facing changes
- Update QUICKREF.md for API changes
- Add JSDoc comments to functions and classes
- Include code examples where appropriate
- Keep documentation clear and concise

## Pull Request Process

1. Ensure all tests pass
2. Update documentation as needed
3. Add a clear description of changes to the PR
4. Reference any related issues
5. Be responsive to code review feedback
6. Ensure the PR is focused and addresses one concern

## Commit Message Guidelines

- Use clear, descriptive commit messages
- Start with a verb in present tense (e.g., "Add", "Fix", "Update")
- Keep the first line under 50 characters
- Add detailed explanation in the body if needed
- Reference issue numbers when applicable

Example:
```
Add BLE device emulation support

- Implement BLE device discovery callbacks
- Add random device generation
- Update UI to display BLE devices
- Add example BLE tracker script

Fixes #123
```

## Reporting Issues

When reporting issues, please include:

- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Node.js version, browser, OS)
- Error messages or stack traces
- Code samples that demonstrate the issue

## Feature Requests

We welcome feature requests! Please:

- Check if the feature has already been requested
- Clearly describe the feature and its use case
- Explain why it would be valuable
- Consider implementation approaches
- Be open to discussion and feedback

## Code Review

All submissions require review. We review:

- Code quality and style
- Test coverage
- Documentation completeness
- Security implications
- Performance considerations
- Compatibility with existing features

## Questions?

If you have questions about contributing:

- Check existing documentation
- Look at example code
- Review closed issues and PRs
- Open a discussion or issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what is best for the project
- Show empathy towards others
- Be patient and helpful

Thank you for contributing to BruceEmu! 🚀
