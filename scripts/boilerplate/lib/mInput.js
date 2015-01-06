/**
 * mInput.js
 **/

define(['lib/hammer'], function(Hammer) {
	var mInput = function() {

		this.allowedEvent = new Array("tap", "touch", "release");

		this.registerEvent = function(target, type, action) {
			var eventType = type.toLowerCase();
			if (this.allowedEvent.contains(eventType) && isFunction(action)) {
				log('Register event : '+eventType);
				Hammer(target).on(type, function(event) {
					action();
				});
			}
			else {
				if (!isFunction(action)) {
					log('Parameter "action" is not a function : ');
					log(action);
				}
				else if (this.allowedEvent.contains(eventType)) {
					log('Type '+type+' is not an allowed event.');
					log('Allowed event are following : ');
					log(this.allowedEvent);
				}
			}
		};

		this.logEvent = function(event) {
			log(event.type.toLowerCase());
			log(event);
			log(event.gesture.center);
		};		
	};

	var init = function(Canvas) {
		var input = new mInput();
		return input;
	}

    return {
    	init: init,
    };
});