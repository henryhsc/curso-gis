curso taller GIS
Postgrado de Informatica

La instalación de Sublimetext3 es la habitual en windows (siguiente, siguiente..)

Sobre el key de activación, en el archivo encontraran 3 keys de activación, pueden utilizar cualquiera de ellas.

Links de ayuda

    http://boundingbox.klokantech.com/
    https://maps.googleapis.com/maps/api/js
    http://maps.stamen.com/js/tile.stamen.js

Ayuda

mapboxLayer = new OpenLayers.Layer.XYZ('MapBox', [

	"http://b.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/${z}/${x}/${y}.png",
	"http://c.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/${z}/${x}/${y}.png",
	"http://d.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/${z}/${x}/${y}.png"
		    ], {
        sphericalMercator: true,
        //tileSize: new OpenLayers.Size([512, 512]),
        wrapDateLine: true,
	numZoomLevels: 19
    });

google:

   ("Mapa Satelital",{type:google.maps.MapTypeId.TIPYMAP});
