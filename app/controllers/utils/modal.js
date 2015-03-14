var controller = {
    args : arguments[0] || {},
    init : function() {
        controller.addHandlers();
    },
    
    modalElements : {},
    
	dismiss : function(parameters) {
		controller.modalElements = {};
		var startupAnimation = Titanium.UI.createAnimation({
			curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
		    opacity : 0,
		    duration : 550,
		});
		$.modal.animate(startupAnimation, function(){
			$.modal.hide();
			$.modalContent.removeAllChildren();
			if (parameters) {
				controller.showView(parameters);
			}
		});
	},
    
    showView : function(parameters) {
		$.modalContent.removeAllChildren();
	    $.modal.show();
		var startupAnimation = Titanium.UI.createAnimation({
	        curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
	        opacity : 1,
	        duration : 550,
	    });
	    $.modal.animate(startupAnimation);
	    
	    /* Create the modal title */
	    var modalTitle = Ti.UI.createLabel({
			id: 'title',
			text: parameters.title,
			height: 30,
		});
			
		$.addClass(modalTitle, "title");
		$.modalContent.add(modalTitle);
		
		/**
		 * generateInput
		 * 	
		 * Parameters:
		 * 		parameters: if, hintText, validate
		 * 
		 * Generate inputs according to the provided text
		 */
		function generateInput(parameters) {
			var inputView = Ti.UI.createView({});
			var inputContainer = Ti.UI.createView({});
			inputView.add(inputContainer);
			$.addClass(inputContainer, "inputContainer");
			$.addClass(inputView, "inputView1");
			
			if (parameters.label != null) {
				$.addClass(inputView, "inputView2");
				var label = generateInputLabel(parameters.label);
				inputView.add(label);		
			}
			
			var input = Ti.UI.createTextField({
				id: parameters.id,
				hintText: parameters.hintText
			});
			
			if (parameters.maxLength) {
				input.maxLength = parameters.maxLength;
			}
			
			if (parameters.keyboardType) {
				input.keyboardType = parameters.keyboardType;
			} else {
				input.keyboardType = Ti.UI.KEYBOARD_APPEARANCE_DEFAULT;
			}
			
			if (parameters.passwordMask) {
				input.passwordMask = parameters.passwordMask;
			}
			
			controller.modalElements[input.id] = input;
			
			$.addClass(input, "input");
			inputContainer.add(input);
			return inputView;
		}
		
		/**
		 * generateLabel
		 * 
		 * Generate labels according to the provided text
		 */
		function generateLabel(buttonText,buttonClass) {
			var label = Ti.UI.createLabel({
				text: buttonText,
			});	
			$.addClass(label, buttonClass);
			return label;
		}
		
		/**
		 * generateInputLabel
		 * 
		 * Generate labels according to the provided text
		 */
		function generateInputLabel(label) {
			var label = Ti.UI.createLabel({
				text: label,
			});	
			$.addClass(label, "inputLabel");
			return label;
		}
		
		/**
		 * generateButton
		 * 
		 * Parameters:
		 * 		param: id, text
		 * 
		 * Generate labels according to the provided text
		 */
		function generateButton(param) {
			var button = Ti.UI.createView({
				actionId: param.id,
				buttonElement: true,
				type: 'otherButton',
				data: param
			});
			
			var label = generateLabel(param.text,'buttonLabel');
			button.add(label);
			
			if (param.subText) {
				var subLabel = generateLabel(param.subText, 'buttonSubLabel');
				button.add(subLabel);	
			}
			
			return button;
		}
		
		/**
		 * generateText
		 * 
		 * Generate labels according to the provided text
		 */
		function generateText(parameters) {
			var textView = Ti.UI.createView({
				height: Ti.UI.SIZE
			});
			var label = Ti.UI.createLabel({
				text: parameters.text,
			});
			$.addClass(label, parameters.class);
			textView.add(label);
			if (parameters.content) {
				textView.layout = parameters.layout;
				var content = Ti.UI.createLabel({
					text: parameters.content
				});
				$.addClass(content, parameters.contentClass);
				textView.add(content);
			}
			return textView;
		}
		
		/* Generate informational text if provided */
		if (parameters.info != []) {
			for (i=0; i < parameters.info.length; i++) {
				var info = generateText(parameters.info[i]);
				$.modalContent.add(info);
			}
		}
		
		/* Generate inputs if provided */
		if (parameters.inputs != []) {
			for (i=0; i < parameters.inputs.length; i++) {
				var input = generateInput(parameters.inputs[i]);
				if (i == parameters.inputs.length-1) 
					$.addClass(input, "lastInput");
				$.modalContent.add(input);
			}
		}
		
		if (parameters.elements != null) {
			if (parameters.elements.slider != null) {
				var slider = Ti.UI.createSlider({
					min: parameters.elements.slider.min,
					max: parameters.elements.slider.max,
					value: parameters.elements.slider.value
				});
				
				/* Remove navigation when slidr is active */
				if (OS_IOS) {
		        	slider.bubbleParent = false;
		        }
		        
		        var sliderLabel = Ti.UI.createLabel({});
		        sliderLabel.text = slider.value;
		        
				/* Slider event Listener */
				slider.addEventListener('change', function(e) {
					sliderLabel.text = String.format("%d", parseInt(e.source.value));
		    		// sliderLabel.text = String.format("%d", e.value);
				});
				
				controller.modalElements[parameters.elements.slider.id] = slider;
				
				$.addClass(slider, "slider");
				$.addClass(sliderLabel, "sliderLabel");
				$.modalContent.add(slider);
				$.modalContent.add(sliderLabel);
			}
		}
		
		var okButton = Ti.UI.createView({
			actionId: 'okButton',
			buttonElement: true,
			type: 'okButton'
		});
		
		var cancelButton = Ti.UI.createView({
			actionId: 'cancelButton',
			buttonElement: true,
			type: 'cancelButton'
		});
		
		var buttonsView = Ti.UI.createView();
		$.addClass(buttonsView, "buttonsView");
		
		/* Generate extra buttons if provided */
		if (parameters.buttons != null) {
			for (i=0; i < parameters.buttons.length; i++) {
				var button = generateButton(parameters.buttons[i]);
				$.addClass(button, "largeAcquaButton");
				if (parameters.buttons[i].subText) {
					$.addClass(button, "extraLargeAcquaButton");
				}
				$.modalContent.add(button);
			} 
		};
		
		/* Generate default buttons if provided */
		if (parameters.okButton != null && parameters.cancelButton == null) {
			
			if (parameters.okButton.id) {
				okButton.actionId = parameters.okButton.id; 
			};
			
			var label = generateLabel(parameters.okButton.text, 'buttonLabel');
			okButton.add(label);
			$.addClass(okButton, "largeBlueButton");
			$.modalContent.add(okButton);
		} else if (parameters.okButton != null && parameters.cancelButton != null) {
			
			if (parameters.okButton.id) {
				okButton.actionId = parameters.okButton.id; 
			};
			
			if (parameters.cancelButton.id) {
				cancelButton.actionId = parameters.cancelButton.id; 
			};
			
			var label = generateLabel(parameters.okButton.text, 'buttonLabel');
			okButton.add(label);
			$.addClass(okButton, "leftButton");
			buttonsView.add(okButton);
			var label = generateLabel(parameters.cancelButton.text, 'buttonLabel');
			cancelButton.add(label);
			$.addClass(cancelButton, "rightButton");
			buttonsView.add(cancelButton);
			$.modalContent.add(buttonsView);
		} else if (parameters.okButton == null && parameters.cancelButton != null) {
			
			if (parameters.cancelButton.id) {
				cancelButton.actionId = parameters.cancelButton.id; 
			};
			
			var label = generateLabel(parameters.cancelButton.text, 'buttonLabel');
			cancelButton.add(label);
			$.addClass(cancelButton, "largeBlueButton");
			$.modalContent.add(cancelButton);
		}
	},
	
    addHandlers : function() {
    	$.opacityBackground.addEventListener('click', function(e) {
    		controller.dismiss();
    	});
    	
        $.modalContent.addEventListener('click', function(e) {
            if (e.source.buttonElement) {
            	switch (e.source.type) {
	            	case 'cancelButton': 
	            		controller.dismiss();
	            		$.modal.fireEvent(e.source.actionId);
	            		break;
	            	default:
	            		$.modal.fireEvent(e.source.actionId);
	            		break;
            	}
            }
		});
    }
};

controller.init();

//EXPORTED
$.show = function(parameters) { 
	controller.showView(parameters);
};

$.hide = function(parameters) {
	controller.modalElements = {};
	controller.dismiss(parameters);
};

$.getModalElements = function() {
	return controller.modalElements;
};