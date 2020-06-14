'use strict';
angular.module('AppModule')

.controller('AppCtrl',
  function(
    $rootScope,
    $scope,
    $ionicModal,
    $timeout,
    $state,
    $log,
    $ionicSideMenuDelegate,
    localStorageService,
    globVar,
    $translate,
    $ionicPopup,
    Common
  ) {

    $scope.openMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.hasImage= function() {
      if (globVar.userPhoto === ""){
        return false;
      }
      else {
        return true;
      }
    };

    $scope.userLogged= function() {
      if (globVar.userId === ""){
        return false;
      }
      else {
        return true;
      }
    };

  //=======================================================
  // Evento: $ionicView.beforeEnter
  //=======================================================
  $scope.$on('$ionicView.enter', function() {
    //var logid = "AppCtrl:$ionicView.enter: ";
    $log.debug("Entrada en AppCtrl");

    $scope.foto = globVar.userPhoto;
    $scope.nombre = globVar.userName;
    $scope.userId = globVar.userId;
    var tmparr = globVar.userPhoto.split("=");
		$scope.id_user = tmparr[tmparr.length-1];
  });


  $scope.goPub = function(){
  	Common.goPub();
	};
});
