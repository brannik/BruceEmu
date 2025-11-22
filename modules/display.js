/**
 * Example module using callback pattern
 */

module.exports = function(callback) {
  println('Display module executing...');
  
  setTimeout(() => {
    const data = {
      width: 128,
      height: 64,
      type: 'OLED'
    };
    
    println('Display initialized:', JSON.stringify(data));
    
    if (callback) {
      callback(null, data);
    }
  }, 100);
  
  return 'Display module loaded';
};
