# BruceEmu Quick Reference

## Running Scripts

```bash
# Run a script file
node bruce_runtime.js examples/test_script.js

# Run tests
npm test
```

## Module Patterns

### onDevice Pattern
```javascript
// modules/example.js
module.exports = {
  onDevice: function(arg) {
    println('Running on device');
    return result;
  }
};

// Usage in script:
const example = require('example');
const result = example.onDevice(someArg);
```

### Callback Pattern
```javascript
// modules/async_example.js
module.exports = function(callback) {
  setTimeout(() => {
    callback(null, data);
  }, 100);
  return 'Started';
};

// Usage in script:
const async = require('async_example');
async((err, data) => {
  println('Done:', data);
});
```

### Standard CommonJS
```javascript
// modules/utils.js
module.exports = {
  helper: function() { },
  constant: 42
};

// Usage in script:
const utils = require('utils');
utils.helper();
```

## Global Functions Available in Scripts

- `println(...args)` - Print to console
- `setTimeout(fn, ms)` - Schedule function
- `setInterval(fn, ms)` - Repeat function
- `clearTimeout(id)` - Cancel timeout
- `clearInterval(id)` - Cancel interval
- `require(moduleName)` - Load module

## Module Resolution

- `require('moduleName')` - Loads from `modules/moduleName.js`
- `require('./relative')` - Loads relative to current file
- Modules are cached after first load
- Same module instance shared across all requires

## Script Isolation

- Each script runs in isolated VM context
- Variables don't leak between scripts
- Modules are shared (cached) between scripts
- Global functions available in all scripts

## Programmatic API

```javascript
const BruceRuntime = require('./bruce_runtime.js');

// Create runtime
const runtime = new BruceRuntime({
  modulesDir: './modules'  // optional
});

// Run script file
runtime.runScript('./script.js', {
  context: { customVar: 'value' },  // optional
  timeout: 5000  // optional, in ms
});

// Run code directly
const result = runtime.runCode('2 + 2');

// Detect module style
const style = runtime.detectModuleStyle(moduleExports);
// Returns: 'onDevice', 'callback', or 'unknown'

// Execute module
runtime.executeModule(moduleExports, args);

// Cache management
runtime.clearCache();
const modules = runtime.getCachedModules();
```

## Examples

- `examples/test_script.js` - Basic usage
- `examples/test_isolation.js` - Isolation demo
- `examples/test_relative.js` - Relative imports
- `examples/comprehensive_demo.js` - All features
- `examples/error_handling.js` - Error patterns

## Testing

Run the test suite:
```bash
npm test
```

15 tests covering:
- Runtime instantiation
- Global context
- Module pattern detection
- Code execution
- Module caching
- Script isolation
- Error handling
