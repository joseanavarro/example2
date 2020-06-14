'use strict';
angular.module('AppModule')

	.controller('ReportsCtrl',
		function (
			$scope,
			$state,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$ionicPopover,
			$translate,
			$ionicLoading,
			$resource,
			$ionicSideMenuDelegate,
			$log,
			$ionicHistory,
			LogId,
			globVar,
			DataService,
			BackendService,
			Common,
			$ionicScrollDelegate,
			$ionicPlatform
		) {

			$scope.report = {};

			$scope.$on('$ionicView.enter', function () {
				//------------------------
				// Get the input data
				//------------------------
				$scope.report.itemId = $stateParams.itemId;
				$scope.report.kind = $stateParams.kind;
			});


			$scope.myGoBack = function () {
				$ionicHistory.goBack();
			};

			$scope.sendReport = function () {
				if ($scope.report.choice !== undefined) {
					BackendService.report.save({}, {
						id_item: $scope.report.itemId,
						token: globVar.userToken,
						item_type: $scope.report.kind,
						report_type: $scope.report.choice,
						description: $scope.report.descText
					}, function (resp) {
						$scope.result = resp.result;
						$state.go('reportFinal');
					});
				} else {
					$ionicPopup.alert({
						title: 'Error',
						template: $translate.instant("wrong_type_txt")
					});
				}
			};

		});
