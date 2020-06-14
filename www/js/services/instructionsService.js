'use strict';
angular.module('AppModule')

.factory('InstructionsService', [ function() {

  var instructionsObj = {};

  instructionsObj.instructions = {
    newLocations : {
      text : "txt_add_locations_desc",
      seen : false
    }
  };

  return instructionsObj;

}]);
