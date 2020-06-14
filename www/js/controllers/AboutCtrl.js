'use strict';
angular.module('AppModule')

	.controller('AboutCtrl',
		function (
			$scope,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$resource,
			$ionicSideMenuDelegate,
			$log,
			$ionicHistory
		) {

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$log.debug("Entrada en AboutCtrl");
			$scope.myGoBack = function () {
				$ionicHistory.goBack();
			};
		});
