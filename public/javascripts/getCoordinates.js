function geoFindMe() {
  var output = document.getElementById("gps");
  //var location = document.getElementById("location");
  if (!navigator.geolocation) {
    output.innerHTML = "<p>Your browser doesn't supports geolcation</p>";
    return;
  }

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    // output.innerHTML =
    //   "<p>Latitude is " +
    //   latitude +
    //   "° Longitude is " +
    //   longitude +
    //   "° </p>";
    output.value = [latitude, longitude];
    //console.log(location.value);
  }

  function error() {
    output.innerHTML = "Unable to obtain your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}
