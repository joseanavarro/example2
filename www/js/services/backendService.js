'use strict';
angular.module('AppModule')

  .factory('BackendService',
    function ($resource,
              $ionicPopup,
              ELQV_API_URL,
              ELQV_API_URL2,
              AUTH_API_URL,
              GOOGLE_GEOCODING_API_URL,
              FACEBOOK_PROFILE_URL,
              $log,
              globVar) {
      return {
        login: $resource(AUTH_API_URL + ':m?' + ':qs',
              {
                  m: '@m',
                  qs: '@qs'
              },
              {
                  query: {
                      method: 'GET',
                      isArray: true,
                      timeout: 5000,
                      params: {},
                      interceptor: {
                          response: function (data) {
                              $log.debug('respuesta correcta en peticion API', data);
                          },
                          responseError: function (data) {
                              $log.debug('error en peticion API', data);
                              $ionicPopup.alert({
                                  title: 'Error',
                                  template: 'Error en la descarga de datos desde el servidor'
                              });
                          }
                      },
                  }
              }
          ),
      profile: $resource(AUTH_API_URL + 'profile.aspx?token=:tok',
                {
                    tok: '@tok'
                },
                {
                    query: {
                        method: 'GET',
                        isArray: true,
                        timeout: 5000,
                        params: {},
                        interceptor: {
                            response: function (data) {
                                $log.debug('respuesta correcta en peticion API', data);
                            },
                            responseError: function (data) {
                                $log.debug('error en peticion API', data);
                                $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Error en la descarga de datos desde el servidor'
                                });
                            }
                        },
                    }
                }
            ),
          visit: $resource(ELQV_API_URL + 'visitd/:id/:opt/:lang',
                {
                    id: '@id',
                    opt: '@opt',
                    lang: '@lang'
                },
                {
                    query: {
                        method: 'GET',
                        isArray: false,
                        timeout: 5000,
                        params: {},

                    }
                }
            ),
            visitByPano: $resource(ELQV_API_URL + 'visitp/:id/:lang',
                {
                    id: '@id',
                    lang: '@lang'
                },
                {
                    query: {
                        method: 'GET',
                        isArray: false,
                        timeout: 5000,
                        params: {},

                    }
                }
            ),
          //------------------------------------------------------------
          // Llamada mediante un querystring creado en el controlador
          //------------------------------------------------------------
          visits: $resource(ELQV_API_URL2 + 'visits?:qs',
                {
                    qs: '@qs'
                },
                {
                    query: {
                        method: 'GET',
                        isArray: false,
                        timeout: 5000,
                        params: {},

                    }
                }
            ),
            visitsg: $resource(ELQV_API_URL2 + 'visitsg?:qs',
                {
                    qs: '@qs'
                },
                {
                    query: {
                        method: 'GET',
                        isArray: false,
                        timeout: 5000,
                        params: {},

                    }
                }
            ),
            rroutes: $resource(ELQV_API_URL2 + 'rroutes?:qs',
                  {
                      qs: '@qs'
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},

                      }
                  }
              ),
          areas: $resource(ELQV_API_URL + 'areas/:id/:lang',
                {
                    id: '@id',
                    lang: '@lang'
                },
                {
                    query: {
                        method: 'GET',
                        isArray: false,
                        timeout: 5000,
                        params: {},

                    }
                }
            ),
            area: $resource(ELQV_API_URL + 'visit/:idv/area/:ida/lng/:lang',
                  {
                      idv: '@idv',
                      ida: '@ida',
                    	lang: '@lang'
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},

                      }
                  }
              ),
               users: $resource(ELQV_API_URL + 'users?:qs',
                  {
                      qs: '@qs'
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                              }
                          },
                      }
                  }
              ),
               user: $resource(ELQV_API_URL + 'user?id_user=:id_user&token=:token&lng=:lng&portal=:portal',
                  {
                      id_user: '@id_user',
                      token: '@token',
                      lng: '@lng',
                      portal: '@portal'
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                              }
                          },
                      }
                  }
              ),
               comments: $resource(ELQV_API_URL + 'comments/:id_visit',
                  {
                  	 id_visit: '@id_visit'
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                              }
                          },
                      }
                  }
              ),
               comment: $resource(ELQV_API_URL + 'comment',
                  {

                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                              }
                          },
                      },
                      save: {
                          method: 'POST',
                          timeout: 5000,
                          isArray: false,
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                                  return data;
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                                  return data;
                              }
                          }
                      },
                      delete: {
                          method: 'DELETE',
                          timeout: 5000,
                          isArray: false,
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                                  return data;
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                                  return data;
                              }
                          }
                      }
                  }
              ),
              report: $resource(ELQV_API_URL + 'report',
                 {

                 },
                 {
                     save: {
                         method: 'POST',
                         timeout: 5000,
                         isArray: false,
                         interceptor: {
                             response: function (data) {
                                 $log.debug('respuesta correcta en peticion API', data);
                                 return data;
                             },
                             responseError: function (data) {
                                 $log.debug('error en peticion API', data);
                                 $ionicPopup.alert({
                                     title: 'Error',
                                     template: 'Error en la descarga de datos desde el servidor'
                                 });
                                 return data;
                             }
                         }
                     }
                 }
             ),
               tour: $resource(ELQV_API_URL + 'visit',
                  {

                  },
                  {
                      delete: {
                          method: 'DELETE',
                          timeout: 5000,
                          isArray: false,
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                                  return data;
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                                  return data;
                              }
                          }
                      }
                  }
              ),
               trackview: $resource(ELQV_API_URL + 'trackview/:id',
                  {
                      id: '@id',
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                              }
                          },
                      }
                  }
              ),
              like: $resource(ELQV_API_URL + 'like/:id/:token/:like',
                  {
                      id: '@id',
                      token: '@token',
                      like: '@like'
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                              }
                          },
                      }
                  }
              ),
              follow: $resource(ELQV_API_URL + 'follow/:id/:token/:follow',
                  {
                      id: '@id',
                      token: '@token',
                      follow: '@follow'
                  },
                  {
                      query: {
                          method: 'GET',
                          isArray: false,
                          timeout: 5000,
                          params: {},
                          interceptor: {
                              response: function (data) {
                                  $log.debug('respuesta correcta en peticion API', data);
                              },
                              responseError: function (data) {
                                  $log.debug('error en peticion API', data);
                                  $ionicPopup.alert({
                                      title: 'Error',
                                      template: 'Error en la descarga de datos desde el servidor'
                                  });
                              }
                          },
                      }
                  }
              ),
              geocode: $resource(GOOGLE_GEOCODING_API_URL + '?sensor=false&address=:strAddress',
                    {
                        strAddress: '@strAddress'
                    },
                    {
                        query: {
                            method: 'GET',
                            isArray: false,
                            timeout: 5000,
                            params: {},
                            interceptor: {
                                response: function (data) {
                                    $log.debug('respuesta correcta en peticion API', data);
                                },
                                responseError: function (data) {
                                    $log.debug('error en peticion API', data);
                                    $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'Error en la descarga de datos desde el servidor'
                                    });
                                }
                            },
                        }
                    }
                ),
              reversegeocode: $resource(GOOGLE_GEOCODING_API_URL + '?sensor=false&latlng=:lat,:lng',
                    {
                        lat: '@lat',
                        lng: '@lng'
                    },
                    {
                        query: {
                            method: 'GET',
                            isArray: false,
                            timeout: 5000,
                            params: {},
                            interceptor: {
                                response: function (data) {
                                    $log.debug('respuesta correcta en peticion API', data);
                                },
                                responseError: function (data) {
                                    $log.debug('error en peticion API', data);
                                    $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'Error en la descarga de datos desde el servidor'
                                    });
                                }
                            },
                        }
                    }
                ),
          // Esta es una prueba con un servicio REST externo
          visita: $resource(ELQV_API_URL + 'visits/:id/:lang', { id: '@id',lang:'en' }, {
              query: { method: 'GET', params: {}, isArray: false }
          }),
          // Esta es una prueba con un servicio REST externo
          currentEvent: $resource(ELQV_API_URL + 'currentevent?lng=:lang', { lang:'en' }, {
              query: { method: 'GET', params: {}, isArray: false }
          }),
          //------------------------------------------------------------
          // Llamada mediante un querystring creado en el controlador
          //------------------------------------------------------------
          fbprofile: $resource(FACEBOOK_PROFILE_URL + '?:qs',
                {
                    qs: '@qs'
                },
                {
                    query: {
                        method: 'GET',
                        isArray: true,
                        timeout: 5000,
                        params: {},
                        interceptor: {
                            response: function (data) {
                                $log.debug('respuesta correcta en peticion API', data);
                            },
                            responseError: function (data) {
                                $log.debug('error en peticion API', data);
                                $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'Error en la descarga de datos desde el servidor'
                                });
                            }
                        },
                    }
                }
            )


      };
  })
  .factory('RegService', function($resource, AUTH_API_URL) {
    return $resource(AUTH_API_URL + 'account/register/');
  })
  .factory('LoginService', function($resource, AUTH_API_URL) {
    return $resource(AUTH_API_URL + 'account/login/');
  })
;
