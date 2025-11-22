# BruceEmu

Emulator for BruceJS interpreter scripts - Test your BruceJS scripts both in Node.js and in the browser with full device emulation!

## Overview

BruceEmu consists of two main components:

1. **Node.js Runtime (`bruce_runtime.js`)**: A server-side runtime for executing BruceJS scripts with CommonJS module support
2. **Browser Emulator (`index.html`)**: A browser-based emulator for testing BruceJS scripts with emulated hardware devices (BLE, WiFi, buttons)

## Node.js Runtime Features

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

## Node.js Runtime Usage

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

See the `examples/` directory for demonstrations:

- `test_script.js`: Basic functionality (require, println, setTimeout)
- `test_isolation.js`: Module isolation and caching
- `test_relative.js`: Relative imports between modules
- `comprehensive_demo.js`: All features in one example
- `error_handling.js`: Error handling patterns

## Testing

Run the test suite:

```bash
npm test
```

---

## Browser Emulator

The browser emulator provides a visual testing environment for BruceJS scripts with emulated hardware devices:

### 🔷 **BLE Device Emulation**
- Emulates BLE devices with `{addr, name, rssi}` properties
- Supports `ble.onDevice(callback)` for receiving device discovery events
- Supports `ble.scan()` to retrieve all discovered devices
- Add random BLE devices or create custom ones

### 📶 **WiFi Network Emulation**
- Emulates WiFi networks with `{ssid, bssid, channel, rssi, security}` properties
- Supports `wifi.onScan(callback)` for receiving network discovery events
- Supports `wifi.scan()` to retrieve all discovered networks
- Add random WiFi networks or create custom ones

### 🎮 **Hardware Button Emulation**
- Emulates hardware buttons (BTN A, BTN B, BTN C)
- Supports `device.onButton(callback)` for all buttons
- Supports `device.onButton("A", callback)` for specific buttons
- Click UI buttons to trigger callbacks in your scripts

## Quick Start

1. Open `index.html` in your browser
2. The emulator will load with some default BLE devices and WiFi networks
3. Click "Load BLE Example" or "Load WiFi Example" to load sample scripts
4. Click "▶️ Run Script" to execute the script
5. Add new devices/networks using the UI buttons to see them detected by your script
6. Click hardware buttons (BTN A/B/C) to test button callbacks

## Supported BruceJS APIs

### BLE Module (`require('ble')`)

```javascript
const ble = require('ble');

// Register callback for device discovery
ble.onDevice(function(device) {
    println('Found: ' + device.name);
    println('Address: ' + device.addr);
    println('RSSI: ' + device.rssi);
});

// Start scanning
ble.scan();

// Stop scanning
ble.stop();
```

### WiFi Module (`require('wifi')`)

```javascript
const wifi = require('wifi');

// Register callback for network discovery
wifi.onScan(function(network) {
    println('SSID: ' + network.ssid);
    println('BSSID: ' + network.bssid);
    println('Channel: ' + network.channel);
    println('RSSI: ' + network.rssi);
    println('Security: ' + network.security);
});

// Start scanning
wifi.scan();

// Stop scanning
wifi.stop();
```

### Device Module (`require('device')`)

```javascript
const device = require('device');

// Register callback for all buttons
device.onButton(function(button) {
    println('Button pressed: ' + button);
});

// Register callback for specific button
device.onButton("A", function(button) {
    println('Button A pressed!');
});
```

## Example Scripts

### BLE Tracker (`ble_tracker.js`)

A complete BLE device tracker that:
- Monitors for BLE devices
- Tracks discovered devices
- Estimates distance based on RSSI
- Shows device updates

### WiFi Tracker (`wifi_tracker.js`)

A complete WiFi network tracker that:
- Monitors for WiFi networks
- Tracks discovered networks
- Analyzes signal strength
- Identifies security vulnerabilities

## Testing Your Own Scripts

1. Write your BruceJS script in the script editor
2. Use the provided modules: `ble`, `wifi`, `device`
3. Use `println()` or `print()` to output to the console
4. Click "Run Script" to execute
5. Use the UI to add devices/networks and press buttons
6. Monitor the console output for results

## Architecture

- **index.html** - Main UI and layout
- **emulator.js** - Core emulation engine and API implementation
- **ble_tracker.js** - Example BLE tracking script
- **wifi_tracker.js** - Example WiFi tracking script

## Browser Compatibility

Works in all modern browsers that support ES6:
- Chrome/Edge 51+
- Firefox 54+
- Safari 10+

## Goals

✅ Full BLE device emulation with callbacks  
✅ Full WiFi network emulation with callbacks  
✅ Hardware button emulation  
✅ Support for ble_tracker.js and wifi_tracker.js scripts  
✅ Browser-based testing environment  

## Future Enhancements

- More BruceJS modules (display, gpio, storage, etc.)
- Save/load scripts from files
- Export console logs
- Advanced device simulation features
- Timing control for device discovery

## License

MIT License - Feel free to use and modify!
