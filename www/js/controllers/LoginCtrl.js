(function () {
	'use strict';
	angular.module('AppModule')

		.controller('LoginCtrl',
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
				$q,
				AUTH_API_URL,
				Login,
				localStorageService,
				DataService,
				BackendService,
				Common,
				CN,
				globVar,
				$ionicHistory
			) {
				$log.debug("Entrada en LoginCtrl");

				//---------------------------------
				// Lanzar la página de registro
				//---------------------------------
				$scope.register = function () {
					$log.debug("Entrada en register");

					$state.go('register');
				};

				$scope.parameters = [];

				$scope.doLogin = function () {
					$scope.treatLogin("HuescaLaMagia360");
				};

				$scope.facebookSignIn = function () {
					globVar.forceFacebookLogin = false;
					$scope.treatLogin("facebook");
				};

				//=========================================================
				// doSignUp: Registro directo desde la App
				//=========================================================
				$scope.treatLogin = function (loginType) {
					var logid = "LoginCtrl:treatLogin: ";

					$scope.prepLogin(loginType)
						.then(function () {

							//------------------------------------------------------------
							// Intentamos el registro en el servidor de autentificación
							//------------------------------------------------------------
							BackendService.login.get({}, {
								'm': $scope.m,
								'qs': $scope.qs
							}, function (resp) {
								$log.debug(logid + "Recibida respuesta de login");
								//-----------------------------------------------------------
								// Comprobar si recibimos los parámetros 'token' o 'error'
								//-----------------------------------------------------------
								if (typeof resp.error === "undefined") {
									//------------------------------------------------
									// No se recibe 'error', autentificación correcta
									//------------------------------------------------
									$scope.parameters.token = resp.token;
									//--------------------------------------------
									// Pedimos al servidor los datos del usuario
									//--------------------------------------------
									$scope.m = "profile.aspx";
									$scope.qs = "token=" + $scope.parameters.token;
									BackendService.login.get({}, {
										'm': $scope.m,
										'qs': $scope.qs
									}, function (resp) {

										$log.debug(logid + "Recibida respuesta de profile");

										$scope.parameters.id = 1;
										$scope.parameters.name = resp.name + " " + resp.surname;
										$scope.parameters.photo = resp.profile_pic;

										//-----------------------------------------------
										// Guardamos el perfil de usuario en la BD local
										//-----------------------------------------------
										Login.update(1, $scope.parameters)
											.then(function () {
												$log.debug(logid + "Perfil de usuario actualizado en la BD");
												Common.loadProfile()
													.then(function () {
														DataService.clearAll();
														if (globVar.returnPage) {
															location.href = globVar.returnPage;
														} else {
															window.location.href = CN.INIT_PAGE;
														}
													});
											}, function () {
												$log.debug(logid + "No es posible actualizar los datos del perfil de usuario la BD");
												$ionicPopup.alert({
													title: $translate.instant("login_error_txt"),
													template: $translate.instant("login_error_desc_txt")
												});
											});
									}, function (error) {
										$log.debug(logid + "Error en Login: " + error);
										$ionicPopup.alert({
											title: $translate.instant("login_error_txt"),
											template: $translate.instant("login_error_desc_txt")
										});
									});
								} else {
									switch (resp.error) {

									case 'IncorrectCredentials':
										$ionicPopup.alert({
											title: $translate.instant("login_error_txt"),
											template: $translate.instant("password_error_desc_txt")
										});
										break;

									case 'Blocked':
										$ionicPopup.alert({
											title: $translate.instant("login_error_txt"),
											template: $translate.instant("user_blocked_txt")
										});
										break;

									case 'NotApproved':
										$ionicPopup.alert({
											title: $translate.instant("login_error_txt"),
											template: $translate.instant("user_not_confirmed_txt")
										});
										break;

									default:
										$ionicPopup.alert({
											title: $translate.instant("login_error_txt"),
											template: $translate.instant("password_error_desc_txt")
										});
										break;
									}
									//------------------------------------------------
									// Se recibe 'error', autentificación incorrecta
									//------------------------------------------------
									$log.debug(logid + "Error de autentificación");
								}
							}, function (error) {
								$log.debug(logid + "Error en Login: " + error);
								$ionicPopup.alert({
									title: $translate.instant("login_error_txt"),
									template: $translate.instant("login_error_desc_txt")
								});
							});

						}, function (reason) {
							$log.debug(logid + "Error al preparar los datos de login: " + reason);
							$ionicPopup.alert({
								title: $translate.instant("login_error_txt"),
								template: $translate.instant("login_error_desc_txt")
							});
						});
				};

				//=========================================================
				// prepLogin: Prepara los datos para hacer Login
				//=========================================================
				$scope.prepLogin = function (loginType) {
					var logid = "LoginCtrl:prepLogin: ";
					var q = $q.defer();
					$scope.parameters.id = 1;
					switch (loginType) {

					case "TurismoRioja":
						$scope.parameters.userid = $scope.signup_form.email.$modelValue;
						$scope.parameters.password = $scope.signup_form.password.$modelValue;
						$scope.m = "login.aspx";
						$scope.qs = "u=" + $scope.parameters.userid + "&p=" + $scope.parameters.password;
						q.resolve();
						break;

					case "HuescaLaMagia360":
						$scope.parameters.userid = $scope.signup_form.email.$modelValue;
						$scope.parameters.password = $scope.signup_form.password.$modelValue;
						$scope.m = "login.aspx";
						$scope.qs = "u=" + $scope.parameters.userid + "&p=" + $scope.parameters.password;
						q.resolve();
						break;

					case "facebook":
						$scope.getFacebookToken()
							.then(function () {
								$scope.m = "facebooklogin.aspx";
								$scope.qs = "token=" + $scope.parameters.fbtoken;
								q.resolve();
							}, function (reason) {
								$log.debug(logid + "Error al pedir token de Facebook: " + reason);
								q.reject(reason);
							});
						break;
					}
					return q.promise;
				};

				//=========================================================
				// facebookSignIn: Log in con usuario de Facebook
				//=========================================================
				$scope.getFacebookToken = function () {
					var logid = "LoginCtrl:getFacebookToken: ";
					var q = $q.defer();

					$cordovaOauth.platform = 'mobile';
					$cordovaOauth.facebook("179542409071672", ["email", "public_profile"])
						.then(function (result) {
							$scope.parameters.id = 1;
							$scope.parameters.fbtoken = result.access_token;
							q.resolve(result);
						}, function (error) {
							$log.debug(logid + "Error en $cordovaOauth.facebook: " + error);
							q.reject(error);
						});
					return q.promise;
				};

				//=========================================================
				// NO SE USA, VERSIÓN ANTERIOR
				// requestProfile: Solicitar datos de perfil a Facebook
				//=========================================================
				$scope.requestProfile = function (access_token) {
					var logid = "LoginCtrl:requestProfile: ";

					var qstring = "access_token=" + access_token + "&fields=name,email,locale,picture&format=json";
					BackendService.fbprofile.get({}, {
						'qs': qstring
					}, function (resp) {
						$log.debug("RegisterCtrl:requestProfile: " + "Recibido perfil de usuario");
						//-----------------------------------------------------------
						// Guardar los datos recibidos en la base de datos del móvil
						//-----------------------------------------------------------
						$scope.parameters.id = 1;
						$scope.parameters.name = resp.name;
						$scope.parameters.photo = resp.picture.data.url;
						$scope.parameters.email = resp.email;
						$scope.parameters.fbid = resp.id;
						$scope.parameters.userid = resp.email;

						//------------------------------------------------------------
						// Intentamos el registro en el servidor de autentificación
						//------------------------------------------------------------
						$scope.postLogin();

					}, function (error) {
						$log.debug(logid + "Error en BackendService.fbprofile.get: " + error);
					});
				};

				if (globVar.forceFacebookLogin) {
					$scope.facebookSignIn();
				}

				$scope.myGoBack = function () {
					$ionicHistory.goBack();
				};

			});

}());
