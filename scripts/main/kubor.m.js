define(["core/boilerplate", "core/manager", "kubor", "conf/player"], 
	function(Boilerplate, Manager, Kubor, Conf) {
		var KuborManager = new Manager(Kubor);

		// Call after initialization
		KuborManager.caInit = function() {
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];
			}
		}

		return KuborManager;
	}
);