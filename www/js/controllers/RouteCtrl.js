'use strict';
angular.module('AppModule')

	.controller('RouteCtrl',
		function (
			$scope,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$resource,
			$log,
			$ionicSideMenuDelegate,
			$state,
			$ionicHistory,
			globVar,
			Common,
			RoutesService,
			Maps
		) {

			var LogId = 'RouteCtrl: ';

			$log.debug(LogId + "Entrada en RouteCtrl");

			$scope.openMenu = function () {
				//DataService.clear();
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.goToList1 = function () {
				$log.debug("goToList1");
				$state.go('app.list_1');
			};

			$scope.goToMap1 = function () {
				$log.debug("goToMap1");
				$state.go('app.map_1');
			};

			//--------------------------------------------------------------
			// Este evento se dispara cuando la vista está cargada y activa
			// y siempre se dispara aunque la página esté en cache
			//--------------------------------------------------------------
			$scope.$on('$ionicView.beforeEnter', function () {

				$log.debug(LogId + "$ionicView.beforeEnter");

				$scope.route = [];

				$ionicHistory.clearHistory();

				if (globVar.back === 1) {
					globVar.back = 0;
				}

				var routeId = $stateParams.routeId;

				if (!routeId) {
					routeId = globVar.routeId;
				} else {
					globVar.routeId = routeId;
				}

				if (typeof routeId != 'undefined') {
					$log.debug(LogId + "routeId recibido = " + routeId);
					globVar.showDesc = true;
					//-------------------------------------------------------------
					// Carga desde la lista de rutas, tenemos que tomar los datos
					// de la ruta y dibujar el mapa en las coordenadas de la ruta
					$scope.route = RoutesService.getDataById(routeId, 'routes');

					$log.debug(LogId + "globVar.lat = " + globVar.lat);
					$log.debug(LogId + "globVar.lon = " + globVar.lon);
					$log.debug(LogId + "$scope.route.lat = " + $scope.route.lat);
					$log.debug(LogId + "$scope.route.lon = " + $scope.route.lon);

					$log.debug(LogId + "Sí hay cambio en el mapa");
					Maps.getNearPanos($scope.route.lat, $scope.route.lon)
						.then(function () {
							globVar.mapChange = 1;
						});

					//------------------------------------------
					// Guardar las nuevas coordenadas del mapa
					//------------------------------------------
					globVar.lat = parseFloat($scope.route.lat);
					globVar.lon = parseFloat($scope.route.lon);
					globVar.zoom = parseInt($scope.route.zoom);
					globVar.name = $scope.route.title;

				} else {
					$log.debug(LogId + "routeId no recibido");
				}
			});


		});
