// Implement dependencies
define(["core/boilerplate", "core/manager", "example", "conf/example"], 
	// Set alias for each depency
	function(Boilerplate, Manager, Example, Conf) {
		
		//Create a manager with the example model
		var ExampleManager = new Manager(Example);

		// Call after the initialization of the manager
		ExampleManager.caInit = function() {
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

		// Call before the update of entities
		ExampleManager.cbUpdate = function() {
			// Do some stuff
		}

		// Return the manager
		return ExampleManager;
	}
);