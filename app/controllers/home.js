var controller = {
    args : arguments[0] || {},
    navigation : require('/modules/com.inwork-solutions.navigation'),
    http: require('/modules/request'),
    
    init : function() {
        controller.addHandlers();
    },
    
    onOpen : function() {},
    
    addHandlers : function() {
    	controller.cleanTable();
    	controller.loadData();
    },
    
    cleanTable : function() {
    	$.tableContainer.removeAllChildren();
       	var style;
       	if (OS_IOS) {
			style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
		} else {
		  	style = Ti.UI.ActivityIndicatorStyle.DARK;
		}
       	var activityIndicator = Ti.UI.createActivityIndicator({
			color: '#575757',
			font:{
				fontFamily: 'Helvetica Neue',
				fontSize: 15,
				fontWeight:'bold'
			},
		  	message: 'Loading...',
		  	style: style,
		  	height: Ti.UI.SIZE,
		  	width: Ti.UI.SIZE
		});
		$.tableContainer.add(activityIndicator);
		controller.activityIndicator = activityIndicator;
       	activityIndicator.show();
    },
    
    setSections : function(list) {
		var tableData = [];
		for (var i = 0, len = list.length; i < len; i++) {
			
			var item = list[i];
			
			var row = Ti.UI.createTableViewRow({
				height: 100,
				selectedBackgroundColor: "B7B7B7",
				layout: "horizontal"
			});
			
			var containerView = Ti.UI.createView({
				rowId: i,
				layout: "horizontal"
			});
			
			var rowColumn1 = Ti.UI.createImageView({
				left: "2%",
			   	//width: "20%",
				height: 100,
				image: Alloy.Globals.appAPIServer + "/" + (item.id%10).toString() + ".png",
				touchEnabled: false
			});
			
			var rowColumn2 = Ti.UI.createLabel({
			   	left: "24%",
				text: item.name,
				color: '#575757',
				font:{
					fontFamily: 'Helvetica Neue',
					fontSize: 15
				},
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				touchEnabled: false,
			});
			
			containerView.add(rowColumn1);
			containerView.add(rowColumn2);
			
			row.add(containerView);
			
			row.addEventListener('click', function(e) {
				Ti.API.info(e.source);
				controller.showDetail(e.source.rowId);
			});
			
			tableData.push(row);
		}
		
		var tableView = Ti.UI.createTableView({
			top: 15,
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			separatorStyle: "NONE",
			data: tableData
		});
		setTimeout(function() {
			controller.activityIndicator.hide();
	       	$.tableContainer.removeAllChildren();
			controller.tableView = tableView;
			$.tableContainer.add(tableView);
		}, 1500);
    },
    
    loadData : function() {
    	controller.http.request({
            httpRequestMethod : 'GET',
            service : '/apps',
            parameters : {},
        }, function (args) {
            var success = args.success;
            if (success) {
            	controller.data = args.data;
            	controller.setSections(controller.data);
            } else {
                var message = args.message;
                alert(message);
            }
		});
    },
    
    showDetail : function(index) {
    	Ti.API.info(index);
    	var row = controller.data[index];
		var config = {
			time: (new Date()).getTime, 
			data: { 
				item : {
			     	id : row.id,
			     	name : row.name,
			     	description : row.description
			     }
			}
		};
		controller.navigation.backToAndNavigate('home', 'detail', config, '');
    }
};

$.home.addEventListener('open', controller.onOpen);
controller.init();