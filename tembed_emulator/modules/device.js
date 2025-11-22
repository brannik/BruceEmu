/**
 * Device Module - Provides device information APIs for Bruce scripts
 */

window.DeviceModule = (function() {
    
    // Get device info
    function getInfo() {
        return {
            name: 'Bruce T-Embed Emulator',
            model: 'T-Embed',
            type: 'emulator',
            version: '1.0.0',
            platform: 'web'
        };
    }
    
    // Get battery level (simulated)
    function getBatteryLevel() {
        // Return a simulated battery level
        return 85;
    }
    
    // Check if charging (simulated)
    function isCharging() {
        return false;
    }
    
    // Get device ID
    function getDeviceId() {
        // Generate or retrieve a persistent device ID
        let deviceId = localStorage.getItem('bruce_device_id');
        if (!deviceId) {
            deviceId = 'emu_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('bruce_device_id', deviceId);
        }
        return deviceId;
    }
    
    // Get MAC address (simulated)
    function getMacAddress() {
        return 'AA:BB:CC:DD:EE:FF';
    }
    
    // Vibrate device (simulated)
    function vibrate(duration = 100) {
        console.log(`[DEVICE] Vibrate for ${duration}ms`);
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }
    
    // Get uptime (simulated)
    let startTime = Date.now();
    function getUptime() {
        return Math.floor((Date.now() - startTime) / 1000);
    }
    
    // Get free memory (simulated)
    function getFreeMemory() {
        // Return simulated free memory in KB
        return 128000;
    }
    
    // Get system time
    function getTime() {
        return Date.now();
    }
    
    // Delay/sleep function
    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // API for Bruce scripts
    const api = {
        getInfo: getInfo,
        info: getInfo,
        getBatteryLevel: getBatteryLevel,
        battery: getBatteryLevel,
        isCharging: isCharging,
        charging: isCharging,
        getDeviceId: getDeviceId,
        id: getDeviceId,
        getMacAddress: getMacAddress,
        mac: getMacAddress,
        vibrate: vibrate,
        getUptime: getUptime,
        uptime: getUptime,
        getFreeMemory: getFreeMemory,
        memory: getFreeMemory,
        getTime: getTime,
        time: getTime,
        delay: delay,
        sleep: delay
    };
    
    return {
        api: api
    };
})();
