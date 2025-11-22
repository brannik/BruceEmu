// Storage Module - Provides persistent storage API
class StorageModule {
    constructor() {
        this.prefix = 'bruce_';
    }
    
    // Set item in storage
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serialized);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }
    
    // Get item from storage
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }
    
    // Remove item from storage
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
    
    // Clear all storage
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
    
    // Check if key exists
    has(key) {
        return localStorage.getItem(this.prefix + key) !== null;
    }
    
    // Get all keys
    keys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.substring(this.prefix.length));
    }
    
    // Get storage size
    size() {
        return this.keys().length;
    }
    
    // Get all items as object
    getAll() {
        const result = {};
        this.keys().forEach(key => {
            result[key] = this.get(key);
        });
        return result;
    }
}
