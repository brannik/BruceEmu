// Notification Module - Provides notification API
class NotificationModule {
    constructor(emulator) {
        this.emulator = emulator;
        this.notifications = [];
    }
    
    // Show notification
    show(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date()
        };
        
        this.notifications.push(notification);
        this.emulator.log(`NOTIFICATION [${type}]: ${title} - ${message}`, type);
        
        // Use browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: this.getIconForType(type)
            });
        }
        
        return notification.id;
    }
    
    // Show info notification
    info(title, message) {
        return this.show(title, message, 'info');
    }
    
    // Show success notification
    success(title, message) {
        return this.show(title, message, 'success');
    }
    
    // Show warning notification
    warning(title, message) {
        return this.show(title, message, 'warn');
    }
    
    // Show error notification
    error(title, message) {
        return this.show(title, message, 'error');
    }
    
    // Clear notification by ID
    clear(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }
    
    // Clear all notifications
    clearAll() {
        this.notifications = [];
    }
    
    // Get all notifications
    getAll() {
        return [...this.notifications];
    }
    
    // Request notification permission
    async requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }
    
    getIconForType(type) {
        // Return appropriate icon based on type
        // In a real implementation, these would be actual icon URLs
        return '';
    }
}
