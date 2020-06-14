'use strict';
angular.module('AppModule')

	.controller('VisitCtrl',
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
			$cordovaSocialSharing,
			LogId,
			globVar,
			DataService,
			BackendService,
			Common,
			$ionicScrollDelegate,
			$ionicPlatform,
			OWNER_THUMBNAIL_URL,
			KRPANO_API
		) {

			// Display Popovers
			$scope.openPopover = function ($event) {
				// Init popover on load
				$ionicPopover.fromTemplateUrl('templates/popover.html', {
						scope: $scope,
					})
					.then(function (popover) {
						$scope.popover = popover;
						$scope.popover.show($event);
					});
			};

			$scope.openPopover2 = function ($event) {
				// Init popover on load
				$ionicPopover.fromTemplateUrl('templates/popover2.html', {
						scope: $scope,
					})
					.then(function (popover) {
						$scope.popover = popover;
						$scope.popover.show($event);
					});
			};


			$scope.closePopover = function () {
				$scope.popover.hide();
			};

			$scope.isAndroid = ionic.Platform.isAndroid();

			// share anywhere
			$scope.ShareFacebook = function () {
				$scope.prepareShare();
				$cordovaSocialSharing.shareViaFacebook($scope.shareUrl,
					null,
					null);
				$scope.popover.hide();
			};

			$scope.ShareTwitter = function () {
				$scope.prepareShare();
				$cordovaSocialSharing.shareViaTwitter($scope.visitData.title,
					$scope.thumbnailURL,
					$scope.shareUrl);
				$scope.popover.hide();
			};

			$scope.ShareGplus = function () {
				$scope.prepareShare();
				$cordovaSocialSharing.shareVia('com.google.android.apps.plus',
					$scope.desc,
					$scope.visitData.title,
					$scope.thumbnailURL,
					$scope.shareUrl);
				$scope.popover.hide();
			};

			$scope.ShareOther = function () {
				$scope.prepareShare();
				$cordovaSocialSharing.share($scope.desc,
					$scope.visitData.title,
					$scope.thumbnailURL,
					$scope.shareUrl);
				$scope.popover.hide();
			};

			$scope.prepareShare = function () {
				$scope.shareUrl = Common.replaceAll($scope.thumbnailURL, "thumbnail-app.aspx?r=", "sh-") + "-" + globVar.lang + ".html";
				$scope.desc = $scope.visitData.description.trunc(80, true) + " photo: " +
					$scope.visitData.owner + " ";
			};

			//-----------------------------
			// Truncar cadena de textos
			//-----------------------------
			String.prototype.trunc =
				function (n, useWordBoundary) {
					var isTooLong = this.length > n,
						s_ = isTooLong ? this.substr(0, n - 1) : this;
					s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
					return isTooLong ? s_ + '... ' : s_;
				};

			$scope.myGoBack = function () {
				var kind = $stateParams.kind;
				if (kind == 'user') {
					window.location.href = '#/app/profile/' + $scope.visitData.userId;
				} else if (kind == 'recent') {
					window.location.href = '#/app/recent';
				} else if (kind == 'recent') {
					window.location.href = '#/app/recent';
				} else {
					var h = $ionicHistory.viewHistory();
					if (h.backView !== null) {
						$ionicHistory.goBack();
					} else {
						window.location.href = '#/app/home';
					}
				}
				//$state.go($scope.prevState);
			};
			$scope.profileImgURL = "";
			$scope.thumbnailURL = "";

			$scope.$on('$ionicView.enter', function () {
				$scope.charLimit = 150;
				globVar.tourId = $stateParams.visitId;
				$scope.foto = globVar.userPhoto;
				$scope.nombre = globVar.userName;
				$scope.userId = globVar.userId;
				$scope.token = globVar.userToken;
				$scope.isLogged = globVar.userToken !== "";

				$scope.readVisitData($stateParams.visitId, $stateParams.kind);
			});

			$scope.focusComment = function () {
				document.getElementById("vistComment")
					.focus();
			};

			$scope.showmoreclass = "";
			$scope.showMore = function () {
				if ($scope.showmoreclass === "show-more-active") {
					$scope.showmoreclass = "";
				} else {
					$scope.showmoreclass = "show-more-active";
				}
			};

			$scope.goComment = function () {
				if ($scope.isLogged) {
					$scope.focusComment();
				} else {
					$scope.visitData.comment();
				}
			};


			//$scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
			$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState) {

				$scope.prevState = fromState.name;
				$log.debug("Venimos del estado: " + $scope.prevState);
				if ($scope.prevState === 'app.home') {
					$log.debug("globVar.back = 1");
					globVar.back = 1;
				}
			});

			//===============================================================
			// readVisitData:
			// Leer los datos de la visita si no esta en el listado
			//===============================================================
			$scope.readVisitData = function (visitId, kind) {
				var LogId = 'VisitCtrl: ';

				$log.debug(LogId + "Entrada en VisitCtrl: " + visitId);
				globVar.mapChange = 0;

				//---------------------------------------------------------
				// Leer los datos básicos de la visita desde DataService
				// que contiene el array de datos con todas las visitas
				// virtuales cercanas
				//---------------------------------------------------------
				$scope.visitData = DataService.getDataById(visitId, kind);

				if (!$scope.visitData) {
					window.updateVisitData(visitId);
				} else {
					$log.debug(LogId + "Título: " + $scope.visitData.title);
					setData();
				}
			};

			$scope.reloadComments = function () {
				$scope.comments = [];
				BackendService.comments.get({
					token: globVar.userToken
				}, {
					'id_visit': $scope.visitData.id
				}, function (resp) {
					for (var i = 0; i < resp.Elems.length; i++) {

						var obj = {
							id: resp.Elems[i].id,
							avatar: resp.Elems[i].avatar,
							name: resp.Elems[i].name,
							text: resp.Elems[i].text,
							date: resp.Elems[i].date,
							can_edit: resp.Elems[i].can_edit
						};
						$scope.comments.push(obj);
					}
				});

			};

			//Funcion que accede al scope de manera externa
			window.updateVisitData = function (id_visit, id_pano) {
				var scope = angular.element(document.getElementById("visitView"))
					.scope();
				scope.updateVisitData(id_visit, id_pano);
			};

			$scope.updateVisitData = function (id_visit, id_pano) {

				//Se ha cambiado de visita?
				if ($scope.visitData && $scope.visitData.id == id_visit) {
					//Update the pano
					if (id_pano && $scope.visitData) {
						$scope.visitData.id_pano = id_pano;
						$scope.$apply();
					}

					return;
				}
				var likeHandler = function () {
					var curretElement = this;
					if (globVar.userId === "") {
						globVar.returnPage = "#/visit/" + curretElement.id + '/user';
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
					BackendService.like.get({}, {
							'id': curretElement.id,
							'token': globVar.userToken,
							'like': !curretElement.liked
						},
						function (resp) {
							curretElement.likes = resp.likes;
							curretElement.liked = !curretElement.liked;
						},
						function (resp) {
							$log.debug(LogId + "Error en la llamada al API");
							//$ionicLoading.hide();
						});
				};

				BackendService.visit.get({}, {
						'id': id_visit,
						'opt': 1,
						lang: globVar.lang
					}, function (resp) {
						$scope.visitData = {
							id: resp.id,
							id_pano: (id_pano) ? id_pano : resp.id_pano,
							address: resp.address,
							city: resp.city,
							country: resp.country,
							description: resp.description,
							distance: resp.distance,
							lat: resp.lat,
							lon: resp.lon,
							province: resp.province,
							thumbnail: resp.thumbnail,
							title: resp.title,
							userId: resp.userId,
							owner: resp.nombre + " " + resp.apellidos,
							likes: resp.likes,
							vis: resp.visualizaciones,
							com: resp.total_comentarios,
							creation: resp.creation,
							color: 1,
							liked: resp.liked,
							like: likeHandler

						};
						$log.debug(LogId + "Título: " + $scope.visitData.title);

						setData();
					},
					function () {
						$scope.myGoBack();
					}
				);
			};

			function setData() {
				//Track view
				BackendService.trackview.get({}, {
					'id': $scope.visitData.id,
					'opt': 1
				}, function (resp) {});
				//Load comments
				$scope.reloadComments();
				//Get areas
				BackendService.areas.get({}, {
					'id': $scope.visitData.id,
					'lang': globVar.lang
				}, loadAreas);
				//Set Profile Picture
				$scope.profileImgURL = OWNER_THUMBNAIL_URL + $scope.visitData.userId;
				//Set preview Thumbnail
				$scope.thumbnailURL = $scope.visitData.thumbnail;
				if (!$scope.PanoContainer) {
					bindEvents();
					initPano($scope.visitData.id_pano);
				}
			}


			$scope.title = "";

			function initPano(id_tour) {
				$scope.PanoContainer = document.getElementById("PanoContainer");
				setTimeout(function () {
					window.embedpano({
						swf: "krpano/krpano.js",
						html5: "prefer",
						xml: KRPANO_API + "/app-" + $scope.visitData.id_pano + "-MFSG22LO_walk2viewapp.html?vr=true",
						target: "PanoContainer",
						id: "krpano-embed"
					});
				}, 0);
				var LogId = "PanoCtrl:initPano: ";
			}



			$scope.hideStatusBar = function () {
				if (window.StatusBar) {
					window.StatusBar.hide();
				}
			};

			function unBindEvents() {
				if (window.StatusBar) {
					window.StatusBar.show();
				}
				if (window.plugins) {
					window.plugins.insomnia.allowSleepAgain();
				}
				$scope.PanoContainer = null;
				window.removepano("krpano-embed");
				$scope.deregisterBackButton();
			}

			$scope.$on('$ionicView.beforeLeave', function () {
				unBindEvents();
			});

			function bindEvents() {
				$scope.hideStatusBar();

				if (window.plugins) {
					// Keep screen on
					window.plugins.insomnia.keepAwake();
				}

				$scope.deregisterBackButton = $ionicPlatform.registerBackButtonAction(
					function () {
						if (document.getElementById("krpano-embed")
							.get("fullscreen")) {
							document.getElementById("krpano-embed")
								.set("fullscreen", false);
						} else {
							$scope.myGoBack();
						}
					}, 100
				);
			}

			$scope.addComment = function () {
				BackendService.comment.save({}, {
					id_visit: $scope.visitData.id,
					token: globVar.userToken,
					text: $scope.visitData.commentText
				}, function (resp) {
					$scope.visitData.com = resp.data.comments;
					$scope.reloadComments();
					$scope.visitData.commentText = "";
				});
			};

			$scope.deleteComment = function () {
				BackendService.comment.delete({
						id: $scope.selectedComment.id,
						token: globVar.userToken
					}, {},
					function (resp) {
						$scope.visitData.com = resp.data.comments;
						$scope.reloadComments();
					}
				);
			};

			$scope.commentPopup = function (comment) {
				if (!comment.can_edit) {
					return;
				}
				$scope.selectedComment = comment;
				$ionicPopup.show({
					template: 'Comentario',
					cssClass: 'options-menu',
					scope: $scope,
					buttons: [{
							text: '<b>Borrar</b>',
							type: 'button-positive',
							onTap: $scope.deleteComment
						},
						{
							text: 'Cancelar'
						}

					]
				});
			};

			//Funciones hacia el visor

			$scope.krLoadPano = function (id_pano) {
				document.getElementById("krpano-embed")
					.call("cargaPano(" + id_pano + ")");
				$ionicScrollDelegate.$getByHandle('visitScroll')
					.scrollTop();
			};

			$scope.enterVR = function () {
				document.getElementById("krpano-embed")
					.call("webvr.enterVR();");
			};

			//AREAS

			var loadAreas = function (resp) {
				$scope.tour_areas = resp.Elems;
				$scope.name = resp.name;
				$log.debug("Recibida lista de areas de una visita");
				//---------------------------------------------------------------
				// Si no es un pano suelto, bajar la lista de panos adicionales
				//---------------------------------------------------------------
				$scope.totalAreas = resp.totalItems;
				if (resp.totalItems > 0) {
					for (var i = 0; i < resp.totalItems; i++) {

						BackendService.area.get({}, {
							'idv': $scope.visitData.id,
							'ida': i,
							'lang': globVar.lang
						}, loadArea);

					}
				}
			};

			var loadArea = function (resp) {
				$scope.title_visit = resp.title_visit;
				if (resp.name.indexOf("defecto") > -1) {
					$scope.tour_areas[resp.id_area].areaTitle = "";
				} else {
					$scope.tour_areas[resp.id_area].areaTitle = resp.name;
				}
				$scope.tour_areas[resp.id_area].description = resp.description;
				$scope.tour_areas[resp.id_area].Panos = resp.Panos;
				$scope.morePanos = resp.numPanos;

				for (var j = 0; j < resp.numPanos; j++) {
					$scope.tour_areas[resp.id_area].Panos[j].thumbnail = resp.Panos[j].thumbnail;
					$scope.tour_areas[resp.id_area].Panos[j].kind = $stateParams.kind;
				}

				$log.debug("Recibida descripcion de un area de una visita");
			};

			$scope.reportInadequate = function (id_item, tipo) {
				$scope.popover.hide();
				$state.go('reportInadequate', {
					itemId: id_item,
					kind: tipo
				});
			};

			$scope.reportInadequate2 = function (id_item, tipo) {
				$state.go('reportInadequate', {
					itemId: id_item,
					kind: tipo
				});
			};

			$scope.reportWrong = function (id_item, tipo) {
				$scope.popover.hide();
				$state.go('reportWrong', {
					itemId: id_item,
					kind: tipo
				});
			};

		});
