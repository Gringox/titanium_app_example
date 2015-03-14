var controller = {
    args : arguments[0] || {},
    picker : null,
    label : null,
    value : {},
    type: null,
    timer : null,
    lastSearch : null,
    init : function() {
        controller.addHandlers();
    },
    showPicker : function() {
    	$.searchBar.value = '';
    	var type = controller.type;
		if (type == 'date') {
			controller.picker.value = controller.value;
		} else if (type == 'time') {
	    	controller.picker.value = controller.value;
		} else {
			if (controller.value.index) {
				controller.picker.setSelectedRow(0, controller.value.index);
			}
		}
	    $.dataPicker.show();
		var startupAnimation = Titanium.UI.createAnimation({
	        curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
	        opacity : 1,
	        duration : 900,
	    });
	    $.dataPicker.animate(startupAnimation);
	},
	setOptions : function(options) {
    	var type = options.type;
    	var value = options.value;
    	var searchBar = options.searchBar;
    	var pickerTitle = options.pickerTitle;
    	var location = options.location;
    	var data = options.data;
    	var label = options.label;
    	controller.label = label;
	    $.title.text = pickerTitle;
	    switch (location) {
        	case 'top':
        			$.pickerContainer.top = 0;
        			$.pickerContainer.bottom = null;
				break;
			case 'bottom':
        			$.pickerContainer.top = null;
        			$.pickerContainer.bottom = 0;
				break;
			default:
        			$.pickerContainer.top = null;
        			$.pickerContainer.bottom = null;
				break;
		}
    	if (controller.picker) {
    		$.pickerView.remove(controller.picker);
    	}
        if (type == 'date') {
        	controller.type = 'date';
        	if (OS_ANDROID) {
	            var $picker = Ti.UI.createPicker({
					format24: false,
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					selectionIndicator: true,
					backgroundColor: '#333333',
		    	});
	        }
	        if (OS_IOS) {
	            var $picker = Ti.UI.createPicker({});
	        }
        	$picker.type = Titanium.UI.PICKER_TYPE_DATE;
        	$picker.maxDate = Alloy.Globals.MaxDate.toDate();
			controller.value = value ? value : Alloy.Globals.MaxDate.toDate();
			$.pickerView.add($picker);
	    	controller.picker = $picker;
		    $.activityIndicator.hide();
		    $picker.show();
        } else if (type == 'time') {
        	controller.type = 'time';
        	if (OS_ANDROID) {
	            var $picker = Ti.UI.createPicker({
					format24: false,
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					selectionIndicator: true,
					backgroundColor: '#333333',
		    	});
	        }
	        if (OS_IOS) {
	            var $picker = Ti.UI.createPicker({});
	        }
            $picker.type = Titanium.UI.PICKER_TYPE_TIME;
			controller.value = value ? value : Alloy.Globals.MaxDate.toDate();
			$.pickerView.add($picker);
	    	controller.picker = $picker;
		    $.activityIndicator.hide();
		    $picker.show();
        } else {
        	controller.type = 'plain';
        	if (searchBar) {
	        	$.searchBarContainer.height = 45;
	        	$.searchBarContainer.visible = true;
	        }
        	if (data) {
				controller.setData(data, value);
			} else {
				$.activityIndicator.show();
			}
        }
	},
	setData : function(data, value) {
		var $picker = controller.picker;
    	var type = controller.type;
        if (type == 'plain') {
        	if (OS_ANDROID) {
	            $picker = Ti.UI.createPicker({
					format24: false,
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					selectionIndicator: true,
					useSpinner: true,
		    	});
	        }
	        if (OS_IOS) {
	            $picker = Ti.UI.createPicker({});
	        }
			$picker.type = Titanium.UI.PICKER_TYPE_PLAIN;
			 var _data = [];
		    if (data.length > 0) {
			    data.forEach(function(item, i) {
			    	item.index = i;
			        var row = Ti.UI.createPickerRow(item);
			        _data.push(row);
			        if (value && (row.value == value)) {
						controller.value = row;
					}
			    }); 
		    } else {
		    	_data.push(Ti.UI.createPickerRow({
		            title : 'No hubo coincidencias..',
		            value : 0,
		            index : 1
		        }));
		    }
    		$picker.add(_data);
    		if (controller.picker) {
	    		$.pickerView.remove(controller.picker);
	    	}
	    	$.pickerView.add($picker);
	    	controller.picker = $picker;
        }
    	$.activityIndicator.hide();
   		$picker.show();
	},
	addHandlers : function() {
        $.pickerBg.addEventListener('click', function() {
        	var startupAnimation = Titanium.UI.createAnimation({
                curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
                opacity : 0,
                duration : 900,
            });
            $.dataPicker.animate(startupAnimation, function(){
                $.dataPicker.hide();
            });
		});

		$.btnCancel.addEventListener('click', function() {
			$.pickerBg.fireEvent('click');
		});
		
		$.btnDone.addEventListener('click', function() {
    		var $picker = controller.picker;
			var type = controller.type;
			var value = null;
			if (type == 'date') {
				value = $picker.getValue();
			} else if (type == 'time') {
				value = $picker.getValue();
			} else {
				value = $picker.getSelectedRow(0);
			}
			$.dataPicker.fireEvent('select', {
                value : value,
                pickerType: type,
            });
			$.pickerBg.fireEvent('click');
		});

    	$.searchBar.addEventListener('change', function(e) {
    		var source = e.source;
    		if (source.value.length > 2) {
    			var $picker = controller.picker;
	    		$picker.hide();
	    		$.activityIndicator.show();
				clearTimeout(controller.timer);
				controller.timer = setTimeout(function() {
					if (source.value != controller.lastSearch) {
						controller.lastSearch = source.value;
						$.dataPicker.fireEvent('autoComplete', {
			                value : source.value
			            });
					} else {
						$.activityIndicator.hide();
						$picker.show();
					}
				}, 500);
			}
		});
    }
};

