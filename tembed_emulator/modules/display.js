// Display Module - Provides display manipulation API
class DisplayModule {
    constructor(emulator) {
        this.emulator = emulator;
        this.ctx = emulator.ctx;
        this.canvas = emulator.canvas;
        this.width = 320;
        this.height = 240;
    }
    
    // Clear the display
    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    // Set pixel color
    setPixel(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 1, 1);
    }
    
    // Draw text
    print(text, x = 0, y = 0, color = '#FFFFFF', size = 12) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px monospace`;
        this.ctx.fillText(text, x, y + size);
    }
    
    // Draw rectangle
    drawRect(x, y, width, height, color = '#FFFFFF', filled = false) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        
        if (filled) {
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.strokeRect(x, y, width, height);
        }
    }
    
    // Draw circle
    drawCircle(x, y, radius, color = '#FFFFFF', filled = false) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        
        if (filled) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }
    
    // Draw line
    drawLine(x1, y1, x2, y2, color = '#FFFFFF', width = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    // Update display (for buffered drawing)
    update() {
        // In this implementation, drawing is immediate
        // This is here for API compatibility
    }
    
    // Get display dimensions
    getWidth() {
        return this.width;
    }
    
    getHeight() {
        return this.height;
    }
    
    // Set background color
    setBackground(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    // Draw image from data URL
    drawImage(dataUrl, x, y, width, height) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, x, y, width, height);
                resolve();
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    }
}
