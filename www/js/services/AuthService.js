'use strict';
angular.module('AppModule')

.factory('AuthService',
  function($resource,
           AUTH_API_URL) {
 return {register: $resource(AUTH_API_URL + 'Account/Register/')};
});