controller.init();



/*******************************************
 **                Exported               **
 *******************************************/
$.show = controller.showPicker;

$.hide = function() {
   	$.pickerBg.fireEvent('click');
};

$.setOptions = controller.setOptions;

$.setData = controller.setData;

$.setLabel = function(label) {
    controller.label = label;
};

$.getLabel = function() {
    return controller.label;
};






/*******************************************
 **                Examples               **
 *******************************************/
/*
	$.dataPicker.show();
	
	$.dataPicker.hide();
	
	
	
	$.dataPicker.setLabel($.welcomeLabel);
	
    $.dataPicker.getLabel();
	
	
	
	$.dataPicker.setOptions({
		type: 'time',
		value: require('alloy/moment')('10:23:48 pm', "h:mm:ss a").toDate(),
		searchBar: null,
		pickerTitle: 'Prueba Top',
		location: 'top',
		label: $.welcomeLabel,
	});

	$.dataPicker.setOptions({
		type: 'date',
		value: require('alloy/moment')('02/06/1989', "DD/MM/YYYY").toDate(),
		searchBar: null,
		pickerTitle: 'Prueba Center',
		location: 'center',
		label: $.welcomeLabel,
	});

	$.dataPicker.setOptions({
		type: null,
		value: 2,
		searchBar: true,
		pickerTitle: 'Prueba Bottom',
		location: 'bottom',
		label: $.welcomeLabel,
		data: [
			{
				title: 'Colombia',
				value: 1,
			},
			{
				title: 'Estados Unidos',
				value: 2,
			},
			{
				title: 'Mexico',
				value: 3,
			},
			{
				title: 'Venezuela',
				value: 4,
			},
			{
				title: 'Canada',
				value: 5,
			},
			{
				title: 'Australia',
				value: 6,
			},
			{
				title: 'Panama',
				value: 7,
			},
			{
				title: 'Costa Rica',
				value: 8,
			},
			{
				title: 'Inglaterra',
				value: 9,
			},
			{
				title: 'Chile',
				value: 10,
			}
		],
	});
	
	$.dataPicker.setData([
		{
			title: 'Abogado',
			value: 1,
		},
		{
			title: 'Ingeniero',
			value: 2,
		},
		{
			title: 'Médico',
			value: 3,
		},
		{
			title: 'Piloto',
			value: 4,
		}
	]);
	
	
	
	$.dataPicker.getView().addEventListener('select', function(e) {
        if (e.pickerType) {
        	var pickerType = e.pickerType;	
        	var value = e.value;
        	var label = $.dataPicker.getLabel();
		    switch (pickerType) {
	        	case 'date':
	        		label.text = require('alloy/moment')(value).format('DD/MM/YYYY');
					break;
				case 'time':
					label.text = require('alloy/moment')(value).format('h:mm:ss a');
					break;
				default:
        			label.text = value.title;
    				label.valueId = value.value;
				break;
			}
        }
    });
        
    $.dataPicker.getView().addEventListener('autoComplete', function(e) {
    	
    });  
//*/