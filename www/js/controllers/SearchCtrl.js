'use strict';
angular.module('AppModule')

	.controller('SearchCtrl',
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
			BackendService,
			globVar,
			DataService,
			Maps
		) {

			var LogId = 'SearchCtrl: ';

			$scope.openMenu = function () {
				//DataService.clear();
				$ionicSideMenuDelegate.toggleLeft();
			};

			//======================================================
			// findLocation:
			// Buscar una ubicación a partir de la dirección postal
			//======================================================
			$scope.findLocation = function (searchText) {
				$log.debug(LogId + "Entrada en findLocation");

				var sTitle;
				var sTemplate;
				var valor = searchText;

				$log.debug(LogId + "Entrada en findLocation, búsqueda: " + valor);

				//----------------------------------------
				// Mostrar la ventana de espera de carga
				//----------------------------------------
				$ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					maxWidth: 900
				});

				//----------------------------------------------------------------------------
				// Llamada al API de Google para determinar la localización a partir de la
				// dirección postal
				//----------------------------------------------------------------------------
				BackendService.geocode.get({}, {
					'strAddress': valor
				}, function (resp) {

					var result = resp.status;

					if (result == "OK") {
						DataService.clear('data');
						//-----------------------------
						// Se han recibido resultados
						//-----------------------------
						var latlng = resp.results[0].geometry.location;

						//--------------------------------------------------
						// Colocar las coordenadas actuales en el indice 0
						//--------------------------------------------------
						$log.debug(LogId + "Recibidas coordenadas lat=" + latlng.lat + " lon=" + latlng.lng);
						globVar.lat = latlng.lat;
						globVar.lon = latlng.lng;
						globVar.zoom = 13;

						globVar.mapChange = 1;

						Maps.getNearPanos(globVar.lat, globVar.lon)
							.then(function () {
								//---------------------------------
								// Ocultar el indicador de espera
								//---------------------------------
								$ionicLoading.hide();

								$state.go('app.map_2');
							});
					} else {
						$log.debug(LogId + "Error en la llamada a Google API = " + result);
						//------------------------------
						// Se ha producido algún error
						//------------------------------
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
						//---------------------------------
						// Ocultar el indicador de espera
						//---------------------------------
						$ionicLoading.hide();

						//--------------------------------------
						// Mostrar ventana que explica el error
						//--------------------------------------
						$ionicPopup.alert({
							title: sTitle,
							template: sTemplate
						});
					}
				}, function () {});
			};

		});
