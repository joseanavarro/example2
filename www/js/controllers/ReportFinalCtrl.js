'use strict';
angular.module('AppModule')

	.controller('ReportFinalCtrl',
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
				$ionicHistory.goBack(-2);
			};

			$scope.sendReport = function () {
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
			};

		});
