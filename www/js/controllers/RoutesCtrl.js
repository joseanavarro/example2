'use strict';
angular.module('AppModule')

	.controller('RoutesCtrl',
		function (
			$scope,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$ionicLoading,
			$resource,
			$ionicSideMenuDelegate,
			RoutesService,
			$log
		) {
			$log.debug("Entrada en RoutesCtrl");
			var LogId = 'RoutesCtrl: ';
			$scope.recRoutes = [];
			//-------------------------------------------------------
			// Cargar primer listado descargado en fase de arranque
			//-------------------------------------------------------
			$scope.recRoutes = RoutesService.getAllData('routes');

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.$on('$ionicView.beforeEnter', function () {});

			$scope.loadMoreData = function () {
				$log.debug(LogId + "loadMoreData() ...");
				RoutesService.getRestData('routes')
					.then(function () {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.recRoutes = RoutesService.getAllData('routes');
					});
			};

			$scope.isMoreData = function () {
				return RoutesService.isMoreData('routes');
			};

		});
