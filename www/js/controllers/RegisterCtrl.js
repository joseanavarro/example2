'use strict';
angular.module('AppModule')

	.controller('RegisterCtrl',
		function (
			$scope,
			$stateParams,
			$ionicPopup,
			$translate,
			$ionicLoading,
			$resource,
			$log,
			$state,
			$cordovaOauth,
			$http,
			AUTH_API_URL,
			Login,
			localStorageService,
			BackendService,
			RegService,
			Common,
			CN,
			globVar,
			$ionicHistory
		) {

			$log.debug("Entrada en RegisterCtrl");

			$scope.parameters = [];

			//=========================================================
			// doSignUp: Registro directo desde la App
			//=========================================================
			$scope.doSignUp = function () {
				var logid = "RegisterCtrl:doSignUp: ";
				//----------------------------------------------------------------
				// Leer los campos del formulario y comprobar si están todos, en
				// caso de no estar no se acepta y se muestra mensaje para que lo
				// rellene
				//----------------------------------------------------------------
				var password = $scope.signup_form.password.$modelValue;
				var repassword = $scope.signup_form.repassword.$modelValue;
				if (password !== repassword) {
					$log.debug(logid + "Las contraseñas no coinciden");
					$ionicPopup.alert({
						title: $translate.instant("register_error_txt"),
						template: $translate.instant("enter_same_password_txt"),
						okText: $translate.instant("ok_txt")
					});
				} else {
					$log.debug(logid + "Enviar los parámetros al servidor de autentificación");
					//-------------------------------------------------------
					// Enviar los parámetros al servidor de autentificación
					//-------------------------------------------------------
					$scope.parameters.id = 1;
					$scope.parameters.name = $scope.signup_form.first_name.$modelValue;
					$scope.parameters.surname = $scope.signup_form.last_name.$modelValue;
					$scope.parameters.email = $scope.signup_form.email.$modelValue;
					$scope.parameters.password = $scope.signup_form.password.$modelValue;
					$scope.parameters.lng = globVar.lang;

					$scope.m = "register.aspx";
					$scope.qs = "name=" + $scope.parameters.name +
						"&surname=" + $scope.parameters.surname +
						"&email=" + $scope.parameters.email +
						"&pass=" + $scope.parameters.password +
						"&lng=" + $scope.parameters.lng;

					BackendService.login.get({}, {
						'm': $scope.m,
						'qs': $scope.qs
					}, function (resp) {
						$log.debug(logid + "Recibida respuesta de registro");
						//-----------------------------------------------------------
						// Comprobar si recibimos los parámetros 'token' o 'error'
						//-----------------------------------------------------------
						if (typeof resp.error === "undefined") {
							//------------------------------------------------
							// No se recibe 'error', registro correcto
							//------------------------------------------------
							$log.debug(logid + "Usuario registrado");
							$ionicPopup.alert({
								title: $translate.instant("user_registered_txt"),
								template: $translate.instant("welcome_txt") + " " +
									$translate.instant("user_not_confirmed_txt")
							});
							$state.go('start');
						} else {
							switch (resp.error) {

							case 'DuplicateEmail':
								$ionicPopup.alert({
									title: $translate.instant("signup_error_txt"),
									template: $translate.instant("duplicate_email_txt")
								});
								break;

							case 'UnknowErrorInvalidPassword':
								$ionicPopup.alert({
									title: $translate.instant("signup_error_txt"),
									template: $translate.instant("invalid_password_txt")
								});
								break;

							default:
								$ionicPopup.alert({
									title: $translate.instant("signup_error_txt"),
									template: $translate.instant("login_error_desc_txt")
								});
								break;
							}
							//------------------------------------------------
							// Se recibe 'error', autentificación incorrecta
							//------------------------------------------------
							$log.debug(logid + "Error de registro");
						}
					}, function (error) {
						$log.debug(logid + "Error en registro: " + error);
						$ionicPopup.alert({
							title: $translate.instant("signup_error_txt"),
							template: $translate.instant("login_error_desc_txt")
						});
					});

				}
			};

			//======================================================================
			// ABANDONADO
			// postReg: Enviar solicitud de registro al servidor de autentificación
			//======================================================================
			$scope.postReg = function () {
				var logid = "RegisterCtrl:postReg: ";
				var post = new RegService($scope.parameters);
				post.$save()
					.then(function (result) {
						$log.debug(logid + "Recibida respuesta de registro");
						if (result.resultCode === 0) {
							$scope.parameters.userid = result.userId;
							$scope.parameters.tokem = result.token;
							Login.update(1, $scope.parameters)
								.then(function () {
									$log.debug(logid + "Perfil de usuario actualizado en la BD");
									Common.loadProfile();
									//-------------------------------------------------------------------
									// Después de recibir la confirmación del registro, lanzamos la
									// zona principal de la aplicación
									//-------------------------------------------------------------------
									$ionicPopup.alert({
										title: $translate.instant("welcome_txt"),
										template: $translate.instant("welcome_desc_txt")
									});

									window.location.href = CN.INIT_PAGE;
								}, function () {
									$log.debug(logid + "No es posible actualizar los datos del perfil de usuario la BD");
								});
						} else {
							$log.debug(logid + "Error de Registro en el API ");
							$ionicPopup.alert({
								title: $translate.instant("register_error_txt"),
								template: $translate.instant("register_error_desc_txt")
							});
						}
					}, function (error) {
						$log.debug(logid + "Error en RegService: " + error);
						$ionicPopup.alert({
							title: $translate.instant("register_error_txt"),
							template: error
						});

					});
			};

			//=========================================================
			// facebookSignIn: Log in con usuario de Facebook
			//=========================================================
			$scope.facebookSignIn = function () {
				var logid = "RegisterCtrl:facebookSignIn: ";

				$cordovaOauth.platform = 'mobile';
				$cordovaOauth.facebook("179542409071672", ["email", "public_profile"])
					.then(function (result) {
						$scope.parameters.id = 1;
						$scope.parameters.fbtoken = result.access_token;
						$scope.parameters.name = '';
						$scope.parameters.photo = '';
						$scope.parameters.email = '';
						$scope.parameters.token = '';
						$scope.parameters.fbid = '';
						$scope.parameters.userid = '';

						//--------------------------------------------------------------------------------
						// Guardar el token recibido en el índice 1, ya que la App sólo tiene un usuario
						//--------------------------------------------------------------------------------
						Login.update(1, $scope.parameters)
							.then(function () {
								$log.debug(logid + "Perfil de usuario actualizado en la BD");
							}, function () {
								$log.debug(logid + "No es posible actualizar los datos del perfil de usuario la BD");
							});
						$log.debug(logid + "Solicitar Perfil de usuario a Facebook");
						$scope.requestProfile(result.access_token);

					}, function (error) {
						$log.debug(logid + "Error en $cordovaOauth.facebook: " + error);
						$ionicPopup.alert({
							title: $translate.instant("register_error_txt"),
							template: $translate.instant("register_error_desc_txt")
						});

					});
			};

			//=========================================================
			// ABANDONADO
			// requestProfile: Solicitar datos de perfil a Facebook
			//=========================================================
			$scope.requestProfile = function (access_token) {
				var logid = "RegisterCtrl:requestProfile: ";

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
					$scope.parameters.userid = resp.userId;

					//------------------------------------------------------------
					// Intentamos el registro en el servidor de autentificación
					//------------------------------------------------------------
					$scope.postReg();

				}, function (error) {
					$log.debug(logid + "Error en BackendService.fbprofile.get: " + error);
				});
			};

			$scope.facebookSignIn = function () {
				globVar.forceFacebookLogin = true;
				$state.go('login');
			};

			$scope.myGoBack = function () {
				$ionicHistory.goBack();
			};

		});
