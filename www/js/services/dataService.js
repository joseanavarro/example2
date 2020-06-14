
'use strict';
angular.module('AppModule')

	.service('DataService',
		function ($q,
			$log,
			$ionicLoading,
			globVar,
			BackendService,
			Common,
			$ionicPopup,
			$translate,
			$state) {

			var LogId = 'DataService: ';

			//Clase que contiene los datos de un listado.
			var DataList = function () {
				this.elements = [];
				this.page = 0;
				this.isMoreData = true;
			};

			var self = this;

			self.dataLists = [];
			self.dataLists.data = new DataList();
			self.dataLists.recent = new DataList();
			self.dataLists.sel = new DataList();
			self.dataLists.near = new DataList();
			self.dataLists.search = new DataList();
			self.dataLists.user = new DataList();
			self.dataLists.areas = new DataList();

			self.userProfile = null;

			//==========================================
			// setdataArray:
			//==========================================
			self.setdataArray = function (newObj, item, index) {
				if (!self.dataLists[item]) {
					item = "data";
				}
				self.dataLists[item].index = index;
				self.dataLists[item].elements.push(newObj);
			};

			//==========================================
			// setdataArray:
			//==========================================
			self.isMoreData = function (item) {
				if (!self.dataLists[item]) {
					item = "data";
				}
				return self.dataLists[item].isMoreData;
			};

			//==========================================
			// getAllData: Obtener la lista de datos
			//==========================================
			self.getAllData = function (item) {
				if (!self.dataLists[item]) {
					item = "data";
				}
				return self.dataLists[item].elements;
			};

			//==========================================
			// getDataById:
			//==========================================
			self.getDataById = function (idVal, item) {
				if (!self.dataLists[item]) {
					item = "data";
				}
				var result = '';

				result = self.dataLists[item].elements.filter(function (obj) {
					return obj.id == idVal;
				});

				return result ? result[0] : null; // or undefined
			};

			//==========================================
			// clear:
			//==========================================
			self.clear = function (item) {
				if (!self.dataLists[item]) {
					item = "data";
				}
				self.dataLists[item].page = 0;
				self.dataLists[item].elements = [];
				self.dataLists[item].isMoreData = true;

			};

			self.clearAll = function () {
				self.clear('recent');
				self.clear('sel');
				self.clear('user');
				self.clear('near');
				self.clear('search');
				self.clear('areas');
				self.userProfile = null;
				globVar.photographer = null;
				self.clear();
			};
			//============================================
			// Descargar datos del servicio REST
			//============================================
			self.getRestData = function (item, user) {

				var q = $q.defer();
				$log.debug(LogId + "Entrada en getRestData");
				//-----------------------------------------------
				// Mostrar la ventana de espera de carga
				//-----------------------------------------------
				/*
				$ionicLoading.show({
				    content: 'Loading',
				    animation: 'fade-in',
				    maxWidth: 900
				});
				*/
				var sel = 0;
				var page = 0;
				var isMoreData = true;
				var qstring = "";

				self.dataLists[item].page++;
				page = self.dataLists[item].page;

				switch (item) {
				case 'recent':
					sel = 0;
					qstring = "search=&page=" + page + "&pageSize=" + globVar.pageSize + "&type=" + sel + "&lng=" + globVar.lang + "&portal=" + globVar.idPortal;
					break;

				case 'sel':
					sel = 1;
					qstring = "search=&page=" + page + "&pageSize=" + globVar.pageSize + "&type=" + sel + "&lng=" + globVar.lang + "&portal=" + globVar.idPortal;
					break;

				case 'user':
					sel = 0;
					qstring = "search=&page=" + page + "&pageSize=" + globVar.pageSize + "&type=" + sel + "&lng=" + globVar.lang + "&id_user=" + user + "&portal=" + globVar.idPortal;
					break;

				case 'near':
					break;

				case 'search':
					break;

				default:
					break;
				}

				if (globVar.userToken !== '') {
					if (qstring !== '') {
						qstring += '&';
					}
					qstring += 'token=' + globVar.userToken;
				}


				//--------------------------------------------
				// Realizar llamada a API mediante $resource
				//--------------------------------------------
				var total = 0;

				BackendService.visits.get({}, {
					'qs': qstring
				}, function (resp) {

					if (resp.totalItems > 0) {
						if ((resp.pageSize * page) > resp.totalItems) {
							total = resp.totalItems - (resp.pageSize * (page - 1));
							isMoreData = false;
						} else {
							total = resp.pageSize;
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
									q.reject(resp);
								});
						};

						var commentHandler = function () {
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
												globVar.forceComment = true;
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
							globVar.forceComment = true;
							location.href = "#/visit/" + curretElement.id + "/comment";
						};


						var optionsHandler = function () {
							var curretElement = this;
							if (curretElement.can_edit) {
								globVar.deletingTour = curretElement.id;
								$ionicPopup.show({
									template: 'Comentario',
									cssClass: 'options-menu',
									buttons: [{
											text: '<b>' + $translate.instant('delete_txt') + '</b>',
											type: 'button-positive',
											onTap: confirmDelete
										},
										{
											text: $translate.instant('cancel_txt')
										}

									]
								});

							}

						};

						var confirmDelete = function () {
							var confirmPopup = $ionicPopup.confirm({
								template: $translate.instant('delete_confirmation_txt'),
								cancelText: $translate.instant('cancel_txt')
							});

							confirmPopup.then(function (res) {
								if (res) {
									deleteTour();
								}
							});
						};

						var deleteTour = function () {
							BackendService.tour.delete({
									id: globVar.deletingTour,
									token: globVar.userToken
								}, {},
								function (resp) {
									globVar.photographer = 0;
									self.clearAll();
									var tmparr = globVar.userPhoto.split("=");
									var id_user = tmparr[tmparr.length - 1];
									location.href = "#/app/profile/" + id_user;
								}
							);
						};

						$log.debug(LogId + "Recibida lista");
						for (var i = 0; i < total; i++) {
							if (resp.Elems[i].id !== null) {
								var obj = {
									id: resp.Elems[i].id,
									id_pano: resp.Elems[i].id_pano,
									address: resp.Elems[i].address,
									city: resp.Elems[i].city,
									country: resp.Elems[i].country,
									description: Common.htmlToPlaintext(resp.Elems[i].description),
									distance: resp.Elems[i].distance,
									lat: resp.Elems[i].lat,
									lon: resp.Elems[i].lon,
									province: resp.Elems[i].province,
									thumbnail: resp.Elems[i].thumbnail,
									title: resp.Elems[i].title,
									userId: resp.Elems[i].userId,
									owner: resp.Elems[i].nombre + " " + resp.Elems[i].apellidos,
									likes: resp.Elems[i].likes,
									vis: resp.Elems[i].visualizaciones,
									com: resp.Elems[i].total_comentarios,
									creation: resp.Elems[i].creation,
									color: 1,
									kind: item,
									liked: resp.Elems[i].liked,
									can_edit: resp.Elems[i].can_edit,
									like: likeHandler,
									comment: commentHandler,
									options: optionsHandler
								};

								//------------------------------------------------------
								// Guardar el dato recibido en el array correspondiente
								//------------------------------------------------------

								self.dataLists[item].elements.push(obj);

							} else {
								//--------------------
								// No hay más datos
								//--------------------
							}
						}
						self.dataLists[item].isMoreData = isMoreData;
						//$ionicLoading.hide();
						q.resolve(resp);
					} else {
						self.dataLists[item].isMoreData = false;
						$log.debug(LogId + "No se han recibido resultados");
						//$ionicLoading.hide();
						q.resolve(resp);
					}
				}, function (resp) {
					$log.debug(LogId + "Error en la llamada al API");
					//$ionicLoading.hide();
					q.reject(resp);
				});
				//$ionicLoading.hide();
				return q.promise;
			};


		})

	.service('RoutesService',
		function ($q,
			$log,
			$ionicLoading,
			globVar,
			BackendService,
			Common) {

			var LogId = 'RoutesService: ';

			var self = this;

			self.routesArray = [];
			self.routesPage = 0;
			self.routesIsMoreData = true;

			//==========================================
			// setdataArray:
			//==========================================
			self.setdataArray = function (newObj, item, index) {

				switch (item) {

				case 'routes':
					self.routesIndex = index;
					self.routesArray.push(newObj);
					break;

				default:
					self.routesIndex = index;
					self.routesArray.push(newObj);
					break;
				}
			};

			//==========================================
			// setdataArray:
			//==========================================
			self.isMoreData = function (item) {

				switch (item) {

				case 'routes':
					return self.routesIsMoreData;
				default:
					return self.routesIsMoreData;
				}
			};

			//==========================================
			// getAllData: Obtener la lista de datos
			//==========================================
			self.getAllData = function (item) {

				switch (item) {

				case 'routes':
					return self.routesArray;

				default:
					return self.routesArray;
				}
			};

			//==========================================
			// getDataById:
			//==========================================
			self.getDataById = function (idVal, item) {
				var result = '';

				switch (item) {

				case 'routes':
					result = self.routesArray.filter(function (obj) {
						return obj.id == idVal;
					});
					break;

				default:
					result = self.routesArray.filter(function (obj) {
						return obj.id == idVal;
					});
					break;
				}

				return result ? result[0] : null; // or undefined
			};

			//==========================================
			// clear:
			//==========================================
			self.clear = function (item) {

				switch (item) {

				case 'routes':
					self.routesPage = 0;
					self.routesArray = [];
					self.routesIsMoreData = true;
					break;

				default:
					self.routesPage = 0;
					self.routesArray = [];
					self.routesIsMoreData = true;
					break;
				}

			};

			//============================================
			// Descargar datos del servicio REST
			//============================================
			self.getRestData = function (item, user) {

				var q = $q.defer();
				$log.debug(LogId + "Entrada en getRestData");
				//-----------------------------------------------
				// Mostrar la ventana de espera de carga
				//-----------------------------------------------
				/*
				$ionicLoading.show({
				    content: 'Loading',
				    animation: 'fade-in',
				    maxWidth: 900
				});
				*/
				var sel = 0;
				var page = 0;
				var isMoreData = true;
				var qstring = "";

				switch (item) {

				case 'routes':
					self.routesPage++;
					page = self.routesPage;
					qstring = "page=" + page + "&pageSize=6&type=0&lastUpdated=20070101&lng=" + globVar.lang + "&portal=" + globVar.idPortal;
					break;

				default:
					self.routesPage++;
					page = self.routesPage;
					qstring = "page=" + page + "&pageSize=6&type=0&lastUpdated=20070101&lng=" + globVar.lang + "&portal=" + globVar.idPortal;
					break;
				}

				//--------------------------------------------
				// Realizar llamada a API mediante $resource
				//--------------------------------------------
				var total = 0;

				BackendService.rroutes.get({}, {
					'qs': qstring
				}, function (resp) {

					if (resp.totalItems > 0) {
						if ((resp.pageSize * page) > resp.totalItems) {
							total = resp.totalItems - (resp.pageSize * (page - 1));
							isMoreData = false;
						} else {
							total = resp.pageSize;
						}

						$log.debug(LogId + "Recibida lista");
						for (var i = 0; i < total; i++) {
							if (resp.Elems[i].id !== null) {
								var obj = {
									id: resp.Elems[i].id,
									title: resp.Elems[i].title,
									description: resp.Elems[i].description,
									lat: resp.Elems[i].lat,
									lon: resp.Elems[i].lon,
									zoom: resp.Elems[i].zoom,
									thumbnail: resp.Elems[i].thumbnail,
									country: resp.Elems[i].country,
									province: resp.Elems[i].province,
									city: resp.Elems[i].city,
									kind: item
								};

								//------------------------------------------------------
								// Guardar el dato recibido en el array correspondiente
								//------------------------------------------------------
								switch (item) {

								case 'routes':
									self.routesArray.push(obj);
									self.routesIsMoreData = isMoreData;
									break;

								default:
									self.routesArray.push(obj);
									self.routesIsMoreData = isMoreData;
									break;
								}
							} else {
								//--------------------
								// No hay más datos
								//--------------------
							}
						}
						//$ionicLoading.hide();
						q.resolve(resp);
					} else {
						$log.debug(LogId + "No se han recibido resultados");
						//$ionicLoading.hide();
						q.resolve(resp);
					}
				}, function (resp) {
					$log.debug(LogId + "Error en la llamada al API");
					//$ionicLoading.hide();
					q.reject(resp);
				});
				//$ionicLoading.hide();
				return q.promise;
			};


		})

;
