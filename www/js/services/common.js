
'use strict';
angular.module('AppModule')
	.service('Common',
		function (Login,
			$log,
			$q,
			globVar,
			$translate,
			$ionicPopup,
			$state,
			Options,
			$cordovaGeolocation,
			$ionicLoading,
			$cordovaFileTransfer,
			$cordovaFile
		) {

			//------------------------------------------------
			// Funcion para reemplazar fragmentos de cadenas
			//------------------------------------------------
			this.replaceAll = function (a, s, r) {
				return a.split(s)
					.join(r);
			};

			//------------------------------------------------
			// Funcion para convertir html en texto plano
			//------------------------------------------------
			this.htmlToPlaintext = function (text) {
				return text ? String(text)
					.replace(/<[^>]+>/gm, '') : '';
			};

			//-----------------------------------------------------
			// Funcion para cargar en memoria el perfil de usuario
			//-----------------------------------------------------
			this.loadProfile = function () {
				var q = $q.defer();
				Login.get(1)
					.then(function (result) {
						var logid = "Common.loadProfile: ";

						globVar.userId = result.userid;
						globVar.userName = result.name;
						globVar.userToken = result.token;
						globVar.userPhoto = result.photo;
						$log.debug(logid + "Cargando perfil de usuario");
						$log.debug(logid + "globVar.userId = " + globVar.userId);
						$log.debug(logid + "globVar.userName = " + globVar.userName);
						$log.debug(logid + "globVar.userToken = " + globVar.userToken);
						$log.debug(logid + "globVar.userPhoto = " + globVar.userPhoto);
						q.resolve(result);

					}, function () {
						$log.debug("No es posible leer la tabla Login");
						q.reject();
					});
				return q.promise;
			};

			this.goPub = function () {
				if (globVar.userId === "") {
					globVar.returnPage = "#/publish";

					$ionicPopup.alert({
						title: $translate.instant(""),
						template: $translate.instant('must_login_first_txt'),
						buttons: [{
							text: '<b>' + $translate.instant('login_txt') + '</b>',
							type: 'button-positive',
							onTap: function (e) {
								$state.go('login');
							}
						}, {
							text: $translate.instant('cancel_txt')
						}]
					});

				} else {
					$state.go('publish');
				}
			};

			/**------------------------------------------------------------
			 * Obtener las coordenadas geográficas
			 *
			 * @ngdoc function
			 *------------------------------------------------------------*/
			this.getLocation = function () {
				$log.debug("Pedir coordenadas GPS");
				// Se pide guardar la ubicación
				var posOptions = {
					timeout: 10000,
					maximumAge: 600000,
					enableHighAccuracy: true
				};

				$cordovaGeolocation
					.getCurrentPosition(posOptions)
					.then(function (position) {
						globVar.lat = position.coords.latitude;
						globVar.lon = position.coords.longitude;
						$log.debug("Detectada posición: lat=" + globVar.lat + "  lon=" + globVar.lon);
					}, function () {
						$log.debug("Error de posición!");
					});
			};
			//---------------------------------------------------------------

			/**------------------------------------------------------------
			 * Convertir goordenadas GPS a decimal
			 * Los datos llegan así desde la cámara
			 * "gpsLatitude":"37/1,23/1,7908/1000"
			 * "gpsLongitude":"5/1,59/1,34491/1000"
			 * @ngdoc function
			 *------------------------------------------------------------*/
			this.gpsToDec = function (gpsLatLon, direction) {
				var temp = gpsLatLon.split(',');
				var temp2 = temp[0].split('/');
				var deg = temp2[0] / temp2[1];
				temp2 = temp[1].split('/');
				var minutes = temp2[0] / temp2[1];
				temp2 = temp[2].split('/');
				var seconds = temp2[0] / temp2[1];

				direction.toUpperCase();
				var dd = deg + minutes / 60 + seconds / (60 * 60);
				//alert(dd);
				if (direction == "S" || direction == "W") {
					dd = dd * -1;
				} // Don't do anything for N or E
				return dd;
			};
			//---------------------------------------------------------------

			/**------------------------------------------------------------
			 * Read the path top save photos
			 *
			 * @ngdoc function
			 *------------------------------------------------------------*/
			this.getSavePath = function () {

				var q = $q.defer();

				Options.then(function (data) {
					if (data.path !== '') {
						$log.debug('Path encontrado');
						q.resolve(data.path);
					} else {
						$log.debug('Path no encontrado');
						q.resolve('');
					}
				}, function (error) {
					$log.debug('Error al leer configuración' + error);
					q.reject();
				});
				return q.promise;
			};
			//---------------------------------------------------------------

			/**------------------------------------------------------------
			 * Mostrar ventana de espera con mensaje
			 *
			 * @ngdoc function
			 *------------------------------------------------------------*/
			this.waitWindow = function (title, body, time) {
				//Mostrar la ventana de espera
				var maxDuration;
				if (time !== null) {
					maxDuration = 1000 * time;
				} else {
					maxDuration = 60000;
				}
				if (title === 0) {
					$ionicLoading.hide();
				} else {
					var sTemplate = '<ion-spinner></ion-spinner> <br/><br/><b>' + title + '</b> <br/><br/>' + body;

					$ionicLoading.show({
						template: sTemplate,
						content: 'Loading',
						animation: 'fade-in',
						hideOnStateChange: true,
						duration: maxDuration,
						noBackdrop: true,
						maxWidth: 900
					});
				}

			};
			//---------------------------------------------------------------

			/**------------------------------------------------------------
			 * Mostrar mensaje brevemente, que se cierra solo
			 *
			 * @ngdoc function
			 *------------------------------------------------------------*/
			this.showToast = function (text, duration, position) {

				window.plugins.toast.showWithOptions({
					message: text,
					duration: duration, // 2000 ms
					position: position,
					styling: {
						opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
						backgroundColor: '#000000', // make sure you use #RRGGBB. Default #333333
						textColor: '#FFFFFF', // Ditto. Default #FFFFFF
						textSize: 17, // Default is approx. 13.
						cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
						horizontalPadding: 20, // iOS default 16, Android default 50
						verticalPadding: 16 // iOS default 12, Android default 30
					}
				});
			};
			//---------------------------------------------------------------

			/**------------------------------------------------------------
			 * Guardar imagen en la galería del teléfono
			 *
			 * @ngdoc function
			 *------------------------------------------------------------*/
			this.saveImageToPhone = function (url, success, error) {
				// var canvas, context, imageDataUrl, imageData;
				// var img = new Image();
				// img.onload = function () {
				// 	canvas = document.createElement('canvas');
				// 	canvas.width = img.width;
				// 	canvas.height = img.height;
				// 	context = canvas.getContext('2d');
				// 	context.drawImage(img, 0, 0);
				// 	try {
				// 		imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
				// 		imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
				// 		cordova.exec(
				// 			success,
				// 			error,
				// 			'Canvas2ImagePlugin',
				// 			'saveImageDataToLibrary', [imageData]
				// 		);
				// 	} catch (e) {
				// 		error(e.message);
				// 	}
				// };
				// try {
				// 	img.src = url;
				// } catch (e) {
				// 	error(e.message);
				// }
			};
			//---------------------------------------------------------------

			/**------------------------------------------------------------
			 * Guardar imagen en la galería del teléfono
			 *
			 * @ngdoc function
			 *------------------------------------------------------------*/
			this.downloadPanorama = function (url) {
				var q = $q.defer();
				// continue with downloading/ Accessing operation
				/* Descargar foto desde url */
				var filename = url.substring(url.lastIndexOf('/') + 1);
				var imagePath;
				if (ionic.Platform.isAndroid()) {
					imagePath = cordova.file.externalRootDirectory + 'walk2view/';
				} else {
					imagePath = cordova.file.syncedDataDirectory + 'walk2view/';
				}
				var targetPath = imagePath + filename;

				$cordovaFileTransfer.download(url, targetPath, {}, true)
					.then(function (res) {
						$log.debug('Save file on ' + targetPath + ' success!');
						// Mover archivo descargado a la galería
						window.cordova.plugins.imagesaver.saveImageToGallery(
							targetPath,
							function () {
								$log.info('Fichero guardado en galería: ' + targetPath);
								// Borrar archivo de ubicación original
								$log.info('Borrar archivo = ' + targetPath);
								$cordovaFile.removeFile(imagePath, filename)
									.then(function (success) {
										$log.info('Archivo borrado = ' + targetPath);
									}, function (error) {
										$log.info(error + ' -> Error borrando archivo = ' + targetPath);
									});
								q.resolve(targetPath);
							},
							function (error) {
								$log.error('Fichero NO guardado en galería: ' + targetPath);
								q.reject(targetPath);
							});
						//window.refreshMedia.refresh(targetPath);
						//q.resolve(targetPath);
					}, function (error) {
						$log.debug('Error al descargar archivo: ' + error.exception);
						q.reject();
					}, function (progress) {
						// PROGRESS HANDLING GOES HERE
						//var downloadProgress = (progress.loaded / progress.total) * 100;
						//$log.debug('Descarga: ' + downloadProgress);
					});
				return q.promise;
			};
			//---------------------------------------------------------------


		});
