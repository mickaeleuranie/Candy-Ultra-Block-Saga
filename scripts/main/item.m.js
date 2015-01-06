// Implement dependencies
define(["core/boilerplate", "core/manager", "item", "conf/item"],
	// Set alias for each depency
	function(Boilerplate, Manager, Item, Conf) {

		//Create a manager with the item model
		var ItemManager = new Manager(Item);

		ItemManager.cbInit = function() {
			this.generateItems(Conf.number);
		}

		// Call afeter the update of entities
		ItemManager.caUpdate = function() {
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

		// Add an item on a corridor
		// Usage : Boilerplate.getManager("Item").addOne(corridor);
		ItemManager.addOne = function(action, itemId, corridorId) {
			// Define a physic element with default values
			var transform = {
				position : {
					x: Boilerplate.scene.width - Boilerplate.scene.unite,
					y: Boilerplate.scene.height - Boilerplate.scene.unite
				},
				scale : {
					x: 1,
					y: 1
				},
				rotation : 0
			};

			// get sprite
			var sprite = action.sprite;

			var item = this.create({
				transform: transform,
				action: action,
				itemId: itemId,
				sprite: sprite,
				corridorId: corridorId
			});

			this.entities.push(item);

			return item;
		}

		// Generate multiple type of items with random combinaison major/minor/default
		ItemManager.generateItems = function(number) {
			this.actions = new Array;
			var items = Conf.items;
			items.shuffle();
			var sprites = Conf.sprites;
			sprites.shuffle();

			for (var i = 0; i < items.length; i++) {
				var action = {
					bonus: items[i]['bonus'],
					malus: items[i]['malus'],
					sprite: sprites[i]
				}
				this.actions.push(action);
			}
		}

		// Return the manager
		return ItemManager;
	}
);