(function () {
	'use strict';

	angular
		.module('AppModule')
		.controller('VRCameraCtrl', VRCameraCtrl);

	/* @ngInject */
	function VRCameraCtrl(
		$scope,
		$q,
		$stateParams,
		$ionicModal,
		$ionicPopup,
		$translate,
		$resource,
		$ionicSideMenuDelegate,
		$log,
		$interval,
		$cordovaFileTransfer,
		$cordovaFile,
		DataService,
		$state,
		BackendService,
		camService,
		globVar,
		CN,
		cameraApi,
		Common,
		Options,
		$timeout
	) {
		var vm = this;
		vm.property = 'VRCameraCtrl';
		$scope.panoData = {};
		$scope.pageData = {};
		var permissions = cordova.plugins.permissions;
		var fileUrl;
		var continueOperation = false;
		var stopConnecting;
		var scanningAndConnecting = false;
		var stopConn;

		$scope.isAndroid = ionic.Platform.isAndroid();
		//$scope.isAndroid = false;

		$scope.openMenu = function () {
			//DataService.clear('sel');
			$ionicSideMenuDelegate.toggleLeft();
		};

		// Tomar parámetro HDR
		if (globVar.hdr === CN.PANO_INDOOR) {
			$scope.hdr = true;
		} else {
			$scope.hdr = false;
		}

		$scope.delFoto = true;

		if (window.analytics) {
			window.analytics.trackView('Home');
		}

		// Lanzar tarea en segundo plano para comprobar conexión con la cámara
		$interval(function (event, toState, toParams, fromState, fromParams) {
			// Comprobar estado de conexión
			if (globVar.connectedToCamera && !globVar.takingPhoto && !$scope.cameraConnecting) {
				$log.debug('Comprobar estado de conexión');

				camService.checkCamera()
					.then(function () {
							globVar.connectedToCamera = true;
							$log.debug('Conexión camara OK');
						},
						function (err) {
							$log.error('Conexión camara Error');
							globVar.connectedToCamera = false;
							$scope.percentBatteryLevel = globVar.batteryLevel * 100;
							$scope.cameraConnected = globVar.connectedToCamera;
							if ($scope.isAndroid) {
								camService.disconnectFromThetaWifi($scope.SSID)
									.then(function () {
										$scope.cameraConnecting = false;
										globVar.connectedToCamera = false;
										$scope.tries = 0;
										$interval.cancel(stopConn);
									});
							}
							// Si estamos en la página de cámara, recargar, si estamos en
							// otra página, volver a la de cámara
							//$state.reload();
							window.location.href = '#/Camera';
						});
			}
		}, 1000 * 5); // x segundos

		//------------------$ionicView.enter------------------------------------
		$scope.$on('$ionicView.enter', function () {

			$scope.tries = 0;
			$scope.cameraConnected = globVar.connectedToCamera;
			$scope.conn = globVar.forceCameraConnect;
			$scope.percentBatteryLevel = globVar.batteryLevel * 100;
			$scope.cameraConnecting = false;
			//Evento actual
			$scope.currentEvent = {
				active: false
			};
			// Comprobar y pedir permiso para escribir en tarjeta SD
			permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function (status) {
				if (status.hasPermission) {
					$log.debug("Existe permiso de escritura en tarjeta SD");
				} else {
					$log.debug("No existe permiso de escritura en tarjeta SD");
					// Pedir permiso de escritura en tarjeta SD
					permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function () {
						$log.debug("Permiso de escritura en tarjeta SD concedido");
					}, function (error) {
						$log.debug("Permiso de escritura en tarjeta SD NO concedido - " + error);
						$ionicPopup.alert({
							title: $translate.instant('error_txt'),
							template: $translate.instant('error_perm_txt'),
							buttons: [{
								text: $translate.instant('ok_txt')
							}]
						});
					});
				}
			});
		});
		//------------------$ionicView.enter------------------------------------

		$scope.$on('$ionicView.leave', function () {

		});

		$scope.myGoBack = function () {
			if ($scope.isAndroid && $scope.cameraConnected) {
				$interval.cancel(stopConn);
				camService.disconnectFromThetaWifi($scope.SSID)
					.then(function () {
						globVar.connectedToCamera = false;
						$scope.cameraConnected = false;
						$scope.cameraConnecting = false;
						$scope.tries = 0;
					});
			}
			window.location.href = '#/app/home';
		};

		//---------------------------------------------------------------
		// Iniciar procedimineto de conexión con la cámara, según el SO
		//---------------------------------------------------------------
		$scope.startConnection = function () {
			if ($scope.isAndroid) {
				//Common.showToast($translate.instant('connecting_camera_txt'), 'long', 'center');
				//--------------------------------------
				// Conectar con la cámara en Android
				//--------------------------------------
				// Lanzar tarea en segundo plano para comprobar conexión con la cámara
				stopConn = $interval(function (event, toState, toParams, fromState, fromParams) {
					// Comprobar estado de conexión
					if (!$scope.cameraConnected && !$scope.cameraConnecting && $scope.tries < 8) {
						$scope.cameraConnecting = true;
						//Common.showToast($translate.instant('checking_wifi_desc_txt'), 'long', 'center');
						Common.waitWindow($translate.instant('connecting_camera_txt'), $translate.instant('checking_wifi_desc_txt'));
						$log.info("INTENTO DE CONEXIÓN " + $scope.tries);
						camService.connectToCameraWifi()
							.then(function (SSID) {
									$scope.SSID = SSID;
									$timeout(function () {
										$scope.connectCameraAPI()
											.then(function () {
													$log.debug('Cámara conectada');
													$scope.cameraConnected = true;
													globVar.connectedToCamera = true;
													$scope.cameraConnecting = false;
													Common.waitWindow(0);
													//Common.showToast($translate.instant('connected_to_camera_txt'), 'long', 'center');
													$interval.cancel(stopConn);
												},
												function (err) {
													//Common.showToast($translate.instant('err_camera_txt'), 'long', 'center');
													$log.error('Error conectando con la wifi de la cámara');
													$scope.cameraConnected = false;
													globVar.connectedToCamera = false;
													$scope.cameraConnecting = false;
													$scope.tries += 1;
												});
									}, 1000);
								},
								function (err) {
									$log.error('Error conectando con la wifi de la cámara');
									$scope.cameraConnected = false;
									globVar.connectedToCamera = false;
									$scope.cameraConnecting = false;
									$scope.tries += 1;
								});
					}
					if (!$scope.cameraConnected && $scope.tries >= 8) {
						$interval.cancel(stopConn);
						$scope.tries = 0;
						Common.waitWindow(0);
						$ionicPopup.alert({
							title: $translate.instant('err_camera_txt'),
							template: $translate.instant('err_camera_not_ok_txt'),
							buttons: [{
								text: $translate.instant('ok_txt')
							}]
						});
					}
				}, 1000 * 2); // x segundos

			} else {
				//--------------------------------------------------------------
				// Conectar cámara en iOS, La red Wifi debe estar ya conectada
				//--------------------------------------------------------------
				$scope.connectCameraAPI()
					.then(function () {
							$log.debug('Cámara conectada');
							$scope.cameraConnected = true;
							globVar.connectedToCamera = true;
							//Common.showToast($translate.instant('connected_to_camera_txt'), 'long', 'center');
						},
						function (err) {
							//Common.showToast($translate.instant('err_camera_txt'), 'long', 'center');
							$log.error('Error conectando con la cámara');
							$scope.cameraConnected = false;
							globVar.connectedToCamera = false;
							$ionicPopup.alert({
								title: $translate.instant('err_camera_txt'),
								template: $translate.instant('err_camera_not_ok_txt'),
								buttons: [{
									text: $translate.instant('ok_txt')
								}]
							});
						});
			}
		};



		//-------------------------------------
		// Connect with the 360 camera
		//-------------------------------------
		$scope.connectCameraAPI = function () {
			var q = $q.defer();
			Common.getLocation();

			camService.init()
				.then(function () {
						{}
						$log.info('Init camara OK');
						$scope.conn = true;
						$scope.cameraConnected = true;
						globVar.connectedToCamera = true;
						$scope.percentBatteryLevel = globVar.batteryLevel * 100;
						$interval.cancel(stopConnecting);
						stopConnecting = undefined;
						q.resolve();
					},
					function (err) {
						$log.error('Init camara Error');
						$scope.cameraConnected = false;
						globVar.connectedToCamera = false;
						q.reject();
					});
			return q.promise;
		};

		//---------------------------------------
		// Actualizar HDR en la cámara
		//---------------------------------------
		$scope.updateHDR = function () {
			$scope.buttondisabled = true;
			if ($scope.hdr) {
				$scope.hdr = false;
			} else {
				$scope.hdr = true;
			}
		};

		//---------------------------------------
		// Actualizar borrar foto en la cámara
		//---------------------------------------
		$scope.updateDeletePhoto = function () {
			//$scope.buttondisabled = true;
			if ($scope.delFoto) {
				$scope.delFoto = false;
			} else {
				$scope.delFoto = true;
			}
		};

		$scope.cancel = function () {
			$scope.stopCheckPhoto(0);
			Common.waitWindow(0);
		};

		//---------------------------------------
		// Realizar la foto
		//---------------------------------------
		$scope.takePanorama = function () {
			$scope.buttondisabled = true;
			$scope.pageData.photoDone = false;
			var idPhoto;

			Common.getLocation();

			if (globVar.connectedToCamera) {
				$log.debug('Comprobar estado de conexión');

				camService.checkCamera()
					.then(function () {
							globVar.takingPhoto = true;
							globVar.connectedToCamera = true;
							$log.debug('Conexión camara OK');
							Common.waitWindow($translate.instant('taking_photo_txt'),
								$translate.instant('taking_photo_desc_txt'));

							camService.updateHdr($scope.hdr)
								.then(function () {
										$log.debug("Cambiada opción HDR");
										$scope.buttondisabled = false;
										cameraApi.takePhoto()
											.then(function (data) {
													globVar.photoId = data;
													$log.info('Foto realizada, id = ' + globVar.photoId);
													// Bucle de comprobación del estado de la foto, cada segundo
													// se comprueba el estado
													$scope.checkPhoto();
												},
												function (err) {
													$log.error('Error en takePanorama: ' + err);
													globVar.takingPhoto = false;
													Common.waitWindow(0);
													$ionicPopup.alert({
														title: $translate.instant('err_camera_txt'),
														template: $translate.instant('err_camera_not_ok_txt'),
														buttons: [{
															text: $translate.instant('ok_txt')
														}]
													});
												});
									},
									function (err) {
										globVar.takingPhoto = false;
										$log.error('Error en cambio opción HDR');
									});
						},
						function (err) {
							globVar.takingPhoto = false;
							globVar.connectedToCamera = false;
							$log.error('Conexión camara Error');
							$ionicPopup.alert({
								title: $translate.instant('err_camera_txt'),
								template: $translate.instant('err_camera_not_ok_txt'),
								buttons: [{
									text: $translate.instant('ok_txt')
								}]
							});
						});
			}
		};

		//---------------------------------------
		// Comprobación de foto realizada
		//---------------------------------------
		var stop;
		$scope.checkPhoto = function () {
			// No iniciar nueva comprobación si hay una en marcha
			if (angular.isDefined(stop)) {
				return;
			}
			// Repetir cada 2 segundos, y hacerlo como máximo 30 veces
			stop = $interval(function () {
				/*jshint loopfunc: true */
				cameraApi.checkPhoto(globVar.photoId)
					.then(function (data) {
							if (data.state === 'done') {
								$log.info('setOptions OK');
								$scope.panoData.fileUrl = data.results.fileUrl;
								$scope.stopCheckPhoto(globVar.photoId, $scope.panoData.fileUrl);
							}
						},
						function (err) {
							globVar.takingPhoto = false;
							$log.error('Error en checkPhoto: ' + err);
							Common.waitWindow(0);
							$ionicPopup.alert({
								title: $translate.instant('err_camera_txt'),
								template: $translate.instant('err_camera_not_ok_txt'),
								buttons: [{
									text: $translate.instant('ok_txt')
								}]
							});
							$scope.stopCheckPhoto(0);
						});
			}, 1000 * 2, 30);
		};

		//---------------------------------------
		// Detener comprobación de foto realizada
		//---------------------------------------
		$scope.stopCheckPhoto = function (id) {

			if (angular.isDefined(stop)) {
				$interval.cancel(stop);
				stop = undefined;
				if (id !== 0) {
					$log.debug("Panorama realizado");
					$scope.pageData = {};

					$scope.filename = $scope.panoData.fileUrl.substring($scope.panoData.fileUrl.lastIndexOf('/') + 1);
					Common.waitWindow($translate.instant('taking_photo_txt'),
						$translate.instant('downloading_photo_desc_txt'));
					// Guardar imagen en galería de imágenes
					//Common.saveImageToPhone($scope.panoData.fileUrl, saveImageSuccess, saveImageError);
					Common.downloadPanorama($scope.panoData.fileUrl)
						.then(function (data) {
								$log.info('Foto: ' + data + ' descargada OK');
								saveImageSuccess(data);
							},
							function (err) {
								$log.error('Error al descargar foto: ' + err);
								saveImageError(err);
							});
				}
			}
		};

		//---------------------------------------
		// Descarga del panorama correcta
		//---------------------------------------
		function saveImageSuccess(imagePath) {
			$log.debug(imagePath);
			$log.debug('Save file ' + $scope.filename + ' success!');
			$scope.buttondisabled = false;
			$scope.pageData.photoDone = true;
			globVar.takingPhoto = false;
			if (globVar.delFoto) {
				deleteCameraPhoto();
			}
			Common.waitWindow(0);

			$ionicPopup.alert({
				title: $translate.instant('photo_done_txt'),
				template: '<img src="' + imagePath + '" style="max-width:100%;" /> <br /><br />' + $translate.instant('photo_done_desc_txt') + '<br />',
				buttons: [{
					text: $translate.instant('ok_txt')
				}]
			});
		}

		//---------------------------------------
		// Descarga del panorama incorrecta
		//---------------------------------------
		function saveImageError(err) {
			$log.error(err);
			globVar.takingPhoto = false;
			Common.waitWindow(0);
			$ionicPopup.alert({
				title: $translate.instant('error_photo_done_txt'),
				template: $translate.instant('error_photo_done_desc_txt'),
				buttons: [{
					text: $translate.instant('ok_txt')
				}]
			});
		}

		//---------------------------------------------
		// Borrar el panorama descargado de la cámara
		//---------------------------------------------
		function deleteCameraPhoto() {
			cameraApi.delPhoto($scope.panoData.fileUrl)
				.then(function (data) {
						$log.info('Foto' + $scope.panoData.fileUrl + ' borrada OK');
					},
					function (err) {
						$log.error('Error al borrar foto: ' + err);
					});
		}

	}
})();
