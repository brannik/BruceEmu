# tembed_emulator

A web-based emulator for Bruce JS interpreter scripts with a complete GUI, module system, and example scripts.

## Features

- **320x240 Display**: Canvas scaled up for better visibility with pixelated rendering
- **Virtual Buttons**: Interactive UI buttons (UP, DOWN, LEFT, RIGHT, OK, BACK)
- **Keyboard Support**: Arrow keys, Enter, and Escape for navigation
- **Console Log**: Real-time logging with color-coded message types
- **Script Loading**: Dynamic script loading and execution
- **Module System**: Complete API modules for device interaction

## Getting Started

### Running the Emulator

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Select a script from the dropdown menu
3. Click "Load & Run" to execute the script
4. Use virtual buttons or keyboard to interact
5. Click "Stop" to terminate the running script

### Keyboard Controls

- **Arrow Keys**: UP, DOWN, LEFT, RIGHT navigation
- **Enter**: OK button
- **Escape**: BACK button

## Available Modules

### display
Canvas manipulation and drawing:
```javascript
display.clear();
display.print('Hello', 10, 20, '#FFFFFF', 14);
display.drawRect(10, 10, 100, 50, '#00FF00', true);
display.drawCircle(160, 120, 30, '#FF0000', false);
display.drawLine(0, 0, 320, 240, '#FFFF00', 2);
```

### dialog
User interaction:
```javascript
await dialog.alert('Title', 'Message');
const result = await dialog.confirm('Title', 'Question?');
const input = await dialog.prompt('Title', 'Enter value:', 'default');
const choice = await dialog.choice('Title', ['Option 1', 'Option 2', 'Option 3']);
```

### notification
System notifications:
```javascript
notification.info('Title', 'Info message');
notification.success('Title', 'Success message');
notification.warning('Title', 'Warning message');
notification.error('Title', 'Error message');
```

### storage
Persistent data storage:
```javascript
storage.set('key', { data: 'value' });
const data = storage.get('key', defaultValue);
storage.remove('key');
storage.clear();
```

### device
Device information and control:
```javascript
const info = device.getInfo();
const battery = device.getBatteryLevel();
device.vibrate(200);
device.beep(440, 200);
const time = device.getDateTime();
```

### ble
Bluetooth Low Energy scanning:
```javascript
// Promise-based scanning
const devices = await ble.scan(5000);

// Callback-based scanning
await ble.scanWithCallback((device) => {
    console.log('Found:', device.name, device.rssi);
}, 5000);

// Device operations
await ble.connect(deviceId);
const data = await ble.readCharacteristic(deviceId, serviceUUID, charUUID);
await ble.writeCharacteristic(deviceId, serviceUUID, charUUID, data);
```

### wifi
WiFi network scanning:
```javascript
// Promise-based scanning
const networks = await wifi.scan(5000);

// Callback-based scanning
await wifi.scanWithCallback((network) => {
    console.log('Found:', network.ssid, network.rssi);
}, 5000);

// Network operations
await wifi.connect('SSID', 'password');
const connected = wifi.isConnected();
const ip = wifi.getIPAddress();
```

## Creating Scripts

Scripts should be placed in the `scripts/` directory and follow this structure:

```javascript
// Initialize display
display.clear();
display.print('My Script', 10, 20, '#00FF00', 16);

// Register button handlers
registerButtonHandler('ok', () => {
    console.log('OK pressed');
});

registerButtonHandler('back', () => {
    console.log('Back pressed');
});

// Use async operations
await delay(1000);

// Use module APIs
const devices = await ble.scan(5000);
console.log(`Found ${devices.length} devices`);
```

## Example Scripts

### ble_tracker.js
Demonstrates BLE scanning with:
- Real-time device discovery
- Interactive list navigation
- Signal strength display
- Rescan capability

### wifi_tracker.js
Demonstrates WiFi scanning with:
- Real-time network discovery
- Security indicators
- Signal strength bars
- Detailed network information view

## API Reference

### Button Handler Registration
```javascript
registerButtonHandler(key, handler);
// Keys: 'up', 'down', 'left', 'right', 'ok', 'back'
```

### Delay Function
```javascript
await delay(milliseconds);
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Supported with touch controls

## Development

### File Structure
```
tembed_emulator/
├── index.html          # Main HTML page
├── style.css           # UI styling
├── emulator.js         # Emulator controller
├── bruce_runtime.js    # Script execution sandbox
├── modules/           # API modules
│   ├── display.js
│   ├── dialog.js
│   ├── notification.js
│   ├── storage.js
│   ├── device.js
│   ├── ble.js
│   └── wifi.js
└── scripts/           # Example scripts
    ├── ble_tracker.js
    └── wifi_tracker.js
```

### Adding New Scripts

1. Create a new `.js` file in the `scripts/` directory
2. Implement your script using the available modules
3. The script will automatically appear in the script selector

### Adding New Modules

1. Create a new module class in `modules/`
2. Add it to `index.html` script includes
3. Initialize it in `bruce_runtime.js`
4. Pass it to scripts in the `executeScript` function

## Troubleshooting

### Script not loading
- Check browser console for errors
- Ensure script syntax is valid JavaScript
- Verify all required modules are loaded

### Display not updating
- Call `display.clear()` before drawing
- Check that coordinates are within 0-319 (x) and 0-239 (y)

### Buttons not responding
- Ensure button handlers are registered with `registerButtonHandler()`
- Check that the script is running (not stopped)

## License

Part of the BruceEmu project.
