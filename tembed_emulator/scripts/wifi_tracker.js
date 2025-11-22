/**
 * WiFi Scanner Script
 * Scans for WiFi networks and displays them
 */

console.log('Starting WiFi Scanner...');

// Clear display
display.clear('#000000');

// Draw title
display.drawText('WiFi Scanner', 75, 10, '#00ffff', 16);
display.drawLine(10, 35, 310, 35, '#00ffff');

// Status
let scanStatus = 'Initializing...';
let networkList = [];
let selectedIndex = 0;

// Display update function
function updateDisplay() {
    // Clear main area
    display.fillRect(0, 40, 320, 200, '#000000');
    
    // Draw status
    display.drawText(`Status: ${scanStatus}`, 10, 45, '#ffff00', 12);
    
    // Draw network count
    display.drawText(`Networks: ${networkList.length}`, 200, 45, '#ffffff', 12);
    
    // Draw network list
    const startY = 70;
    const lineHeight = 22;
    const maxVisible = 6;
    
    for (let i = 0; i < Math.min(networkList.length, maxVisible); i++) {
        const network = networkList[i];
        const y = startY + (i * lineHeight);
        const color = i === selectedIndex ? '#00ffff' : '#ffffff';
        
        // Network SSID
        const ssid = network.hidden ? '[Hidden]' : (network.ssid || 'Unknown');
        display.drawText(ssid.substring(0, 18), 15, y, color, 11);
        
        // Security indicator
        const securityStr = network.encryption.substring(0, 4);
        display.drawText(securityStr, 190, y, color, 10);
        
        // RSSI and channel
        const rssiStr = `${network.rssi}`;
        display.drawText(rssiStr, 235, y, color, 10);
        
        const chStr = `CH${network.channel}`;
        display.drawText(chStr, 275, y, color, 10);
    }
    
    // Draw scroll indicator if needed
    if (networkList.length > maxVisible) {
        display.drawText('...', 150, startY + (maxVisible * lineHeight), '#888888', 11);
    }
    
    // Draw legend
    display.drawText('SSID', 15, 220, '#888888', 9);
    display.drawText('SEC', 190, 220, '#888888', 9);
    display.drawText('RSSI', 235, 220, '#888888', 9);
    display.drawText('CH', 275, 220, '#888888', 9);
    
    // Draw border
    display.drawRect(5, 40, 310, 195, '#00ffff', false);
}

// Handle button events
window.addEventListener('bruceButton', (event) => {
    const key = event.detail.key;
    
    if (key === 'up' && selectedIndex > 0) {
        selectedIndex--;
        updateDisplay();
    } else if (key === 'down' && selectedIndex < networkList.length - 1) {
        selectedIndex++;
        updateDisplay();
    } else if (key === 'ok' && networkList.length > 0) {
        const network = networkList[selectedIndex];
        const ssid = network.hidden ? '[Hidden Network]' : network.ssid;
        notification.show('Network Info', 
            `${ssid}\n` +
            `BSSID: ${network.bssid}\n` +
            `RSSI: ${network.rssi}dBm\n` +
            `Channel: ${network.channel}\n` +
            `Security: ${network.encryption}`
        );
    } else if (key === 'menu') {
        // Rescan
        scanStatus = 'Rescanning...';
        networkList = [];
        selectedIndex = 0;
        updateDisplay();
        startScan();
    }
});

// Start WiFi scan
async function startScan() {
    console.log('Starting WiFi scan...');
    scanStatus = 'Scanning...';
    updateDisplay();
    
    wifi.startScan((network) => {
        // Check if network already exists
        const existingIndex = networkList.findIndex(n => n.bssid === network.bssid);
        
        if (existingIndex >= 0) {
            // Update existing network
            networkList[existingIndex] = network;
        } else {
            // Add new network
            networkList.push(network);
            // Sort by RSSI (strongest first)
            networkList.sort((a, b) => b.rssi - a.rssi);
        }
        
        updateDisplay();
    }, 8000); // Scan for 8 seconds
    
    // Wait for scan to complete
    await device.delay(8000);
    
    scanStatus = 'Scan Complete';
    updateDisplay();
    
    console.log(`WiFi scan complete. Found ${networkList.length} networks.`);
}

// Initial display
updateDisplay();

// Start initial scan
await startScan();

// Display instructions
display.drawText('Press MENU to rescan', 70, 205, '#888888', 10);

// Keep script running to allow interaction
await device.delay(60000);

console.log('WiFi Scanner finished.');
