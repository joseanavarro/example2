'use strict';
angular.module('AppModule')

	//=======================================================
	// Control del mapa con leaflet
	//=======================================================
	.controller('MapCtrl',
		function (
			$scope,
			$state,
			$cordovaGeolocation,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$ionicLoading,
			$resource,
			$log,
			$ionicHistory,
			$ionicSideMenuDelegate,
			LocationsService,
			InstructionsService,
			BackendService,
			Common,
			globVar,
			DataService,
			$timeout,
			Maps,
			leafletData
		) {

			var LogId = 'MapCtrl: ';

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.myGoBack = function () {
				window.history.back();
			};

			$scope.goToList1 = function () {
				$log.debug("goToList1");
				$state.go('app.list_1');
			};

			$scope.goToList2 = function () {
				$log.debug("goToList2");
				$state.go('app.list_2');
			};

			$scope.goToRoute = function () {
				$log.debug("goToRoute");
				$state.go('app.route', {
					routeId: globVar.routeId
				});
			};

			//=======================================================
			// Evento: $ionicView.afterEnter
			// Se dispara cuando la vista actual está ya activa
			//=======================================================
			$scope.$on('$ionicView.afterEnter', function () {

				if (globVar.back === 1) {
					globVar.back = 0;
				}

				$ionicHistory.clearHistory();

				$scope.iniMap();

				if ($stateParams.lat !== undefined) {
					Maps.getNearPanos($stateParams.lat, $stateParams.lon)
						.then(function () {
							globVar.mapChange = 1;
							globVar.lat = $stateParams.lat;
							globVar.lon = $stateParams.lon;
							globVar.zoom = 22;

							$scope.showMap();

							$scope.form = {};
						});
				} else {
					$scope.showMap();

					$scope.form = {};
				}

			});

			//==================================================
			// saveLocation:
			// Guardar una ubicación introducida desde modal1
			//==================================================
			$scope.iniMap = function () {
				$log.debug(LogId + "Inicializar el mapa");
				//===========================================================
				// Definir valores de configuración de los mapas si el mapa
				// no ha sido inicializado con anterioridad
				//===========================================================
				$scope.map = {
					defaults: {
						maxZoom: 22,
						zoomControl: false
					},
					events: {
						map: {
							enable: ['context', 'moveend'],
							logic: 'emit'
						},
						markers: {
							enable: ['click'],
							logic: 'emit'
						}
					}
				};
			};


			//=======================================================
			// Definir la variable de localización
			//=======================================================
			var Location = function () {
				if (!(this instanceof Location)) {
					return new Location();
				}
				this.lat = "";
				this.lng = "";
				this.name = "";
				this.zoom = "";
			};

			//==============================
			// Definir los tipos de iconos
			//==============================
			var icons = {
				blue: {},
				green: {
					type: 'awesomeMarker',
					icon: 'star',
					markerColor: 'green'
				}
			};


			//=======================================================
			// gestionar ventana modal
			//=======================================================
			$ionicModal.fromTemplateUrl('findLocation.html', {
					scope: $scope,
					animation: 'slide-in-up'
				})
				.then(function (modal) {
					$scope.modal = modal;
				});

			//=======================================================
			// Evento: leafletDirectiveMap.contextmenu
			// Detect user long-pressing on map to add new location
			//=======================================================
			//$scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
			$scope.$on('leafletDirectiveMap.contextmenu', function () {
				$log.debug(LogId + "Entrada en leafletDirectiveMap.contextmenu");

				//$scope.newLocation = new Location();
				//$scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
				//$scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
				//$scope.modal.show();
			});

			//=========================================================
			// Evento: leafletDirectiveMap.moveend
			// Detectar el evento de finalizar el movimiento del mapa
			//=========================================================
			var reloadPromise = null;
			$scope.$on('leafletDirectiveMap.moveend', function () {
				//$log.debug(LogId + "Entrada en leafletDirectiveMap.moveend");
				$log.debug(LogId + "Movido a nueva posición: lat=" + $scope.map.center.lat + "  lon=" + $scope.map.center.lng);

				globVar.lat = $scope.map.center.lat;
				globVar.lon = $scope.map.center.lng;
				globVar.zoom = $scope.map.center.zoom;
				if (reloadPromise !== null) {
					$timeout.cancel(reloadPromise);
				}
				reloadPromise = $timeout($scope.refresh, 1000);
			});

			//=========================================================
			// Evento: leafletDirectiveMarker.click
			// Detectar el click en un marcador
			//=========================================================
			$scope.$on('leafletDirectiveMarker.click', function (e, args) {
				$log.debug(LogId + "Entrada en leafletDirectiveMarker.click");
				var markerIndex = parseInt(args.modelName);
				//----------------------------------------------
				// Si 'color' == 0 es el icono de 'estás aquí'
				//----------------------------------------------
				if ($scope.markerData[markerIndex].color !== 0) {
					$log.debug(LogId + "Click en el marker " + args.markerName + " " +
						$scope.markerData[markerIndex].id + " " +
						$scope.markerData[markerIndex].title);
					//-------------------------------------------------
					// Saltar a la página de descripción de la visita
					//-------------------------------------------------
					$state.go('visit', {
						'visitId': $scope.markerData[markerIndex].id,
						kind: 'data'
					});
				}
			});


			//==================================================
			// refresh:
			// pedir la lista de puntos cercanos
			//==================================================
			$scope.refresh = function () {
				$log.debug(LogId + "Entrada en refresh");

				Maps.getNearPanos(globVar.lat, globVar.lon)
					.then(function () {
						$scope.loadMarkers(1);
					});

			};

			//==================================================
			// geocode:
			// Mostar la ventana para introducir la dirección
			//==================================================
			$scope.geocode = function () {
				$log.debug(LogId + "Entrada en geocode");

				$scope.newLocation = new Location();
				$scope.modal.show();
			};

			//==================================================
			// showMap:
			// Cargar el mapa con los marcadores encontrados
			//==================================================
			$scope.showMap = function () {

				$log.debug(LogId + "Entrada en showMap");

				// Mostrar la ventana de espera de carga
				//$ionicLoading.show({
				//                   content: 'Loading',
				//                  animation: 'fade-in',
				//                  maxWidth: 900
				//                 });

				//---------------------------------------------------------
				// El centro del mapa se ha guardado en la variable global
				//---------------------------------------------------------
				$scope.map.center = {
					lat: globVar.lat,
					lng: globVar.lon,
					zoom: globVar.zoom
				};

				$scope.loadMarkers(globVar.mapChange);

				// Mostrar la ventana de espera de carga
				// $ionicLoading.show({
				//                    content: 'Loading',
				//                    animation: 'fade-in',
				//                   maxWidth: 900
				//                  });

				//$ionicLoading.hide();
				setTimeout(function () {
					leafletData.getMap("generalMap")
						.then(function (map) {
							map.invalidateSize();
							map.on('moveend', function (event) {});
						});
				}, 0);
			};


			//===============================================================
			// loadMarkers:
			// Redibujar en el mapa los marcadores encontrados
			//===============================================================
			$scope.loadMarkers = function (iter) {
				var iniKm;
				var endKm;
				var iconColor;
				var txtMessage;
				var bFocus;
				var txtName;

				$scope.markerData = DataService.getAllData('data');
				//------------------------------------
				//  Cargar los iconos sobre el mapa
				//------------------------------------
				if ($scope.markerData.length > 0) {

					$scope.map.markers = [];

					for (var i = 0; i < $scope.markerData.length; i++) {
						if (i === 0) {
							iniKm = $scope.markerData[i].distance.toFixed(2);
						}
						//-----------------------------------------------------------------------
						// Agregar un nuevo marcador para cada punto recibido
						//-----------------------------------------------------------------------
						if ($scope.markerData[i].color == 1) {
							iconColor = icons.blue;
							endKm = $scope.markerData[i].distance.toFixed(2);
							bFocus = false;
						} else {
							iconColor = icons.green;
							bFocus = true;
						}
						txtMessage = $scope.markerData[i].title;
						txtName = $scope.markerData[i].id;

						$scope.map.markers.push({
							name: txtName,
							lat: $scope.markerData[i].lat,
							lng: $scope.markerData[i].lon,
							icon: iconColor,
							message: txtMessage,
							focus: bFocus
						});

					}
				}
			};
		});
