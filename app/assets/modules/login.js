//////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                        INNOVATION WORKSHOP SOLUTIONS                        //
//                                                                             //
////////////////////////////////////////////////////////////////////////////////
/**
  * File:        com.inwork-solutions.login.js
  * Version:     0.1
  * Author:      Rafael Rodriguez
  * Info:        Yet to come
  *
  * Copyright 2014 Rafael Rodriguez, all rights reserved.
**/



/******************************************
 **         Module dependencies.         **
 ******************************************/
var navigation = require('/modules/com.inwork-solutions.navigation');
var request = require('/modules/request');



/******************************************
 **             User Login.              **
 ******************************************/
exports.logIn = function(args, callback) {
	var username = args.username;
	var password = args.password;
	callback = callback ? callback : function() {};
	
	
	
	
	
	
					
	
	var args = {
		success : true,
		data : {
			user : {
				id : 1, 
				username : 'validUser', 
				fullname : 'Valid User',
				token : '123',
			},
			data : {
				balance : 'US$ 15,000.00',
			},
		}
	};
	var data = args.data;
	var user = data.user;
	Alloy.Globals.user = {
		id: user.id,
		username: user.username,
		fullname: user.fullname,
		token: user.token
	};
	callback(args);
	
	
	
	
	
	
	
	/*
	request.request({
		authHeader : username+':'+password,
		//httpRequestMethod : 'GET',
		httpRequestMethod : 'POST',
		service : '/login',
		parameters : {}
	}, function (args) {
		var success = args.success;
		if (success) {
			var data = args.data;
			var user = data.user;
			Alloy.Globals.user = {
				id: user.id,
				username: user.username,
				token: user.token
			};
			callback(args);
		} else {
			callback(args);
		}
	});
	//*/
};



/******************************************
 **            User Logout.              **
 ******************************************/
exports.logOut = function(args, callback) {
	var args = args ? args : {};
	var closeMessage = args.closeMessage;
	var callback = callback ? callback : function() {};
	function checkResponse(success) {
		Alloy.Globals.user = {
			id: null,
			username: null,
			fullname: null,
			token: null
		};
		callback(success);
	}
	if (closeMessage) {
		
		var logOutMessage = {
			title: L('logout_msg'),
			inputs: [],
			info: [],
			cancelButton: {
				text: L('no')
			},
			okButton: {
				text: L('yes')
			},
			buttons: [],
			elements: null
		};
		
		var modal = Alloy.Globals.currentWindow.getModal();
		
		modal.show(logOutMessage);
		
		modal.getView().addEventListener('okButton', function(e){
			// navigation.closeAll({callback: checkResponse});
			navigation.setHome('signin', {}, '');
		});

	} else {
		
		
		
		
		
		
		//navigation.closeAll({callback: checkResponse});
		navigation.setHome('signin', {}, '');
		
		
		
		
		
		
	}
};