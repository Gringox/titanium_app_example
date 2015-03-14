//////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                        INNOVATION WORKSHOP SOLUTIONS                        //
//                                                                             //
////////////////////////////////////////////////////////////////////////////////
/**
  * File:        com.inwork-solutions.navigation.js
  * Version:     0.1
  * Author:      Rafael Rodriguez
  * Info:        Yet to come
  *
  * Copyright 2014 Rafael Rodriguez, all rights reserved.
**/



/******************************************
 **                 UTILS                **
 ******************************************/
var swipeBack = function(e) {
	if (e.direction == 'right') {
		if (Alloy.Globals.navigation.length == 1) {
			require('/modules/login').logOut({closeMessage: true}, function(){});
		} else {
			exports.back();
		}
	}
};

var androidBack = function(e) {
	if (Alloy.Globals.navigation.length == 1) {
		require('/modules/login').logOut({closeMessage: true}, function(){});
	} else {
		exports.back();
	}
};

var configureWin = function(win) {
	
	
	
	
	
	
	
	if ( OS_ANDROID ) {
		win.addEventListener('touchstart', function(e) {
			Titanium.UI.Android.hideSoftKeyboard();
		});
	}
	
	
	
	
	
	
	
	if (Alloy.Globals.navigation && Alloy.Globals.navigation.length > 0) {
        if (OS_ANDROID) {
            win.addEventListener('androidback', androidBack);
        }
        if (OS_IOS) {
            win.addEventListener('swipe', swipeBack);
        }
    }
    if (OS_ANDROID) {
    	if (win.getMenu) {
            var menu = win.getMenu();
            if (menu) {
                if (menu.showed) {
                    menu.hide();
                }
            }
        }
    }
};



/******************************************
 **              NAVIGATION              **
 ******************************************/
exports.navigate = function() {
	var controller = arguments[0];
	var args = arguments[1] || {};
	var title = arguments[2] || '';
	if (Alloy.Globals.navigation) {
		var currentObj = Alloy.Globals.navigation.length - 1;
		if ((Alloy.Globals.navigation[currentObj].controller == controller) && (JSON.stringify(Alloy.Globals.navigation[currentObj].args) == JSON.stringify(args)) && (Alloy.Globals.navigation[currentObj].title == title)) {	
			return;
		}
	}
	var $controller = Alloy.createController(controller, args);
	var win = $controller.getView();
	configureWin(win);
	var containerView = (win.children[1]) ? win.children[1] : win.children[0];
	win.addEventListener('open', function() {
		containerView.width = Alloy.Globals.platformWidth;
        containerView.animate({
            left : 0
        }, function() {
            if (Alloy.Globals.currentWindow) {
				Alloy.Globals.currentWindow.close();
				Alloy.Globals.currentWindow = null;
			}
			if (Alloy.Globals.currentController) {
				Alloy.Globals.currentController.destroy();
				Alloy.Globals.currentController = null;
			}
			Alloy.Globals.currentController = $controller;
			Alloy.Globals.currentWindow = win;
        });        
	});
	containerView.left = Alloy.Globals.platformWidth;
	if (!Alloy.Globals.navigation) {
		Alloy.Globals.navigation = [];
	}
	Alloy.Globals.navigation.push({
		controller : controller,
		args : args,
		title : title
	});
	if (OS_IOS) {
    	win.open();
    }
    if (OS_ANDROID) {
    	win.open({
    		activityEnterAnimation: Ti.Android.R.slide_in_left
    	});
    }
};

exports.setHome = function() {
	var controller = arguments[0];
	var args = arguments[1] || {};
	var title = arguments[2] || '';
	var $controller = Alloy.createController(controller, args);
	var win = $controller.getView();
	configureWin(win);
	var containerView = (win.children[1]) ? win.children[1] : win.children[0];
	win.addEventListener('open', function() {
		containerView.width = Alloy.Globals.platformWidth;
        containerView.animate({
            left : 0
        }, function() {
            if (Alloy.Globals.currentWindow) {
				Alloy.Globals.currentWindow.close();
				Alloy.Globals.currentWindow = null;
			}
			if (Alloy.Globals.currentController) {
				Alloy.Globals.currentController.destroy();
				Alloy.Globals.currentController = null;
			}
			Alloy.Globals.currentController = $controller;
			Alloy.Globals.currentWindow = win;
        });        
	});
	containerView.left = Alloy.Globals.platformWidth;
	Alloy.Globals.navigation = [];
	Alloy.Globals.navigation.push({
		controller : controller,
		args : args,
		title : title
	});
	if (OS_IOS) {
    	win.open();
    }
    if (OS_ANDROID) {
    	win.open({
    		activityEnterAnimation: Ti.Android.R.slide_in_left
    	});
    }
};

exports.home = function() {
	if (Alloy.Globals.navigation && Alloy.Globals.navigation.length > 0) {
		var controller = Alloy.Globals.navigation[0].controller;
		var args = Alloy.Globals.navigation[0].args;
		var $controller = Alloy.createController(controller, args);
		var win = $controller.getView();
		configureWin(win);
		var containerView = (win.children[1]) ? win.children[1] : win.children[0];
		win.addEventListener('open', function() {
			containerView.width = Alloy.Globals.platformWidth;
	        containerView.animate({
	            right : 0
	        }, function() {
				if (Alloy.Globals.currentWindow) {
					Alloy.Globals.currentWindow.close();
					Alloy.Globals.currentWindow = null;
				}
				if (Alloy.Globals.currentController) {
					Alloy.Globals.currentController.destroy();
					Alloy.Globals.currentController = null;
				}
				Alloy.Globals.currentController = $controller;
				Alloy.Globals.currentWindow = win;
			});
		});
		containerView.right = Alloy.Globals.platformWidth;
		Alloy.Globals.navigation = [Alloy.Globals.navigation[0]];
		if (OS_IOS) {
	    	win.open();
	    }
	    if (OS_ANDROID) {
	    	win.open({
	    		activityEnterAnimation: Ti.Android.R.slide_in_left
	    	});
	    }
	}
};

