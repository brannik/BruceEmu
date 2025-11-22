# BruceEmu
Emulator for bruce js interpreter scripts

## Overview

BruceEmu is a browser-based emulator for the Bruce JavaScript interpreter, providing a complete set of modules to simulate embedded device functionality including display, storage, dialogs, notifications, BLE, WiFi, and device controls.

## Modules

### display.js
Display module for rendering text on a canvas.

**API:**
- `clear()` - Clears the display
- `print(x, y, text, wrap)` - Prints text at position (x,y), optionally with word wrap
- `cursor` - Get/set cursor position `{x, y}`
- `render()` - Re-renders all buffered content

**Example:**
```javascript
display.clear();
display.print(10, 20, 'Hello World!');
display.print(5, 35, 'This text wraps around', true);
console.log(display.cursor); // {x: 5, y: 35}
```

### dialog.js
Dialog module for showing modal messages.

**API:**
- `message({title, message, buttons})` - Shows a dialog and returns a Promise that resolves to the button index

**Example:**
```javascript
const result = await dialog.message({
  title: 'Confirm',
  message: 'Are you sure?',
  buttons: ['Yes', 'No']
});
console.log('Selected:', result); // 0 for Yes, 1 for No
```

### notification.js
Notification module for vibration effects.

**API:**
- `vibrate(ms)` - Triggers vibration for specified milliseconds (uses browser vibration API + visual feedback)

**Example:**
```javascript
notification.vibrate(500); // Vibrate for 500ms
```

### storage.js
Storage module that maps filesystem operations to localStorage.

**API:**
- `open({fs, path, mode})` - Opens a file, returns file handle
  - `fs`: filesystem name (e.g., "sd")
  - `path`: file path
  - `mode`: "r" (read), "w" (write), "a" (append), "r+" (read/write)
- File handle methods:
  - `read(length)` - Read bytes from file
  - `readAll()` - Read entire file
  - `write(data)` - Write data to file
  - `close()` - Close file handle
  - `seek(position)` - Set file position
- `list(fs, prefix)` - List files
- `remove(fs, path)` - Delete file
- `exists(fs, path)` - Check if file exists

**Example:**
```javascript
// Write file
const file = storage.open({fs: 'sd', path: '/data.txt', mode: 'w'});
file.write('Hello World');
file.close();

// Read file
const file2 = storage.open({fs: 'sd', path: '/data.txt', mode: 'r'});
const content = file2.readAll();
file2.close();
console.log(content); // 'Hello World'
```

### device.js
Device module for hardware interaction.

**API:**
- `bleScan(options)` - Scans for BLE devices
- `wifiScan(options)` - Scans for WiFi networks
- `onButton(name, callback)` - Registers a button handler

**Example:**
```javascript
// Add button
device.onButton('OK', () => {
  console.log('OK button pressed');
});

// Scan
const bleDevices = await device.bleScan({duration: 5000});
const wifiNetworks = await device.wifiScan({duration: 3000});
```

### ble.js
BLE module for Bluetooth Low Energy operations.

**API:**
- `scan(options)` - Scan for BLE devices
  - `duration`: scan duration in ms
  - `filters`: scan filters
  - `onDevice`: callback for each device found
- `injectFake(deviceInfo)` - Inject fake device for testing
- `clearFakes()` - Clear all fake devices
- `getDevices()` - Get scanned devices
- `isScanning()` - Check if currently scanning

**Example:**
```javascript
ble.injectFake({
  name: 'Test Device',
  rssi: -60,
  services: ['battery_service']
});

const devices = await ble.scan({
  duration: 5000,
  onDevice: (device) => console.log('Found:', device.name)
});
```

### wifi.js
WiFi module for network scanning.

**API:**
- `scan(options)` - Scan for WiFi networks
  - `duration`: scan duration in ms
  - `onNetwork`: callback for each network found
- `injectFake(networkInfo)` - Inject fake network for testing
- `clearFakes()` - Clear all fake networks
- `getNetworks()` - Get scanned networks
- `isScanning()` - Check if currently scanning

**Example:**
```javascript
wifi.injectFake({
  ssid: 'TestNetwork',
  rssi: -50,
  channel: 6,
  encryption: 'WPA2'
});

const networks = await wifi.scan({
  duration: 3000,
  onNetwork: (net) => console.log('Found:', net.ssid)
});
```

## Usage

Open `index.html` in a web browser to see the interactive demo of all modules.

All modules are available globally and can be used directly in your scripts:

```javascript
// Display text
display.clear();
display.print(10, 20, 'Bruce is running!');

// Show dialog
const choice = await dialog.message({
  title: 'Question',
  message: 'Continue?',
  buttons: ['Yes', 'No']
});

// Save data
const f = storage.open({fs: 'sd', path: '/config.txt', mode: 'w'});
f.write('setting=value');
f.close();

// Scan for devices
const devices = await device.bleScan({duration: 5000});
console.log(`Found ${devices.length} BLE devices`);
```

## Testing

The emulator includes an interactive test page (`index.html`) that demonstrates all module functionality. Open it in a browser to:

- Test display rendering
- Show dialogs
- Trigger vibrations
- Read/write files
- Inject and scan fake BLE devices
- Inject and scan fake WiFi networks
- Register button handlers

## Browser Compatibility

- Modern browsers with ES6 support
- Canvas API for display rendering
- localStorage for storage module
- Web Bluetooth API (optional, for real BLE scanning)
- Vibration API (optional, falls back to visual feedback)

## License

ISC
