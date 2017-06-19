var inicio = function () {
    // tipo de proyeccion del mapa
    var proyeccion = new OpenLayers.Projection('EPSG:4326');    // EPSG:900913
    var controlNavegacion = new OpenLayers.Control.Navigation();
    var controlZoom = new OpenLayers.Control.PanZoomBar();   // un estilo
    //var controlZoom = new OpenLayers.Control.Zoom();    // un estilo mas sencillo
    var propiedades = {
        projection: proyeccion,
        units: 'm',
        controls: [
            controlNavegacion,
            controlZoom
        ]
    };
    var map = new OpenLayers.Map("miMapa", propiedades);     // parametro: el ID del contenedor
    var layerOSM = new OpenLayers.Layer.OSM();
    map.addLayer(layerOSM);
    map.setCenter(new OpenLayers.LonLat(-63,5887, -16,2902), 4);
}
// iniciamos la funcion para desplegar el mapa
window.onload = inicio;
