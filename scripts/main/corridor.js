define(['core/boilerplate'],
	function(Boilerplate) {
		var Corridor = function() {
			// List of items int the corridor
			this.items = [];
			// List of players in the corridor
			this.players = [];
			// Flag to set the object disabled
			this.disabled = false;
			// Flag to highlight the corridor when Kubor is on it
			this.selected = false;

			this.init = function() {
				// Initialize Corridor
				// Define a physic element with default values
				this.transform = {
					position : {
						x: 0,
						y: 0
					},
					scale : {
						x: Boilerplate.scene.width/Boilerplate.scene.unite,
						y: 1
					},
					rotation : 0
				};
				this.margin = 11;
			}
		}

		Corridor.prototype = {
			name : "Corridor", // Define name of the model
			update : function() {
				this.selected = false;
				// Update Corridor each frame
				this.items = this.getEntities("Item");
				this.players = this.getEntities("PlayerWithGamepad");
			},
			render : function() {
				// Get scale of the object renderer
				var scale = Boilerplate.scene.scale(this.transform);
				// Render Corridor on scene
				// Get vertical limit of the corridor
				var y = Boilerplate.scene.unite * this.id;

				Boilerplate.scene.ctx.strokeStyle = "rgba(255,0,0,1)";
				//drawLine(Boilerplate.scene.ctx,0,this.transform.position.y,Boilerplate.scene.width,this.transform.position.y);

				// The corridor is disabled
				if(this.disabled === true) {
					// Draw a rect to see the area disabled
					drawRect(Boilerplate.scene.ctx, 
						"rgba(255,255,255,.3)",
						0, y, 
						Boilerplate.scene.width, Boilerplate.scene.unite
					);
				}

				// Render du corridor selectionné
				if (this.selected) {
					Boilerplate.scene.ctx.fillStyle = 'rgba(0,0,0,.2)';
					Boilerplate.scene.ctx.fillRect(
						0,
						this.transform.position.y+7.5,
						scale.x,
						scale.y
					);
				}
			},
			getPosition : function() {
				var scale = Boilerplate.scene.scale(this.transform);
				return {x : this.transform.x, y : scale.y * this.id + (this.margin * this.id)};
			},
			getEntities : function(model) {
				var entities = Boilerplate.getManager(model).entities,
					children = [];

				for(var i = 0, c = entities.length; i < c; i++) {
					var entity = entities[i];
					var y = entity.transform.position.y;
					if(y >= this.transform.position.y && y < this.transform.position.y + Boilerplate.scene.unite) {
						children.push(entity);
						if(Boilerplate.conf.verbose === true && model === "PlayerWithGamepad") {
							debug("Corridor " + this.id + " has "+model+" " + i);
						}
					}
				}

				return children;
			}
		}



		return Corridor;
	}
);