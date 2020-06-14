(function () {

	//-----------------------------------
	// Módulo de traducción de textos
	//-----------------------------------
	'use strict';
	angular.module('AppModule')

		.constant('langConfig', function ($translateProvider) {

			//------------------------------------------------------------
			// Configuración de la traducción de textos de la aplicación
			//------------------------------------------------------------
			$translateProvider.translations('en', {
				about_txt: "About",
				address_txt: "Address",
				address_desc_txt: "You can search city names or detailed adresses",
				address_sample1_txt: "New York",
				address_sample2_txt: "23 King St, London",
				and_txt: " and ",
				associated_camera_txt: "Associated camera",
				battery_level_txt: "Battery level",
				camera_txt: "Camera",
				camera_connected_txt: "Connected",
				camera_not_connected_txt: "Camera not connected",
				camera_not_connected_ios_txt: "This version of the App can connect to Ricoh Theta S cameras. If you want control the camera from the App you need first to connectthrough wifi with the camera (please, follow the camera instructions). Once the camera and the phone are connected through wifi you can enter here and swtich the 'Connect camera' button.",
				camera_not_connected_and_txt: "This version of the App can connect to Ricoh Theta S cameras. If you want control the camera first switch it on. Once the camera is on press the 'Connect camera' button.",
				camera_wifi_found_txt: "Found camera Wifi ",
				camera_wifi_not_found_txt: "Camera Wifi not found",
				cancel_txt: "Cancel",
				checking_wifi_txt: "Checking Wifi",
				checking_wifi_desc_txt: "Looking for the camera Wifi",
				circular_photo_txt: "First 'Open camera', shoot the photo around you. When the photo is available, come back here and 'Select panorama'",
				config_txt: "Configuration",
				connect_camera_txt: "Connect camera",
				connected_to_camera_txt: "Connected to camera",
				connected_to_camera_wifi_txt: "Connected to camera Wifi",
				connecting_camera_txt: "Connecting to the camera",
				desc_txt: "Description",
				design_txt: "Design/Content",
				details_txt: "Details",
				downloading_photo_desc_txt: "Copying photo from the camera to the mobile phone. Please wait",
				duplicate_email_txt: "The e-mail address is assigned to another user",
				editor_selection_txt: "Editor's Picks",
				enter_same_password_txt: "Please, enter the same password in both password fields",
				error_txt: "Error",
				error_int_txt: "App internal error. Please reinstall and try again",
				error_geocode_body_txt: "There has been an error in your request. Please, try again later",
				error_geocode_title_txt: "Error",
				err_camera_not_ok_txt: "Can not connect with the camera. Please,  check the wifi connection",
				err_camera_txt: "Camera error",
				err_manually_enable_wifi_txt: "Unable to switch on Wifi from the App. Please, switch the Wifi on manually",
				error_perm_txt: "Permission not granted, the requested operation can not be executed",
				error_photo_done_txt: "Error taking photo",
				error_photo_done_desc_txt: "There was a problem taking or downloading the photo. Please check the connection to the camera.",
				explore_txt: "Explore",
				facebook_login_txt: "Init session with Facebook",
				facebook_register_txt: "Sign Up with Facebook",
				find_location_txt: "Find street address",
				follow_arrow_txt: "You need to start shooting the 360 photo in the direction pointed by the red arrow, in order to properly connect your photo with the rest of the world",
				help_txt: "Help",
				help1_txt: "Shoot 360 photos with your phone",
				help2_txt: "Upload 360 photos from the App",
				help3_txt: "Enjoy your photos in VR",
				help4_txt: "Share your photos with your friends",
				home_txt: "Home",
				indoor_view_txt: "Indoor view",
				init_session_txt: "Init session",
				interesting_places_txt: "Interesting places",
				interesting_places_end_txt: " . You can zoom and pan in order to see all the places",
				interesting_places_ini_txt: "There are interesting places around this location",
				intro_title_txt: "The 360 photography social network",
				intro_text_txt: "Create, edit and share 360 photographs, has never been so easy",
				invalid_password_txt: "The password is too weak. Try with a different one, or at least a longer one",
				keep_photos_txt: "Keep photos in camera",
				km_txt: " Km ",
				last_name_txt: "Last name",
				list_txt: "List",
				location_nok_body_txt: "Can not fin your location. Please, try to  find your location with the 'Search' option",
				location_nok_title_txt: "Can not fin your location",
				login_error_txt: "Log in error",
				login_error_desc_txt: "Access system error. Please try again later. If the problem persists reinstall the App",
				log_in_txt: "Log in",
				logout_txt: "Log out",
				map_txt: "Map",
				maps_txt: "Maps",
				more_views_txt: "More views in the tour",
				name_txt: "Name",
				near_here_txt: "Near here",
				need_cardboard_txt: "You need to install the App 'Cardboard Camera' from the Play Store ",
				new_location_txt: "New Location",
				new_posts_txt: "Recent",
				no_geocode_res_body_txt: "Try to enter a different data and search again",
				no_geocode_res_title_txt: "There are no results",
				no_places_near_body_txt: "Unfortunately we don't have photographs of interesting places near here",
				no_places_near_title_txt: "No places found",
				ok_txt: "OK",
				open_camera_txt: "Connect 360 camera",
				photo_done_txt: "Panorama done",
				photo_done_desc_txt: "You can publish the panorama whenever you want, by entering the publish option and selecting it from the Photo Gallery in the 'images' folder",
				password_txt: "Password",
				password_error_desc_txt: "The user identity or the password are wrong",
				priv_agreement_1_txt: "By Signing up you agree to the",
				priv_agreement_2_txt: "Terms of Service",
				priv_agreement_3_txt: " and ",
				priv_agreement_4_txt: "Privacy Policy",
				programming_txt: "Programming",
				PublishError_txt: "Error in the publish process",
				publish_ok_txt: "Successful publication",
				publish_txt: "Publish",
				reg_txt: "Sign Up",
				register_data_txt: "Sign Up data",
				register_error_txt: "Sign Up error",
				register_error_desc_txt: "Sign Up error, please try again later",
				register_txt: "Sign Up",
				register2_txt: "Are you still not a member? Sign up!",
				remember_password_txt: "Forgot password?",
				remove_photos_txt: "Remove camera photo",
				remove_photo_after_txt: "Remove photos in camera after download to the phone",
				repeat_password_txt: "Repeat password",
				results_found_txt: "Interesting places near here",
				route_details_txt: "Route details",
				route_map_txt: "Route map",
				routes_txt: "Routes",
				samples_txt: "EXAMPLES: ",
				save_location_txt: "Save location of tours",
				save_txt: "Save",
				search_txt: "Search",
				search_location_txt: "Search location",
				search_near: "Finding actual location",
				select_folder_txt: "Select folder",
				select_folder_desc_txt: "Select a picture in the next screen, the panoramas will be saved in the same folder as the photo selected",
				share_in_txt: "Share in",
				signup_error_txt: "Signup error",
				status_txt: "Status",
				take_panorama_txt: "Take panorama",
				taking_photo_txt: "Taking panorama",
				taking_photo_desc_txt: "It may take a while <br/>Please wait and don't switch off the camera",
				unknown_error: "Unknown error",
				UploadError_txt: "Error uploading the photo. Please, try again later",
				user_blocked_txt: "The user is blocked. Please, contact with the webmaster.",
				user_not_confirmed_txt: "Please, check your inbox and confirm your e-mail address, following the instructions that we sent to you",
				user_publications: "User publications",
				view_more_txt: "View more ",
				welcome_txt: "Welcome!",
				welcome_desc_txt: "You are now a 'Walk2view' user. Check your e-mail for further details",
				wifi_enabled_txt: "Phone Wifi enabled",
				you_are_here_txt: "You are here",
				title_missing_txt: "Title missing",
				select_pano_txt: "Select panorama",
				pano_is_published_txt: "The tour is being processed. In a few minutes it will be published.",
				publish_pano_txt: "Publish Panorama",
				install_txt: "Install",
				or_txt: "or",
				year_ago_txt: "{0} year ago",
				years_ago_txt: "{0} years ago",
				month_ago_txt: "{0} month ago",
				months_ago_txt: "{0} months ago",
				day_ago_txt: "{0} day ago",
				days_ago_txt: "{0} days ago",
				hour_ago_txt: "{0} hour ago",
				hours_ago_txt: "{0} hours ago",
				minute_ago_txt: "{0} minute ago",
				minutes_ago_txt: "{0} minutes ago",
				must_login_first_txt: "You must login first",
				login_txt: "Login",
				followers_txt: "Followers",
				following_txt: "Following",
				city_txt: "City",
				country_txt: "Country",
				ocupation_txt: "Ocupation",
				more_info_txt: "More information",
				information_txt: "Information",
				publications_txt: "Publications",
				notification_title_txt: "Walk2view",
				publish_notification_success_txt: "Publishing complete",
				publish_notification_error_txt: "Publishing error",
				obtaining_location_txt: "Obtaning location",
				unknown_location_txt: "Add a location",
				try_again_txt: "Try again",
				restart_txt: "Restart",
				publish_another_txt: "Publish again",
				do_something_else_txt: "Do something else",
				compass_description_txt: "If you want your 360 photos link correctly to other user's photos, you should start capturing where the arrow points.",
				publish_instructions_1_txt: "Press 'Open Camera', take a photo while turning and when it is ready, come back here and press 'Select Panorama'",
				uploading_panorama_txt: "Uploading Panorama",
				you_can_do_something_else_txt: "You can do something else while the panorama is being uploaded.",
				published_txt: "Published",
				comments_txt: "Comments",
				write_comment_txt: "      Write a comment...",
				write_title_txt: "Write a title...",
				write_description_txt: "Write a description...",
				search_a_location_txt: "Search a location...",
				title_txt: "Title",
				location_txt: "Location",
				now_txt: "Now",
				delete_txt: "Delete",
				delete_confirmation_txt: "Are you sure?",
				incorrect_proportions_txt: "The image aspect ratio isn't correct.",
				other_txt: "Other",
				ios_publish_txt: "Use a 360 camera or a mobile App to obtain a 360 foto. Then return here and select the image pressing the button",
				report_content_txt: "Report content",
				inadequate_content_txt: "Inadequate",
				wrong_data_txt: "Wrong",
				send_txt: "Send",
				report_inadequate_txt: "Please indicate the reason for your complaint and enter the additional information deemed relevant",
				report_wrong_txt: "Please indicate the reason for your report and enter the additional information deemed relevant",
				sexual_content_txt: "Sexual content",
				violent_context_txt: "Violent or repulsive content",
				hate_content_txt: "Inappropriate or Hateful content",
				dangerous_content_txt: "Harmful activities",
				child_abuse_txt: "Child abuse",
				rights_abuse_txt: "Infringement of my rights",
				spam_txt: "Spam",
				report_thanks_txt: "Ya hemos registrado su indicación. En breve nuestros operadores procederán a revisar el contenido. Muchas gracias por su colaboración",
				wrong_title_txt: "Wrong title",
				wrong_description_txt: "Wrong Description",
				wrong_location_txt: "Wrong Location",
				wrong_orientation_txt: "Wrong Orientation",
				wrong_type_txt: "You must select a reason",
				app_title_txt: "Walk2view"
			});
			$translateProvider.translations('es', {
				about_txt: "Acerca de",
				address_txt: "Dirección",
				address_desc_txt: "Pudes buscar nombres de poblaciones o direcciones detalladas",
				address_sample1_txt: "Barcelona",
				address_sample2_txt: "Gran vía, 23, Madrid",
				and_txt: " y ",
				associated_camera_txt: "Cámara asociada",
				battery_level_txt: "Nivel de batería",
				camera_txt: "Cámara",
				camera_connected_txt: "Conectada",
				camera_not_connected_txt: "Cámara no conectada",
				camera_not_connected_ios_txt: "Esta versión de la App permite conectar cámaras Ricoh Theta S. Si quieres conectar la cámara desde la App debes conectar en primer lugar la cámara y el teléfono por wifi (por favor, sigue las instrucciones de la cámara). Una vez que el móvil y la cámara están conectados por wifi entra aquí y pulsa el botón 'Conectar cámara'.",
				camera_not_connected_and_txt: "Esta versión de la App permite conectar cámaras Ricoh Theta S. Si quieres conectar la cámara desde la App, en primer lugar debes poner en marcha la cámara con acceso wifi activo (El led de wifi debe parpadear). A continuación pulsa el botón 'Conectar cámara'.",
				camera_wifi_found_txt: "Encontrada wifi de cámara ",
				camera_wifi_not_found_txt: "Wifi de la cámara no encontrado",
				cancel_txt: "Cancelar",
				config_txt: "Configuración",
				connect_camera_txt: "Conectar cámara",
				connected_to_camera_txt: "Conectado a la cámara",
				connected_to_camera_wifi_txt: "Conectado a Wifi de la cámara",
				connecting_camera_txt: "Conectando con la cámara",
				checking_wifi_txt: "Comprobando Wifi",
				checking_wifi_desc_txt: "Buscando la red Wifi de la cámara",
				circular_photo_txt: "Pulsa 'Abrir cámara', realiza la foto en circulo. Y una vez esté disponible vuelve aquí y pulsa 'Seleccionar panorama'",
				desc_txt: "Descripción",
				design_txt: "Diseño/Contenido",
				details_txt: "Detalles",
				downloading_photo_desc_txt: "Copiando la foto desde la cámara al teléfono. Por favor, espera",
				duplicate_email_txt: "La dirección de correo ya está asignada a otro usuario",
				editor_selection_txt: "Selección Editores",
				enter_same_password_txt: "Por favor, introduce la misma contraseña en ambos campos",
				error_txt: "Error",
				error_int_txt: "Error interno de la aplicación. Por favor reinstale y vuelva a probar",
				error_geocode_body_txt: "Se ha producido un error en tu petición. Por favor, inténtalo más tarde",
				error_geocode_title_txt: "Error",
				err_camera_not_ok_txt: "No se puede establecer comunicación con la cámara. Por favor, revisa la conexión wifi",
				err_camera_txt: "Error en la cámara",
				err_manually_enable_wifi_txt: "No es posible habilitar la conexión wifi desde la App. Por favor, habilita Wifi manualmente",
				error_perm_txt: "Permiso no concedido, la operación solcitada no se puede realizar",
				error_photo_done_txt: "Error tomando foto",
				error_photo_done_desc_txt: "Ha habido un problema al realizar o descargar la foto. Por favor, comprueba la conexión con la cámara.",
				explore_txt: "Explorar",
				facebook_login_txt: "Iniciar sesión con Facebook",
				facebook_register_txt: "Registrar con Facebook",
				find_location_txt: "Encontrar dirección",
				follow_arrow_txt: "Para que tus fotos 360 se enlacen correctamente con las fotos de otros usuarios, debes empezar la foto en la dirección que marca la flecha roja",
				help_txt: "Ayuda",
				help1_txt: "Puedes hacer fotos 360 con tu teléfono",
				help2_txt: "Puedes publicar las fotos 360 desde la App",
				help3_txt: "Disfruta de tus fotos con tus gafas VR",
				help4_txt: "Comparte tus fotos con tus amigos",
				home_txt: "Inicio",
				indoor_view_txt: "Vista interior",
				init_session_txt: "Inciar sesión",
				interesting_places_txt: "Lugares interesantes",
				interesting_places_end_txt: " . Puedes usar el zoom y desplazar para ver todos los lugares.",
				interesting_places_ini_txt: "Hay lugares interesantes cerca de este lugar",
				intro_title_txt: "La red social de fotografía 360",
				intro_text_txt: "Crear, editar y compartir fotos 360, nunca había sido tan fácil",
				invalid_password_txt: "La contraseña introducida es incorrecta. Intenta con una de mayor longitud",
				keep_photos_txt: "Mantener fotos en cámara",
				km_txt: " Km ",
				last_name_txt: "Apellido",
				list_txt: "Lista",
				location_nok_body_txt: "Por favor, intenta buscar tu ubicación buscando con la opción 'Buscar'",
				location_nok_title_txt: "No es posible determinar tu localización",
				login_error_txt: "Error de acceso",
				login_error_desc_txt: "Error del sistema de acceso. Por favor inténtelo de nuevo más tarde. Si el problema persiste reinstale la App",
				log_in_txt: "Iniciar sesión",
				logout_txt: "Desconectar",
				map_txt: "Mapa",
				maps_txt: "Mapas",
				more_views_txt: "Más vistas en la visita",
				name_txt: "Nombre",
				near_here_txt: "Cerca de aquí",
				need_cardboard_txt: "Necesitas instalar la App 'Cardboard Camera' desde Play Store ",
				new_location_txt: "Nueva ubicación",
				new_posts_txt: "Novedades",
				no_geocode_res_body_txt: "Intenta cambiar los datos introducidos y vuelve a buscar",
				no_geocode_res_title_txt: "No hay resultados",
				no_places_near_body_txt: "Desafortunadamente no disponemos de fotos de lugares interesantes cerca de aquí",
				no_places_near_title_txt: "Lugares de interés no encontrados",
				ok_txt: "Aceptar",
				open_camera_txt: "Conectar cámara 360",
				password_txt: "Contraseña",
				password_error_desc_txt: "La identidad de usuario o la contraseña introducidos son incorrectos",
				photo_done_txt: "Panorama realizado",
				photo_done_desc_txt: "Puedes publicarlo cuando quieras entrando en la opción de publicación y seleccionado el panorama de la galería de imágenes, en la carpeta 'imágenes'",
				priv_agreement_1_txt: "Al registrarme acepto las ",
				priv_agreement_2_txt: "Condiciones de Servicio",
				priv_agreement_3_txt: " y la  ",
				priv_agreement_4_txt: " Política de privacidad",
				programming_txt: "Programación",
				PublishError_txt: "Error en la publicación",
				publish_txt: "Publicar",
				reg_txt: "Registrar",
				register_data_txt: "Datos de registro",
				register_error_txt: "Error de registro",
				register_error_desc_txt: "Error en el registro, por favor inténtalo más tarde",
				register_txt: "Regístrate",
				register2_txt: "¿Todavía no eres usuario? ¡Regístrate!",
				remember_password_txt: "¿Has olvidado la contraseña?",
				remove_photos_txt: "Borrar foto cámara",
				remove_photo_after_txt: "Borrar fotos en la cámara después de descargarlas al móvil",
				repeat_password_txt: "Repetir contraseña",
				results_found_txt: "Lugares de interés cercanos",
				route_details_txt: "Detalles de la ruta",
				route_map_txt: "Mapa de la ruta",
				routes_txt: "Rutas",
				samples_txt: "EJEMPLOS: ",
				save_location_txt: "Registrar la localización de las visitas virtuales",
				save_txt: "Guardar",
				search_txt: "Buscar",
				search_location_txt: "Buscar dirección",
				search_near: "Buscando localización actual",
				select_folder_txt: "Seleccionar carpeta",
				select_folder_desc_txt: "En la siguiente pantalla selecciona una foto de la carpeta donde quieres que se guarden los panoramas",
				share_in_txt: "Compartir en",
				signup_error_txt: "Error de registro",
				status_txt: "Estado",
				take_panorama_txt: "Realizar panorama",
				taking_photo_txt: "Capturando panorama",
				taking_photo_desc_txt: "Puede tardar un rato<br/> Por favor espera y no apagues la cámara",
				unknown_error: "Error desconocido",
				UploadError_txt: "Error subiendo la foto. Por favor, inténtalo más tarde",
				user_blocked_txt: "El usuario está bloqueado. Por favor, contacta con el webmaster.",
				user_not_confirmed_txt: "Por favor, revisa tu correo y confirma tu dirección siguiendo las instrucciones que te hemos enviado",
				user_publications: "Publicaciones de usuario",
				user_registered_txt: "Usuario registrado",
				view_more_txt: "Ver más ",
				welcome_txt: "¡Bienvenido/a!",
				welcome_desc_txt: "Ya eres usuario/a de 'Walk2view'. Comprueba tu correo para más detalles",
				wifi_enabled_txt: "Habilitada Wifi del teléfono",
				you_are_here_txt: "Estás aquí",
				title_missing_txt: "Falta el titulo",
				select_pano_txt: "Seleccionar panorama",
				pano_is_published_txt: "La visita está siendo procesada. En breves minutos será publica.",
				publish_ok_txt: "Publicación correcta",
				publish_pano_txt: "Publicar Panorama",
				install_txt: "Instalar",
				or_txt: "o",
				year_ago_txt: "Hace {0} año",
				years_ago_txt: "Hace {0} años",
				month_ago_txt: "Hace {0} mes",
				months_ago_txt: "Hace {0} meses",
				day_ago_txt: "Hace {0} dia",
				days_ago_txt: "Hace {0} dias",
				hour_ago_txt: "Hace {0} hora",
				hours_ago_txt: "Hace {0} horas",
				minute_ago_txt: "Hace {0} minuto",
				minutes_ago_txt: "Hace {0} minutos",
				must_login_first_txt: "Debes registrarte primero",
				login_txt: "Login",
				followers_txt: "Seguidores",
				following_txt: "Siguiendo",
				city_txt: "Ciudad",
				country_txt: "Pais",
				ocupation_txt: "Ocupación",
				more_info_txt: "Más información",
				information_txt: "Información",
				publications_txt: "Publicaciones",
				notification_title_txt: "Walk2view",
				publish_notification_error_txt: "Error al publicar",
				publish_notification_success_txt: "Publicación completada",
				obtaining_location_txt: "Obteniendo localización",
				unknown_location_txt: "Añadir ubicación",
				try_again_txt: "Reintentar",
				restart_txt: "Reiniciar",
				publish_another_txt: "Publicar otra vez",
				do_something_else_txt: "Hacer otra cosa",
				compass_description_txt: "Si quieres que tus fotos 360 se enlacen correctamente con las de otros usuarios, empieza la captura donde apunta la flecha.",
				publish_instructions_1_txt: "Pulsa 'Abrir Camara',toma la foto en circulo y una vez este disponible, vuelve aquí y pulsa 'Seleccionar Panorama'.",
				uploading_panorama_txt: "Subiendo Panorama",
				you_can_do_something_else_txt: "Mientras el panorama se sube puedes ir haciendo otra cosa.",
				published_txt: "Panorama Publicado",
				comments_txt: "Comentarios",
				write_comment_txt: "      Escribe un comentario...",
				write_title_txt: "Escribe un titulo...",
				write_description_txt: "Escribe una descripción...",
				search_a_location_txt: "Busca una ubicación...",
				title_txt: "Titulo",
				location_txt: "Ubicación",
				now_txt: "Ahora",
				delete_txt: "Borrar",
				delete_confirmation_txt: "¿Estás seguro?",
				incorrect_proportions_txt: "Las proporciones de la imagen no son las de un panorama.",
				other_txt: "Otros",
				ios_publish_txt: "Utiliza una camara 360 o una App móvil para crear las fotos 360. A continuación vuelve a esta pantalla y pulsa el botón ",
				report_content_txt: "Reportar contenido",
				inadequate_content_txt: "Inadecuado",
				wrong_data_txt: "Incorrecto",
				send_txt: "Enviar",
				report_inadequate_txt: "Por favor indique la razón de su denuncia y escriba la información adicional que considere relevante",
				report_wrong_txt: "Por favor indique la razón de su informe y escriba la información adicional que considere relevante",
				sexual_content_txt: "Contenido sexual",
				violent_context_txt: "Contenido violento o repulsivo",
				hate_content_txt: "Incita al odio",
				dangerous_content_txt: "Actividades peligrosas o dañinas",
				child_abuse_txt: "Abuso infantil",
				rights_abuse_txt: "Infracción de mis derechos",
				spam_txt: "Spam",
				report_thanks_txt: "Ya hemos registrado su indicación. En breve nuestros operadores procederán a revisar el contenido. Muchas gracias por su colaboración",
				wrong_title_txt: "Título incorrecto",
				wrong_description_txt: "Descripción incorrecta",
				wrong_location_txt: "Ubicación incorrecta",
				wrong_orientation_txt: "Orientación incorrecta",
				wrong_type_txt: "Debes seleccionar una razón",
				app_title_txt: "Walk2view"
			});

			//---------------------------
			// Obtener idioma
			//---------------------------
			var lang = (navigator.language)
				.split("-")[0];
			switch (lang) {
			case "es":
				lang = "es";
				break;

			default:
				lang = "en";
				break;
			}

			$translateProvider.preferredLanguage(lang);
			$translateProvider.fallbackLanguage("en");
			$translateProvider.useSanitizeValueStrategy("escaped");

		});

}());
