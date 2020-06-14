'use strict';
angular.module('AppModule')

	.controller('ListController',
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
			$ionicHistory,
			DataService,
			globVar
		) {

			var LogId = 'ListController: ';

			$log.debug(LogId + "Entrada en ListController");

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.goToMap1 = function () {
				$log.debug("goToMap1");
				$state.go('app.map_1');
			};

			$scope.goToMap2 = function () {
				$log.debug("goToMap2");
				$state.go('app.map_2');
			};

			$scope.goToRoute = function () {
				$log.debug("goToRoute");
				$state.go('app.route', {
					routeId: globVar.routeId
				});
			};

			$scope.$on('$ionicView.beforeEnter', function () {

				$ionicHistory.clearHistory();

				$scope.nearPanos = [];

				$log.debug(LogId + "$ionicView.afterEnter");
				$scope.nearPanos = DataService.getAllData('data');
				globVar.mapChange = 0;
			});
		});
