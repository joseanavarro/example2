'use strict';
angular.module('AppModule')

	.controller('LogoutCtrl',
		function (
			$scope,
			$stateParams,
			$ionicPopup,
			$translate,
			$resource,
			$log,
			$state,
			$cordovaOauth,
			$http,
			AUTH_API_URL,
			Login,
			globVar
		) {

			$log.debug("Entrada en LogoutCtrl");
			$scope.parameters = [];

			//=======================================================
			// Evento: $ionicView.beforeEnter
			// Se dispara antes de que la vista actual esté activa
			//=======================================================
			$scope.$on('$ionicView.beforeEnter', function () {
				var logid = "LogoutCtrl:$ionicView.beforeEnter: ";
				//----------------------------------------------------------------
				// Borrar el registro de usuario
				//----------------------------------------------------------------
				$scope.parameters.id = 1;
				$scope.parameters.fbtoken = '';
				$scope.parameters.name = '';
				$scope.parameters.photo = '';
				$scope.parameters.email = '';
				$scope.parameters.token = '';
				$scope.parameters.fbid = '';
				$scope.parameters.userid = '';
				globVar.userId = '';
				globVar.userName = '';
				globVar.userToken = '';
				globVar.userPhoto = '';
				Login.update(1, $scope.parameters)
					.then(function (result) {
						if (result.rowsAffected > 0) {
							$log.debug(logid + "Borrado el registro de usuario");
							$state.go('start');
						}
					}, function () {
						$log.debug(logid + "No es posible leer la tabla Login");
					});

			});


		});
