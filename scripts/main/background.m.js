// Implement dependencies
define(["core/boilerplate", "core/manager", "background", "conf/background", "IM"], 
	// Set alias for each depency
	function(Boilerplate, Manager, Background, Conf, IM) {
		
		//Create a manager with the item model
		var BackgroundManager = new Manager(Background);

		BackgroundManager.speed = Conf.speed;

		// Call after the initialization of the manager
		BackgroundManager.caInit = function() {
			// Parse all entities of the manager
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				// Get reference to the current entity
				var entity = this.entities[iE];
				// If its defined
				if(typeof entity != 'undefined') {
					// Do stuff with the entity
				}
			}
		}

		BackgroundManager.cbInit = function() {
			// Comptage du nb d'éléments background dans la config
			for (var iE = 0, c = Conf.list.length; iE < c; iE++) {
				
				var entity = {
					transform : {
						position : {
							// Position the entity depending on its ID
							x : iE * Boilerplate.scene.width,
							y : 0
						},
						scale : {
							x : 0,
							y : 0
						},
						rotation : 0
					},
					img : IM.getInstance( Conf.list[iE] )
				}

				this.entities.push( this.create(entity) );
			}
		}

		// Call before the update of entities
		BackgroundManager.cbUpdate = function() {
			// Do some stuff
		}

		// Return the manager
		return BackgroundManager;
	}
);