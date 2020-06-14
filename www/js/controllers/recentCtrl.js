'use strict';
angular.module('AppModule')

	.controller('RecentCtrl',
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

			var LogId = 'RecentCtrl: ';

			$log.debug(LogId + "Entrada en RecentCtrl");

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.refresh = function () {
				$state.go($state.current, {}, {
					reload: true
				});
			};

			$scope.$on('$ionicView.beforeEnter', function () {

				$ionicHistory.clearHistory();

				$scope.nearPanos = [];

				$log.debug(LogId + "$ionicView.afterEnter");
				$scope.nearPanos = DataService.getdataArray();
				globVar.mapChange = 0;
			});
		});
