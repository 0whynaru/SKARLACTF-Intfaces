document.onkeydown = function(e) {
        if (e.ctrlKey && 
            (e.keyCode === 85 )) {
            return false;
        }
};
document.addEventListener('keydown', function(event) {
  // 123 is the keyCode for F12
  if (event.keyCode === 123 || event.key === "F12") {
    event.preventDefault();
    return false;
  }
});
document.addEventListener('contextmenu', (e) => e.preventDefault());

console.log('IF U SEE THIS. WOW! ')