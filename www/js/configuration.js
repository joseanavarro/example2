(function () {
	'use strict';

	angular.module('AppModule')
		//-----------------------
		// Variables globales
		//-----------------------
		.value('globVar', {
			lat: 0,
			lon: 0,
			zoom: 0,
			name: '',
			userId: '',
			userName: '',
			userToken: '',
			userPhoto: '',
			routeId: 0,
			tourId: 0,
			batteryLevel: 1,
			hdr: 0,
			mapChange: 0,
			areaType: 'map',
			lang: 'en',
			back: 0,
			photographer: 0,
			pageSize: 4,
			forceFacebook: false,
			forceComment: false,
			returnPage: '',
			camSession: '',
			savePath: '',
			connectedToCamera: false,
			takingPhoto: false,
			idPortal: 40,
			delFoto: false,
			delTourAfterPub: true,
			cameraWifi: ''
		})
		//--------------------------------------------
		// Definición de constantes de configuración
		//--------------------------------------------
		.constant('LogId', 'Walk2View: ')
		.constant('ELQV_API_URL', 'http://app.walk2view.com/app2/api/v1/')
		.constant('ELQV_API_URL2', 'http://app.walk2view.com/app1/api/v2/')
		.constant('AUTH_API_URL', 'https://www.walk2view.com/login/api/')
		.constant('GOOGLE_GEOCODING_API_URL', 'http://maps.googleapis.com/maps/api/geocode/json')
		.constant('FACEBOOK_PROFILE_URL', 'https://graph.facebook.com/v2.2/me')
		.constant('OWNER_THUMBNAIL_URL', 'http://app.walk2view.com/profilepic.aspx?u=')
		.constant('TOUR_THUMBNAIL_URL', 'http://app.walk2view.com/thumbnaileq.aspx?r=')
		.constant('PUBLISH_API', 'http://app.walk2view.com/admin/webservices/pub/publish.aspx')
		.constant('UPLOAD_PANO_API', 'http://app.walk2view.com/admin/webservices/pub/uploadpano.aspx')
		.constant('GET_TASK_ID_API', 'http://app.walk2view.com/admin/webservices/pub/gettaskid.aspx')
		.constant('KRPANO_API', 'http://app.walk2view.com/krpano')

		.constant('URL', {
			CAMERA_API2: 'http://localhost:8080/osc/',
			CAMERA_API1: 'http://10.0.2.2:8080/osc/',
			CAMERA_API: 'http://192.168.1.1:80/osc/'
		})
		.constant('CN', {
			CAMERA_MODEL: 'RICOH THETA S',
			FIRMWARE_REQ: ['01.82', '1.82'],
			HTTP_TIMEOUT: 3000,
			INIT_WAIT: 200,
			NOTFOUND: -1,
			PANO_INDOOR: 1,
			PANO_OUTDOOR: 0,
			INIT_PAGE: '#/app/home'
		})
		.constant('ERR', {
			CAMERA_NOT_OK: 'err_camera_not_ok_txt',
			CAMERA_ERROR: 'err_camera_txt'
		})
		.constant('DB_CONFIG', {
			name: 'DB',
			tables: [{
					name: 'Login',
					columns: [{
							name: 'id',
							type: 'bigint PRIMARY KEY'
						},
						{
							name: 'userid',
							type: 'text'
						},
						{
							name: 'token',
							type: 'text'
						},
						{
							name: 'name',
							type: 'text'
						},
						{
							name: 'photo',
							type: 'text'
						},
						{
							name: 'email',
							type: 'text'
						},
						{
							name: 'fbtoken',
							type: 'text'
						},
						{
							name: 'fbid',
							type: 'text'
						}
					]
				},
				{
					name: 'Options2',
					columns: [{
							name: 'id',
							type: 'bigint PRIMARY KEY'
						},
						{
							name: 'Lic',
							type: 'text'
						},
						{
							name: 'sessionId',
							type: 'text'
						},
						{
							name: 'remPhotoAfter',
							type: 'int'
						},
						{
							name: 'loc',
							type: 'int'
						},
						{
							name: 'cameraWifi',
							type: 'text'
						},
						{
							name: 'serialNr',
							type: 'text'
						}
					]
				}
			]
		});

}());
