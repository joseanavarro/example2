'use strict';
angular.module('AppModule')

.service('Maps',
  function (
    $ionicLoading,
    $log,
    $q,
    BackendService,
    DataService,
    Common,
    globVar,
    $ionicPopup,
    $translate,
    $state
  ) {
    var LogId = 'Maps: ';
    //===================================================================
    // getNearPanos:
    // Obtener la lista de visitas cercanas a las coordeandas recibidas
    //===================================================================
    this.getNearPanos = function(latitude, longitude) {

      var q = $q.defer();
      $log.debug(LogId + "Entrada en getNearPanos, lat: " + latitude + " lon: " + longitude);

        //-----------------------------------------------
        // Mostrar la ventana de espera de carga
        //-----------------------------------------------
        //$ionicLoading.show({
         //   content: 'Loading',
         //   animation: 'fade-in',
        //    maxWidth: 900
        //});

        //--------------------------------------------
        // Realizar llamada a API mediante $resource
        //--------------------------------------------
        var qstring = "search=&lat=" + latitude + "&lon=" + longitude +
                      "&page=100&pageSize=40&type=0&lng=" + globVar.lang +
                      "&portal="  + globVar.idPortal;
        BackendService.visitsg.get({}, { 'qs': qstring }, function (resp) {

          if (resp.totalItems > 0)
          {
            //------------------------------------------
            // Limpiar la lista almacenada previamente
            //------------------------------------------
            DataService.clear('data');

            var likeHandler = function (){
							var curretElement = this;
							 if (globVar.userId === ""){
							 	globVar.returnPage = "#/visit/"+curretElement.id + '/data';
								 $ionicPopup.alert({
                        title:  $translate.instant(""),
                        template: $translate.instant('must_login_first_txt'),
                     buttons: [ {text: '<b>'+ $translate.instant('login_txt') +'</b>',
												        type: 'button-positive',
												        onTap: function(e) {
													        				$state.go('login');
													        			}
												        },
												        {text:$translate.instant('cancel_txt')}
        											]
                      });
								return;
								}
							BackendService.like.get({}, {'id':curretElement.id,'token':globVar.userToken,'like':!curretElement.liked},
							function (resp) {
								curretElement.likes = resp.likes;
								curretElement.liked = !curretElement.liked;
							}, function (resp) {
			          $log.debug(LogId + "Error en la llamada al API");
			          //$ionicLoading.hide();
			          q.reject(resp);});
						};
						var commentHandler = function (){
							var curretElement = this;
							 if (globVar.userId === ""){
							 	globVar.returnPage = "#/visit/"+curretElement.id + '/user';
								 $ionicPopup.alert({
                        title:  $translate.instant(""),
                        template: $translate.instant('must_login_first_txt'),
                     buttons: [ {text: '<b>'+ $translate.instant('login_txt') +'</b>',
												        type: 'button-positive',
												        onTap: function(e) {
												        					globVar.forceComment = true;
													        				$state.go('login');
													        }
												        },
												        {text:$translate.instant('cancel_txt')}
        											]
                      });
								return;
								}
							globVar.forceComment = true;
							location.href="#/visit/"+curretElement.id;
					};


					var optionsHandler = function (){
							var curretElement = this;
							 if (curretElement.can_edit){
							 		globVar.deletingTour = curretElement.id;
							 		$ionicPopup.show({
							    template: 'Comentario',
							    cssClass:'options-menu',
							    buttons: [
							     					{
											        text: '<b>'+ $translate.instant('delete_txt') +'</b>',
											        type: 'button-positive',
											        onTap: confirmDelete
									        	},
				      							{ text: $translate.instant('cancel_txt') }

									    ]
					  			});

								}

					};

					var	confirmDelete  = function(){
						var confirmPopup = $ionicPopup.confirm({
							     template: $translate.instant('delete_confirmation_txt'),
							     cancelText: $translate.instant('cancel_txt')
							   });

							   confirmPopup.then(function(res) {
							     if(res) {
							       deleteTour();
							     }
							   });
					};

				var	deleteTour = function(){
  			BackendService.tour.delete(
					{
						id:globVar.deletingTour,
						token:globVar.userToken
					},
					{
					},
						function(resp){
							globVar.photographer = 0;
							DataService.clearAll();
		       		var tmparr = globVar.userPhoto.split("=");
							var id_user = tmparr[tmparr.length-1];
		       		location.href = "#/app/profile/" + id_user;
						}
					);
			};

            $log.debug(LogId + "Recibida lista de visitas cercanas a lat=" + latitude + " lon=" + longitude);
            for (var i = 0; i < resp.totalItems; i++) {

               //-----------------------------------------------------------------------
               // Guardar un array con datos de cada punto, que usaremos para Mostrar
               // un PopUp centrado en la pantalla del móvil
               //-----------------------------------------------------------------------
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
                      kind: 'data',
											liked: resp.Elems[i].liked,
											can_edit: resp.Elems[i].can_edit,
											like:likeHandler,
											comment:commentHandler,
											options:optionsHandler
                    };
               DataService.setdataArray(obj, 'data', i);
            }
            //$ionicLoading.hide();
            q.resolve(resp);
          }
          else
          {
            $log.debug(LogId + "No se han recibido resultados para lat: " + latitude + " lon=" + longitude);
            //$ionic.hide();
            q.resolve(resp);
          }
        }, function (resp) {
          $log.debug(LogId + "Error en la llamada al API para lat: " + latitude + " lon=" + longitude);
          //$ionicLoading.hide();
          q.reject(resp);
      });

      return q.promise;
    };

});