exports.back = function() {
	Alloy.Globals.navigation.pop();	
	var back = Alloy.Globals.navigation[Alloy.Globals.navigation.length - 1];
	var controller = back.controller;
	var args = back.args;
	var $controller = Alloy.createController(controller, args);
	var win = $controller.getView();
	configureWin(win);
	var containerView = (win.children[1]) ? win.children[1] : win.children[0];
	win.addEventListener('open', function() {
		containerView.width = Alloy.Globals.platformWidth;
        containerView.animate({
            right : 0
        }, function() {
			if (Alloy.Globals.currentWindow) {
				Alloy.Globals.currentWindow.close();
				Alloy.Globals.currentWindow = null;
			}
			if (Alloy.Globals.currentController) {
				Alloy.Globals.currentController.destroy();
				Alloy.Globals.currentController = null;
			}
			Alloy.Globals.currentController = $controller;
			Alloy.Globals.currentWindow = win;
		});
	});
	containerView.right = Alloy.Globals.platformWidth;
	if (OS_IOS) {
    	win.open();
    }
    if (OS_ANDROID) {
    	win.open({
    		activityEnterAnimation: Ti.Android.R.slide_in_left
    	});
    }
};

exports.backTo = function() {
	var backToController = arguments[0];
	for (var i = Alloy.Globals.navigation.length - 1; i >= 0; i--) {
		if (backToController != Alloy.Globals.navigation[i].controller) {
			Alloy.Globals.navigation.pop();
		} else {
			var controller = Alloy.Globals.navigation[i].controller;
			var args = Alloy.Globals.navigation[i].args;
			var $controller = Alloy.createController(controller, args);
			var win = $controller.getView();
			break;
		}
	}
	configureWin(win);
	var containerView = (win.children[1]) ? win.children[1] : win.children[0];
	win.addEventListener('open', function() {
		containerView.width = Alloy.Globals.platformWidth;
        containerView.animate({
            right : 0
        }, function() {
			if (Alloy.Globals.currentWindow) {
				Alloy.Globals.currentWindow.close();
				Alloy.Globals.currentWindow = null;
			}
			if (Alloy.Globals.currentController) {
				Alloy.Globals.currentController.destroy();
				Alloy.Globals.currentController = null;
			}
			Alloy.Globals.currentController = $controller;
			Alloy.Globals.currentWindow = win;
        });
	});
	containerView.right = Alloy.Globals.platformWidth;
	if (OS_IOS) {
    	win.open();
    }
    if (OS_ANDROID) {
    	win.open({
    		activityEnterAnimation: Ti.Android.R.slide_in_left
    	});
    }
};


















exports.backToAndNavigate = function() {
	var backToController = arguments[0];
	var controller = arguments[1];
	var args = arguments[2];
	var title = arguments[3] || '';
	var currentObj = Alloy.Globals.navigation.length - 1;
	
	
	
	
	
	
	
	
	
	
	/*
	Ti.API.info('----------------------------------------------------------------------------------------------');
	Ti.API.info(Alloy.Globals.navigation[currentObj].controller+', '+JSON.stringify(Alloy.Globals.navigation[currentObj].args)+', '+Alloy.Globals.navigation[currentObj].title);
	Ti.API.info('**********************************************************************************************');
	Ti.API.info(controller+', '+JSON.stringify(args)+', '+title);
	Ti.API.info('----------------------------------------------------------------------------------------------');
	//*/
	
	
	
	
	Ti.API.info('----------------------------------------------------------------------------------------------');
	if (Alloy.Globals.navigation[currentObj].controller == controller) {
		Ti.API.info('controller iguales');	
	}
	
	
	if (JSON.stringify(Alloy.Globals.navigation[currentObj].args) == JSON.stringify(args)) {
		Ti.API.info('args iguales');
	} else {
		Ti.API.info(JSON.stringify(Alloy.Globals.navigation[currentObj].args) == JSON.stringify(args));
	}
	
	
	if (Alloy.Globals.navigation[currentObj].title == title) {
		Ti.API.info('title iguales');
	}
	Ti.API.info('----------------------------------------------------------------------------------------------');
	
	
	
	
	
	
	
	
	if ((Alloy.Globals.navigation[currentObj].controller != controller) || (JSON.stringify(Alloy.Globals.navigation[currentObj].args) != JSON.stringify(args)) || (Alloy.Globals.navigation[currentObj].title != title)) {
		for (var i = Alloy.Globals.navigation.length - 1; i >= 0; i--) {
			if (backToController != Alloy.Globals.navigation[i].controller) {
				Alloy.Globals.navigation.pop();
			} else {
				break;
			}
		}
		exports.navigate(controller, args, title);
	} else {
		return;
	}
};























exports.backAndNavigate = function() {
	var controller = arguments[0];
	var args = arguments[1] || {};
	var title = arguments[2] || '';
	var currentObj = Alloy.Globals.navigation.length - 1;
	if ((Alloy.Globals.navigation[currentObj].controller != controller) || (JSON.stringify(Alloy.Globals.navigation[currentObj].args) != JSON.stringify(args)) || (Alloy.Globals.navigation[currentObj].title != title)) {
		Alloy.Globals.navigation.pop();
		exports.navigate(controller, args, title);		
	} else {
		return;
	}
};