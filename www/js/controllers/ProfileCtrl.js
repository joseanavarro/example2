'use strict';
angular.module('AppModule')

	.controller('ProfileCtrl',
		function (
			$scope,
			$q,
			$stateParams,
			$ionicModal,
			$ionicPopup,
			$translate,
			$ionicLoading,
			$resource,
			$ionicSideMenuDelegate,
			$log,
			DataService,
			$state,
			globVar,
			BackendService,
			$sce
		) {
			$log.debug("Entrada en ProfileCtrl");
			var LogId = 'ProfileCtrl: ';
			$scope.selPanos = [];

			$scope.openMenu = function () {
				//DataService.clear();
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.gotoRecent = function () {
				$state.go('app.recent');
			};

			$scope.gotoSelection = function () {
				$state.go('app.selection');
			};

			$scope.$on('$ionicView.beforeEnter', function () {
				$scope.id_user = $stateParams.id_user;
				if ($stateParams.id_user !== globVar.photographer) {
					//-----------------------------------------------
					// Se pide listado de fotos de otro fotógrafo
					// hay que limpiar el listado que teníamos
					//-----------------------------------------------
					DataService.clear('user');
					BackendService.user.get({}, {
						'id_user': $stateParams.id_user,
						'lng': globVar.lang,
						'token': globVar.userToken,
						'portal': globVar.idPortal
					}, function (resp) {
						$scope.userProfile = {};
						$scope.userProfile.name = resp.name;
						$scope.userProfile.surname = resp.surname;
						$scope.userProfile.city = resp.city;
						$scope.userProfile.country = resp.country;
						$scope.userProfile.background = resp.background;
						$scope.userProfile.avatar = resp.avatar;
						$scope.userProfile.description = $sce.trustAsHtml(resp.description);
						$scope.userProfile.followers = resp.followers;
						$scope.userProfile.following = resp.following;
						$scope.userProfile.hometown = resp.hometown;
						$scope.userProfile.id_user = resp.id_user;
						$scope.userProfile.is_followed = resp.is_followed;
						$scope.userProfile.likes = resp.likes;
						$scope.userProfile.ocupation = resp.ocupation;
						$scope.userProfile.tours = resp.tours;
						$scope.userProfile.web = resp.web;
						$scope.userProfile.web_name = resp.web_name;
						$scope.userProfile.is_self = resp.is_self;
						DataService.userProfile = $scope.userProfile;
					});
					$scope.loadMoreData();

				} else {

					$scope.selPanos = DataService.getAllData('user');
					$scope.userProfile = DataService.userProfile;
				}
				globVar.photographer = $stateParams.id_user;

			});
			if (window.analytics) {
				window.analytics.trackView('Profile');
			}

			$scope.loadMoreData = function () {
				$log.debug(LogId + "loadMoreData() ...");
				DataService.getRestData('user', $stateParams.id_user)
					.then(function () {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.selPanos = DataService.getAllData('user');
					});
			};

			$scope.isMoreData = function () {
				return DataService.isMoreData('user');
			};

			$scope.follow = function () {
				if (globVar.userId === "") {
					globVar.returnPage = "#/app/profile/" + $stateParams.id_user;
					$ionicPopup.alert({
						title: $translate.instant(""),
						template: $translate.instant('must_login_first_txt'),
						buttons: [{
								text: '<b>' + $translate.instant('login_txt') + '</b>',
								type: 'button-positive',
								onTap: function (e) {
									$state.go('login');
								}
							},
							{
								text: $translate.instant('cancel_txt')
							}
						]
					});
					return;
				}
				BackendService.follow.get({}, {
						'id': $scope.userProfile.id_user,
						'token': globVar.userToken,
						'follow': !$scope.userProfile.is_followed
					},
					function (resp) {
						$scope.userProfile.is_followed = resp.followed;
						$scope.userProfile.followers = resp.followers;
						$scope.userProfile.following = resp.following;
					},
					function (resp) {
						$log.debug(LogId + "Error en la llamada al API");
					});

			};

		});
