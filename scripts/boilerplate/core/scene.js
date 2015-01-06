/*
 *	Build scene with canvas
 */
define(function() {
	var Scene = function(SceneConf) {
		// Initialize scene according to configuration
		for(property in SceneConf) {
			this[property] = SceneConf[property];
		}
		
		// Create Canvas
		this.canvas = document.createElement('canvas');
		// Configure it
		this.canvas.id = SceneConf.id;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = '50%';
		this.canvas.style.left = '50%';
		this.canvas.style.marginTop = (-this.height/2) + 'px';
		this.canvas.style.marginLeft = (-this.width/2) + 'px';

		// Title Screen
		$('#title-screen-anim').style.position = 'absolute';
		$('#title-screen-anim').style.top = '50%';
		$('#title-screen-anim').style.left = '50%';
		$('#title-screen-anim').style.marginTop = (-768/2) + 'px';
		$('#title-screen-anim').style.marginLeft = (-1600/2) + 'px';

		// Add it to page
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(this.canvas);

		// Get context for canvas
		this.ctx = this.canvas.getContext('2d');
	}

	Scene.prototype = {
		scale : function(transform) {
			return {
				x : Math.floor(transform.scale.x * this.unite),
				y : Math.floor(transform.scale.y * this.unite)
			}
		}
	}

	return Scene;
});