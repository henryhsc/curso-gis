var inicioLeaflet = function(){
    console.log('inicio leaflet');
   var mapaL = new L.Map('miMapaLeaflet', {
       center: new L.LatLng(-17.379999,-64.819336),
       zoom: 5,
       attributionControl:true,
       zoomControl:true,
       minZoom:1
   });

   // se puede encontrar todos los mapas en https://leaflet-extras.github.io/leaflet-providers/preview/

   //var layerNatGeo = L.tileLayer.provider('Esri.NatGeoWorldMap');
   //var layerNatGeo = L.tileLayer.provider('Esri.WorldImagery');
   var layerNatGeo = L.tileLayer.provider('OpenTopoMap');
   mapaL.addLayer(layerNatGeo);

   // capas de transparencia
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
   mapaL.addLayer(wmsLayer1);
   mapaL.addLayer(wmsLayer2);
   mapaL.addLayer(wmsLayer3);

   var base = {
       //"OSM": osm
       "Esri.WorldImagery": layerNatGeo
   };
   superpuestas = {
       "Límites departamentales":wmsLayer1,
       "Centros Educativos":wmsLayer2,
       "Comunidades":wmsLayer3
   };
   L.control.layers(base, superpuestas).addTo(mapaL);

   // cargamos archivo geoJSON
   $.getJSON('uploads/countries.geojson', function(datos){
       agregarDatos(datos, mapaL);
   });

   function agregarDatos(data, map){
       var capa = L.geoJson(
           data,
           {
               onEachFeature: onEachFeature
           }
       );
       capa.addTo(map);
   }

   // interaccion con el mapa
   function onEachFeature(feature, layer){
       layer.on('click', function(e){
           var codigoPais = e.target.feature.id;
           $.get('https://restcountries.eu/rest/v2/alpha/'+codigoPais, null, function(datosPais){
               var html = '<h3>Informacion de Pais</h3>' +
               '<table class="table table-hover table-striped">' +
               '<tr>' +
                    '<td>Nombre</td><td>'+ datosPais.name +'</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Alpha3Code</td><td>'+ datosPais.alpha3Code +'</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Codigo de llamada</td><td>'+ datosPais.callingCodes[0] +'</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Capital</td><td>'+ datosPais.capital +'</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Region - Subregion</td><td>'+ datosPais.region + ' - ' + datosPais.subregion +'</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Area</td><td>'+ datosPais.area.toLocaleString() +' Km2</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Poblacion</td><td>'+ datosPais.population.toLocaleString() +' </td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Zona Horaria</td><td>'+ datosPais.timezones[0] +'</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Moneda</td><td>'+ datosPais.currencies[0].name + ' [' + datosPais.currencies[0].symbol + ']' +'</td>' +
               '</tr>' +
               '<tr>' +
                    '<td>Bandera</td><td><img src="'+ datosPais.flag +'" width="80"></td>' +
               '</tr>' +
               '</table>';
               $('#info-mapa').html(html);
           });
       });
   }
}
