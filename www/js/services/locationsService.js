'use strict';
angular.module('AppModule')

.factory('LocationsService', [ function() {

  var locationsObj = {};

  locationsObj.savedLocations = [
    {
      name : "Now",
      lat : 37.176413,
      lng : -3.5991999,
      zoom : 17
    }  ];

  return locationsObj;

}]);
