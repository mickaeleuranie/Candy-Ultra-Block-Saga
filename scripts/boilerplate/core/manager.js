todo("Améliorer la suppression d'une entité.");
/*
 *	Define a manager template to deal with
 *	simple/multiple instance of a model
 */
define(['core/boilerplate'],
	function(Boilerplate) {
		var Manager = function(Model) {
			// Create new manager
			this.model = Model;
			this.entities = [];
			this.isRenderer = true; // Set to false if object isn't displayed
			// Define constructor methods
			this.init = function(cE, Parameters) {
				var args = Parameters === undefined ? false : Parameters;

				// Call Before callback if defined
				if(typeof this.cbInit !== "undefined") {
					this.cbInit(args);
				}

				for(var iE = 0; iE < cE; iE++) {
					this.entities.push(this.create(args));
				}

				if(Boilerplate.conf.verbose === true && this.entities.length) {
					log("@Manager : Initializing "+this.getOne(0).name+"Manager");
					if(this.entities.length === cE) {
						log("@Manager : Initialized "+cE+" "+p('entity', 'entities', cE)+" with success");
					}
				}

				// Call After callback if defined
				if(typeof this.caInit !== "undefined") {
					this.caInit(args);
				}
			}
		}

		// Define prototype methods
		Manager.prototype = {
			toString : function() {
				var model = ucfirst(this.model.prototype.name);

				return model + 'Manager' + o2s(this);
			},
			update : function() {

				// Call Before callback if defined
				if(typeof this.cbUpdate !== "undefined") {
					this.cbUpdate();
				}

				for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
					var entity = this.entities[iE];
					if(typeof entity != 'undefined') {
						entity.update();
					}
				}

				// Call After callback if defined
				if(typeof this.caUpdate !== "undefined") {
					this.caUpdate();
				}
			},
			render : function() {
				// If manager object doesn't need to be displayed
				if(this.isRenderer === false) {
					return;
				}

				// Call Before callback if defined
				if(typeof this.cbRender !== "undefined") {
					this.cbRender();
				}

				for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
					var entity = this.entities[iE];
					if(typeof entity != 'undefined') {
						entity.render();
					}
				}

				// Call After callback if defined
				if(typeof this.caRender !== "undefined") {
					this.caRender();
				}
			},
			create : function(Parameters) {
				var args = Parameters === undefined ? false : Parameters;
				var instance = new this.model();
				instance.init(this, args);
				return instance;
			},
			getOne : function(id) {
				var cEntity = this.entities.length;
				if(id >= cEntity) {
					warn("Your get request is out of perimeter : "+this.model.prototype.name+" manager has only "+cEntity+" instance.");
				} else if(typeof this.entities[id] == "undefined") {
					warn(this.model.prototype.name+" instance with id ["+id+"] doesn't exist");
				} else {
					return this.entities[id];
				}
				return null;
			},
			deleteOne : function(entity) {
				// Delete the entity specified in parameter
				for (var i = 0, c = this.entities.length; i < c; i++) {
					if (this.entities[i] !== entity) {
						continue;
					}

					// Updates the possible entities which wouldn't be linked with this destruction
					this.entities[i].isDestroyed = true;

					if (this.entities[i].animation) {
						delete this.entities[i].animation;
					}

					this.entities.splice(i, 1);
					c--;
				}

				if (entity instanceof this.model) {
					// Ensure this is deleting the entity
					var tbl = [entity];
					tbl.splice(0, 1);
					entity = tbl = undefined;
				}

				return undefined;
			}
		}

		return Manager;
	}
);