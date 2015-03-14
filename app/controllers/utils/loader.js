var controller = {
    args : arguments[0] || {},
    init : function() {
        controller.addHandlers();
    },
    
    showView : function(parameters) {
		$.loader.show();
		
	    var image = Ti.UI.createImageView({
		    images: [
		        "/images/loader/loader-1.png",
		        "/images/loader/loader-2.png",
		        "/images/loader/loader-3.png",
		        "/images/loader/loader-4.png",
		        "/images/loader/loader-5.png"
		    ],
		    width: '25%'
		});
		
		var startupAnimation = Titanium.UI.createAnimation({
	        curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
	        opacity : 1,
	        duration : 250,
	    });
	    
	    $.loader.animate(startupAnimation);
	    $.loader.add(image);

		if (image.getAnimating() === false) {
			image.start();
		} else {
			image.stop();
		}
	},
	
    addHandlers : function() {
    	
    }
};

controller.init();

$.show = function(parameters) { 
	controller.showView(parameters);
};