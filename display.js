// Display module for BruceEmu
// Provides clear(), print(x,y,text,wrap), cursor, and render GUI functionality

class Display {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 128;
    this.height = 64;
    this.cursorX = 0;
    this.cursorY = 0;
    this.charWidth = 6;
    this.charHeight = 8;
    this.buffer = [];
  }

  init(canvasId = 'display') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '8px monospace';
  }

  clear() {
    if (!this.ctx) this.init();
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#fff';
    this.buffer = [];
    this.cursorX = 0;
    this.cursorY = 0;
  }

  print(x, y, text, wrap = false) {
    if (!this.ctx) this.init();
    
    const textStr = String(text);
    this.buffer.push({ x, y, text: textStr, wrap });
    
    if (wrap) {
      const maxWidth = this.width - x;
      const words = textStr.split(' ');
      let line = '';
      let currentY = y;
      
      for (let word of words) {
        const testLine = line + word + ' ';
        const metrics = this.ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          this.ctx.fillText(line.trim(), x, currentY);
          line = word + ' ';
          currentY += this.charHeight;
        } else {
          line = testLine;
        }
      }
      this.ctx.fillText(line.trim(), x, currentY);
    } else {
      this.ctx.fillText(textStr, x, y);
    }
    
    this.cursorX = x;
    this.cursorY = y;
  }

  get cursor() {
    return { x: this.cursorX, y: this.cursorY };
  }

  set cursor(pos) {
    if (pos && typeof pos === 'object') {
      if (pos.x !== undefined) this.cursorX = pos.x;
      if (pos.y !== undefined) this.cursorY = pos.y;
    }
  }

  render() {
    // Re-render all buffered content
    if (!this.ctx) this.init();
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#fff';
    
    // Render without modifying the buffer
    for (let item of this.buffer) {
      if (item.wrap) {
        const maxWidth = this.width - item.x;
        const words = item.text.split(' ');
        let line = '';
        let currentY = item.y;
        
        for (let word of words) {
          const testLine = line + word + ' ';
          const metrics = this.ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && line !== '') {
            this.ctx.fillText(line.trim(), item.x, currentY);
            line = word + ' ';
            currentY += this.charHeight;
          } else {
            line = testLine;
          }
        }
        this.ctx.fillText(line.trim(), item.x, currentY);
      } else {
        this.ctx.fillText(item.text, item.x, item.y);
      }
    }
  }
}

// Export as singleton
const display = new Display();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = display;
}
