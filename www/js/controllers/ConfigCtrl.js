'use strict';
angular.module('AppModule')

	.controller('ConfigCtrl',
		function (
			$scope,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$resource,
			$ionicSideMenuDelegate,
			camService,
			$log,
			$ionicHistory,
			globVar,
			Options,
			CN
		) {

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$log.debug("Entrada en ConfigCtrl");
			$scope.myGoBack = function () {
				$ionicHistory.goBack();
			};

			$scope.$on('$ionicView.enter', function () {
				// Cargar valores de configuración
				$scope.debugApp = globVar.debugApp;
				$scope.remPhotoAfter = globVar.delFoto;
				$scope.saveLocation = globVar.location;
				$scope.cameraWifi = globVar.cameraWifi;
				$log.debug("Configuración cargada");
			});

			//---------------------------------------
			// Actualizar flag
			//---------------------------------------

			$scope.removeWifi = function () {
				if ($scope.cameraWifi) {
					$scope.cameraWifi = '';
				}
			};

			$scope.updateRemPhotoAfter = function () {
				if (globVar.delFoto) {
					$scope.remPhotoAfter = false;
					globVar.delFoto = false;
				} else {
					$scope.remPhotoAfter = true;
					globVar.delFoto = true;
				}
			};

			$scope.updateSaveLocation = function () {
				if (globVar.location) {
					$scope.saveLocation = false;
					globVar.location = false;
				} else {
					$scope.saveLocation = true;
					globVar.location = true;
				}
			};

			$scope.saveConfig = function () {
				var remPhoto = $scope.remPhotoAfter ? 1 : 0;
				var loc = $scope.saveLocation ? 1 : 0;

				Options.saveOptions(remPhoto, loc, $scope.cameraWifi)
					.then(function () {
						globVar.delFoto = $scope.remPhotoAfter;
						globVar.cameraWifi = $scope.cameraWifi;
						globVar.location = $scope.saveLocation;

						$log.debug("Configuración guardada");
					}, function () {
						$log.debug("Error al guardar Configuración");
					});
				// Volver a la página de inicio
				window.location.href = CN.INIT_PAGE;
			};

		});
