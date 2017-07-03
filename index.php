<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Curso GIS - visor simple Open Layers</title>
    <!-- dise;o responsivo -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

    <!-- USAMOS LA VERSION 2.12 DE OPENLAYERS -->
    <!-- cuando se carga desde un geoserver se puede quitar "https:" en caso de que haya problemas -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/openlayers/2.12/theme/default/style.min.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/openlayers/2.12/OpenLayers.min.js"></script>
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/bootstrap.min.js"></script>

    <!-- libreria Leaflet -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.1.0/leaflet.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.1.0/leaflet.js"></script>

    <!-- <link rel="stylesheet" href="style.css"> -->
    <link rel="stylesheet" href="css/myStyle.css">
    <!-- creamos una nueva key api en google maps con nuestra cuenta email -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3ZuoGE7vsmslNCVk0GHXMNxjJd-O3zQY" async defer></script>
    <script src="http://maps.stamen.com/js/tile.stamen.js"></script>
    <!-- <script src="OpenLayers.js"></script> -->
</head>
<body>
    <section>
        <div class="row">
            <div class="col-md-2 col-xs-12"></div>
            <div class="col-md-6 col-xs-12">
                <div class="cabecera text-center">
                    Visor Geografico multicapa Open Layers<hr>
                    <button class="btn btn-primary">OpenLayers</button>
                    <button class="btn btn-info">LeafLet</button>
                </div>
            </div>
            <div class="col-md-4 col-xs-12"></div>
        </div>
    </section>
    <div class="row">
        <div class="col-md-2 col-xs-12">
            <!-- formulario para subir archivos shape -->
            <?php
            echo (isset($_SESSION['mensaje'])?$_SESSION['mensaje']:"")."<hr>";
            if( isset($_SESSION['mensaje']) )
                unset($_SESSION['mensaje']);
            ?>
            <form action="upload.php" method="post" enctype="multipart/form-data">
                Seleccione archivos shape:
                <fieldset>
                    <input type="file" class="btn-info" name="myFile[]" multiple id="myFile">
                </fieldset>
                <input type="submit" class="btn btn-primary" value="Upload File" name="submit">
            </form>
        </div>
        <div class="col-md-6 col-xs-12">
            <div id="miMapaOL" class="contenedor-layer"></div>
            <div id="miMapaLeaflet" class="cobtenedor-layer"></div>
        </div>
        <div class="col-md-4 col-xs-12">
            <div id="info-mapa"></div>
        </div>
    </div>
    <script src="js/myScript.js"></script>
</body>
</html>
