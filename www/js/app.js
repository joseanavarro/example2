(function () {
	'use strict';

	angular.module('AppModule', [
			'ionic',
			'LocalStorageModule',
			'leaflet-directive',
			'ngCordova',
			'ngResource',
			'igTruncate',
			'pascalprecht.translate',
			'ngCordovaOauth',
			'templates',
			'monospaced.elastic'
		])

		.run(function ($ionicPlatform, DBA, $log, $cordovaSplashscreen, DataService,
			RoutesService, $cordovaStatusbar, $interval, globVar, camService, Options, Common) {
			$ionicPlatform.ready(function () {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				if (window.cordova && window.cordova.plugins.Keyboard) {
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					window.cordova.plugins.Keyboard.disableScroll(true);
				}
				if (window.StatusBar) {
					//StatusBar.styleDefault();
					// Fijar color de la barra se estado para que coincida con la App
					$cordovaStatusbar.styleHex('#a31a16');
				}
				if (window.analytics) {
					window.analytics.startTrackerWithId('UA-74241421-2');
					window.analytics.debugMode();
				}
				//-------------------------------------
				// Inicalizar base de datos local
				//-------------------------------------
				DBA.init()
					.then(function () {
						$log.debug("Despues de DBA.init()");

						Options.get()
							.then(function (result) {
								if (result.loc === 1) {
									globVar.location = true;
									// Pedir localización
									Common.getLocation();
								} else {
									{
										globVar.location = false;
									}
								}
								globVar.delFoto = result.remPhotoAfter ? true : false;
								globVar.cameraWifi = result.cameraWifi;
							}, function () {
								$log.error('Error en Lectura de configuración');
							});
						try {
							$cordovaSplashscreen.hide();
						} catch (e) {}
					});
				cordova.plugins.notification.local.hasPermission(function (granted1) {
					if (!granted1) {
						cordova.plugins.notification.local.registerPermission(function (granted) {});
					}
				});
				cordova.plugins.notification.local.on("click", function (notification, state) {
					if (notification.id == 1) {
						location.href = "#/publish";
					}
				}, this);

			});


		})

		.config(function ($stateProvider, $urlRouterProvider, $translateProvider,
			langConfig, $logProvider) {

			//---------------------------------------------------------
			// Control de trazas de debug, poner a false en producción
			//---------------------------------------------------------
			$logProvider.debugEnabled(true);

			//----------------------
			// Cargar idiomas
			//----------------------
			langConfig($translateProvider);

			// Ionic uses AngularUI Router which uses the concept of states
			// Learn more here: https://github.com/angular-ui/ui-router
			// Set up the various states which the app can be in.
			// Each state's controller can be found in controllers.js
			$stateProvider
				.state('start', {
					url: '/start',
					controller: 'StartCtrl',
					templateUrl: 'start.html'
				})
				.state('register', {
					url: '/register',
					controller: 'RegisterCtrl',
					templateUrl: 'register.html'
				})
				.state('login', {
					url: '/login',
					templateUrl: 'login.html',
					controller: 'LoginCtrl'
				})
				.state('logout', {
					url: '/logout',
					templateUrl: 'logout.html',
					controller: 'LogoutCtrl'
				})
				.state('app', {
					url: '/app',
					abstract: true,
					templateUrl: 'menu.html',
					controller: 'AppCtrl'
				})
				.state('app.home', {
					url: '/home',
					views: {
						'menuContent': {
							templateUrl: 'home.html',
							controller: 'HomeCtrl'
						}
					}
				})
				.state('app.profile', {
					url: '/profile/:id_user',
					views: {
						'menuContent': {
							templateUrl: 'profile.html',
							controller: 'ProfileCtrl'
						}
					}
				})
				.state('app.profiletours', {
					url: '/profiletours/:id_user',
					views: {
						'menuContent': {
							templateUrl: 'profile.tours.html',
							controller: 'ProfileCtrl'
						}
					}
				})
				.state('app.routes', {
					url: '/routes',
					views: {
						'menuContent': {
							templateUrl: 'routes.html',
							controller: 'RoutesCtrl'
						}
					}
				})
				.state('app.route', {
					url: '/route/:routeId',
					views: {
						'menuContent': {
							templateUrl: 'routeDesc.html',
							controller: 'RouteCtrl'
						}
					}
				})
				.state('app.map_1', {
					url: '/map_1/:routeId',
					views: {
						'menuContent': {
							templateUrl: 'map_1.html',
							controller: 'MapCtrl'
						}
					}
				})
				.state('app.list_1', {
					url: '/list_1/:routeId',
					views: {
						'menuContent': {
							templateUrl: 'list_1.html',
							controller: 'ListController'
						}
					}
				})
				.state('app.map_2', {
					url: '/map_2',
					cache: false,
					views: {
						'menuContent': {
							templateUrl: 'map_2.html',
							controller: 'MapCtrl'
						}
					}
				})
				.state('app.list_2', {
					url: '/list_2',
					views: {
						'menuContent': {
							templateUrl: 'list_2.html',
							controller: 'ListController'
						}
					}
				})
				.state('app.search', {
					url: '/search',
					views: {
						'menuContent': {
							templateUrl: 'search.html',
							controller: 'SearchCtrl'
						}
					}
				})
				.state('app.near', {
					url: '/near',
					views: {
						'menuContent': {
							templateUrl: 'near.html',
							controller: 'NearCtrl'
						}
					}
				})
				.state('Camera', {
					url: '/Camera',
					templateUrl: 'Camera.html',
					controller: 'VRCameraCtrl'
				})
				.state('about', {
					url: '/about',
					templateUrl: 'about.html',
					controller: 'AboutCtrl'
				})
				.state('visit', {
					url: "/visit/:visitId/:kind",
					templateUrl: 'visitDesc.html',
					controller: 'VisitCtrl',
					cache: false
				})
				.state('visit2', {
					url: "/visit/:visitId/:panoId/:kind",
					templateUrl: 'visitDesc.html',
					controller: 'VisitCtrl',
					cache: false
				})
				.state('map3', {
					url: "/map3/:lat/:lon",
					templateUrl: 'map3.html',
					controller: 'MapCtrl',
					cache: false
				})
				.state('reportInadequate', {
					url: "/reportInadequate/:itemId/:reportType/:kind",
					templateUrl: 'reportInadequate.html',
					controller: 'ReportsCtrl',
					cache: false
				})
				.state('reportWrong', {
					url: "/reportWrong/:itemId/:reportType/:kind",
					templateUrl: 'reportWrong.html',
					controller: 'ReportsCtrl',
					cache: false
				})
				.state('reportFinal', {
					url: "/reportFinal",
					templateUrl: 'reportFinal.html',
					controller: 'ReportFinalCtrl',
					cache: false
				})
				.state('app.recent', {
					url: "/recent",
					views: {
						'menuContent': {
							templateUrl: 'recent.html',
							controller: 'Home2Ctrl'
						}
					}
				})
				.state('config', {
					url: '/config',
					templateUrl: 'config.html',
					controller: 'ConfigCtrl'
				})
				.state('publish', {
					url: "/publish",
					templateUrl: 'publish.html',
					controller: 'PublishCtrl'
				})
				.state('VR', {
					url: '/VR/:id_tour',
					templateUrl: 'VR.html',
					controller: 'VRCtrl'
				});
			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('/start');
			//$urlRouterProvider.otherwise('/app/home');
		})

		.config(function ($ionicConfigProvider) {
			// Make tabs show up at the bottom for android if you so desire
			$ionicConfigProvider.tabs.position('bottom');

			// Use native scrolling on Android
			if (ionic.Platform.isAndroid()) {
				$ionicConfigProvider.scrolling.jsScrolling(false);
			}
		});

})();
