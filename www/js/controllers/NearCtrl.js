'use strict';
angular.module('AppModule')

	.controller('NearCtrl',
		function (
			$scope,
			$state,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$ionicLoading,
			$resource,
			$ionicSideMenuDelegate,
			$log,
			$cordovaGeolocation,
			BackendService,
			globVar,
			Maps,
			DataService
		) {

			var LogId = 'NearCtrl: ';

			$scope.$on('$ionicView.afterEnter', function () {
				//-----------------------------
				// Encontrar ubicación actual
				//-----------------------------
				$scope.locate();
			});

			$scope.openMenu = function () {
				//DataService.clear();
				$ionicSideMenuDelegate.toggleLeft();
			};

			//===============================================================
			// locate:
			// Centrar el mapa en la ubicación actual del usuario
			//===============================================================
			$scope.locate = function () {
				$log.debug(LogId + "Entrada en locate");

				//----------------------------------------
				// Mostrar la ventana de espera de carga
				//----------------------------------------
				$ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					maxWidth: 900
				});

				var posOptions = {
					timeout: 10000,
					maximumAge: 600000,
					enableHighAccuracy: true
				};

				$cordovaGeolocation
					.getCurrentPosition(posOptions)
					.then(function (position) {
						//--------------------------------------------------
						// Colocar las coordenadas actuales en el indice 0
						//--------------------------------------------------
						globVar.lat = position.coords.latitude;
						globVar.lon = position.coords.longitude;
						globVar.zoom = 13;

						globVar.mapChange = 1;

						Maps.getNearPanos(globVar.lat, globVar.lon)
							.then(function () {
								//-------------------------------------
								// Añadir el marcador de 'estás aquí'
								//-------------------------------------
								var obj = {
									id: 0,
									address: '',
									city: '',
									country: '',
									description: '',
									distance: 0,
									lat: globVar.lat,
									lon: globVar.lon,
									province: '',
									thumbnail: '',
									title: $translate.instant("you_are_here_txt"),
									color: 0
								};
								DataService.setdataArray(obj, 'data', 0);

								//---------------------------------
								// Ocultar el indicador de espera
								//---------------------------------
								$ionicLoading.hide();

								globVar.showDesc = false;

								$state.go('app.map_2');
							});

						$log.debug(LogId + "Detectada posición: lat=" + position.coords.latitude + "  lon=" + position.coords.longitude);
						$ionicLoading.hide();

					}, function (err) {
						// error
						$ionicLoading.hide();
						$log.debug(LogId + "Error de posición!");
						$log.debug(LogId + err);
						$ionicPopup.alert({
							title: $translate.instant("location_nok_title_txt"),
							template: $translate.instant("location_nok_body_txt")
						});
					});
				$log.debug(LogId + "Después de determinar de posición!");
			};

		});
