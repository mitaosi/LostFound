mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: lostitem.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

//marker即地图上的箭头标签
//Poppup的作用是当鼠标放在地图上的标签上时显示指定的内容，此处为失物标题
new mapboxgl.Marker()
  .setLngLat(lostitem.geometry.coordinates)
  .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${lostitem.title}</h3><p>${lostitem.location}</>`
        )
  )
  .addTo(map)
