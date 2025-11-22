/**
 * BLE Module - Provides Bluetooth Low Energy scanning APIs for Bruce scripts
 * Supports both promise and callback based APIs
 */

window.BLEModule = (function() {
    
    let scanning = false;
    let scanCallback = null;
    let foundDevices = new Map();
    
    // Simulated BLE devices for emulation
    const SIMULATED_DEVICES = [
        { address: '11:22:33:44:55:66', name: 'Bruce Device 1', rssi: -45, type: 'BLE' },
        { address: '22:33:44:55:66:77', name: 'Fitness Tracker', rssi: -67, type: 'BLE' },
        { address: '33:44:55:66:77:88', name: 'Smart Watch', rssi: -52, type: 'BLE' },
        { address: '44:55:66:77:88:99', name: 'Headphones', rssi: -78, type: 'BLE' },
        { address: 'AA:BB:CC:DD:EE:FF', name: 'Phone', rssi: -35, type: 'BLE' }
    ];
    
    // Start BLE scan with callback
    function startScan(callback, duration = 10000) {
        if (scanning) {
            console.warn('[BLE] Scan already in progress');
            return false;
        }
        
        scanning = true;
        scanCallback = callback;
        foundDevices.clear();
        
        console.log('[BLE] Starting scan...');
        
        // Simulate finding devices
        let deviceIndex = 0;
        const scanInterval = setInterval(() => {
            if (!scanning) {
                clearInterval(scanInterval);
                return;
            }
            
            if (deviceIndex < SIMULATED_DEVICES.length) {
                const device = { ...SIMULATED_DEVICES[deviceIndex] };
                // Add some randomness to RSSI
                device.rssi += Math.floor(Math.random() * 10 - 5);
                
                foundDevices.set(device.address, device);
                
                if (scanCallback) {
                    scanCallback(device);
                }
                
                console.log(`[BLE] Found device: ${device.name} (${device.address}) RSSI: ${device.rssi}`);
                deviceIndex++;
            }
        }, 1000);
        
        // Auto-stop after duration
        if (duration > 0) {
            setTimeout(() => {
                stopScan();
                clearInterval(scanInterval);
            }, duration);
        }
        
        return true;
    }
    
    // Stop BLE scan
    function stopScan() {
        if (!scanning) {
            return false;
        }
        
        scanning = false;
        scanCallback = null;
        console.log('[BLE] Scan stopped');
        return true;
    }
    
    // Get scan results
    function getScanResults() {
        return Array.from(foundDevices.values());
    }
    
    // Scan with promise (returns all devices after duration)
    async function scan(duration = 10000) {
        return new Promise((resolve) => {
            const devices = [];
            
            startScan((device) => {
                devices.push(device);
            }, duration);
            
            setTimeout(() => {
                stopScan();
                resolve(devices);
            }, duration);
        });
    }
    
    // Check if scanning
    function isScanning() {
        return scanning;
    }
    
    // Clear found devices
    function clearDevices() {
        foundDevices.clear();
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
        clear: clearDevices,
        
        // Promise-based API
        scan: scan,
        
        // Properties
        enabled: true
    };
    
    return {
        api: api
    };
})();
