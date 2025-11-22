/**
 * BLE Tracker Script
 * Scans for Bluetooth Low Energy devices and displays them
 */

console.log('Starting BLE Tracker...');

// Clear display
display.clear('#000000');

// Draw title
display.drawText('BLE Tracker', 80, 10, '#00ff00', 16);
display.drawLine(10, 35, 310, 35, '#00ff00');

// Status
let scanStatus = 'Initializing...';
let deviceList = [];
let selectedIndex = 0;

// Display update function
function updateDisplay() {
    // Clear main area
    display.fillRect(0, 40, 320, 200, '#000000');
    
    // Draw status
    display.drawText(`Status: ${scanStatus}`, 10, 45, '#ffff00', 12);
    
    // Draw device count
    display.drawText(`Devices: ${deviceList.length}`, 200, 45, '#ffffff', 12);
    
    // Draw device list
    const startY = 70;
    const lineHeight = 20;
    const maxVisible = 7;
    
    for (let i = 0; i < Math.min(deviceList.length, maxVisible); i++) {
        const device = deviceList[i];
        const y = startY + (i * lineHeight);
        const color = i === selectedIndex ? '#00ff00' : '#ffffff';
        
        // Device name
        const name = device.name || 'Unknown';
        display.drawText(name.substring(0, 20), 15, y, color, 11);
        
        // RSSI indicator
        const rssiStr = `${device.rssi}dBm`;
        display.drawText(rssiStr, 240, y, color, 11);
    }
    
    // Draw scroll indicator if needed
    if (deviceList.length > maxVisible) {
        display.drawText('...', 150, startY + (maxVisible * lineHeight), '#888888', 11);
    }
    
    // Draw border
    display.drawRect(5, 40, 310, 195, '#00ff00', false);
}

// Handle button events
window.addEventListener('bruceButton', (event) => {
    const key = event.detail.key;
    
    if (key === 'up' && selectedIndex > 0) {
        selectedIndex--;
        updateDisplay();
    } else if (key === 'down' && selectedIndex < deviceList.length - 1) {
        selectedIndex++;
        updateDisplay();
    } else if (key === 'ok' && deviceList.length > 0) {
        const device = deviceList[selectedIndex];
        notification.show('Device Selected', `${device.name}\nRSSI: ${device.rssi}dBm\nAddr: ${device.address}`);
    }
});

// Start BLE scan with callback
scanStatus = 'Scanning...';
updateDisplay();

console.log('Starting BLE scan...');

ble.startScan((device) => {
    // Check if device already exists
    const existingIndex = deviceList.findIndex(d => d.address === device.address);
    
    if (existingIndex >= 0) {
        // Update existing device
        deviceList[existingIndex] = device;
    } else {
        // Add new device
        deviceList.push(device);
        // Sort by RSSI (strongest first)
        deviceList.sort((a, b) => b.rssi - a.rssi);
    }
    
    updateDisplay();
}, 15000); // Scan for 15 seconds

// Initial display
updateDisplay();

// Wait for scan to complete
await device.delay(15000);

scanStatus = 'Scan Complete';
updateDisplay();

console.log(`BLE scan complete. Found ${deviceList.length} devices.`);

// Keep script running to allow interaction
await device.delay(30000);

console.log('BLE Tracker finished.');
