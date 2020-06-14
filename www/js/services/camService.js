(function () {
	'use strict';

	angular.module('AppModule')
		.service('camService', camService);

	/* @ngInject */
	function camService($ionicLoading, $log, $q, $ionicPopup, $translate, $state,
		$timeout, $cordovaFileTransfer, $cordovaFile, DataService, Common, cameraApi,
		globVar, CN, Options) {

		var LogId = 'camService: ';
		/*jshint validthis: true */
		var vm = this;

		var service = {
			init: init,
			checkCamera: checkCamera,
			updateHdr: updateHdr,
			downloadPhotos: downloadPhotos,
			getCameraWifi: getCameraWifi,
			connectToThetaWifi: connectToThetaWifi,
			disconnectFromThetaWifi: disconnectFromThetaWifi,
			connectToCameraWifi: connectToCameraWifi,
			enableDeviceWifi: enableDeviceWifi
		};


		return service;
		/**------------------------------------------------------------
		 * Iniciar sesión con la cámara
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function init() {
			var q = $q.defer();

			// Pedir información de la cámara, con esta información podemos
			// saber si la cámara es la adecuada
			cameraApi.getCameraInfo()
				.then(function (data) {

					$log.debug('Información correcta');
					//                    if (globVar.camSession === '') {
					cameraApi.startSession()
						.then(function (data) {
								globVar.connectedToCamera = true;
								Options.saveSession(globVar.camSession);
								$log.info('Session id = ' + globVar.camSession);
								// Pedimos información de la cámara, con esta información
								// podemos comprobar la licencia de uso ***TBD***
								cameraApi.getStatus()
									.then(function (data) {
											$log.info('getStatus OK');
											cameraApi.setApiLevel(2)
												.then(function (data) {
														$log.info('SetApiLevel OK');
														cameraApi.setOptions(CN.PANO_INDOOR, globVar.lat, globVar.lon)
															.then(function (data) {
																	$log.info('setOptions OK');
																	q.resolve();
																},
																function (err) {
																	globVar.connectedToCamera = false;
																	$log.error('Error en setOptions: ' + err);
																	q.reject();
																});
													},
													function (err) {
														globVar.connectedToCamera = false;
														$log.error('Error en SetApiLevel: ' + err);
														q.reject();
													});
										},
										function (err) {
											globVar.connectedToCamera = false;
											$log.error('Error en getStatus: ' + err);
											q.reject();
										});
							},
							function (err) {
								// Ver si existe una sesión en la base de datos. Esto lo hacemos
								// por si se vuelve a ¡niciar el proceso y la sesión está
								// ya establecida (en principio poco probable)
								Options.get()
									.then(function (result) {
										globVar.connectedToCamera = true;
										globVar.camSession = result.sessionId;
										$log.info('Session id obtenida de DB = ' + globVar.camSession);
										q.resolve();
									}, function () {
										globVar.connectedToCamera = false;
										$log.error('Error en startSession: ' + err);
										q.reject();
									});
							});
					/*                   } else {
                        // Ya tenemos una identidad de sesión
                        $log.info('Ya teníamos sesión con id = ' + globVar.camSession);
                        q.resolve();
                    }
*/
				}, function (err) {
					globVar.connectedToCamera = false;
					$log.error('Error en la cámara: ' + $translate.instant(err));
					q.reject();
				});
			return q.promise;
		} // end function init()
		//---------------------------------------------------------------

		/**------------------------------------------------------------
		 * Comprobar estado de la cámara y reestablecer la conexión
		 * si es necesario
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function checkCamera() {
			var q = $q.defer();

			cameraApi.getStatus()
				.then(function (data) {
						globVar.connectedToCamera = true;
						$log.info('getStatus OK');
						q.resolve();
					},
					function (err) {
						globVar.connectedToCamera = false;
						$log.info('getStatus NOK');
						q.reject();
					});

			return q.promise;
		} // end function checkCamera()
		//---------------------------------------------------------------

		/**------------------------------------------------------------
		 * Comprobar estado de la cámara
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function updateHdr(value) {
			var q = $q.defer();
			var options;

			if (value) {
				options = CN.PANO_INDOOR;
				$log.debug('Activar HDR');
			} else {
				options = CN.PANO_OUTDOOR;
				$log.debug('Desactivar HDR');
			}

			cameraApi.setOptions(options, globVar.lat, globVar.lon)
				.then(function (data) {
						$log.info('setOptions OK');
						q.resolve();
					},
					function (err) {
						$log.error('Error en setOptions: ' + err);
						q.reject();
					});
			return q.promise;
		} // end function updateHdr()
		//---------------------------------------------------------------

		/**---------------------------------------------------------------
		 * Descargar desde la cámara las fotos que todavía no se hayan
		 * descargado. Esto es un servicio que se dispara periódicamente
		 * en segundo plano. Las fotos se descargan de una en una,
		 * cada vez que se dispara el servicio sólo se descarga una.
		 *
		 * @ngdoc function
		 * @returns {promise}
		 *------------------------------------------------------------*/
		function downloadPhotos() {
			var q = $q.defer();
			/*
						Tours.getAllPanos(CN.PANO_IN_CAMERA)
							.then(function (data) {
								if (data.length > 0) {
									$log.debug('Encontrados panos sin descargar');

									$log.info('tourId: ' + data[0].tourid);
									$log.info('panoId: ' + data[0].panoid);
									$log.info('name: ' + data[0].name);
									$log.info('pano: ' + data[0].pano);
									$log.info('status: ' + data[0].status);
									// Descargar el archivo del panorama
									var tourId = data[0].tourid;
									var panoId = data[0].panoid;
									// File name only
									var filename = data[0].pano.split('/')
										.pop();
									// Save location
									var targetPath = cordova.file.dataDirectory + filename;
									var fileOnCamera = data[0].pano;

									$cordovaFileTransfer.download(fileOnCamera, targetPath, {}, true)
										.then(function (res) {
											$log.debug('Save file on ' + targetPath + ' success!');
											// Si el archivo se ha guardado, comprobar si existe
											$cordovaFile.checkFile(cordova.file.dataDirectory, filename)
												.then(function (success) {
													$log.debug('El archivo ' + targetPath + ' existe!');
													// Actualizamos el registro del panorama
													Tours.UpdatePanoStatus(tourId, targetPath, panoId, CN.PANO_DOWNLOADED)
														.then(function () {
															$log.debug("Pano actualizado en la BD");
															cameraApi.delPhoto(fileOnCamera)
																.then(function (data) {
																		$log.info('Foto' + fileOnCamera + ' borrada OK');
																		q.resolve();
																	},
																	function (err) {
																		$log.error('Error al borrar foto: ' + err);
																		q.resolve();
																	});
														}, function () {
															$log.debug("No es posible actualizar el pano en la BD");
															q.reject();
														});
												}, function (error) {
													$log.debug('El archivo ' + targetPath + ' NO existe!');
													q.reject();
												});
										}, function (error) {
											$log.debug('Error al descargar archivo');
											q.reject();
										}, function (progress) {
											// PROGRESS HANDLING GOES HERE
											var downloadProgress = (progress.loaded / progress.total) * 100;
											//$log.debug('Descarga: ' + downloadProgress);
										});
								} else {
									$log.debug('No encontrados panos sin descargar');
									globVar.newPhotos = false;
									q.reject();
								}
							}, function (error) {
								$log.debug('Error al leer panoramas a descargar' + error);
								q.reject();
							});
			*/
			return q.promise;
		} // end function downloadPhotos()
		//---------------------------------------------------------------

		/**------------------------------------------------------------
		 * Comprobar si existe la Wifi de la cámara y devolverla
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function getCameraWifi() {
			var q = $q.defer();
			var netSSSID;
			//Scan Networks for Theta Wifi
			window.WifiWizard.startScan(function () {
				//Scan Started give it a few seconds to populate
				$log.debug('Wifi AP Scan Started');
				//We waited on the scan for a few seconds, now get the results.
				window.WifiWizard.getScanResults({
					numLevels: 5
				}, function (networks) {
					$log.debug('Got WIFI Scan Results');
					$log.debug(networks);
					var thetaNetworkFound = false;
					/* jshint loopfunc:true */
					for (var i = 0; i < networks.length; i++) {
						var network = networks[i];
						if (network.SSID.includes("THETA")) {
							netSSSID = network.SSID;
							// Comprobar si la red coincide con la que está almacenada
							if (globVar.cameraWifi === netSSSID) {
								$log.debug('Found A Theta SSID');
								q.resolve(netSSSID);
								thetaNetworkFound = true;
							} else {
								$log.debug('Nueva red Theta');
								q.reject(netSSSID);
								thetaNetworkFound = false;
							}
						}
					}
					if (!thetaNetworkFound) {
						$log.error('Could Not Find THETA Wifi. Make Sure Theta Wifi Is On And In Range');
						q.reject();
					}
				}, function () {
					$log.error('Failed To Get Wifi AP Scan Results');
					q.reject();
				});
			}, function () {
				$log.error('Could Not Initiate Wifi AP Scanning');
				q.reject();
			});
			return q.promise;
		}
		//---------------------------------------------------------------

		/**------------------------------------------------------------
		 * Conectar a la red Wifi de la Cámara Ricoh Theta S
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function connectToThetaWifi(SSID) {
			var q = $q.defer();
			//Do a little work to dig out the Wifi password from the AP Name.
			//This only works if the Wifi name is the default and starts with THETAXS and ends with .OSC
			var period_idx = SSID.indexOf('.');
			var password = SSID.substring(7, period_idx);
			var wifiwizard_connector = window.WifiWizard.formatWifiConfig(SSID, password, 'WPA');

			window.WifiWizard.addNetwork(wifiwizard_connector, function () {
				$timeout(function () {
					$log.debug(' Add Theta Wifi To Device');
					window.WifiWizard.connectNetwork(SSID, function () {
						$log.debug('Connected To Theta Wifi');
						q.resolve(SSID);
					}, function () {
						$log.error('Could Not Add Theta Wifi To Device', false);
						q.reject();
					});
				}, 1000);
			}, function () {
				$log.error('Could Not Add Theta Wifi To Device');
				q.reject();
			});
			return q.promise;
		}
		//---------------------------------------------------------------

		/**------------------------------------------------------------
		 * Desconectar Wifi de tel´wfono con la cámara
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function disconnectFromThetaWifi(SSID) {
			var q = $q.defer();
			window.WifiWizard.disconnectNetwork(SSID, function () {
				$timeout(function () {
					$log.debug(' disconnect Theta Wifi From Device');
					window.WifiWizard.removeNetwork(SSID, function () {
						$log.debug('Remove Theta Wifi');
						q.resolve();
					}, function () {
						$log.error('Could Not Remove Theta Wifi From Device', false);
						q.reject();
					});
				}, 1000);
			}, function () {
				$log.error('Could Not Disconnect Theta Wifi From Device');
				q.reject();
			});
			return q.promise;
		}
		//---------------------------------------------------------------

		/**------------------------------------------------------------
		 * Establecer la conexión Wifi o  omprobar si ya está
		 * establecida
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function checkConnCameraWifi() {
			var q = $q.defer();
			//Common.showToast($translate.instant('checking_wifi_desc_txt'), 'long', 'center');
			// *** Comprobar si la conexión ya está establecida ***
			window.WifiWizard.isWifiEnabled(function (isEnabled) {
				if (isEnabled) {
					window.WifiWizard.getCurrentSSID(function (SSID) {
						$log.debug('Got Current SSID: ' + SSID);
						if (SSID.includes("THETA")) {
							$log.info('Es una Theta SSID');
							// Ya estamos conectados, a la salida no hay que rehacer la conexión
							q.resolve(SSID);
						} else {
							$log.debug('Not A Theta SSID - Start Scan');
							// Devolvemos 'true' por la salida de error, no estamos conectados
							// pero realmente no es un error
							q.reject(true);
						}
					}, function () {
						$log.debug('Could Not Read Current SSID - Likely just not connected to anything');
						// Devolvemos 'true' por la salida de error, no estamos conectados
						// pero realmente no es un error
						q.reject(true);
					});
				} else {
					enableDeviceWifi()
						.then(function () {
								$log.debug('Wifi habilitada');
								//Common.showToast($translate.instant('wifi_enabled_txt'), 'long', 'center');
								// Devolvemos 'true' por la salida de error, no estamos conectados
								// pero realmente no es un error
								q.reject(true);
							},
							function (err) {
								$log.error('Error habilitando la wifi del móvil');
								// Hay que empezar de nuevo, por eso devolvemos false
								q.reject(false);
							});
				}
			}, function () {
				$log.error('Could Not Turn On Device Wifi.');
				// Hay que empezar de nuevo, por eso devolvemos false
				q.reject(false);
			});
			return q.promise;
		}
		//---------------------------------------------------------------

		/**------------------------------------------------------------
		 * Conectar a la Wifi de la cámara tratando todas las
		 * posibilidades
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function connectToCameraWifi() {
			var q = $q.defer();

			checkConnCameraWifi()
				.then(function (SSID) {
						// Ya estábamos conectados a la wifi de la cámara
						q.resolve(SSID);
					},
					function (err) {
						$log.info('Wifi del móvil habilitada pero no conectada a la cámara');
						if (err) {
							// La conexión wifi está habilitada pero está conectado a
							// otra red o no está conectado
							getCameraWifi()
								.then(function (SSID) {
										//Common.showToast($translate.instant('camera_wifi_found_txt') + ' ' + SSID, 'long', 'center');
										$log.debug('Obtenida wifi de la cámara: ' + SSID);
										connectToThetaWifi(SSID)
											.then(function () {
													q.resolve(SSID);
												},
												function (err) {
													q.reject();
												});
									},
									function (SSID) {
										if (!SSID) {
											q.reject();
										} else {
											connectToThetaWifi(SSID)
												.then(function () {
														Options.saveWifi(SSID)
															.then(function () {
																globVar.cameraWifi = SSID;
																$log.debug('Theta SSID guardada');
																q.resolve(SSID);
															}, function (err) {
																globVar.connectedToCamera = false;
																$log.error('Error al guardar opciones: ' + err);
																q.reject();
															});
													},
													function (err) {
														q.reject();
													});
										}
									});
						} else {
							// No se puede habilitar la conexión wifi
							q.reject();
						}
					});
			return q.promise;
		}
		//---------------------------------------------------------------


		/**------------------------------------------------------------
		 * Comprobar licencia por la aplicación
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function enableDeviceWifi() {
			var q = $q.defer();
			window.WifiWizard.setWifiEnabled(true, function () {
				$log.info('Device WIFI Enabled');
				q.resolve();
			}, function () {
				$log.error('Could Not Turn On Device Wifi.');
				q.reject();
			});
			return q.promise;
		}
		//---------------------------------------------------------------


		/**------------------------------------------------------------
		 * Comprobar licencia por la aplicación
		 *
		 * @ngdoc function
		 *------------------------------------------------------------*/
		function checkLicense(data) {
			// Comprobar datos para licencia
		}
		//---------------------------------------------------------------

	}

})();
