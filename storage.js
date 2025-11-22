// Storage module for BruceEmu
// Provides open({fs,path,mode}) => read/write/close, map fs:"sd" to localStorage

class Storage {
  constructor() {
    this.openFiles = new Map();
    this.fileIdCounter = 0;
  }

  open({ fs = 'sd', path = '', mode = 'r' }) {
    const fileId = this.fileIdCounter++;
    const storageKey = `${fs}:${path}`;
    
    const fileHandle = {
      id: fileId,
      fs: fs,
      path: path,
      mode: mode,
      storageKey: storageKey,
      position: 0,
      closed: false,

      read(length) {
        if (this.closed) {
          throw new Error('File is closed');
        }
        
        if (this.mode !== 'r' && this.mode !== 'r+') {
          throw new Error('File not opened for reading');
        }

        try {
          const data = localStorage.getItem(this.storageKey) || '';
          const chunk = data.substring(this.position, this.position + length);
          this.position += chunk.length;
          return chunk;
        } catch (e) {
          console.error('Read error:', e);
          return '';
        }
      },

      readAll() {
        if (this.closed) {
          throw new Error('File is closed');
        }
        
        if (this.mode !== 'r' && this.mode !== 'r+') {
          throw new Error('File not opened for reading');
        }

        try {
          return localStorage.getItem(this.storageKey) || '';
        } catch (e) {
          console.error('Read error:', e);
          return '';
        }
      },

      write(data) {
        if (this.closed) {
          throw new Error('File is closed');
        }
        
        if (this.mode !== 'w' && this.mode !== 'w+' && this.mode !== 'a' && this.mode !== 'r+') {
          throw new Error('File not opened for writing');
        }

        try {
          let currentData = localStorage.getItem(this.storageKey) || '';
          
          if (this.mode === 'w' || this.mode === 'w+') {
            // Write mode: replace content
            localStorage.setItem(this.storageKey, data);
            this.position = data.length;
          } else if (this.mode === 'a') {
            // Append mode: add to end
            const newData = currentData + data;
            localStorage.setItem(this.storageKey, newData);
            this.position = newData.length;
          } else if (this.mode === 'r+') {
            // Read/write mode: write at current position
            const before = currentData.substring(0, this.position);
            const after = currentData.substring(this.position + data.length);
            const newData = before + data + after;
            localStorage.setItem(this.storageKey, newData);
            this.position += data.length;
          }
          return data.length;
        } catch (e) {
          console.error('Write error:', e);
          return 0;
        }
      },

      close() {
        if (this.closed) {
          return;
        }
        this.closed = true;
        // Remove from open files map if it exists
        if (storage.openFiles.has(this.id)) {
          storage.openFiles.delete(this.id);
        }
      },

      seek(position) {
        if (this.closed) {
          throw new Error('File is closed');
        }
        this.position = position;
      }
    };

    this.openFiles.set(fileId, fileHandle);
    return fileHandle;
  }

  list(fs = 'sd', prefix = '') {
    const storagePrefix = `${fs}:${prefix}`;
    const files = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(storagePrefix)) {
        files.push(key.slice(storagePrefix.length));
      }
    }
    
    return files;
  }

  remove(fs = 'sd', path = '') {
    const storageKey = `${fs}:${path}`;
    localStorage.removeItem(storageKey);
  }

  exists(fs = 'sd', path = '') {
    const storageKey = `${fs}:${path}`;
    return localStorage.getItem(storageKey) !== null;
  }
}

// Export as singleton
const storage = new Storage();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = storage;
}
