# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing the project maintainers or opening a private security advisory on GitHub.

Please do not disclose security vulnerabilities publicly until we've had a chance to address them.

## Security Considerations

### Node.js Runtime (bruce_runtime.js)

The Node.js runtime uses the `vm` module to sandbox script execution. While this provides isolation, please be aware:

- Scripts run in a sandboxed VM context with limited access to Node.js APIs
- Only explicitly provided global functions (println, setTimeout, setInterval, require) are available
- Module loading is restricted to the configured modules directory
- Scripts cannot access the filesystem directly or make network requests unless modules provide that capability

**Best Practices:**
- Only run trusted scripts in the Node.js runtime
- Review all modules before adding them to the modules directory
- Use timeouts to prevent infinite loops
- Be cautious when providing custom context variables

### Browser Emulator (emulator.js)

The browser emulator uses `new Function()` to execute user-provided scripts. This approach has security implications:

- User scripts are executed in the browser's JavaScript context
- Scripts have access to the DOM and browser APIs
- Cross-site scripting (XSS) vulnerabilities are possible if untrusted code is executed

**Best Practices:**
- Only run trusted scripts in the browser emulator
- Do not execute scripts from untrusted sources
- The emulator is intended for development and testing purposes only
- Do not deploy the emulator in production environments where users can execute arbitrary code
- Always validate and sanitize any user input before using it in scripts

### Module Security

When creating custom modules:

- Validate all input parameters
- Avoid using `eval()` or `new Function()` with user input
- Sanitize any data that will be displayed in the browser
- Be cautious with filesystem and network operations
- Follow the principle of least privilege

### Content Security Policy

If deploying the browser emulator, consider implementing a Content Security Policy (CSP) to restrict:
- Script sources
- External resource loading
- Inline script execution

## Known Limitations

1. **Browser Emulator**: Uses `new Function()` for script execution, which cannot be fully sandboxed in the browser
2. **Node.js Runtime**: VM sandboxing is not a complete security boundary (see Node.js vm module documentation)
3. **Module System**: No built-in permissions system for module capabilities

## Security Updates

Security patches will be released as soon as possible after a vulnerability is confirmed. Users are encouraged to:

- Keep dependencies up to date
- Watch the repository for security advisories
- Review the CHANGELOG for security-related updates
- Test updates in a development environment before deploying

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities and will acknowledge contributors in security advisories (unless they prefer to remain anonymous).
