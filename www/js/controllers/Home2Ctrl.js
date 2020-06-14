'use strict';
angular.module('AppModule')

	.controller('Home2Ctrl',
		function (
			$scope,
			$q,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$resource,
			$ionicSideMenuDelegate,
			$log,
			DataService,
			$state
		) {
			var LogId = 'Home2Ctrl: ';
			$scope.newPanos = [];
			//-------------------------------------------------------
			// Cargar primer listado descargado en fase de arranque
			//-------------------------------------------------------
			//$scope.newPanos = DataService.getAllData('recent');

			$scope.refresh = function () {
				$scope.selPanos = DataService.getAllData('recent');
				$state.go($state.current, {}, {
					reload: true
				});
			};

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.gotoRecent = function () {
				$state.go('app.recent');
			};

			$scope.gotoSelection = function () {
				$state.go('app.home');
			};

			$scope.loadMoreData = function () {
				$log.debug(LogId + "loadMoreData() ...");
				DataService.getRestData('recent')
					.then(function () {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.newPanos = DataService.getAllData('recent');
					});
			};

			$scope.isMoreData = function () {
				return DataService.isMoreData('recent');
			};

			$scope.$on('$ionicView.enter', function () {
				$scope.selPanos = DataService.getAllData('recent');
				if ($scope.selPanos.length === 0) {
					$scope.loadMoreData();
				}
			});

		});
