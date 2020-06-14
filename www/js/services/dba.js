'use strict';
angular.module('AppModule')

	.factory('DBA',
		function (
			$cordovaSQLite,
			$q,
			$ionicPlatform,
			$filter,
			$log,
			DB_CONFIG,
			BackendService,
			globVar
		) {

			var self = this;
			self.db = null;
			var query;
			var lastSync;
			var parameters;
			var date;
			var date0;
			var LogId = 'DBA: ';
			//---------------------------
			// Inicializar base de datos
			//---------------------------
			self.init = function () {
				var q = $q.defer();

				$ionicPlatform.ready(function () {
					//----------------------
					// Abrir base de datos
					//----------------------
					if (window.cordova) {
						// App syntax
						if (ionic.Platform.isAndroid()) {
							self.db = $cordovaSQLite.openDB({
								name: DB_CONFIG.name,
								location: 'default'
							});
						} else {
							self.db = $cordovaSQLite.openDB({
								name: DB_CONFIG.name,
								iosDatabaseLocation: 'default'
							});
						}
					} else {
						// Ionic serve syntax
						self.db = window.openDatabase(DB_CONFIG.name, "1.0", "database", -1);
					}

					//self.query('DROP TABLE LastSync');
					//self.query('DROP TABLE Routes');
					//self.query('DROP TABLE Login');
					//self.query('DROP TABLE Config');
					self.query('DROP TABLE IF EXISTS Config');
					query = 'CREATE TABLE IF NOT EXISTS CachedPanos (file_path text PRIMARY KEY)';
					self.query(query);

					//----------------------------------------------------
					// Crear la base de datos con los datos de DB_CONFIG
					//----------------------------------------------------
					angular.forEach(DB_CONFIG.tables, function (table) {
						var columns = [];

						angular.forEach(table.columns, function (column) {
							columns.push(column.name + ' ' + column.type);
						});

						var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
						self.query(query);
						console.log('Table ' + table.name + ' initialized');
					});

					//----------------------------------------------
					// Insertar registro del usuario si no existe
					//----------------------------------------------
					query = 'INSERT OR IGNORE INTO Login ' +
						'(id, userid, token, name, photo, email) VALUES (?,?,?,?,?,?)';
					parameters = [1, '', '', '', '', ''];
					self.query(query, parameters);
					//-------------------------------------------------
					// Insertar registro de configuración si no existe
					//-------------------------------------------------
					query = 'INSERT OR IGNORE INTO Options2 ' +
						'(id, Lic, sessionId, remPhotoAfter, loc, cameraWifi, serialNr) VALUES (?,?,?,?,?,?,?)';
					parameters = [1, '', '', 1, 1, '', ''];
					self.query(query, parameters);

					q.resolve();
				});
				return q.promise;
			};

			// Handle query's and potential errors
			self.query = function (query, parameters) {
				parameters = parameters || [];
				var q = $q.defer();

				$ionicPlatform.ready(function () {
					$cordovaSQLite.execute(self.db, query, parameters)
						.then(function (result) {
							$log.debug(LogId + '$cordovaSQLite.execute de query = ' + query + ' -> finalizado');
							q.resolve(result);
						}, function (error) {
							console.warn('I found an error ' + query);
							console.warn(error);
							q.reject(error);
						});
				});
				return q.promise;
			};

			// Proces a result set
			self.getAll = function (result) {
				var output = [];

				for (var i = 0; i < result.rows.length; i++) {
					output.push(result.rows.item(i));
				}
				return output;
			};

			// Proces a single result
			self.getById = function (result) {
				return result.rows.item(0);
			};

			return self;
		})

	//------------------------------------------------------------------------
	// Metodos para acceder a la tabla  Login
	//------------------------------------------------------------------------
	.factory('Login', function ($cordovaSQLite, DBA) {
		var self = this;

		self.all = function () {
			return DBA.query("SELECT * FROM Login ORDER BY lastUpd DESC")
				.then(function (result) {
					return DBA.getAll(result);
				});
		};

		self.get = function (memberId) {
			var parameters = [memberId];
			return DBA.query("SELECT id, userid, token, name, photo, email, fbid, fbtoken FROM Login WHERE id = (?)", parameters)
				.then(function (result) {
					return DBA.getById(result);
				});
		};

		self.add = function (member) {
			var parameters = [member.id, member.userid, member.token, member.name, member.photo, member.email, member.fbid, member.fbtoken];
			return DBA.query("INSERT INTO Login (id, userid, token, name, photo, email, fbid, fbtoken) VALUES (?,?,?,?,?,?,?,?)", parameters);
		};

		self.remove = function (member) {
			var parameters = [member.id];
			return DBA.query("DELETE FROM Login WHERE id = (?)", parameters);
		};

		self.update = function (origMember, editMember) {
			var parameters = [editMember.id, editMember.userid, editMember.token, editMember.name, editMember.photo, editMember.email, editMember.fbid, editMember.fbtoken, origMember];
			return DBA.query("UPDATE Login SET id = (?), userid = (?), token = (?), name = (?), photo = (?), email = (?), fbid = (?), fbtoken = (?) WHERE id = (?)", parameters);
		};

		return self;
	})
	//------------------------------------------------------------------------
	// Metodos para acceder a la tabla  Camera
	//------------------------------------------------------------------------
	.factory('Options', function ($cordovaSQLite, DBA) {
		var self = this;

		self.get = function () {
			return DBA.query("SELECT * FROM Options2 WHERE id = 1")
				.then(function (result) {
					return DBA.getById(result);
				});
		};

		self.saveSession = function (member) {
			var parameters = [member];
			return DBA.query("UPDATE Options2 SET sessionId = (?) WHERE id = 1", parameters);
		};

		self.saveConfigLocation = function (member) {
			var parameters = [member];
			return DBA.query("UPDATE Options2 SET location = (?) WHERE id = 1", parameters);
		};

		self.saveWifi = function (member) {
			var parameters = [member];
			return DBA.query("UPDATE Options2 SET cameraWifi = (?) WHERE id = 1", parameters);
		};

		self.saveOptions = function (premPhotoAfter, ploc, wifiCam) {
			var parameters = [premPhotoAfter, ploc, wifiCam];
			return DBA.query("UPDATE Options2 SET remPhotoAfter = (?), loc = (?), cameraWifi = (?) WHERE id = 1", parameters);
		};

		return self;
	})
	//------------------------------------------------------------------------
	// Metodos para acceder a los panos en cache
	//------------------------------------------------------------------------
	.factory('CachedPanos', function ($cordovaSQLite, DBA) {
		var self = this;

		self.all = function () {
			return DBA.query("SELECT * FROM CachedPanos")
				.then(function (result) {
					return DBA.getAll(result);
				});
		};

		self.get = function (memberId) {
			var parameters = [memberId];
			return DBA.query("SELECT file_path FROM CachedPanos WHERE file_path = (?)", parameters)
				.then(function (result) {
					return DBA.getById(result);
				});
		};

		self.add = function (member) {
			var parameters = [member.file_path];
			return DBA.query("INSERT INTO CachedPanos (file_path) VALUES (?)", parameters);
		};

		self.remove = function (member) {
			var parameters = [member.file_path];
			return DBA.query("DELETE FROM CachedPanos WHERE file_path = (?)", parameters);
		};

		self.update = function (origMember, editMember) {
			var parameters = [editMember.file_path, origMember];
			return DBA.query("UPDATE CachedPanos SET file_path = (?)) WHERE file_path = (?)", parameters);
		};

		return self;
	})

;
