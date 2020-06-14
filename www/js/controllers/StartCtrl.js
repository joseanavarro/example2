'use strict';
angular.module('AppModule')

	.controller('StartCtrl',
		function (
			$scope,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$resource,
			$ionicSideMenuDelegate,
			$state,
			$log,
			Login,
			CN,
			globVar,
			DataService,
			BackendService,
			Common,
			$ionicLoading
		) {

			$log.debug("Entrada en StartCtrl");

			$scope.parameters = [];
			if (window.analytics) {
				window.analytics.trackView('Start');
			}
			//=======================================================
			// Evento: $ionicView.beforeEnter
			// Se dispara antes de que la vista actual esté activa
			//=======================================================
			$scope.$on('$ionicView.beforeEnter', function () {
				var logid = "StartCtrl:$ionicView.beforeEnter: ";

				//---------------------------
				// Obtener idioma
				//---------------------------
				var lang = (navigator.language)
					.split("-")[0];
				switch (lang) {
				case "es":
					lang = "es";
					break;

				default:
					lang = "en";
					break;
				}
				globVar.lang = lang;

				//----------------------------------------------------------------
				// Leer si ya existe registro de usuario, en cuyo caso entramos
				// directamente en la app sin pasar por la ventana de Login
				//----------------------------------------------------------------
				Login.get(1)
					.then(function (result) {
						DataService.clearAll();
						var api_method = "profile.aspx";
						var qs = "token=" + result.token;
						globVar.userToken = result.token;
						$ionicLoading.show({
							content: 'Loading',
							animation: 'fade-in',
							maxWidth: 900
						});



						//Autologin
						BackendService.login.get({}, {
							'm': api_method,
							'qs': qs
						}, function (resp) {
							if (resp.error !== undefined) {
								$log.debug(logid + "Token invalido");
								$ionicLoading.hide();
								tryIntent();
								return;
							}
							$log.debug(logid + "Recibida respuesta de profile");

							$scope.parameters.id = 1;
							$scope.parameters.name = resp.name + " " + resp.surname;
							$scope.parameters.photo = resp.profile_pic;
							$scope.parameters.token = result.token;
							globVar.userId = $scope.userid;
							globVar.userName = $scope.name;

							globVar.userPhoto = $scope.photo;

							//-----------------------------------------------
							// Guardamos el perfil de usuario en la BD local
							//-----------------------------------------------
							Login.update(1, $scope.parameters)
								.then(function () {
									$log.debug(logid + "Perfil de usuario actualizado en la BD");
									Common.loadProfile()
										.then(function () {
											DataService.clearAll();
											tryIntent(CN.INIT_PAGE);
											$ionicLoading.hide();
										});
								}, function () {
									$ionicLoading.hide();
									$log.debug(logid + "No es posible actualizar los datos del perfil de usuario la BD");
									$ionicPopup.alert({
										title: $translate.instant("login_error_txt"),
										template: $translate.instant("login_error_desc_txt")
									});
								});
						}, function (error) {
							$ionicLoading.hide();
							$log.debug(logid + "Error en Login: " + error);
							//$ionicPopup.alert({
							//  title:  $translate.instant("login_error_txt"),
							//  template: $translate.instant("login_error_desc_txt")
							//});
						});
					}, function () {
						$log.debug(logid + "No es posible leer la tabla Login");
						$ionicLoading.hide();
						tryIntent();
					});

			});

			$scope.openMenu = function () {
				$ionicSideMenuDelegate.toggleLeft();
			};

			//---------------------------------
			// Lanzar la página de login
			//---------------------------------
			$scope.login = function () {
				$log.debug("Entrada en login");

				$state.go('login');
			};

			//---------------------------------
			// Lanzar la página de registro
			//---------------------------------
			$scope.register = function () {
				$log.debug("Entrada en register");

				$state.go('register');
			};

			//-----------------------------------
			// Lanzar la página de login anónimo
			//-----------------------------------
			$scope.anonLogin = function () {
				var logid = "StartCtrl:anonLogin: ";

				$log.debug(logid + "Entrada en login anónimo");
				//---------------------------------------
				// Guardar los datos del usuario anónimo
				//---------------------------------------
				$scope.parameters.id = 1;
				$scope.parameters.fbtoken = '';
				$scope.parameters.name = '';
				$scope.parameters.photo = '';
				$scope.parameters.email = '';
				$scope.parameters.token = '';
				$scope.parameters.fbid = '';
				$scope.parameters.userid = '';


				Login.update(1, $scope.parameters)
					.then(function () {
						$log.debug(logid + "Perfil de usuario actualizado en la BD");

						window.location.href = CN.INIT_PAGE;
					}, function () {
						$log.debug(logid + "No es posible actualizar los datos del perfil de usuario la BD");
						$ionicPopup.alert({
							title: $translate.instant("login_error_txt"),
							template: $translate.instant("login_error_desc_txt")
						});
					});
			};


			var tryIntent = function (defaultURL) {
				var url = defaultURL;

				var intentURL = window.sessionStorage.getItem("intentURL");
				if (intentURL) {
					defaultURL = intentURL;
				}

				if (url) {
					window.location.href = url;
				}
				window.ISLOGINGRESOLVED = true;
			};



		});
