// WiFi Tracker Script
// Example script demonstrating WiFi scanning functionality

console.log('=== WiFi Tracker Started ===');

// Clear display and show title
display.clear();
display.print('WiFi Scanner', 10, 10, '#0080FF', 16);
display.print('Scanning for networks...', 10, 40, '#FFFFFF', 12);

let networks = [];
let selectedIndex = 0;
let showDetails = false;

// Function to update display
function updateDisplay() {
    display.clear();
    display.print('WiFi Scanner', 10, 10, '#0080FF', 16);
    display.drawLine(0, 30, 320, 30, '#0080FF', 2);
    
    if (networks.length === 0) {
        display.print('No networks found yet...', 10, 50, '#FFFF00', 12);
        display.print('Press OK to scan', 10, 80, '#FFFFFF', 12);
    } else if (!showDetails) {
        display.print(`Networks: ${networks.length}`, 10, 40, '#FFFFFF', 12);
        
        // Display networks list
        let y = 60;
        networks.slice(0, 8).forEach((network, index) => {
            const color = index === selectedIndex ? '#FFFF00' : '#FFFFFF';
            const prefix = index === selectedIndex ? '> ' : '  ';
            
            // Security indicator
            const secIcon = network.security === 'OPEN' ? '' : '[S]';
            
            display.print(
                `${prefix}${secIcon}${network.ssid}`,
                10, y, color, 11
            );
            
            // Signal strength bars
            const bars = getSignalBars(network.rssi);
            display.print(
                bars,
                250, y, color, 11
            );
            
            y += 18;
        });
        
        // Instructions
        display.print('UP/DOWN: Select', 10, 220, '#888888', 10);
        display.print('RIGHT: Details | OK: Rescan', 130, 220, '#888888', 10);
    } else {
        // Show details of selected network
        const network = networks[selectedIndex];
        
        display.print('Network Details', 10, 40, '#0080FF', 14);
        display.drawLine(0, 58, 320, 58, '#0080FF', 1);
        
        display.print(`SSID: ${network.ssid}`, 10, 75, '#FFFFFF', 11);
        display.print(`BSSID: ${network.bssid}`, 10, 95, '#FFFFFF', 11);
        display.print(`Channel: ${network.channel}`, 10, 115, '#FFFFFF', 11);
        display.print(`Security: ${network.security}`, 10, 135, '#FFFFFF', 11);
        display.print(`Signal: ${network.rssi} dBm`, 10, 155, '#FFFFFF', 11);
        
        // Signal quality
        const quality = getSignalQuality(network.rssi);
        const qualityColor = quality > 70 ? '#00FF00' : quality > 40 ? '#FFFF00' : '#FF0000';
        display.print(`Quality: ${quality}%`, 10, 175, qualityColor, 11);
        
        display.print('LEFT: Back to list', 10, 220, '#888888', 10);
    }
}

// Get signal bars representation
function getSignalBars(rssi) {
    if (rssi > -50) return '▂▄▆█';
    if (rssi > -60) return '▂▄▆';
    if (rssi > -70) return '▂▄';
    if (rssi > -80) return '▂';
    return '';
}

// Calculate signal quality percentage
function getSignalQuality(rssi) {
    const quality = Math.min(100, Math.max(0, (rssi + 100) * 2));
    return Math.round(quality);
}

// Function to scan for WiFi networks
async function scanNetworks() {
    display.clear();
    display.print('Scanning WiFi...', 10, 110, '#FFFF00', 14);
    
    networks = [];
    notification.info('WiFi Scan', 'Starting scan...');
    
    // Scan with callback for real-time updates
    await wifi.scanWithCallback((network) => {
        console.log(`Network found: ${network.ssid} - Ch:${network.channel} - ${network.rssi} dBm`);
    }, 5000);
    
    // Get all discovered networks
    networks = wifi.getNetworks();
    
    // Sort by RSSI (signal strength)
    networks.sort((a, b) => b.rssi - a.rssi);
    
    notification.success('WiFi Scan', `Found ${networks.length} networks`);
    selectedIndex = 0;
    showDetails = false;
    updateDisplay();
}

// Register button handlers
registerButtonHandler('up', () => {
    if (!showDetails && networks.length > 0 && selectedIndex > 0) {
        selectedIndex--;
        device.beep(440, 50);
        updateDisplay();
    }
});

registerButtonHandler('down', () => {
    if (!showDetails && networks.length > 0 && selectedIndex < networks.length - 1) {
        selectedIndex++;
        device.beep(440, 50);
        updateDisplay();
    }
});

registerButtonHandler('right', () => {
    if (!showDetails && networks.length > 0) {
        showDetails = true;
        device.beep(660, 80);
        updateDisplay();
    }
});

registerButtonHandler('left', () => {
    if (showDetails) {
        showDetails = false;
        device.beep(440, 80);
        updateDisplay();
    }
});

registerButtonHandler('ok', () => {
    device.beep(880, 100);
    scanNetworks();
});

registerButtonHandler('back', () => {
    notification.info('WiFi Scanner', 'Exiting...');
    display.clear();
    display.print('WiFi Scanner Stopped', 10, 110, '#FF0000', 14);
});

// Initial display
updateDisplay();

// Auto-start scan after a short delay
await delay(1000);
await scanNetworks();
