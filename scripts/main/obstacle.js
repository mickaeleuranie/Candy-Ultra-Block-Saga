define(['core/boilerplate', 'IM'],
	function(Boilerplate, IM) {
		var Obstacle = function() {

			this.image = null;

			this.init = function(parent, args) {
				// Initialize Obstacle

				this.setCorridor();

				this.transform = {
					position : {
						x: Boilerplate.scene.width + Boilerplate.scene.unite,
						y: 0
					},
					scale : {
						x: 1,
						y: 1
					},
					rotation : 0
				};

				this.type = args.type;
				switch(this.type) {
					case 'lavaLong' :
					case 'rockLong' :
						this.image = parent[this.type+"Left"];
						parent.createLong(this, randi(1, 3));
					break;
					case 'lavaLongMiddle':
					case 'rockLongMiddle':
						this.image = parent[this.type].pickup();
						break;
					default : 
						if(parent[this.type] !== undefined) {
							this.image = parent[this.type];
						}
					break;
				}

				this.walkable = this.type.indexOf("rock") === -1;
			}
		}

		Obstacle.prototype = {
			name : "Obstacle", // Define name of the model
			update : function() {
				// Update Obstacle each frame
				var scale = Boilerplate.scene.scale(this.transform);
				var corridor = Boilerplate.getManager("Corridor").entities[this.corridorId];
				this.transform.position.y = corridor.transform.position.y + corridor.margin/2 + scale.y/2;

				this.transform.position.x -= Boilerplate.getManager("Background").speed;

				if(this.transform.position.x + scale.x*2 < 0) {
					this.toDelete = true;
				}

				this.checkCollision();
			},
			render : function() {
				// Render Obstacle on scene
				var scale = Boilerplate.scene.scale(this.transform);
				IM.drawImage(Boilerplate.scene.ctx, this.image, this.transform.position.x - scale.x/2, this.transform.position.y - scale.y/2);
			},
			setCorridor : function() {
				this.corridorId = Boilerplate.getManager("Corridor").entities.pickup().id;

				if(this.corridorId === Boilerplate.getManager("Corridor").lastCorridorUsed) {
					this.setCorridor();
				}
			},
			checkCollision : function() {
				var players = Boilerplate.getManager("PlayerWithGamepad").entities;
				for(var i = 0, c = players.length; i < c; i++) {
					var player = players[i];

					if(player.corridorId !== this.corridorId) {
						continue;
					} else {
						var scale = Boilerplate.scene.scale(this.transform);
						if (Math.abs(player.transform.position.x - this.transform.position.x) < Boilerplate.scene.unite/2) {
							switch(this.type) {
								case 'lavaLong' : 
								case 'lavaLongMiddle' : 
								case 'lavaShort': 
									player.lock(1, true);
								break;
								case 'rockLong' : 
								case 'rockLongMiddle' :
								case 'rockShort': 
									player.isFreeze = true;
								break;
							}
						}
					}
				}
			},
			debug : function() {
				var scale = Boilerplate.scene.scale(this.transform);
				drawRect(Boilerplate.scene.ctx, "rgba(255,0,0,.5)",this.transform.position.x - scale.x/2, this.transform.position.y - scale.y/2, scale.x, scale.y);
				Boilerplate.scene.ctx.strokeStyle = "rgb(0,255,0)";
				drawLine(Boilerplate.scene.ctx, this.transform.position.x, this.transform.position.y - scale.y, this.transform.position.x, this.transform.position.y + scale.y);			
				Boilerplate.scene.ctx.fillStyle = "#000";
				Boilerplate.scene.ctx.fillText(this.transform.position.x,this.transform.position.x,this.transform.position.y);
			}
		}

		return Obstacle;
	}
);