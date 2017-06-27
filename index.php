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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/openlayers/2.12/OpenLayers.min.js"></script>
    <!-- <link rel="stylesheet" href="style.css">
    <script src="OpenLayers.js"></script> -->

    <!-- <link rel="stylesheet" href="style.css"> -->
    <link rel="stylesheet" href="myStyle.css">
    <!-- creamos una nueva key api en google maps con nuestra cuenta email -->
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3ZuoGE7vsmslNCVk0GHXMNxjJd-O3zQY" async defer></script>
    <script src="http://maps.stamen.com/js/tile.stamen.js"></script>
    <!-- <script src="OpenLayers.js"></script> -->
</head>
<body>
    <div class="cabecera">Visor simple Open Layers</div>
    <div id="miMapa"></div>
    <!-- formulario para subir archivos shape -->
    <?=(isset($mensaje)?$mensaje:"")."<hr>"?>
    <form action="upload.php" method="post" enctype="multipart/form-data">
        Select file to upload:
        <input type="file" name="myFile[]" multiple id="myFile">
        <input type="submit" value="Upload File" name="submit">
    </form>
    <script src="myScript.js"></script>
</body>
</html>
