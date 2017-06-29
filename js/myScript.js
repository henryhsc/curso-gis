var inicio = function () {
    // variable de acceso a localhost
    //var host = "192.168.43.231";
    var host = "localhost";    // 'localhost'
    // tipo de proyeccion del mapa
    var proyeccion = new OpenLayers.Projection('EPSG:900913');    // se usa EPSG:4326 y si hay problemas se usa EPSG:900913
    var proyeccion2 = new OpenLayers.Projection("EPSG:4326");
    var controlNavegacion = new OpenLayers.Control.Navigation();
    var controlZoom = new OpenLayers.Control.PanZoomBar();   // un estilo
    //var controlZoom = new OpenLayers.Control.Zoom();    // un estilo mas sencillo
    var propiedades = {
        projection: proyeccion,
        displayProjection: proyeccion2,
        units: 'm',     // metros
        controls: [
            controlNavegacion,
            controlZoom
        ],
        // inicialmente el zoom maximo es diferente para cada mapa, definimos un numero standar pero no aplica a mapas que no tienen ese nivel de zoom
        numZoomLevels: 21
    };
    var map = new OpenLayers.Map("miMapa", propiedades);     // parametro: el ID del contenedor



    // control para intercambio de capas
    var controlCapas = new OpenLayers.Control.LayerSwitcher();
    map.addControl(controlCapas);

    // control de posicion del cursor
    var controlCursor = new OpenLayers.Control.MousePosition();
    map.addControl(controlCursor);

    // control mini mapa
    var controlMiniMapa = new OpenLayers.Control.OverviewMap();
    map.addControl(controlMiniMapa);

    /************************************
     ******* DEFINICION DE CAPAS ********
     ************************************/
    // capa OSM
    var layerOSM = new OpenLayers.Layer.OSM();

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

    // capa stamen
    var layerStamen = new OpenLayers.Layer.Stamen("toner");
    //map.addLayer(layerStamen);

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

    /*************************************************
     ******* DEFINICION DE CAPAS SUPERPUESTAS ********
     *************************************************/
    // capas utilizando servicios web WMS (Web Map Service) http://geo.gob.bo/geoserver
    // configura visibilidad predeterminada del layer (forma Nro 1)
    var visibilidad = {     // segundo objeto de propiedades
        visibility: false   // booleano
    };
    var layerDepartamentosWMS = new OpenLayers.Layer.WMS(
        "Limites departamentales Bolivia",                // se pasa un nombre del layer
        "http://geo.gob.bo/geoserver/wms",     // url del servicio a consumir
        {
            layers: 'fondos:departamento1',     // workspace:capa   //layers: 'universidades:flisol_2014',
            transparent: true   // si se pone en false, este layer se usa como un layer adicional
        },
        visibilidad
    );

    // capas utilizando servicios web WMS (Web Map Service) http://localhost:8080/geoserver
    var layerMapaUSAWMS = new OpenLayers.Layer.WMS(
        "Mapa USA WMS",                // se pasa un nombre del layer
        "http://"+host+":8080/geoserver/wms",  // url del servicio geoserver local
        {
            layers: 'topp:states',
            transparent: true   // si se pone en false, este layer se usa como un layer adicional
        }
    );
    layerMapaUSAWMS.setVisibility(false);   // forma Nro 2 para predeterminar visibilidad del layer

    // capas utilizando servicios web WMS (Web Map Service) http://localhost:8080/geoserver
    var layerMapaEolico = new OpenLayers.Layer.WMS(
        "Mapa Eolico",                // se pasa un nombre del layer
        "http://"+host+":8080/geoserver/wms",  // url del servicio geoserver local
        {
            layers: 'curso-gis:EOLICO',
            transparent: true   // si se pone en false, este layer se usa como un layer adicional
        }
    );
    layerMapaEolico.setVisibility(false);

    // layer tipo JSON Areas protegidas
    var layerAPJson = new OpenLayers.Layer.Vector(
        "Capa Areas protegidas Json",     // nombre de la capa
        {
            projection: new OpenLayers.Projection("EPSG:4326"),   // se pone la proyeccion con la que se genero el Geojson
            strategies: [new OpenLayers.Strategy.Fixed()], // similar a CSS position fixed
            protocol: new OpenLayers.Protocol.HTTP({
                url: './ap_nacionales.json',      // ubicacion del archivo geojson (puede ser 'http://localhost/curso-gis/ap_nacionales.json')
                format: new OpenLayers.Format.GeoJSON()
            })
        }
    );
    layerAPJson.setVisibility(false);

    // capas utilizando servicios web WMS (Web Map Service) http://localhost:8080/geoserver
    // consumimos capa desde POSTGIS
    var layerPostGisEolico = new OpenLayers.Layer.WMS(
        "Mapa Eolico POSTGIS",                // se pasa un nombre del layer
        "http://"+host+":8080/geoserver/wms",  // url del servicio geoserver local
        {
            layers: 'curso-gis:postgis-eolico',
            transparent: true   // si se pone en false, este layer se usa como un layer adicional
        }
    );
    layerPostGisEolico.setVisibility(false);

    // capas utilizando servicios web WMS (Web Map Service) http://localhost:8080/geoserver
    // consumimos capa desde POSTGIS
    var layerPostGisRios = new OpenLayers.Layer.WMS(
        "Mapa Rios POSTGIS",                // se pasa un nombre del layer
        "http://"+host+":8080/geoserver/wms",  // url del servicio geoserver local
        {
            layers: 'curso-gis:tabla_rios',
            transparent: true   // si se pone en false, este layer se usa como un layer adicional
        }
    );
    layerPostGisRios.setVisibility(false);

    map.addLayers([     // metodo para cargar varias capas
        // LAYERS
        layerOSM,
        layerGoogle,
        layerGoogleHibrido,
        layerGoogleTerrain,
        layerStamen,
        layerMapBox,
        // OVERLAYS
        layerDepartamentosWMS,
        layerMapaUSAWMS,
        layerMapaEolico,
        layerAPJson,
        layerPostGisEolico,
        layerPostGisRios
    ]);

    console.log('creamos featureInfo');
    var featureInfo =  new OpenLayers.Control.WMSGetFeatureInfo({
        //url: 'http://' + host + ':8080/geoserver/wms',
        title: 'Identifica propiedades JSON',
        queryVisible: true,
        /*maxFeatures: 50,
        output:'features',
        infoFormat:'application/json',
        format: new OpenLayers.Format.JSON,*/
        eventListeners: {
            getfeatureinfo: function(event){
                var popup = new OpenLayers.Popup.FramedCloud(
                    'Popup',    // id: strins
                    map.getLonLatFromPixel(event.xy),   // lonlat: OpenLayers.LonLat
                    null,   // contentSize: OpenLayers.Size
                    event.text, // contentHTML: String
                    null,   // anchor: [Object]
                    true    // closeBox: boolean
                    // closeBoxCallBack: Function to be called con closeBox click
                );
                console.dir( event.features );
                map.addPopup(popup);
                var info = $("#info-mapa");
                var posicion = map.getLonLatFromPixel(event.xy);
                info.html(posicion.lon +" | "+ posicion.lat);
            }
        }
    });
    map.addControl(featureInfo);
    featureInfo.activate();

    // configuracion para mostrar la region de Bolivia
    // Lon: -64.819336, Lat: -17.37999
    // con lon, lat se debe hacer una transformacion de la proyeccion
    var LonLat = new OpenLayers.LonLat(-65.093994, -16.715475);
    var zoom = 5;
    var LonLatTransformado = LonLat.transform(
        new OpenLayers.Projection("EPSG:4326"),     // proyeccion origen
        map.getProjection() //new OpenLayers.Projection("EPSG:900913")    // proyeccion destino
    );
    map.setCenter(LonLatTransformado, zoom); // parametros (Longitud,Latitud), nivel de zoom
}
// iniciamos la funcion para desplegar el mapa
window.onload = inicio;
