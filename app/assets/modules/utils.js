//////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                        INNOVATION WORKSHOP SOLUTIONS                        //
//                                                                             //
////////////////////////////////////////////////////////////////////////////////
/**
  * File:        com.inwork-solutions.utils.js
  * Version:     0.1
  * Author:      Rafael Rodriguez
  * Info:        Yet to come
  *
  * Copyright 2014 Rafael Rodriguez, all rights reserved.
**/



/******************************************
 **         PIXELS/DP Convertions        **
 ******************************************/
exports.PixelsToDPUnits = function(px) {
    return (px / (Titanium.Platform.displayCaps.dpi / 160));
};

exports.DPUnitsToPixels = function(dp) {
    return (dp * (Titanium.Platform.displayCaps.dpi / 160));
};

//PEUnits = Platform Specific Units
exports.PEUnitsToDPUnits = function(pe) {
    if (OS_IOS) {
    	return pe;
    }
    if (OS_ANDROID) {
    	return (pe / (Titanium.Platform.displayCaps.dpi / 160));
    }
};





/******************************************
 **           Tablet Detection           **
 ******************************************/
var osname = Ti.Platform.osname,
	dpi = Ti.Platform.displayCaps.dpi,
	w = Ti.Platform.displayCaps.platformWidth / dpi,
	h = Ti.Platform.displayCaps.platformHeight / dpi,
	diagonalSize = Math.sqrt(w*w+h*h);

	/*
	 * Returns Boolean, true = device is a tablet.
	 *		- diagonalInches [optional]: Minimum diagonal inches of an Android Tablet.
	 */
exports.isTablet = function(diagonalInches) {
	var diag = (diagonalInches) ? parseFloat(diagonalInches) : 8;
	switch(osname) {
		case 'ipad':
			return true;
		break;
		default:
			return (diagonalSize >= diag) ? true : false;
	}
};

	/*
	 * Custom osname function, returns string that includes 'androidTablet'
	 * descriptor that you could use for branching on an Android device
	 *		- diagonalInches [optional]: Minimum diagonal inches of an Android Tablet.
	 */
exports.osname = function(diagonalInches) {
	var diag = (diagonalInches) ? parseFloat(diagonalInches) : 8;
	var osname = Ti.Platform.osname;
	switch(osname) {
		case 'android':
			return (diagonalSize >= diag) ? 'androidTablet' : 'android';
		break;
		default:
			return osname;
	}
};

	/*
	 * Returns the DIAGONAL screen size in inches
	 */
exports.screensize = function() {
	return diagonalSize;
};





/******************************************
 **          Special TextFields          **
 ******************************************/
exports.doublesTextField = function(args) {
	var value = args.value;
	var oldValue = args.oldValue;
	var decimals = args.decimals || 1;
	var callback = args.callback;
	var parsedValue = parseFloat(value);
	var parsedOldValue = parseFloat(oldValue);
	var result = null;
	if (isNaN(parsedValue)) {
		result = oldValue;
	} else {
		var stringParsedValue = parsedValue.toFixed(decimals+1).toString();
		if ((stringParsedValue == value) || (stringParsedValue.substr(0, stringParsedValue.length - 2) == value) ||(stringParsedValue.substr(0, stringParsedValue.length - 1) == value)) {
			var _choppedValue = value.substr(0, value.length - 1);
			var _choppedOldValue = oldValue.substr(0, oldValue.length - 1);
			var newChar = value.slice(-1);
			var intValue = parseInt(parsedValue);
			var intOldValue = parseInt(parsedOldValue);
			if (intValue != intOldValue) {
				if (intValue == parsedValue) {
					//remove the dot
					_choppedValue = parsedValue;
					if (_choppedValue) {
						var divPow = Math.pow(10, decimals);
						_choppedValue = _choppedValue / divPow;
					} else {
						_choppedValue = 0;
					}
					var newValue = _choppedValue;
					result = newValue.toFixed(decimals);
				} else {
					//add or remove a char before the dot (left part)
					result = parsedValue.toFixed(decimals);	
				}
			} else {
				if (value.length > oldValue.length) {
					//add a char after the dot (right part)
					_choppedValue = parseFloat(_choppedValue);
					if (_choppedValue) {
						_choppedValue = _choppedValue * 10;
					} else {
						_choppedValue = 0;
					}
					newChar = parseFloat(newChar);
					var divPow = Math.pow(10, decimals);
					newChar = newChar / divPow;
					var newValue = _choppedValue + newChar;
					result = newValue.toFixed(decimals);
				} else {
					//remove a char after the dot (right part)
					_choppedValue = parsedValue;
					if (_choppedValue) {
						_choppedValue = _choppedValue / 10;
					} else {
						_choppedValue = 0;
					}
					var newValue = _choppedValue;
					result = newValue.toFixed(decimals);
				}
			}
		} else {
			//invalid Character
			result = oldValue;
		}
	}
	callback(result);
};

exports.intTextField = function(args) {
	var value = args.value;
	var oldValue = args.oldValue;
	var callback = args.callback;
	var parsedValue = parseInt(value);
	var result = null;
	if (isNaN(parsedValue)) {
		result = oldValue;
	} else {
		var stringParsedValue = parsedValue.toString();
		if (stringParsedValue == value) {
			result = parsedValue;
		} else {
			if ('0'+stringParsedValue == value) {
				result = parsedValue;
			} else {
				result = oldValue;
			}
		}
	}
	callback(result);
};




/*
 	
 	
		$.apuCyclesTxt.oldValue = 0;
		$.apuCyclesTxt.value = 0;
	       		
	 	$.apuCyclesTxt.addEventListener('change', function(e) {
    		var value = e.source.value;
    		var oldValue = e.source.oldValue;
    		if (oldValue != value) {
	    		controller.utils.intTextField({
	    			value: value,
	    			oldValue: oldValue,
	    			callback: function(result) {
	    				e.source.oldValue = result;
	    				e.source.value = result;
	    			}
	    		});
    		}
		});
		
		
		
    	$.actualInstTxt.oldValue = '0.0';
   		$.actualInstTxt.value = '0.0';
   		
    	$.actualInstTxt.addEventListener('change', function(e) {
    		var value = e.source.value;
    		var oldValue = e.source.oldValue;
    		if (oldValue != value) {
	    		controller.utils.doublesTextField({
	    			value: value,
	    			decimals: 2,
	    			oldValue: oldValue,
	    			callback: function(result) {
	    				e.source.oldValue = result;
	    				e.source.value = result;
	    			}
	    		});
    		}
		});
 //*/