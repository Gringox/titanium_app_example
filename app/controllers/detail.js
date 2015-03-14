var controller = {
    args : arguments[0] || {},
    navigation : require('/modules/com.inwork-solutions.navigation'),
    http: require('/modules/request'),
    
    init : function() {
        controller.addHandlers();
    },
    
    onOpen : function() {},
    
    addHandlers : function() {
    	controller.setSections(controller.args.data.item);
    },
    
    setSections : function(item) {
    	$.name.text = item.name;
    	$.image.image = Alloy.Globals.appAPIServer + "/" + (item.id%10).toString() + ".png";
    	$.description.text = item.description;
    }
};

$.detail.addEventListener('open', controller.onOpen);
controller.init();