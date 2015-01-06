define(['core/boilerplate'],
	function(Boilerplate) {
		var Example = function() {

			this.init = function() {
				// Initialize Example
			}
		}

		Example.prototype = {
			name : "Example", // Define name of the model
			update : function() {
				// Update Example each frame
			},
			render : function() {
				// Render Example on scene
			}
		}

		return Example;
	}
);