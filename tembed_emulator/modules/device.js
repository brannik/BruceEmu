// Device Module - Provides device information and control API
class DeviceModule {
    constructor() {
        this.deviceInfo = {
            model: 'Bruce Emulator',
            version: '1.0.0',
            platform: 'web',
            manufacturer: 'BruceEmu'
        };
        this.audioContext = null;
    }
    
    // Get device information
    getInfo() {
        return { ...this.deviceInfo };
    }
    
    // Get device model
    getModel() {
        return this.deviceInfo.model;
    }
    
    // Get firmware version
    getVersion() {
        return this.deviceInfo.version;
    }
    
    // Get platform
    getPlatform() {
        return this.deviceInfo.platform;
    }
    
    // Get battery level (simulated)
    getBatteryLevel() {
        // Return random battery level for simulation
        return Math.floor(Math.random() * 100);
    }
    
    // Check if charging (simulated)
    isCharging() {
        // Random charging status for simulation
        return Math.random() > 0.5;
    }
    
    // Vibrate device (if supported)
    vibrate(duration = 200) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
            return true;
        }
        return false;
    }
    
    // Play beep sound (simulated)
    beep(frequency = 440, duration = 200) {
        try {
            // Reuse audio context
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
            
            return true;
        } catch (error) {
            console.error('Beep error:', error);
            return false;
        }
    }
    
    // Get current time
    getTime() {
        return Date.now();
    }
    
    // Get formatted date/time
    getDateTime() {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes(),
            second: now.getSeconds(),
            timestamp: now.getTime()
        };
    }
    
    // Sleep/delay
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Get random number
    random(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
