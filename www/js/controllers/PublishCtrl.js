(function () {
	'use strict';
	angular.module('AppModule')

		.controller('PublishCtrl',
			function (
				$scope,
				$stateParams,
				$ionicModal,
				$ionicPopup,
				$translate,
				$resource,
				$ionicSideMenuDelegate,
				$log,
				$state,
				$cordovaDeviceOrientation,
				CachedPanos,
				Login,
				$http,
				globVar,
				$cordovaGeolocation,
				BackendService,
				leafletData,
				$ionicLoading,
				$ionicPlatform,
				PUBLISH_API,
				UPLOAD_PANO_API,
				GET_TASK_ID_API,
				KRPANO_API,
				$cordovaCamera,
				$window,
				Common
			) {
				$scope.globVar = globVar;

				//Borra un fichero
				var deleteFile = function (filePath) {
					var file = filePath.substr(filePath.lastIndexOf('/') + 1);
					window.requestFileSystem(window.TEMPORARY, 2 * 1024 * 1024, function (fs) {
						fs.root.getFile(file, {
							create: false
						}, function (fileEntry) {
							fileEntry.remove(function () {
								$log.debug('File removed.');
							}, function (error) {
								$log.debug('Error: ' + JSON.stringify(error));
							});

						}, function (error) {
							$log.debug('Error: ' + JSON.stringify(error));
						});
					}, function (error) {
						$log.debug('Error: ' + JSON.stringify(error));
					});
				};

				//Borramos las imagenes que se han seleccionado
				var clearCache = function () {
					CachedPanos.all()
						.then(function (result) {
							for (var i = 0; i < result.length; i++) {
								deleteFile(result[i].file_path);
								CachedPanos.remove({
									file_path: result[i].file_path
								});
							}
							$scope.isPanoSelected = false;
							$scope.tourData.selectedPano = null;
							$scope.tourData.selectedPanoThumb = null;
						});
				};

				//Reinicia el proceso de publicación
				$scope.resetPublish = function () {
					destroyPanoPreview();
					$scope.canCancel = true;
					$scope.isPanoSelected = false;
					$scope.tourData = {};
					$scope.tourData.title = "";
					$scope.publishing = false;
					$scope.isPublished = false;
					$scope.token = globVar.userToken;
					$scope.selecting = false;
					clearCache();
				};
				$scope.restartPublish = function () {
					$scope.resetPublish();
					$scope.step = "selectpano";
				};
				//Cambia hacia ese paso.
				$scope.goStep = function (step) {
					$scope.step = step;
				};

				//================================================
				// Pasos
				//================================================

				//Cancela el proceso de publicación y redirige al perfil del usuario.
				$scope.cancelPublish = function () {
					$scope.restartPublish();
					$scope.goProfile();
				};

				$scope.goProfile = function () {
					globVar.photographer = 0;
					var tmparr = globVar.userPhoto.split("=");
					var id_user = tmparr[tmparr.length - 1];
					location.href = "#/app/profile/" + id_user;
				};


				$scope.goMap = function () {
					$scope.goStep('map');

				};

				$scope.goData = function () {
					leafletData.getMap("publishMap")
						.then(function (map) {
							var latlng = map.getCenter();
							setPanoPosition(latlng.lat, latlng.lng);
						});
					$scope.goStep('data');
				};

				$scope.goPublishing = function () {
					$scope.goStep('publishing');
				};

				//Ejecuta acciones al entrar en cada paso.
				//timeout espera a que aparezcan los elementos
				$scope.$watch('step', function (newValue, oldValue) {
					//entrar datos
					if (newValue === 'data' && oldValue != newValue) {

						setTimeout(function () {
							//createPanoPreview();
						}, 0);
					}

					if (oldValue === 'data' && oldValue != newValue) {
						setTimeout(function () {
							//destroyPanoPreview();
						}, 0);
					}
					//entrar mapa
					if (newValue === 'map' && oldValue !== newValue) {
						setTimeout(function () {
							leafletData.getMap("publishMap")
								.then(function (map) {
									map.invalidateSize();
									map.on('moveend', function (event) {});
								});
						}, 0);

					}
					//entrar selectpano
					if (newValue === 'selectpano' && oldValue !== newValue) {
						if ($scope.isAndroid) {
							setTimeout(function () {
								compassArrow = document.getElementById("compass-arrow");
								var options = {
									frequency: 100
								};
								$scope.watchID = navigator.compass.watchHeading(onHeadingSuccess, onHeadingError, options);

							}, 0);
						}

					}
					//salir selectpano
					if (oldValue !== newValue && oldValue === 'selectpano') {
						navigator.compass.clearWatch($scope.watchID);
						setTimeout(function () {
							compassArrow = null;
						}, 0);

					}
				});




				//================================================
				// Brujula
				//================================================

				var compassArrow = null;

				$scope.openMenu = function () {
					$ionicSideMenuDelegate.toggleLeft();
				};

				function onHeadingSuccess(heading) {
					if (compassArrow) {
						$scope.heading = heading.magneticHeading;
						var arrow = 360 - heading.magneticHeading;
						var r = 'rotate(' + arrow + 'deg)';
						compassArrow.style.webkitTransform = r;
						compassArrow.style.mozTransform = r;
						compassArrow.style.msTransform = r;
						compassArrow.style.oTransform = r;
						compassArrow.style.transform = r;
					}
					if ($scope.heading > 350 || $scope.heading < 10) {
						compassArrow.classList.add("ok");
					} else {
						compassArrow.classList.remove("ok");
					}
				}

				function onHeadingError(compassError) {
					$log.debug('Compass error: ' + compassError.code);
				}


				//================================================
				// Seleccionar Panorama
				//================================================
				$scope.selectPano = function () {
					if ($scope.selecting) {
						return;
					} else {
						$scope.selecting = true;
					}
					var posOptions = {
						timeout: 10000,
						maximumAge: 600000,
						enableHighAccuracy: true
					};
					$scope.tourData.location = $translate.instant("obtaining_location_txt");
					$cordovaGeolocation
						.getCurrentPosition(posOptions)
						.then(function (position) {
							setPanoPosition(position.coords.latitude, position.coords.longitude);

						}, function (err) {
							setPanoPosition(0, 0);
						});

					function cameraSuccess(imageData) {
						var metadata;
						var thisResult = JSON.parse(imageData);

						$scope.imgURI = thisResult.filename;

						if (thisResult.json_metadata !== '') {
							// convert json_metadata JSON string to JSON Object
							metadata = JSON.parse(thisResult.json_metadata);

							if (metadata !== "{}") {
								// Las coordenadas están en Grados Minutos Segundos, hay que convertir a decimal
								/*
								*** Metadatos de la foto
								{"filename":"/storage/emulated/0/Pictures/panoramas/PANO_20170423_182732_24.jpg",
								"json_metadata":"{\"aperture\":\"2.0\",\"datetime\":\"2017:04:23 18:27:32\",
								\"exposureTime\":\"5.0E-4\",\"flash\":\"0\",\"focalLength\":\"131/100\",
								\"gpsAltitude\":null,\"gpsAltitudeRef\":null,\"gpsDateStamp\":null,
								\"gpsLatitude\":\"37/1,23/1,7908/1000\",\"gpsLatitudeRef\":\"N\",
								\"gpsLongitude\":\"5/1,59/1,34491/1000\",\"gpsLongitudeRef\":\"W\",
								\"gpsProcessingMethod\":null,\"gpsTimestamp\":null,\"iso\":\"100\",
								\"make\":\"RICOH                \",\"model\":\"RICOH THETA S
								\",\"orientation\":\"1\",\"whiteBalance\":\"0\"}"}"
								*/
								if (!ionic.Platform.isAndroid()) {
									if (metadata.Latitude !== null && metadata.Longitude !== null) {
										setPanoPosition(Common.gpsToDec(metadata.Latitude, metadata.LatitudeRef),
											Common.gpsToDec(metadata.Longitude, metadata.LongitudeRef));
									}
								} else {
									if (metadata.gpsLatitude !== null && metadata.gpsLongitude !== null) {
										setPanoPosition(Common.gpsToDec(metadata.gpsLatitude, metadata.gpsLatitudeRef),
											Common.gpsToDec(metadata.gpsLongitude, metadata.gpsLongitudeRef));
									}
								}
							}
						}

						$log.debug('Image URI: ' + $scope.imgURI);
						CachedPanos.add({
							file_path: $scope.imgURI
						});
						$scope.tourData.selectedPano = $scope.imgURI;
						createThumbnail($scope.imgURI);
						$scope.selecting = false;
					}

					function cameraError(err) {
						$scope.selecting = false;
						$log.debug('Error: ' + err);
					}


					if (ionic.Platform.isAndroid()) {

						clearCache();
						navigator.camera.cleanup();

						var options = {
							quality: 100,
							destinationType: navigator.camera.DestinationType.FILE_URI,
							sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
							allowEdit: false,
							encodingType: navigator.camera.EncodingType.JPEG,
							popoverOptions: navigator.CameraPopoverOptions,
							correctOrientation: true,
							saveToPhotoAlbum: false
						};

						navigator.camera.getPicture(cameraSuccess, cameraError, options);

					} else {

						window.imagePicker.getPictures(
							function (results) {
								if (results.length > 0) {
									$ionicLoading.show({
										content: 'Loading',
										animation: 'fade-in',
										maxWidth: 900
									});
									$log.debug('Image URI: ' + results[0]);
									CachedPanos.add({
										file_path: results[0]
									});
									$scope.tourData.selectedPano = results[0];
									createThumbnail(results[0]);
								}
								$scope.selecting = false;
							},
							function (error) {
								$scope.selecting = false;
								$log.debug('Error: ' + error);
							}, {
								maximumImagesCount: 1
							}
						);
					}
				};


				//Crea un thumbnail a partir de un objeto canvas
				//Además comprueba que el tamaño de la imagen cumple con el de un panorama
				function createThumbnail(url) {
					var tempImg = new Image();
					tempImg.src = url;
					tempImg.onload = function () {
						// Get image size and aspect ratio.
						var targetWidth = tempImg.width;
						var targetHeight = tempImg.height;
						var aspect = tempImg.width / tempImg.height;

						//Get vaov
						$scope.tourData.vaov = 180 * (tempImg.height * 2) / tempImg.width;

						if ($scope.tourData.vaov > 180) {
							$scope.restartPublish();
							$ionicLoading.hide();
							$ionicPopup.alert({
								title: "",
								template: $translate.instant("incorrect_proportions_txt")
							});
							return;
						}
						$scope.goData();
						$ionicLoading.hide();

					};
				}

				// Abrir con la página para comnectar con la cámara 360
				//
				$scope.open360Camera = function () {
					window.location.href = "#/Camera";
				};


				//================================================
				// Datos
				//================================================

				var createPanoPreview = function () {
					var settings = {};
					settings.inlinexmlstring = '<krpano><image><sphere url="' + $scope.tourData.selectedPano + '" /></image></krpano>';
					window.embedpano({
						swf: "krpano/krpano.js",
						xml: KRPANO_API + "/app_preview.xml",
						target: "publishPanoPreview",
						html5: "prefer",
						passQueryParameters: true,
						initvars: settings,
						id: "krpano-embed"
					});
				};

				var destroyPanoPreview = function () {
					if (document.getElementById("krpano-embed")) {
						window.removepano("krpano-embed");
					}
				};


				//================================================
				// Mapa
				//================================================

				angular.extend($scope, {
					map: {
						defaults: {
							zoomControl: false
						},
						center: {
							lat: 0,
							lng: 0,
							zoom: 22
						},
						events: {
							map: {
								enable: ['zoomstart', 'drag', 'click', 'mousemove'],
								logic: 'emit'
							}
						}
					}
				});

				$scope.map.markers = [];

				var setPanoPosition = function (lat, lng) {
					$scope.map.markers = [];

					$scope.map.center.lat = lat;
					$scope.map.center.lng = lng;
					$scope.map.center.zoom = 22;
					var locationUnknown = true;
					if (lat !== 0 && lng !== 0) {
						BackendService.reversegeocode.get({}, {
								'lat': lat,
								'lng': lng
							},
							function (resp) {

								var result = resp.status;
								if (resp.status == 'OK') {
									var results = resp.results;
									if (results.length > 0) {
										$scope.tourData.location = results[0].formatted_address;
										for (var i = 0; i < results[0].address_components.length; i++) {
											var component = results[0].address_components[i];
											if (component.types[0] == "postal_code") {
												$scope.tourData.postal_code = component.long_name;
											} else if (component.types[0] == "route") {
												$scope.tourData.street = component.long_name;
											} else if (component.types[0] == "locality") {
												$scope.tourData.city = component.long_name;
											} else if (component.types[0] == "country") {
												$scope.tourData.country = component.long_name;
											}
										}
									} else {
										$scope.setLocationUnknown();
									}

								} else {
									$scope.setLocationUnknown();
								}
							});
					} else {
						$scope.setLocationUnknown();
					}

				};

				$scope.setLocationUnknown = function () {
					$scope.tourData.location = $translate.instant("unknown_location_txt");
					$scope.map.center.zoom = 1;
					$scope.tourData.postal_code = "";
					$scope.tourData.street = "";
					$scope.tourData.city = "";
					$scope.tourData.country = "";
				};


				$scope.searchAddress = function () {
					cordova.plugins.Keyboard.close();
					BackendService.geocode.get({}, {
							'strAddress': $scope.map.address
						},
						function (resp) {

							var result = resp.status;

							if (result == "OK") {
								//-----------------------------
								// Se han recibido resultados
								//-----------------------------
								var latlng = resp.results[0].geometry.location;

								//--------------------------------------------------
								// Colocar las coordenadas actuales en el indice 0
								//--------------------------------------------------
								$log.debug("Recibidas coordenadas lat=" + latlng.lat + " lon=" + latlng.lng);
								$scope.map.center.lat = latlng.lat;
								$scope.map.center.lng = latlng.lng;
								$scope.map.center.zoom = 22;
							} else {
								$log.debug("Error en la llamada a Google API = " + result);
								//------------------------------
								// Se ha producido algún error
								//------------------------------
								var sTitle, sTemplate;
								switch (result) {
								case "ZERO_RESULTS":
									sTitle = $translate.instant("no_geocode_res_title_txt");
									sTemplate = $translate.instant("no_geocode_res_body_txt");
									break;

								default:
									sTitle = $translate.instant("error_geocode_title_txt");
									sTemplate = $translate.instant("error_geocode_body_txt");
									break;
								}

								//--------------------------------------
								// Mostrar ventana que explica el error
								//--------------------------------------
								$ionicPopup.alert({
									title: sTitle,
									template: sTemplate
								});
							}
						},
						function () {});
				};





				//================================================
				// Subida
				//================================================


				var sendNotificationSuccess = function () {
					var date = new Date();

					cordova.plugins.notification.local.schedule({
						id: 1,
						title: $translate.instant("notification_title_txt"),
						text: $translate.instant("publish_notification_success_txt"),
						at: date,
						icon: 'res://ic_stat_notification_icon',
						color: 'A31A16'
					});
				};

				var sendNotificationError = function () {
					var date = new Date();

					cordova.plugins.notification.local.schedule({
						id: 1,
						title: $translate.instant("notification_title_txt"),
						text: $translate.instant("publish_notification_error_txt"),
						at: date,
						color: 'A31A16',
						icon: 'res://ic_stat_notification_icon'
					});
				};

				var publishingSuccess = function () {
					$scope.canCancel = false;
					$scope.step = "published";
					sendNotificationSuccess();
					$ionicPopup.alert({
						title: $translate.instant("publish_ok_txt"),
						template: $translate.instant("pano_is_published_txt")
					});
					$scope.$digest();
				};

				var publishingError = function (data) {
					$log.debug(data);
					$scope.canCancel = true;
					$scope.step = "error";
					sendNotificationError();
					$ionicPopup.alert({
						title: $translate.instant("PublishError_txt"),
						template: $translate.instant("UploadError_txt")
					});
					$scope.$digest();
				};



				var uploadSuccess = function (r) {
					var response = JSON.parse(r.response);
					if (!response.success) {
						publishingError("upload API failed.");
						return;
					}
					$http({
							method: 'GET',
							url: PUBLISH_API,
							params: {
								token: $scope.token,
								title: $scope.tourData.title,
								description: $scope.tourData.description,
								lat: $scope.map.center.lat,
								lon: $scope.map.center.lng,
								zoom: $scope.map.center.zoom,
								address: $scope.tourData.address,
								city: $scope.tourData.city,
								postal_code: $scope.tourData.postal_code,
								country: $scope.tourData.country,
								id_task: $scope.id_task,
								portal: globVar.idPortal
							}
						})
						.then(
							successPublishCallback, errorPublishCallback
						);

				};


				function successPublishCallback(response) {
					if (!response.data.success) {
						publishingError("publish api failed");
						return;
					} else {
						$scope.isPublished = true;
						publishingSuccess();
					}
					clearCache();
				}

				function errorPublishCallback(response) {
					publishingError(response.data);
				}

				var UploadFail = function (error) {
					$log.debug("upload error source " + error.source);
					$log.debug("upload error target " + error.target);
					publishingError(error.source + " " + error.target);

				};

				function uploadPano() {
					var options = new FileUploadOptions();
					options.fileKey = "file";
					options.fileName = $scope.tourData.selectedPano.substr($scope.tourData.selectedPano.lastIndexOf('/') + 1);
					options.mimeType = "image/jpg";

					var params = {};
					params.token = $scope.token;
					params.id_task = $scope.id_task;

					options.params = params;

					var ft = new FileTransfer();
					ft.upload($scope.tourData.selectedPano, encodeURI(UPLOAD_PANO_API), uploadSuccess, UploadFail, options);
				}


				$scope.publish = function () {

					if ($scope.tourData.title === "") {
						$ionicPopup.alert({
							template: $translate.instant("title_missing_txt")
						});

						return;
					}
					$scope.canCancel = false;
					destroyPanoPreview();
					$scope.goPublishing();
					$http({
							method: 'GET',
							url: GET_TASK_ID_API,
							params: {
								token: $scope.token
							}
						})
						.then(function successCallback(response) {
							$scope.id_task = response.data.id_task;
							if ($scope.id_task === null) {
								publishingError(response.data);
								return;
							}
							uploadPano();
						}, function errorCallback(response) {
							publishingError(response.data);
						});

				};


				///INICIALIZACIÓN
				$scope.$on("$ionicView.loaded", function (scopes, states) {

					$scope.deregisterBackButton = $ionicPlatform.registerBackButtonAction(
						function () {
							console.log("exit fs");

							if (document.getElementById("krpano-embed")
								.get("fullscreen")) {
								document.getElementById("krpano-embed")
									.set("fullscreen", false);
							} else {
								$scope.myGoBack();
							}
						}, 100
					);


					$scope.restartPublish();
					if (ionic.Platform.isAndroid()) {
						$scope.isAndroid = false;
					} else {
						$scope.isAndroid = false;
					}
					if ($scope.isAndroid) {
						setTimeout(function () {
							compassArrow = document.getElementById("compass-arrow");

							var options = {
								frequency: 100
							};
							$scope.watchID = navigator.compass.watchHeading(onHeadingSuccess, onHeadingError, options);


						}, 0);
					}
				});

				$scope.$on('$ionicView.beforeLeave', function () {
					$scope.deregisterBackButton();
				});


			});

}());
