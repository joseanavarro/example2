App_ViajesVirtuales
===================

Pasos para construir la App:

* Crear la base a partir de una aplicación de mapas con leaflet

> ionic start App_ViajesVirtuales https://github.com/calendee/ionic-leafletjs-map-demo

> npm install

> bower install

> ionic platform add android
> ionic platform add ios

* Instalar el plugin de geolocalización

> cordova plugin add cordova-plugin-geolocation

* A partir de este momento ya se puede ejecutar la App básica de mapas

* Añadir el módulo de base de datos SQLite

* Instalar el plugin de SQLite

> cordova plugin add io.litehelpers.cordova.sqlite

* Incluir el sistema multi-idioma

> bower install angular-translate

* Incluir señal de espera cuando se cargan los mapas

* Colocar los permisos correspondientes para poder determinar la localización desde el móvil, que están en:
D:\Codigo\Mobile\App_ViajesVirtuales\platforms\android\AndroidManifest.xml
