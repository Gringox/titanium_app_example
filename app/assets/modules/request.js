exports.request = function(args, callback) {
	var authHeader = args.authHeader ? args.authHeader : null;
	var httpRequestMethod = args.httpRequestMethod ? args.httpRequestMethod : 'GET';
	var serviceName = args.service, params = args.parameters ? args.parameters : {}, callback = callback ? callback : function() {};
	var url = Alloy.Globals.appAPIServer;
	url += serviceName;
	
	exports.checkNetwork({}, function(success) {
		if (success) {
			var xhr = Titanium.Network.createHTTPClient();
			
			xhr.onerror = args.onerror ? args.onerror : function(e) {
				if (xhr.status == 401) {
					if (authHeader) {
						callback({
							success : false,
							message : 'Autenticación fallida.'
						});
						return;
					}
					callback({
						success : false,
						message : 'El servicio no está disponible actualmente. Por favor, inténtelo de nuevo más tarde.'
					});
					return;
				} else {
					callback({
						success : false,
						message : 'El servicio no está disponible actualmente. Por favor, inténtelo de nuevo más tarde.'
					});
					return;
				}
			};
			xhr.onload = args.onload ? args.onload : function(e) {
				if (xhr.status != 200) {
					callback({
						success : false,
						message : 'El servicio no está disponible actualmente. Por favor, inténtelo de nuevo más tarde.'
					});
					return;
				}
				var res;
				try {
					res = JSON.parse(this.responseText);
				} catch(e) {
					callback({
						success : false,
						message : 'El servicio no está disponible actualmente. Inténtalo de nuevo más tarde. Código: 501: Formato Erroneo'
					});
					return;
				}
				callback({
					success : true,
					data : res,
					xhr : xhr
				});
			};
			
			if (authHeader) {
				xhr.open(httpRequestMethod, url);
				xhr.setTimeout(15000);
				var authstr = 'Basic '+Titanium.Utils.base64encode(authHeader);
				authstr = authstr.replace(/(\r\n|\n|\r)/gm,"");
				xhr.setRequestHeader('Authorization', authstr);
				xhr.setRequestHeader("Content-Type", "text/html; charset=utf-8");
				xhr.send();
			} else {
				params.access_token = Alloy.Globals.user.token;
				params.key1 = 'value1';
				params.key2 = 'value2';
				if (httpRequestMethod == 'GET') {
					var data = null;
				    for (var key in params) {
				    	if (data) {
				    		data += '&';
				    	} else {
				    		data = '?';
				    	}
				    	data += key+'='+params[key];
			        }
				    url = encodeURI(url + data);
				    xhr.open(httpRequestMethod, url);
					xhr.setTimeout(15000);
					xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
					xhr.send();
				} else {
					xhr.open(httpRequestMethod, url);
					xhr.setTimeout(15000);
					xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
					xhr.send(JSON.stringify(params));
				}
			}
		}
	});
};



exports.getFile = function(args, callback) {
	exports.checkNetwork({}, function(success) {
		if (success) {
			var _fileURL = args.fileURL;
			var _ind = args.ind ? args.ind : null;
			if (OS_IOS) {
				var _file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'Downloads', _fileURL);
			} else {
				if (Ti.Filesystem.isExternalStoragePresent()) {
					var _file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'Downloads', _fileURL);
				} else {
					var _file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'Downloads', _fileURL);
				}
			}
			if (_file.exists()) {
				console.log("*****  File is on device");
				callback(args.object, _file);
			} else {
				console.log("*****  File is NOT on device. Get missing File from server: " +  _fileURL);
				var getFileFromServer = function(args, callback) {
					var fullURL = Alloy.Globals.appDataServer + args.fileURL;
					var xhr = Titanium.Network.createHTTPClient({
						onload : function() {
							var res = this.responseData;
							callback(res);
						},
						onerror : function(e){
							alert('El servicio no está disponible actualmente. Por favor, inténtelo de nuevo más tarde.');
							console.log('FILE ERROR ['+ fullURL +']: '+ JSON.stringify(e));
							callback(null);
						}
					});
					if (args.ind) {
						xhr.ondatastream = function(e) {
							args.ind.value = e.progress ;
							Ti.API.info('ONDATASTREAM - PROGRESS: ' + e.progress);
						};
					}
					xhr.open('GET', fullURL+'?'+new Date().getTime());
					xhr.setTimeout(25000);
					xhr.send();
				};
				getFileFromServer({
					fileURL: _fileURL,
					ind: _ind
				}, function (res){
					if (res) {
						if (OS_IOS) {
							var fileDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'Downloads');
						} else {
							if (Ti.Filesystem.isExternalStoragePresent()) {
								var fileDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'Downloads');
							} else {	
								var fileDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'Downloads');
							}
						}
						if (! fileDir.exists()) {
							fileDir.createDirectory();
						}
						var directories = _fileURL.split("/");
						for (var i = 0; i < directories.length; i++) {
							var next = i + 1;
							if (next == directories.length) {
								var _file  = Ti.Filesystem.getFile(fileDir.resolve(), directories[i]);
								// .resolve() provides the resolved native path for the directory.
								Ti.API.info("_file path is: " + _file.resolve());
								if (_file.write(res,false) === false) {
									console.log("File NOT saved: " +  directories[i]);
								} else {
									console.log("File saved: " +  directories[i]);
								}
								console.log("***********************************");
								// dispose of file handles
								_file = null;
								fileDir = null;
								callback(args.object, res);
							} else {
								console.log("Checking for directory: " + directories[i]);
								fileDir = Ti.Filesystem.getFile(fileDir.resolve(), directories[i]);
								if (! fileDir.exists()) {
									fileDir.createDirectory();
								}
							}
						}
					} else {
						callback(args.object, res);
					}
				});
			}
		}
	});
};



exports.checkNetwork = function(args, callback) {
	if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
		alert("Disculpe, actualmente no tiene acceso a la red. Verifique el acceso e intente nuevamente.");
		require('/modules/login').logOut({closeMessage: false}, function(){});
		callback(false);
	}
	callback(true);
};