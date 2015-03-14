var controller = {
    args : arguments[0] || {},
    navigation : require('/modules/com.inwork-solutions.navigation'),
    init : function() {
    	$.index.open();
        controller.addHandlers();
    },
    onOpen : function() {
    	controller.navigation.setHome('home', {}, '');
    	$.index.close();
    },
    addHandlers : function() {
    	$.index.addEventListener('close', function() {
			$.destroy();
		});
    }
};

$.index.addEventListener('open', controller.onOpen);
controller.init();