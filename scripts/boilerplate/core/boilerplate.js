define(
	['misc/tools', 'conf/main', 'lib/input', 'core/scene', 'IM'], 
	function(Tools, Conf, Input, Scene, IM) {

		var Boilerplate = function() {}

		Boilerplate.prototype = {
			konami : 0,
			getHelp: function() {
				log("### Your HTML5 canvas boilerplate is now running");
				log("  - Declare 'core/boilerplate' dependency in your modules to access Boilerplate");
				log("  - Enter MyObject.help() to get information about it");
			},
			init: function(Controller) {

				this.getHelp();

				// Initialize default configuration (conf/main.js)
				this.conf = Conf;
				// Initialize Scene
				this.scene = new Scene(Conf.scene);
				// Initialize inputs with canvas as target
				Input.init(this.scene.canvas);

				// log(mInput.init);
				// this.mInput = mInput.init(this.scene.canvas);
				// Initialize controller
				this.controller = new Controller({parent : this});

				this.controller.init();

				this.run();
			},
			run: function() {
				// Reinitialize debug console
				$('#debug').childNodes[1].innerHTML = "";

				// Execute game loop only if game is running 
				// Update game controller
				this.controller.update();
				this.controller.render();

				if(this.konami > this.controller.currentTime && this.controller.renderKonami !== undefined) {
					this.controller.renderKonami();
					debug("Show konami for " + (this.controller.currentTime - this.konami))
				}

				// Listen to input events
				Input.listen();

				// Call game loop again
				requestAnimationFrame(this.run.bind(this));
			},
			setStop: function(stop) {
				// Stop/start controller
				this.controller.stop = stop;
				// If start controller
				if(stop === false) {
					// Relaunch game loop
					this.run();
				}
			},
			setPause: function(pause) {
				// Pause/resume controller
				this.controller.pause = pause;
				this.setStop(pause);
			},
			getManager : function(Model) {
				if(this.controller[Model+"Manager"] !== undefined) {
					return this.controller[Model+"Manager"];
				} else {
					warn("Game doesn't have "+Model+"Manager.");
				}
			}
		};

		return new Boilerplate();
	}
);