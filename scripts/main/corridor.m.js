// Implement dependencies
define(["core/boilerplate", "core/manager", "corridor", "conf/corridor"], 
	// Set alias for each depency
	function(Boilerplate, Manager, Corridor, Conf) {
		
		//Create a manager with the corridor model
		var CorridorManager = new Manager(Corridor);

		// Call after the initialization of the manager
		CorridorManager.caInit = function() {
			// Parse all entities of the manager
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				// Get reference to the current entity
				var entity = this.entities[iE];
				// If its defined
				if(typeof entity != 'undefined') {
					// Save id in the entity
					entity.id = iE;
					// Set position according to id
					entity.transform.position = entity.getPosition();
				}
			}
		}

		// Call before the update of entities
		CorridorManager.cbUpdate = function() {
			// Do some stuff
		}

		// Get a corridor from position (null if doesn't exist)
		CorridorManager.getByPosition = function(y) {
			// Initialize a null corridor object
			var corridor = null;

			// For each entity in the manager
			for(var i = 0, c = this.entities.length; i < c; i++){
				// Get position of the entity
				var position = this.entities[i].transform.position;
				// If position is in the corridor
				if(y >= position.y && y < position.y + Boilerplate.scene.unite) {
					// Get its reference
					corridor = this.entities[i];
					// Stop looking for corridor
					break;
				}
			}

			// Return the corridor object
			return corridor;
		}

		// Return the manager
		return CorridorManager;
	}
);