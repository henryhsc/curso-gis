var init = function(){
   var map = new L.Map('miMapa', {
       center: new L.LatLng(-17.379999,-64.819336),
       zoom: 5,
       attributionControl:true,
       zoomControl:true,
       minZoom:1
   });

   var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
   var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
   var osm = new L.TileLayer(osmUrl, {
       minZoom: 1,
       maxZoom: 19,
       attribution: osmAttrib
   });
   map.addLayer(osm);

   var wmsLayer1= L.tileLayer.wms("http://geo.gob.bo/geoserver/wms", {
       layers: 'fondos:departamento1',
       format: 'image/png',
       transparent: true
   });
   var wmsLayer2= L.tileLayer.wms("http://geo.gob.bo/geoserver/wms", {
       layers: 'mde:EstabEducativos-cluster',
       format: 'image/png',
       transparent: true
   });
   var wmsLayer3= L.tileLayer.wms("http://geo.gob.bo/geoserver/wms", {
       layers: 'fondos:comunidades_2012',
       format: 'image/png',
       transparent: true
   });
   map.addLayer(wmsLayer1);
   map.addLayer(wmsLayer2);
   map.addLayer(wmsLayer3);

   var base = {
       "OSM": osm
   };
   superpuestas = {
       "Límites departamentales":wmsLayer1,
       "Centros Educativos":wmsLayer2,
       "Comunidades":wmsLayer3
   };
   L.control.layers(base, superpuestas).addTo(map);
}
window.onload = init;
