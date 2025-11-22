/**
 * Notification Module - Provides notification APIs for Bruce scripts
 */

window.NotificationModule = (function() {
    
    // Show notification
    function showNotification(title, message, duration = 3000) {
        console.log(`[NOTIFICATION] ${title}: ${message}`);
        
        // Try to use browser notifications if available
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="50">📱</text></svg>'
            });
        } else {
            // Fallback to console
            console.log(`📱 ${title}: ${message}`);
        }
        
        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                console.log(`[NOTIFICATION DISMISSED] ${title}`);
            }, duration);
        }
    }
    
    // Request notification permission
    async function requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }
    
    // Show toast message
    function showToast(message, duration = 2000) {
        showNotification('Info', message, duration);
    }
    
    // API for Bruce scripts
    const api = {
        show: showNotification,
        showNotification: showNotification,
        toast: showToast,
        showToast: showToast,
        requestPermission: requestPermission
    };
    
    return {
        api: api
    };
})();
