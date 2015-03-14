// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};



/*******************************************
 **                Servers                **
 *******************************************/
Alloy.Globals.appAPIServer = 'http://localhost:4567';


/*******************************************
 **             NavigationInit            **
 *******************************************/
Alloy.Globals.showFooter = false;
Alloy.Globals.isTablet = require('/modules/utils').isTablet();
Alloy.Globals.isHandheld = true;
if (Alloy.Globals.isTablet) {
	Alloy.Globals.isHandheld = false;
}


/*******************************************
 **                 Utils                 **
 *******************************************/
Alloy.Globals.MaxDate = require('alloy/moment')().subtract(1, 'days');
Alloy.Globals.platformHeight = require('/modules/utils').PEUnitsToDPUnits(Ti.Platform.displayCaps.platformHeight);
Alloy.Globals.platformWidth = require('/modules/utils').PEUnitsToDPUnits(Ti.Platform.displayCaps.platformWidth);


/*******************************************
 **                General                **
 *******************************************/
Alloy.Globals.user = {
	id: null,
	username: null,
	fullname: null,
	token: "",
	type: null,
};