'use strict';
angular.module('AppModule')

.controller('VRCtrl',
    function(
      $scope,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      $translate,
      $resource,
      $log,
      $ionicSideMenuDelegate,
      $ionicHistory,
      globVar,
      Common,
      BackendService
      ) {

    var vrPane1;
  	var vrPane2;
  	var overlayFadeTimer;

		 //===============================================
    // Manejador de los eventos de movimiento
    //===============================================
    var deviceOrientationHandler = function(eventData) {
        if(!vrPane1) {return;}
      	var roll = eventData.beta;
      	var yaw = - eventData.alpha;

      	var pitch = eventData.gamma;
      	//var fov = 90;
      	var renderer = vrPane1.getRenderer();
      	var renderer2 = vrPane2.getRenderer();

      	if(((eventData.gamma > -90 && eventData.gamma < -45)  && (roll > 90 || roll < -90)) || ((eventData.gamma < 90 && eventData.gamma > 45)  && (roll < 90 && roll > -90))){
      		document.getElementById("rotate-cardboard").style.display = 'block';
      		return;
      	}
      	else{
        	document.getElementById("rotate-cardboard").style.display = 'none';
      	}

      	if (roll < 90 && roll > -90){
      		pitch = 180 + pitch;
      		yaw = yaw + 180;
      	}
      	pitch = -pitch + 90;

      	var startingYaw = vrPane1.getStartingYaw();

      	vrPane1.setPitch(pitch).setYaw(startingYaw + yaw);
      	vrPane2.setPitch(pitch).setYaw(startingYaw + yaw);
      	if (renderer !== null && renderer2  !== null){
      		vrPane1.animate();
      		vrPane2.animate();
      		//Debug(eventData.alpha + " a, " + eventData.beta + " b, " + eventData.gamma + " g " + window.orientation + " orientation");
      	}
      };

   //===============================================
    // Manejador para cargar los datos de la visita virtual
    //===============================================
    function loadTour(data){
      var LogId = "VRCtrl:loadTour";
    	$scope.next_tour_data = data;
  	   BackendService.panos.get({}, { 'id': data.id_tour}, function (result) {

          var config = result;
          config.VR = true;
    			var config2 = JSON.parse(JSON.stringify(result));
    			config2.VR = true;
    			 vrPane1.loadConfig(config,$scope.next_tour_data.targetPitch ,$scope.next_tour_data.targetYaw);
       		 vrPane2.loadConfig(config2,$scope.next_tour_data.targetPitch ,$scope.next_tour_data.targetYaw);

        }, function () {
                $log.debug(LogId + "No es posible obtener los datos de la ruta de la BD");
        });
    }
    //===============================================
    // Inicializar la vista VR
    //===============================================
    function initVR(id_tour){
      var LogId = "VRCtrl:initVR";
      if( screen.lockOrientation){
      	 screen.lockOrientation("landscape");
      }
      if (window.plugins){
       window.plugins.insomnia.keepAwake();
     	}
      if(window.StatusBar) {window.StatusBar.hide();}
      if(window.NavigationBar) {window.NavigationBar.hide();}
    	BackendService.panos.get({}, { 'id': id_tour}, function (result) {
    			var config = result;
    			config.VR = true;
    			var config2 = JSON.parse(JSON.stringify(result));
    			config2.VR = true;

    			 vrPane1 = window.pannellum.viewer('VRcontainer1', config);
    			 vrPane1.SetNavigationHandler(loadTour);
       		 vrPane2 = window.pannellum.viewer('VRcontainer2', config2);

    		}, function () {
              $log.debug(LogId + "No es posible obtener los datos de la ruta de la BD");
        });
    }

    //===============================================
	    // Finalizar ocultación de capas superpuestas
	    //===============================================
	    function endHideOverlay(){
	    	document.getElementById("pannellumVR-overlay").style.display = 'none';
	    }

	    //===============================================
	    // Iniciar ocultación de capas superpuestas
	    //===============================================
	    function startHideOverlay(){
	    	document.getElementById("pannellumVR-overlay").style.opacity = 0;
	    	window.setTimeout(endHideOverlay, 250);
	    }

	    //===============================================
	    // Mostrar capas superpuestas
	    //===============================================
	    function showOverlay(){
	    	window.clearTimeout(overlayFadeTimer);
	    	document.getElementById("pannellumVR-overlay").style.display = 'block';
	    	document.getElementById("pannellumVR-overlay").style.opacity = 1;
	    	overlayFadeTimer = window.setTimeout(startHideOverlay, 2000);
	    }

	    //===============================================
      // Desconectar los eventos
      //===============================================
      function unBindEvents(){
      	if(screen.unlockOrientation){
      		screen.unlockOrientation();
      	}
      	if (window.plugins){
      		window.plugins.insomnia.allowSleepAgain();
      	}
      	if(window.StatusBar) {window.StatusBar.show();}
      	window.removeEventListener('deviceorientation', deviceOrientationHandler);
      	window.clearTimeout(overlayFadeTimer);
      	vrPane1.getRenderer().destroy();
      	vrPane2.getRenderer().destroy();
      }

      //===============================================
      // Conectar los eventos
      //===============================================
      function bindEvents(){
        if (window.DeviceOrientationEvent) {
          // Listen for the event and handle DeviceOrientationEvent object
          window.addEventListener('deviceorientation', deviceOrientationHandler, false);
        }
      	//window.addEventListener('deviceorientation', deviceOrientationHandler , false);
      	document.getElementById('VRcontainer').addEventListener('click', showOverlay , false);
      	document.getElementById('pannellumVR-return-button').addEventListener('click',
      	function(){
      		$ionicHistory.goBack();
      		}
      	);
      }

     //===============================================
    // Ejecutar antes de entrar
    //===============================================
    $scope.$on('$ionicView.beforeEnter', function() {

      bindEvents();
      initVR($stateParams.id_tour);

    });

    //===============================================
    // Ejecutar al salir de la vista
    //===============================================
    $scope.$on('$ionicView.beforeLeave', function() {
      unBindEvents();
    });


















});
