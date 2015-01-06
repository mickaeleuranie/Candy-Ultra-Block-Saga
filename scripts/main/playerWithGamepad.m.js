define(["core/boilerplate", "core/manager", 'IM', "playerWithGamepad", "conf/player"],
	function(Boilerplate, Manager, IM, PlayerWithGamepad, Conf) {
		var PlayerWithGamepadManager = new Manager(PlayerWithGamepad);

		// Call after initialization
		PlayerWithGamepadManager.caInit = function() {
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];

				if(typeof entity != 'undefined') {
					entity.controller = Boilerplate.getManager('Gamepad').entities[iE];
					entity.id = iE;
					entity.corridorId = iE * 2;
				}
			}

			// Define shield instance
			this.shield = IM.getInstance("player/Sprites_Shield");
			this.shield.animation = new IIG.Animation({
				sWidth : 84,
				sHeight : 84,
				sx : 0,
				sy : 0,
				animDirection : 'ltr', // by default
				alternate : false,
				animByFrame : Conf.animByFrame,
				iterations : 'infinite' // by default
			});

			// Define portal for switch animation
			this.portalBlue = IM.getInstance("player/Blue_Portal");
			this.portalBlue.animation = new IIG.Animation({
				sWidth : 84,
				sHeight : 84,
				sx : 0,
				sy : 0,
				animDirection : 'ltr', // by default
				alternate : false,
				animByFrame : Conf.animByFrame,
				iterations : 'infinite' // by default
			});
			this.portalRed = IM.getInstance("player/Red_Portal");
			this.portalRed.animation = new IIG.Animation({
				sWidth : 84,
				sHeight : 84,
				sx : 0,
				sy : 0,
				animDirection : 'ltr', // by default
				alternate : false,
				animByFrame : Conf.animByFrame,
				iterations : 'infinite' // by default
			});

			// define rank
			console.log('RANK');
			this.rank = [];

		}

		PlayerWithGamepadManager.resetReady = function() {
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];
				if(typeof entity != 'undefined') {
					entity.ready = false;
				}
			}
		}

		PlayerWithGamepadManager.disappearAll = function(id, type) {
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];
				if(typeof entity != 'undefined' && entity.id != id) {
					entity.disappear();
					entity.setFeedback(type);
				}
			}
		}

		PlayerWithGamepadManager.initSprites = function() {
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];
				if(typeof entity != 'undefined') {
					entity.setSprite();
				}
			}
		}

		PlayerWithGamepadManager.areYouReady = function(requiredPlayers) {
			var nbReady = 0;

			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];
				if(typeof entity != 'undefined') {
					if (entity.ready) {
						nbReady++;
					}
				}
			}

			return nbReady >= requiredPlayers;
		}

		PlayerWithGamepadManager.playersCount = function() {
			var count = 0;

			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];
				if(typeof entity != 'undefined') {
					if (entity.status === Conf.status.PLAYING) {
						count++;
					}
				}
			}

			return count;
		}

		PlayerWithGamepadManager.endGame = function() {
			Boilerplate.controller.setGameOver(true);
			var rankToSort = new Array;

			// // get each remaining runners
			for(var iE = 0, cE = this.entities.length; iE < cE; iE++) {
				var entity = this.entities[iE];
				if(typeof entity != 'undefined') {
					if (entity.status !== Conf.status.OUT) {

						rankToSort.push(entity);
					}
				}
			}

			var rankSorted = this.getRemainingRunners(rankToSort, new Array());
			console.log(rankSorted);
			for (var j = 0; j < rankSorted.length; j++) {
				this.rank.push(rankSorted[j]);
			}
			// console.log(rankToSort);
			// TODO
			// set rank according to player number
			// if all players are out and still computers characters, make a randi() to know final rank
			// if one player or one computer character is winner, rank is defined with entities.transform.position.x values
		},

		PlayerWithGamepadManager.getRemainingRunners = function(runners, results) {
			console.log();
			if (runners.length == 0) {
				return results;
			}
			var temp = runners.pickup();
			var index = 0;
			for(var i = 0; i < runners.length; i++) {
				if (runners[i].transform.position.x < temp.transform.position.x) {
					temp = runners[i];
					index = i;
				}
			}
			results.push(temp);
			runners.splice(index, 1);
			return this.getRemainingRunners(runners, results);
		}

		PlayerWithGamepadManager.getRandomName = function() {
			var names = [
				'lorem',
				'ipsum',
				'dolor',
				'sit',
				'amet'
			];
			return names[randi(0, names.length - 1)];
		}

		return PlayerWithGamepadManager;
	}
);