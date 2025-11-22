/**
 * WiFi Module - Provides WiFi scanning APIs for Bruce scripts
 * Supports both promise and callback based APIs
 */

window.WiFiModule = (function() {
    
    let scanning = false;
    let scanCallback = null;
    let foundNetworks = new Map();
    
    // Simulated WiFi networks for emulation
    const SIMULATED_NETWORKS = [
        { ssid: 'HomeNetwork', bssid: '00:11:22:33:44:55', rssi: -42, channel: 6, encryption: 'WPA2', hidden: false },
        { ssid: 'Office_WiFi', bssid: '11:22:33:44:55:66', rssi: -56, channel: 11, encryption: 'WPA2', hidden: false },
        { ssid: 'Guest Network', bssid: '22:33:44:55:66:77', rssi: -68, channel: 1, encryption: 'Open', hidden: false },
        { ssid: 'Neighbor_5G', bssid: '33:44:55:66:77:88', rssi: -72, channel: 36, encryption: 'WPA3', hidden: false },
        { ssid: '', bssid: '44:55:66:77:88:99', rssi: -81, channel: 6, encryption: 'WPA2', hidden: true },
        { ssid: 'CoffeeShop', bssid: '55:66:77:88:99:AA', rssi: -75, channel: 11, encryption: 'Open', hidden: false },
        { ssid: 'Bruce_AP', bssid: 'AA:BB:CC:DD:EE:FF', rssi: -38, channel: 1, encryption: 'WPA2', hidden: false }
    ];
    
    // Start WiFi scan with callback
    function startScan(callback, duration = 5000) {
        if (scanning) {
            console.warn('[WiFi] Scan already in progress');
            return false;
        }
        
        scanning = true;
        scanCallback = callback;
        foundNetworks.clear();
        
        console.log('[WiFi] Starting scan...');
        
        // Simulate finding networks
        let networkIndex = 0;
        const scanInterval = setInterval(() => {
            if (!scanning) {
                clearInterval(scanInterval);
                return;
            }
            
            if (networkIndex < SIMULATED_NETWORKS.length) {
                const network = { ...SIMULATED_NETWORKS[networkIndex] };
                // Add some randomness to RSSI
                network.rssi += Math.floor(Math.random() * 10 - 5);
                
                foundNetworks.set(network.bssid, network);
                
                if (scanCallback) {
                    scanCallback(network);
                }
                
                const displayName = network.hidden ? '[Hidden Network]' : network.ssid;
                console.log(`[WiFi] Found network: ${displayName} (${network.bssid}) RSSI: ${network.rssi} CH: ${network.channel}`);
                networkIndex++;
            }
        }, 700);
        
        // Auto-stop after duration
        if (duration > 0) {
            setTimeout(() => {
                stopScan();
                clearInterval(scanInterval);
            }, duration);
        }
        
        return true;
    }
    
    // Stop WiFi scan
    function stopScan() {
        if (!scanning) {
            return false;
        }
        
        scanning = false;
        scanCallback = null;
        console.log('[WiFi] Scan stopped');
        return true;
    }
    
    // Get scan results
    function getScanResults() {
        return Array.from(foundNetworks.values());
    }
    
    // Scan with promise (returns all networks after duration)
    async function scan(duration = 5000) {
        return new Promise((resolve) => {
            const networks = [];
            
            startScan((network) => {
                networks.push(network);
            }, duration);
            
            setTimeout(() => {
                stopScan();
                resolve(networks);
            }, duration);
        });
    }
    
    // Check if scanning
    function isScanning() {
        return scanning;
    }
    
    // Clear found networks
    function clearNetworks() {
        foundNetworks.clear();
    }
    
    // Get connection status (simulated)
    function getStatus() {
        return {
            connected: false,
            ssid: '',
            ip: '0.0.0.0',
            signal: 0
        };
    }
    
    // API for Bruce scripts
    const api = {
        // Callback-based API
        startScan: startScan,
        start: startScan,
        stopScan: stopScan,
        stop: stopScan,
        isScanning: isScanning,
        scanning: isScanning,
        getResults: getScanResults,
        results: getScanResults,
        clear: clearNetworks,
        
        // Promise-based API
        scan: scan,
        
        // Connection API
        getStatus: getStatus,
        status: getStatus,
        
        // Properties
        enabled: true
    };
    
    return {
        api: api
    };
})();
