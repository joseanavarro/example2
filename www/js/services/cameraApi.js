(function () {
    'use strict';

    angular.module('AppModule')
        .factory('cameraApi', cameraApi);

    /* @ngInject */
    function cameraApi($q, $http, $log, globVar, CN, ERR, URL) {

        var data = {};

        return {
            getId: getId,
            startSession: startSession,
            getCameraInfo: getCameraInfo,
            getStatus: getStatus,
            setApiLevel: setApiLevel,
            setOptions: setOptions,
            takePhoto: takePhoto,
            checkPhoto: checkPhoto,
            delPhoto: delPhoto
        };

        /**------------------------------------------------------------
         * Returns the Id of the last created session.
         *
         * @ngdoc function
         * @returns Id of last created session
         */
        function getId() {
            return globVar.camSession;
        }
        //---------------------------------------------------------------

        /**------------------------------------------------------------
         * Stores the Id of the last created session.
         *
         * @ngdoc function
         */
        function setId(Id) {
            globVar.camSession = Id;
        }
        //---------------------------------------------------------------

        /**------------------------------------------------------------
         * Stores the color of the photo button
         *
         * @ngdoc function
         */
        function setButton(color) {
            globVar.photoButton = color;
        }
        //---------------------------------------------------------------

        /**------------------------------------------------------------
         * Pedir información de la cámara
         *
         * @ngdoc function
         * @returns {promise}
         */
        function getCameraInfo() {

            var q = $q.defer();

            // Realizar el envío mediante $http
            // esperar como mucho 3 segundos
            $http({
                    method: 'GET',
                    url: URL.CAMERA_API + 'info',
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {
                    // Comprobar si el Firmware de la cámara está dentro de la lista de
                    // de FWs permitidos (si no está en la lista puede que no se pueda controlar
                    // la cámara desde la App)
                    if ((CN.NOTFOUND !== CN.FIRMWARE_REQ.indexOf(data.firmwareVersion)) &&
                        (CN.CAMERA_MODEL === data.model)) {
                        // Aquí debemos comprobar la licencia en base al
                        // número de serie de la cámara
                        $log.debug('data.firmwareVersion: ' + data.firmwareVersion);
                        $log.debug('data.model: ' + data.model);
                        q.resolve(data);
                    } else {
                        q.reject(ERR.CAMERA_NOT_OK);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------

        /**------------------------------------------------------------
         * Iniciar un sesión en la cámara
         *
         * @ngdoc function
         * @returns {promise}
         */
        function startSession() {

            var q = $q.defer();

            // Preparar datos del POST
            var sendData = {
                name: 'camera.startSession',
                parameters: {}
            };

            // Realizar el envío mediante $http
            $http({
                    method: 'POST',
                    url: URL.CAMERA_API + 'commands/execute',
                    data: sendData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {
                    // This is called when the response is
                    // ready
                    if (data.name === 'camera.startSession' && data.state === 'done') {
                        setId(data.results.sessionId);
                        q.resolve(data);
                    } else {
                        q.reject(ERR.CAMERA_ERROR);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------

        /**------------------------------------------------------------
         * Preguntar estado de la cámara
         *
         * @ngdoc function
         * @returns {promise}
         */
        function getStatus() {

            var q = $q.defer();

            // Realizar el envío mediante $http
            $http({
                    method: 'POST',
                    url: URL.CAMERA_API + 'state',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {

                    if (JSON.stringify(data).charAt(0) === '{') {
                        // This is called when the response is
                        // ready
                        globVar.batteryLevel = data.state.batteryLevel;
                        // Aquí habrá que ver qué otras comprobaciones se pueden hacer
                        q.resolve(data);
                    } else {
                        // This is called when the response
                        // comes back with an error status
                        q.reject(status);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------


        /**------------------------------------------------------------
         * Establecer nivel de API
         *
         * @ngdoc function
         * @returns {promise}
         */
        function setApiLevel(level) {

            var q = $q.defer();

            // Preparar datos del POST
            var sendData = {
                name: 'camera.setOptions',
                parameters: {
                    "sessionId": getId(),
                    "options": {
                        "clientVersion": level
                    }
                }
            };

            // Realizar el envío mediante $http
            $http({
                    method: 'POST',
                    url: URL.CAMERA_API + 'commands/execute',
                    data: sendData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {
                    // This is called when the response is
                    // ready
                    if (data.name === 'camera.setOptions' && data.state === 'done') {
                        q.resolve(data);
                    } else {
                        q.reject(ERR.CAMERA_ERROR);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------


        /**------------------------------------------------------------
         * Establecer opciones de disparo
         *
         * @ngdoc function
         * @returns {promise}
         */
        function setOptions(hdr, lat, lon) {

            var q = $q.defer();
            var filter;

            globVar.hdr = hdr;
            if (hdr === CN.PANO_INDOOR) {
                filter = 'hdr';
            } else {
                filter = 'off';
            }

            // Preparar datos del POST
            var sendData = {
                name: 'camera.setOptions',
                parameters: {
                    sessionId: getId(),
                    options: {
                        clientVersion: 2,
                        _filter: filter,
                        fileFormat: {
                            type: 'jpeg',
                            width: 5376,
                            height: 2688
                        },
                        sleepDelay: 1800,
                        gpsInfo: {
                            lat: lat,
                            lng: lon
                        }
                    }
                }
            };

            // Realizar el envío mediante $http
            $http({
                    method: 'POST',
                    url: URL.CAMERA_API + 'commands/execute',
                    data: sendData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {
                    // This is called when the response is
                    // ready
                    if (data.name === 'camera.setOptions' && data.state === 'done') {
                        q.resolve(data);
                    } else {
                        q.reject(ERR.CAMERA_ERROR);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------

        /**------------------------------------------------------------
         * Realizar foto
         *
         * @ngdoc function
         * @returns {promise}
         */
        function takePhoto() {

            var q = $q.defer();
            var filter;

            // Preparar datos del POST
            var sendData = {
                name: 'camera.takePicture'
            };

            // Realizar el envío mediante $http
            $http({
                    method: 'POST',
                    url: URL.CAMERA_API + 'commands/execute',
                    data: sendData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {
                    // This is called when the response is
                    // ready
                    if (data.name === 'camera.takePicture') {
                        q.resolve(data.id);
                    } else {
                        q.reject(ERR.CAMERA_ERROR);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------



        /**------------------------------------------------------------
         * Comprobar estado de la foto
         *
         * @ngdoc function
         * @returns {promise}
         */
        function checkPhoto(idPhoto) {

            var q = $q.defer();
            var filter;

            // Preparar datos del POST
            var sendData = {
                id: idPhoto.toString()
            };

            // Realizar el envío mediante $http
            $http({
                    method: 'POST',
                    url: URL.CAMERA_API + 'commands/status',
                    data: sendData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {
                    // This is called when the response is
                    // ready
                    if (data.name === 'camera.takePicture') {
                        q.resolve(data);
                    } else {
                        q.reject(ERR.CAMERA_ERROR);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------


        /**------------------------------------------------------------
         * Borrar foto
         *
         * @ngdoc function
         * @returns {promise}
         */
        function delPhoto(photo) {

            var q = $q.defer();

            // Preparar datos del POST
            var sendData = {
                name: 'camera.delete',
                parameters: {
                    fileUrls: [photo]
                }
            };

            // Realizar el envío mediante $http
            $http({
                    method: 'POST',
                    url: URL.CAMERA_API + 'commands/execute',
                    data: sendData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: CN.HTTP_TIMEOUT
                })
                .success(function (data, status, headers, config) {
                    // This is called when the response is
                    // ready
                    if (data.name === 'camera.delete') {
                        q.resolve(data);
                    } else {
                        q.reject(ERR.CAMERA_ERROR);
                    }
                })
                .error(function (data, status, headers, config) {
                    // This is called when the response
                    // comes back with an error status
                    q.reject(status);
                });
            return q.promise;

        }
        //---------------------------------------------------------------


        //=====
    }

})();
