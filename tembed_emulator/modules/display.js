/**
 * Display Module - Provides canvas drawing API for Bruce scripts
 */

window.DisplayModule = (function() {
    let canvas = null;
    let ctx = null;
    
    // Initialize display
    function init(canvasElement) {
        canvas = canvasElement;
        ctx = canvas.getContext('2d');
        
        // Set default properties
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textBaseline = 'top';
        
        // Clear screen
        clear();
    }
    
    // Clear the display
    function clear(color = '#000000') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff'; // Reset to white
    }
    
    // Draw pixel
    function drawPixel(x, y, color = '#ffffff') {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Draw line
    function drawLine(x1, y1, x2, y2, color = '#ffffff') {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    // Draw rectangle
    function drawRect(x, y, width, height, color = '#ffffff', fill = false) {
        if (fill) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(x, y, width, height);
        }
    }
    
    // Draw circle
    function drawCircle(x, y, radius, color = '#ffffff', fill = false) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }
    
    // Draw text
    function drawText(text, x, y, color = '#ffffff', fontSize = 12) {
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, x, y);
    }
    
    // Set font size
    function setFontSize(size) {
        ctx.font = `${size}px monospace`;
    }
    
    // Get display dimensions
    function getWidth() {
        return canvas.width;
    }
    
    function getHeight() {
        return canvas.height;
    }
    
    // API for Bruce scripts
    const api = {
        clear: clear,
        clearDisplay: clear,
        drawPixel: drawPixel,
        drawLine: drawLine,
        drawRect: drawRect,
        drawRectangle: drawRect,
        fillRect: (x, y, w, h, color) => drawRect(x, y, w, h, color, true),
        drawCircle: drawCircle,
        fillCircle: (x, y, r, color) => drawCircle(x, y, r, color, true),
        drawText: drawText,
        print: drawText,
        setFontSize: setFontSize,
        getWidth: getWidth,
        getHeight: getHeight,
        width: 320,
        height: 240,
        update: function() { /* No-op for compatibility */ }
    };
    
    return {
        init: init,
        api: api
    };
})();
