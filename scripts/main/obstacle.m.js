// Implement dependencies
define(["core/boilerplate", "core/manager", "IM", "obstacle", "conf/obstacle"], 
	// Set alias for each depency
	function(Boilerplate, Manager, IM, Obstacle, Conf) {
		
		//Create a manager with the obstacle model
		var ObstacleManager = new Manager(Obstacle);

		ObstacleManager.spawnTime = +new Date();
		ObstacleManager.spawnFrequency = 3;

		ObstacleManager.types = ["rockShort", "lavaShort", "lavaLong", "rockLong"];
		ObstacleManager.lastCorridorUsed = 0;

		// Call after the initialization of the manager
		ObstacleManager.caInit = function() {
			// Parse all entities of the manager
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				// Get reference to the current entity
				var entity = this.entities[iE];
				// If its defined
				if(typeof entity != 'undefined') {
					// Do stuff with the entity
				}
			}

			this.rockShort = IM.getInstance("BG/Rock_Obstacle");
			this.lavaShort = IM.getInstance("BG/Lava_Single");

			this.lavaLongLeft = IM.getInstance("BG/Lava_Tile_LeftEnd");
			this.lavaLongRight = IM.getInstance("BG/Lava_Tile_RightEnd");
			this.lavaLongMiddle = [IM.getInstance("BG/Lava_Tile")];

			this.rockLongLeft = IM.getInstance("BG/Rock_Tile_LeftEnd");
			this.rockLongRight = IM.getInstance("BG/Rock_Tile_RightEnd");
			this.rockLongMiddle = [IM.getInstance("BG/Rock_Tile1"),
									IM.getInstance("BG/Rock_Tile2")];
			
		}

		// Call before the update of entities
		ObstacleManager.cbUpdate = function() {
			// Do some stuff

			if(interval(this.spawnTime, rand(this.spawnFrequency/2, this.spawnFrequency)) === true) {
				var type = this.types.pickup();
				var obstacle = this.create({type:type});
				this.entities.push(obstacle);
				this.spawnTime = +new Date();
			}
		}

		// Call afeter the update of entities
		ObstacleManager.caUpdate = function() {
			// Do some stuff
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				// Get reference to the current entity
				var entity = this.entities[iE];
				// If its defined
				if(typeof entity != 'undefined') {
					// Do stuff with the entity
					if(entity.toDelete === true) {
						this.deleteOne(entity);
					}
				}
			}
		}

		ObstacleManager.createLong = function(parent, size) {
			for(var i = 0; i < size; i++) {
				var type = i < size - 1 ? parent.type+"Middle" : parent.type+"Right";
				var scale = Boilerplate.scene.scale(parent.transform);
				var obstacle = this.create({type:type});
				this.entities.push(obstacle);
				obstacle.transform.position.x = parent.transform.position.x + scale.x * (i+1);
				obstacle.corridorId = parent.corridorId;
			}
		}

		ObstacleManager.getByCorridor = function(id) {
			var obstacles = [];
			for(var i = 0, c = this.entities.length; i < c; i++) {
				if(this.entities[i].corridorId === id) {
					obstacles.push(this.entities[i]);
				}
			}

			return obstacles;
		}

		// Return the manager
		return ObstacleManager;
	}
);