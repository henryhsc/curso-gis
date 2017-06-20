var inicio = function () {
    // tipo de proyeccion del mapa
    var proyeccion = new OpenLayers.Projection('EPSG:4326');    // EPSG:900913
    var controlNavegacion = new OpenLayers.Control.Navigation();
    var controlZoom = new OpenLayers.Control.PanZoomBar();   // un estilo
    //var controlZoom = new OpenLayers.Control.Zoom();    // un estilo mas sencillo
    var propiedades = {
        projection: proyeccion,
        units: 'm',     // metros
        controls: [
            controlNavegacion,
            controlZoom
        ]
    };
    var map = new OpenLayers.Map("miMapa", propiedades);     // parametro: el ID del contenedor

    // capa OSM
    var layerOSM = new OpenLayers.Layer.OSM();
    map.addLayer(layerOSM);
    //map.setCenter(new OpenLayers.LonLat(-63.5887, -16.2902), 4);*/

    // capa googleapi
    var layerGoogle = new OpenLayers.Layer.Google("Mapa Satelital", {
        type: google.maps.MapTypeId.SATELLITE
    });
    var layerGoogleHibrido = new OpenLayers.Layer.Google("Mapa Satelital hibrido", {
        type: google.maps.MapTypeId.HYBRID
    });
    var layerGoogleTerrain = new OpenLayers.Layer.Google("Mapa Satelital Terreno", {
        type: google.maps.MapTypeId.TERRAIN
    })
    //map.addLayer(layerGoogle);
    map.addLayers([     // metodo para cargar varias capas
        layerGoogle,
        layerGoogleHibrido,
        layerGoogleTerrain
    ]);

    // control para intercambio de capas
    var controlCapas = new OpenLayers.Control.LayerSwitcher();
    map.addControl(controlCapas);

    // capa stamen
    var layerStamen = new OpenLayers.Layer.Stamen("toner");
    map.addLayer(layerStamen);

    // layer map box
    var layerMapBox = new OpenLayers.Layer.XYZ('MapBox', [
		    "http://b.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/${z}/${x}/${y}.png",
        	"http://c.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/${z}/${x}/${y}.png",
        	"http://d.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/${z}/${x}/${y}.png"
		    ],
            {
                sphericalMercator: true,
                //tileSize: new OpenLayers.Size([512, 512]),
                wrapDateLine: true,
            	numZoomLevels: 19
    });

    map.addLayer(layerMapBox);

}
// iniciamos la funcion para desplegar el mapa
window.onload = inicio;
