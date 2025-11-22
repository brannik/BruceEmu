// WiFi Tracker Script for BruceJS
// This script demonstrates WiFi network scanning and tracking

const wifi = require('wifi');

println('=== WiFi Tracker v1.0 ===');
println('Starting WiFi network tracker...');

// Keep track of discovered networks
const discoveredNetworks = {};
let totalNetworks = 0;

// Register callback for discovered networks
wifi.onScan(function(network) {
    const bssid = network.bssid;
    
    // Check if this is a new network or an update
    if (!discoveredNetworks[bssid]) {
        discoveredNetworks[bssid] = network;
        totalNetworks++;
        
        println('');
        println('📶 NEW WiFi Network Discovered! (#' + totalNetworks + ')');
        println('  SSID: ' + network.ssid);
        println('  BSSID: ' + bssid);
        println('  Channel: ' + network.channel);
        println('  RSSI: ' + network.rssi + ' dBm');
        println('  Security: ' + network.security);
        
        // Calculate signal strength
        let strength = 'Unknown';
        if (network.rssi > -50) {
            strength = 'Excellent';
        } else if (network.rssi > -60) {
            strength = 'Good';
        } else if (network.rssi > -70) {
            strength = 'Fair';
        } else {
            strength = 'Weak';
        }
        println('  Signal Strength: ' + strength);
        
        // Security analysis
        if (network.security === 'Open') {
            println('  ⚠️  WARNING: Open network (no encryption)');
        } else if (network.security === 'WEP') {
            println('  ⚠️  WARNING: Weak security (WEP)');
        }
        
        println('---');
    } else {
        // Update existing network
        discoveredNetworks[bssid] = network;
        println('[UPDATE] ' + network.ssid + ' (Ch:' + network.channel + ') RSSI: ' + network.rssi);
    }
});

// Start WiFi scanning
println('');
println('Starting WiFi scan...');
wifi.scan();

println('Scan active. Listening for WiFi networks...');
println('Add new networks using the UI to see them appear here.');
println('');
