// BLE Tracker Script
// Example script demonstrating BLE scanning functionality

console.log('=== BLE Tracker Started ===');

// Clear display and show title
display.clear();
display.print('BLE Tracker', 10, 10, '#00FF00', 16);
display.print('Scanning for devices...', 10, 40, '#FFFFFF', 12);

let devices = [];
let selectedIndex = 0;

// Function to update display
function updateDisplay() {
    display.clear();
    display.print('BLE Tracker', 10, 10, '#00FF00', 16);
    display.drawLine(0, 30, 320, 30, '#00FF00', 2);
    
    if (devices.length === 0) {
        display.print('No devices found yet...', 10, 50, '#FFFF00', 12);
        display.print('Press OK to scan', 10, 80, '#FFFFFF', 12);
    } else {
        display.print(`Devices: ${devices.length}`, 10, 40, '#FFFFFF', 12);
        
        // Display devices list
        let y = 60;
        devices.slice(0, 8).forEach((device, index) => {
            const color = index === selectedIndex ? '#FFFF00' : '#FFFFFF';
            const prefix = index === selectedIndex ? '> ' : '  ';
            
            display.print(
                `${prefix}${device.name}`,
                10, y, color, 11
            );
            display.print(
                `${device.rssi} dBm`,
                200, y, color, 11
            );
            
            y += 18;
        });
        
        // Instructions
        display.print('UP/DOWN: Navigate', 10, 220, '#888888', 10);
        display.print('OK: Rescan', 200, 220, '#888888', 10);
    }
}

// Function to scan for BLE devices
async function scanDevices() {
    display.clear();
    display.print('Scanning BLE...', 10, 110, '#FFFF00', 14);
    
    devices = [];
    notification.info('BLE Scan', 'Starting scan...');
    
    // Scan with callback for real-time updates
    await ble.scanWithCallback((device) => {
        console.log(`Device found: ${device.name} - ${device.rssi} dBm`);
    }, 5000);
    
    // Get all discovered devices
    devices = ble.getDevices();
    
    // Sort by RSSI (signal strength)
    devices.sort((a, b) => b.rssi - a.rssi);
    
    notification.success('BLE Scan', `Found ${devices.length} devices`);
    selectedIndex = 0;
    updateDisplay();
}

// Register button handlers
registerButtonHandler('up', () => {
    if (devices.length > 0 && selectedIndex > 0) {
        selectedIndex--;
        device.beep(440, 50);
        updateDisplay();
    }
});

registerButtonHandler('down', () => {
    if (devices.length > 0 && selectedIndex < devices.length - 1) {
        selectedIndex++;
        device.beep(440, 50);
        updateDisplay();
    }
});

registerButtonHandler('ok', () => {
    device.beep(880, 100);
    scanDevices();
});

registerButtonHandler('back', () => {
    notification.info('BLE Tracker', 'Exiting...');
    display.clear();
    display.print('BLE Tracker Stopped', 10, 110, '#FF0000', 14);
});

// Initial display
updateDisplay();

// Auto-start scan after a short delay
await delay(1000);
await scanDevices();
