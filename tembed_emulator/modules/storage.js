/**
 * Storage Module - Provides persistent storage APIs for Bruce scripts
 */

window.StorageModule = (function() {
    const STORAGE_PREFIX = 'bruce_';
    
    // Save data to storage
    function save(key, value) {
        try {
            const storageKey = STORAGE_PREFIX + key;
            const serialized = JSON.stringify(value);
            localStorage.setItem(storageKey, serialized);
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    }
    
    // Load data from storage
    function load(key, defaultValue = null) {
        try {
            const storageKey = STORAGE_PREFIX + key;
            const serialized = localStorage.getItem(storageKey);
            if (serialized === null) {
                return defaultValue;
            }
            return JSON.parse(serialized);
        } catch (e) {
            console.error('Storage load error:', e);
            return defaultValue;
        }
    }
    
    // Remove data from storage
    function remove(key) {
        try {
            const storageKey = STORAGE_PREFIX + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
    
    // Clear all storage
    function clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
    
    // Check if key exists
    function exists(key) {
        const storageKey = STORAGE_PREFIX + key;
        return localStorage.getItem(storageKey) !== null;
    }
    
    // List all keys
    function listKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .map(key => key.substring(STORAGE_PREFIX.length));
    }
    
    // API for Bruce scripts
    const api = {
        save: save,
        set: save,
        write: save,
        load: load,
        get: load,
        read: load,
        remove: remove,
        delete: remove,
        clear: clear,
        exists: exists,
        has: exists,
        listKeys: listKeys,
        keys: listKeys
    };
    
    return {
        api: api
    };
})();
