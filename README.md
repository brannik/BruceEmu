# BruceEmu

Emulator for bruce js interpreter scripts

## Features

- **CommonJS Module System**: Full support for `require()` and `module.exports`
- **Module Loading**: Load modules from the `modules/` directory
- **Global Functions**: `println()`, `setTimeout()`, `setInterval()` available globally
- **Script Sandboxing**: User scripts run in isolated scopes with shared module cache
- **Module Pattern Detection**: Automatically detects and handles:
  - `onDevice` pattern: `module.exports = { onDevice: function() {} }`
  - Callback pattern: `module.exports = function(callback) {}`
- **Isolated Execution**: Each script runs in its own isolated context

## Installation

```bash
npm install
```

## Usage

### Running Scripts

Run a script file:

```bash
node bruce_runtime.js examples/test_script.js
```

### Programmatic Usage

```javascript
const BruceRuntime = require('./bruce_runtime.js');

// Create runtime instance
const runtime = new BruceRuntime({
  modulesDir: './modules'  // Optional, defaults to ./modules
});

// Run a script file
runtime.runScript('./path/to/script.js');

// Run code directly
const result = runtime.runCode('println("Hello!"); 2 + 2;');
console.log(result); // 4

// Run with custom context
runtime.runCode('println(customVar);', {
  context: { customVar: 'Hello World' }
});
```

## Module Patterns

### onDevice Pattern

Modules can export an `onDevice` function:

```javascript
// modules/sensor.js
module.exports = {
  onDevice: function() {
    println('Sensor reading...');
    return { temperature: 25 };
  }
};
```

Usage in script:

```javascript
const sensor = require('sensor');
const data = sensor.onDevice();
println('Temperature:', data.temperature);
```

### Callback Pattern

Modules can export a function that accepts a callback:

```javascript
// modules/async_task.js
module.exports = function(callback) {
  setTimeout(() => {
    callback(null, 'Task complete');
  }, 100);
  return 'Task started';
};
```

Usage in script:

```javascript
const task = require('async_task');
task((err, result) => {
  println('Result:', result);
});
```

### Standard CommonJS

Regular CommonJS exports work as expected:

```javascript
// modules/utils.js
module.exports = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b
};
```

## API Reference

### BruceRuntime

#### Constructor

```javascript
new BruceRuntime(options)
```

Options:
- `modulesDir` (string): Directory to load modules from (default: `./modules`)

#### Methods

##### runScript(scriptPath, options)

Run a script file.

- `scriptPath` (string): Path to the script file
- `options` (object):
  - `context` (object): Additional variables to add to the script context
  - `timeout` (number): Execution timeout in milliseconds

##### runCode(code, options)

Run code directly.

- `code` (string): JavaScript code to execute
- `options` (object):
  - `context` (object): Additional variables to add to the context
  - `timeout` (number): Execution timeout in milliseconds
  - `filename` (string): Filename for error reporting

##### detectModuleStyle(moduleExports)

Detect the module pattern (returns 'onDevice', 'callback', or 'unknown').

##### executeModule(moduleExports, args)

Execute a module based on its detected style.

##### clearCache()

Clear the module cache.

##### getCachedModules()

Get list of cached module paths.

## Global Functions

Scripts have access to these global functions:

- `println(...args)`: Print to console (alias for `console.log`)
- `setTimeout(fn, delay)`: Standard setTimeout
- `setInterval(fn, delay)`: Standard setInterval
- `clearTimeout(id)`: Clear a timeout
- `clearInterval(id)`: Clear an interval
- `require(moduleName)`: Load a module

## Examples

See the `examples/` directory for more examples:

- `test_script.js`: Demonstrates basic functionality
- `test_isolation.js`: Demonstrates module isolation

## Testing

Run the test suite:

```bash
npm test
```

## License

MIT
