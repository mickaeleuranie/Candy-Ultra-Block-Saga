define(['core/boilerplate', 'conf/background'],
	function(Boilerplate, Conf) {
		var Background = function() {

			this.init = function(parent, args) {
				// Initialize Background
				if (args.hasOwnProperty('transform'))
					this.transform = args.transform;

				if (args.hasOwnProperty('img'))
					this.img = args.img;
			}
		}

		Background.prototype = {
			name : "Background", // Define name of the model
			update : function() {
				// Update Background each frame
				this.transform.position.x -= Boilerplate.getManager("Background").speed;

				if (this.transform.position.x <= -Boilerplate.scene.width)
					this.transform.position.x = Boilerplate.scene.width;
			},
			render : function() {
				// Render Background on scene
				var scale = Boilerplate.scene.scale(this.transform);

				var x = this.transform.position.x,
					y = this.transform.position.y;

				Boilerplate.scene.ctx.drawImage(
					this.img.data,
					this.transform.position.x,
					0
				);

				Boilerplate.scene.ctx.restore();
			}
		}

		return Background;
	}
);