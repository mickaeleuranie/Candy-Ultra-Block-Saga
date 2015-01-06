define(['core/boilerplate', 'IM', 'conf/item'],
	function(Boilerplate, IM, Conf) {
		var Item = function() {

			this.toDelete = false;

			this.init = function(parent, args) {
				// Initialize Item
				this.transform = args.transform;

				if (args.itemId != undefined) {
					this.id = args.itemId;
					this.corridorId = args.corridorId;
					this.action = args.action;
					this.sprite = IM.getInstance(args.sprite);
				}

				this.speed = Boilerplate.getManager("Background").speed;

				var index = randi(0, Conf.sprites.length-1);

  				this.sprite.animation = new IIG.Animation({
				  sWidth : 84,
				  sHeight : 84,
				  sx : 0,
				  sy : 0,
				  animDirection : 'ltr', // by default
				  alternate : false,
				  animByFrame : 9,
				  iterations : 'infinite' // by default
				});
			}
		}

		Item.prototype = {
			name : "Item", // Define name of the model
			update : function() {
				// check collisions
				if(this.mobile === true) {
					var player = this.checkCollision();
					if (player !== false) {
						// execute item's action
						player.executeAction(this.action, this.id);
						// remove item
						this.toDelete = true;
						return;
					}
				}

				var scale = Boilerplate.scene.scale(this.transform);
				// Update Item each frame
				if (this.mobile && this.transform.position.x + scale.x > 0) {
					this.transform.position.x -= this.speed;
				} else if (this.mobile && this.transform.position.x + scale.x < 0) {
					this.toDelete = true;
				}
			},
			render : function() {
				// Render Item on scene
				var scale = Boilerplate.scene.scale(this.transform);

				var x = this.transform.position.x,
					y = this.transform.position.y;

			 	drawRect(
					Boilerplate.scene.ctx,
					'rgba(0, 0, 0, .3)',
					x - 5, y,
					scale.x, scale.y
				);

				IM.drawImage(Boilerplate.scene.ctx, this.sprite, x, y);

				Boilerplate.scene.ctx.restore();
			},
			/**
			 * Check if item collides with a player
			 *
			 * @return playerWithGamepad
			 */
			checkCollision: function() {
				var players = Boilerplate.getManager('Corridor').entities[this.corridorId].players;
				for (var i = 0; i < players.length; i++) {
					var player = players[i];
					if (Math.abs(player.transform.position.x - (this.transform.position.x + Boilerplate.scene.unite / 2)) < Boilerplate.scene.unite) {
						if(player.hasShield === true) {
							player.desactiveShield();
							return false;
						} else {
							return player;
						}
					}
				}
				return false;
			}
		}

		return Item;
	}
);