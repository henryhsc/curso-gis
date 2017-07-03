$(document).ready(function(){
    //inicioOL();
    inicioLeaflet();
});

var inicioOL = function () {
    // variable de acceso a localhost
    //var host = "192.168.43.231";
    var host = "localhost";    // 'localhost'
    //OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";

    // CONFIGURACIONES ADICIONALES
    OpenLayers.DOTS_PER_INCH = 90.71428571428572;    // valor recomendado para ajuste DPI
    OpenLayers.Util.onImageLoadErrorColor= 'transparent';   // se define si hay un error cargando capas (para evitar mosaicos rosados)

    // tipo de proyeccion del mapa
    var proyeccion = new OpenLayers.Projection('EPSG:900913');    // se usa EPSG:4326 y si hay problemas se usa EPSG:900913
    var proyeccion2 = new OpenLayers.Projection("EPSG:4326");
    var controlNavegacion = new OpenLayers.Control.Navigation();
    var controlZoom = new OpenLayers.Control.PanZoomBar();   // un estilo
    // para control touch en dispositivos moviles
    var controlTouch = new OpenLayers.Control.TouchNavigation({
        dragPanOptions:{enableKinetic:true}
    });
    // personalizar fuentes para mapa y layers
    var controlFuente = new OpenLayers.Control.Attribution({
    	template:"<span style='color:darkblue;font-weight:bold;'>Curso GIS - Postgrado en Informática</span>"
    });
    //var controlZoom = new OpenLayers.Control.Zoom();    // un estilo mas sencillo
    var propiedades = {
        projection: proyeccion,
        displayProjection: proyeccion2,
        units: 'm',     // metros
        controls: [
            controlNavegacion,
            controlZoom,
            controlTouch,
            controlFuente
        ],
        // inicialmente el zoom maximo es diferente para cada mapa, definimos un numero standar pero no aplica a mapas que no tienen ese nivel de zoom
        numZoomLevels: 21,
        // para fijar el recuadro en el mapa (opcional)
        /*restrictedExtent: new OpenLayers.Bounds(-72.66, -23.81, -56.36, -8.81).transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"),
        )*/
        // maxResolution: resolucion recomendada 196543.0339
    };
    var map = new OpenLayers.Map("miMapaOL", propiedades);     // parametro: el ID del contenedor

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
                /*var popup = new OpenLayers.Popup.FramedCloud(
                    'Popup',    // id: strins
                    map.getLonLatFromPixel(event.xy),   // lonlat: OpenLayers.LonLat
                    null,   // contentSize: OpenLayers.Size
                    event.text, // contentHTML: String
                    null,   // anchor: [Object]
                    true    // closeBox: boolean
                    // closeBoxCallBack: Function to be called con closeBox click
                );
                map.addPopup(popup);*/
                console.dir( event );
                console.log(event.xy);
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

    // PRIMERA FORMA
    var LonLat = new OpenLayers.LonLat(-65.093994, -16.715475);
    var zoom = 5;
    var LonLatTransformado = LonLat.transform(
        new OpenLayers.Projection("EPSG:4326"),     // proyeccion origen
        map.getProjection() //new OpenLayers.Projection("EPSG:900913")    // proyeccion destino
    );
    //map.setCenter(LonLatTransformado, zoom); // parametros (Longitud,Latitud), nivel de zoom

    // SEGUNDA FORMA
    // se utiliza el sitio http://boundingbox.klokantech.com/
    // para demarcar un recuadro y fijar al mapa
    var regionBox = new OpenLayers.Bounds(-72.66, -23.81, -56.36, -8.81);
    // obtenemos el centro
    var centroRegion = regionBox.getCenterLonLat();
    var centroBoxTransform = centroRegion.transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjection()
    );
    map.setCenter(centroBoxTransform, zoom);
}
var inicioLeaflet = function(){
    var mapaLeaflet = new L.Map('miMapaLeaflet', {
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
   mapaLeaflet.addLayer(osm);

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
   mapaLeaflet.addLayer(wmsLayer1);
   mapaLeaflet.addLayer(wmsLayer2);
   mapaLeaflet.addLayer(wmsLayer3);

   var base = {
       "OSM": osm
   };
   superpuestas = {
       "Límites departamentales":wmsLayer1,
       "Centros Educativos":wmsLayer2,
       "Comunidades":wmsLayer3
   };
   L.control.layers(base, superpuestas).addTo(mapaLeaflet);
}

// iniciamos la funcion para desplegar el mapa
//window.onload = inicioOL;
//window.onload = inicioLeaflet;
