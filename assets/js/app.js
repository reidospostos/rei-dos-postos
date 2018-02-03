window.onload = initApp;

function initApp() {
  var addressForm = document.getElementById("addressForm");
  var addressField = document.getElementById("address");

  addressForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var url = addressField.value;
    var datedURL = url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
    console.log(datedURL);
    socket.emit('address', datedURL);

  })
}
