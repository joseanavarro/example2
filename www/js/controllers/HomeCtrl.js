'use strict';
angular.module('AppModule')

	.controller('HomeCtrl',
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
			$state,
			BackendService,
			globVar
		) {
			$log.debug("Entrada en HomeCtrl");
			var LogId = 'HomeCtrl: ';
			$scope.selPanos = [];
			//-------------------------------------------------------
			// Cargar primer listado descargado en fase de arranque
			//-------------------------------------------------------

			$scope.refresh = function () {
				$scope.selPanos = DataService.getAllData('sel');
				$state.go($state.current, {}, {
					reload: true
				});
			};

			$scope.openMenu = function () {
				//DataService.clear('sel');
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.gotoRecent = function () {
				$state.go('app.recent');
			};

			$scope.gotoSelection = function () {
				$state.go('app.selection');
			};



			if (window.analytics) {
				window.analytics.trackView('Home');
			}

			$scope.loadMoreData = function () {
				$log.debug(LogId + "loadMoreData() ...");
				DataService.getRestData('sel')
					.then(function () {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.selPanos = DataService.getAllData('sel');
					});
			};

			$scope.isMoreData = function () {
				return DataService.isMoreData('sel');
			};

			$scope.$on('$ionicView.enter', function () {
				$scope.selPanos = DataService.getAllData('sel');
				if ($scope.selPanos.length === 0) {
					$scope.loadMoreData();
				}

				//Evento actual
				$scope.currentEvent = {
					active: false
				};
				BackendService.currentEvent.get({
					lang: globVar.lang
				}, {}, function (resp) {
					if (resp.active) {
						$scope.currentEvent.active = true;
						$scope.currentEvent.text = resp.text;
					}

				});


			});
		});
