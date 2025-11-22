// BLE Tracker Script for BruceJS
// This script demonstrates BLE device scanning and tracking

const ble = require('ble');

println('=== BLE Tracker v1.0 ===');
println('Starting BLE device tracker...');

// Keep track of discovered devices
const discoveredDevices = {};

// Register callback for discovered devices
ble.onDevice(function(device) {
    const addr = device.addr;
    
    // Check if this is a new device or an update
    if (!discoveredDevices[addr]) {
        discoveredDevices[addr] = device;
        println('');
        println('📱 NEW BLE Device Discovered!');
        println('  Name: ' + device.name);
        println('  Address: ' + addr);
        println('  RSSI: ' + device.rssi + ' dBm');
        
        // Calculate approximate distance based on RSSI
        let distance = 'Unknown';
        if (device.rssi > -50) {
            distance = 'Very Close (< 1m)';
        } else if (device.rssi > -70) {
            distance = 'Close (1-5m)';
        } else if (device.rssi > -85) {
            distance = 'Medium (5-10m)';
        } else {
            distance = 'Far (> 10m)';
        }
        println('  Approximate Distance: ' + distance);
        println('---');
    } else {
        // Update existing device
        discoveredDevices[addr] = device;
        println('[UPDATE] ' + device.name + ' (' + addr + ') RSSI: ' + device.rssi);
    }
});

// Start BLE scanning
println('');
println('Starting BLE scan...');
ble.scan();

println('Scan active. Listening for BLE devices...');
println('Add new devices using the UI to see them appear here.');
println('');
