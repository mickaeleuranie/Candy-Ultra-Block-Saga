define(['core/boilerplate', 'conf/player', 'IM', 'conf/item'],
	function(Boilerplate, Conf, IM, ConfItem) {
		var PlayerWithGamepad = function() {

			// player properties
			this.id,	// unique id
			// Flags for action
			this.isFreeze = false,
			this.isLocked = false,
			this.toSwitch = false,
			this.switchList = [],
			// Time last for action
			this.actionTimers = {
				'lock' : +new Date(),
				'shield' : +new Date(),
				'switch' : +new Date(),
				'invisible' : +new Date()
			},
			this.actionIntervals = {
				'lock' : 2,
			},
			this.character = null,
			this.inputTimer = +new Date(),

			// Invisibility
			this.isInvisible = false,
			this.invisibilityAlpha = 1;
			this.invisibilityStep = 0.5;

			// Player selection attributes
			this.currentStep = 0,
			this.selectScreenID = '',
			this.activeLetter = 0,
			this.name = '',
			this.selectedRunner = 0,
			this.ready = false,

			this.feedback = null,
			this.feedbackTime = +new Date(),

			// to delete
			this.toDelete = false;
			this.running = false,
			this.runningStep = null,

			// Time before playe move forward auto
			this.moveTime = +new Date(),
			// Initialize PlayerWithGamepad
			this.init = function() {
				// Define a physic element with default values
				this.transform = {
					position : {
						x: Conf.spawn * Boilerplate.scene.unite + Boilerplate.scene.unite / 2,
						y: Boilerplate.scene.unite / 2
					},
					scale : {
						x: 1,
						y: 1
					},
					rotation : 0
				};
				// corridor id
				this.corridorId = 0;
				// ratio : 1 = normal, change with malus/bonus
				this.speed = 0;
				// to know if axes or pad goes back to neutral position before next move
				this.neutralPositon = {
					axes: {
						y: true
					},
					pad: {
						top: true,
						bottom: true
					}
				};
				// store player direction to avoid push from another
				this.direction = null;
				// store when player move last time
				this.lastMoveTime = {
					x: Boilerplate.controller.currentTime,
					y: null
				},
				this.nextPosition = {
					x: null
				},
				// to know if player goes forward or backward
				this.speedDirection = 1;

				this.color = "rgba(255,255,255,.8)";

				// status
				this.status = Conf.status.WAITING;
			}
		}

		PlayerWithGamepad.prototype = {
			name : "PlayerWithGamepad",
			setSprite : function() {

				var index = this.selectedRunner;
				if (this.ready) {
					this.selectedRunner = 'runner-' + Conf.runners[index].sprite;
					this.sprite = IM.getInstance(Conf.runners[index].sprite);
				} else {
					var index = "runner-" + (randi(0, Boilerplate.conf.gamepad.count-1) + 1);
					this.selectedRunner = index;
					this.sprite = IM.getInstance(Conf.runners[index].sprite);
				}

				this.sprite.animation = new IIG.Animation({
					sWidth : 84,
					sHeight : 84,
					sx : 0,
					sy : 0,
					animDirection : 'ltr', // by default
					alternate : false,
					animByFrame : Conf.animByFrame,
					iterations : 'infinite' // by default
				});

			},
			updateCurrentStep : function(step) {
				removeClass($('#'+this.selectScreenID), 'step-'+this.currentStep);
				this.currentStep = step;
				addClass($('#'+this.selectScreenID), 'step-'+this.currentStep);

			},
			updateInMenu : function() {
				// Todo - Select Character

				// Select Name
				if (Boilerplate.getManager('Menu').playerSelectionMenuIsActive()) {

					switch (this.currentStep) {

						case 0 :

							if (interval(this.inputTimer, .2) && this.selectScreenID !== '') {
								removeClass($('#'+this.selectScreenID+' .select-perso'), 'selected-right');
								removeClass($('#'+this.selectScreenID+' .select-perso'), 'selected-left');
							}

							if (interval(this.inputTimer, .3)) {

								// Change character
								if (this.controller.axes.left.x > 0 || this.controller.buttons.pad.right) {
									addClass($('#'+this.selectScreenID+' .select-perso'), 'selected-right');

									var artworks = $('#'+this.selectScreenID+' .select-perso .artwork');
									var i = 0;
									var nextArtworkID = null;
									while (i < artworks.length && nextArtworkID === null) {
										if (hasClass(artworks[i], 'current'))
											nextArtworkID = i + 1 >= artworks.length ? 0 : i + 1;
										else
											i++;
									}

									if (Boilerplate.controller.checkRunnerAvailability(artworks[nextArtworkID]))
										addClass(artworks[nextArtworkID], 'available');
									else
										addClass(artworks[nextArtworkID], 'unavailable');

									Boilerplate.getManager('Menu').changeArtwork($('#'+this.selectScreenID+' .current'), artworks[nextArtworkID]);

									this.inputTimer = +new Date();
								}
								else if (this.controller.axes.left.x < 0 || this.controller.buttons.pad.left) {
									addClass($('#'+this.selectScreenID+' .select-perso'), 'selected-left');

									var artworks = $('#'+this.selectScreenID+' .select-perso .artwork');
									var i = 0;
									var nextArtworkID = null;
									while (i < artworks.length && nextArtworkID === null) {
										if (hasClass(artworks[i], 'current'))
											nextArtworkID = i - 1 < 0 ? artworks.length-1 : i - 1;
										else
											i++;
									}

									if (Boilerplate.controller.checkRunnerAvailability(artworks[nextArtworkID]))
										addClass(artworks[nextArtworkID], 'available');
									else
										addClass(artworks[nextArtworkID], 'unavailable');

									Boilerplate.getManager('Menu').changeArtwork($('#'+this.selectScreenID+' .current'), artworks[nextArtworkID]);

									this.inputTimer = +new Date();
								}

								// Push A
								if (this.controller.buttons.face[0] && Boilerplate.controller.checkRunnerAvailability($('#'+this.selectScreenID+' .artwork.current'))) {
									addClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.controller.buttons.face[0] = false;
									this.updateCurrentStep(1);
									this.inputTimer = +new Date();
									this.selectedRunner = $('#'+this.selectScreenID+' .artwork.current').className.replace(/.*artwork\-/, '').replace(/ .*/, '');
									Boilerplate.controller.updateRunnerAvailability($('#'+this.selectScreenID+' .artwork.current'), false);
								}

								// Push B
								if (this.controller.buttons.face[3]) {
									removeClass($('.active-letter'), 'active-letter');
									Boilerplate.getManager('Menu').hidePlayerSelectionScreen();
									this.controller.buttons.face[3] = false;
									this.inputTimer = +new Date();
									Boilerplate.getManager('Menu').pControllerTimer = +new Date();
								}
							}

						break;

						case 1 :

							if (interval(this.inputTimer, .2)) {
								// Change a letter (top - down)
								if (this.controller.axes.left.y > 0 || this.controller.buttons.pad.bottom) {
									var letterValue = $('#'+this.selectScreenID+' .letter-'+this.activeLetter).innerHTML.charCodeAt(0);
									letterValue = letterValue - 1 < 65 ? 90 : letterValue - 1;
									$('#'+this.selectScreenID+' .letter-'+this.activeLetter).innerHTML = String.fromCharCode(letterValue);
									this.inputTimer = +new Date();
								}
								else if (this.controller.axes.left.y < 0 || this.controller.buttons.pad.top) {
									var letterValue = $('#'+this.selectScreenID+' .letter-'+this.activeLetter).innerHTML.charCodeAt(0);
									letterValue = letterValue + 1 > 90 ? 65 : letterValue + 1;
									$('#'+this.selectScreenID+' .letter-'+this.activeLetter).innerHTML = String.fromCharCode(letterValue);
									this.inputTimer = +new Date();
								}
							}

							if (interval(this.inputTimer, .3)) {
								// Change letter to modify (left - right)
								if (this.controller.axes.left.x > 0 || this.controller.buttons.pad.right) {
									removeClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.activeLetter = this.activeLetter + 1 < 3 ? this.activeLetter + 1 : 2;
									addClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.inputTimer = +new Date();
								}
								else if (this.controller.axes.left.x < 0 || this.controller.buttons.pad.left) {
									removeClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.activeLetter = this.activeLetter - 1 > 0 ? this.activeLetter - 1 : 0;
									addClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.inputTimer = +new Date();
								}

								// Push A
								if (this.controller.buttons.face[0]) {
									removeClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.controller.buttons.face[0] = false;
									this.updateCurrentStep(2);
									this.inputTimer = +new Date();
									this.name = $('#'+this.selectScreenID+' .letter-0').innerHTML;
									this.name += $('#'+this.selectScreenID+' .letter-1').innerHTML;
									this.name += $('#'+this.selectScreenID+' .letter-2').innerHTML;

									this.ready = true;
								}

								// Push B
								if (this.controller.buttons.face[3]) {
									addClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.controller.buttons.face[3] = false;
									this.updateCurrentStep(0);
									Boilerplate.controller.updateRunnerAvailability($('#'+this.selectScreenID+' .artwork.current'), true);
									this.inputTimer = +new Date();
								}
							}

						break;

						case 2 :

							if (interval(this.inputTimer, .3)) {

								// Push B
								if (this.controller.buttons.face[3]) {
									addClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
									this.controller.buttons.face[3] = false;
									this.updateCurrentStep(1);
									this.ready = false;
									this.inputTimer = +new Date();
								}
							}

						break;

						default:
					}
				}

			},
			updateInGame : function() {
				// Boilerplate.getManager('PlayerWithGamepad').endGame(this);

				if (!this.checkPlayerStatus()) {
					return;
				}

				if(interval(this.actionTimers['switch'], 2) === true && this.toSwitch === true
					&& this.switchList[0].id === this.id) {
					this.executeSwitch();
				}

				if(this.controller.connected === true) {
					this.status = Conf.status.PLAYING;

					// By default no direction
					this.direction = null;

					// If input down and movement is allowed
					if (this.getInput("down") === true && this.moveAllowed('down', true) === true) {
						// Set direction to bottom
						this.direction = 'down';
						// Change corridor
						this.corridorId++;
						// Reintialize freezing
						this.isFreeze = false;
					// If input up and movement is allowed
					} else if (this.getInput("up") === true && this.moveAllowed('up', true) === true) {
						// Set direction to up
						this.direction = 'up';
						// Change corridor
						this.corridorId--;
						// Reintialize freezing
						this.isFreeze = false;
					} else if(this.getInput("run") === true && this.isFreeze === false && this.isLocked === false) {
						this.transform.position.x += 5;
					}
					else {
						// Set to false input activity
						this.resetInput();
						// Reset direction if no movement
						if (this.neutralPositon.pad.top === true && this.neutralPositon.pad.bottom === true && this.neutralPositon.axes.y === true) {
							this.direction = null;
						}
					}

					// If there is a direction, player has moved
					if(this.direction !== null) {
						// Save last move time
						this.lastMoveTime.y = Boilerplate.controller.currentTime;

						// Set to false the neutral position cause player moved
						this.neutralPositon.axes.y = false;
						this.neutralPositon.pad.top = false;
						this.neutralPositon.pad.bottom = false;
					}
				} else {
					// set player waiting for new ... player
					this.status = Conf.status.WAITING;
				}

				// Set position Y
				var scale = Boilerplate.scene.scale(this.transform);
				var corridor = Boilerplate.getManager("Corridor").entities[this.corridorId];
				this.transform.position.y = corridor.transform.position.y + corridor.margin/2 + scale.y/2;

				// Manage actions
				this.setAction();

				// Set rotation
				this.setRotation();

				// Manage invisibility
				if (this.isInvisible === true && interval(this.actionTimers['invisible'], this.invisibilityStep) === false) {
					if (this.invisibilityStep == .5)
						this.invisibilityAlpha -= 0.05;
					else
						this.invisibilityAlpha += 0.05;
				}
				else if (this.isInvisible === true && interval(this.actionTimers['invisible'], this.invisibilityStep) === true) {
					this.invisibilityStep = 5.5;
				}

				// Manage feedback
				if(this.feedback !== null && interval(this.feedbackTime, this.feedbackStep) === false) {
					this.feedbackAlpha += 0.05;
					this.feedbackOffset += 3;
				// Set position X
				} else {
					if (this.transform.position.x + Boilerplate.scene.unite / 2 < Boilerplate.scene.width) {
						if (this.nextPosition.x !== null &&
							(
								(this.speedDirection > 0 && this.nextPosition.x > this.transform.position.x)
								|| (this.speedDirection < 0 && this.nextPosition.x < this.transform.position.x)
							)
						) {
							this.transform.position.x = this.transform.position.x + (this.speed * this.speedDirection);
							this.sprite.animation.animByFrame = (this.speedDirection < 0) ? Conf.animByFrameWithDeceleration : Conf.animByFrameWithAcceleration;
						} else {
							this.nextPosition.x = null;
							this.sprite.animation.animByFrame = Conf.animByFrame;
						}
					}
				}

				if(this.isFreeze === true) {
					this.transform.position.x -= 2;
				} else if(this.isLocked === true) {
					this.transform.position.x -= randi(0, 1);
				}

			},
			update : function() {
				if (Boilerplate.getManager('Menu').menuIsActive())
					this.updateInMenu();
				else
					this.updateInGame();
			},
			render : function() {
				var scale = Boilerplate.scene.scale(this.transform);
				Boilerplate.scene.ctx.save();

				var x = this.transform.position.x,
					y = this.transform.position.y;

				var manager = Boilerplate.getManager("PlayerWithGamepad");

				// Draw portal under player to switch
				if(interval(this.actionTimers['switch'], 2) === false && this.switchList.length === 2) {

					// Rotation
					Boilerplate.scene.ctx.save();
					Boilerplate.scene.ctx.translate(x, y);
			  		Boilerplate.scene.ctx.rotate( Boilerplate.controller.portalRotation * (Math.PI / 180) );
			  		Boilerplate.scene.ctx.translate(-x, -y);

			  		// Draw
					var image = this.switchList[0].id === this.id ? manager.portalBlue : manager.portalRed;
					IM.drawImage(Boilerplate.scene.ctx, image, x - scale.x/2, y - scale.y/2);

					// Restore
					Boilerplate.scene.ctx.restore();
				}

				Boilerplate.scene.ctx.save();

				Boilerplate.scene.ctx.translate(x, y);
			  	Boilerplate.scene.ctx.rotate( this.transform.rotation * (Math.PI / 180) );
			  	Boilerplate.scene.ctx.translate(-x, -y);

			  	if (this.isInvisible === true) {
			  		Boilerplate.scene.ctx.globalAlpha = this.invisibilityAlpha >= 0 ? this.invisibilityAlpha : 0;
			  	}

				IM.drawImage(Boilerplate.scene.ctx, this.sprite, x - scale.x/2, y - scale.y/2);

				if(this.hasShield === true) {
					IM.drawImage(Boilerplate.scene.ctx, Boilerplate.getManager("PlayerWithGamepad").shield, x, y - scale.y/2);
				}

				Boilerplate.scene.ctx.restore();
				Boilerplate.scene.ctx.globalAlpha = 1;

			  	if(this.feedback !== null && interval(this.feedbackTime, this.feedbackStep) === false) {
			  		Boilerplate.scene.ctx.globalAlpha = this.feedbackAlpha;
					IM.drawImage(Boilerplate.scene.ctx, this.feedback, x + scale.x/4, y - this.feedbackOffset);
			  		Boilerplate.scene.ctx.globalAlpha = 1;
			  	}
			},
			debug : function() {
				var scale = Boilerplate.scene.scale(this.transform);

				var x = this.transform.position.x,
					y = this.transform.position.y;

				Boilerplate.scene.ctx.strokeStyle = "rgb(0,0,255)";
				drawLine(Boilerplate.scene.ctx, x, y - scale.y, x, y + scale.y);
				Boilerplate.scene.ctx.fillStyle = "#000";
				Boilerplate.scene.ctx.fillText(x,x,y);
			},
			bindSelectScreen: function(id) {
				this.currentStep = 0;
				this.selectScreenID = id;
				removeClass($('#'+this.selectScreenID+' .letter-'+this.activeLetter), 'active-letter');
				this.activeLetter = 0;
				this.inputTimer = +new Date();
			},
			setInvisible: function() {
				this.invisibilityAlpha = 1;
				this.invisibilityStep = 0.5;
			},
			setFeedback: function(type) {
				this.feedback = IM.getInstance('player/' + type);
				this.feedbackTime = +new Date();

				this.feedbackStep = 0.5;
				this.feedbackAlpha = 0;
				this.feedbackOffset = 0;

				// Sound
				switch (type) {
					case 'bonus':
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['bonus'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
					break;

					case 'malus':
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['malus'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
					break;
				}
			},
			setAction: function() {
				if(this.actionTimers['lock'] > 0 && interval(this.actionTimers['lock'], this.actionIntervals['lock']/2) === true) {
					this.isLocked = false;
					this.actionTimers['lock'] = 0;
				}
				else if (this.isLocked === true) {
					Boilerplate.controller.portalRotation = Boilerplate.controller.portalRotation + 10;
				}
				if(interval(this.actionTimers['invisible'], 6) === true) {
					this.isInvisible = false;
				}
				if(interval(this.actionTimers['shield'], 3) === true) {
					this.hasShield = false;
				}
			},

			setRotation: function() {
				this.transform.rotation = this.isLocked === true ? this.transform.rotation + randi(5,10) : 0;
			},

			getInput: function(type) {
				var active = false;
				switch(type) {
					case "up" :
						if (this.neutralPositon.axes.y === true && this.controller.axes.left.y < 0 ||
							this.neutralPositon.pad.top === true && this.controller.buttons.pad.top === true) {
							active = true;
						}
					break;
					case "down" :
						if (this.neutralPositon.axes.y === true && this.controller.axes.left.y > 0 ||
							this.neutralPositon.pad.bottom === true && this.controller.buttons.pad.bottom === true) {
							active = true;
						}
					break;
					case "run" :
						var current = this.runningStep !== null ? this.runningStep : 'right';
						var next = current === 'right' ? 'left' : 'right';

						if(this.controller.buttons.shoulder[current].trigger === false &&
							this.controller.buttons.shoulder[next].trigger === true ) {
							active = true;
							this.runningStep = next;
						}

					break;
				}

				return active;
			},

			resetInput: function() {
				// If no movement on axis
				if (this.controller.axes.left.y === 0) {
					// Input is in neutral position
					this.neutralPositon.axes.y = true
				}
				// If no activiy on d-pad top
				if (this.controller.buttons.pad.top === false) {
					// Input is in neutral position
					this.neutralPositon.pad.top = true;
				}
				// If no activiy on d-pad bottom
				if (this.controller.buttons.pad.bottom === false) {
					// Input is in neutral position
					this.neutralPositon.pad.bottom = true;
				}
			},

			// Check collision, malus ...
			moveAllowed: function(direction, withCrush) {
				if(this.isLocked === true) {
					return false;
				}

				// Check if another player avoid this move
				var corridors = Boilerplate.getManager('Corridor').entities;
				// Get direction coefficient
				var dir = direction === "down" ? 1 : -1;

				// Check if there is a corridor in the direction we want
				if (corridors[this.corridorId + dir] === undefined) {
					return false;
				}

				// Get next corridor according direction
				var nextCorridor = corridors[this.corridorId + dir];

				var canMove = true;
				var distance = 0;
				// Get all players on that corridor
				var nextCorridorObstacles = Boilerplate.getManager("Obstacle").getByCorridor(nextCorridor.id);
				for(var i = 0, c = nextCorridorObstacles.length; i < c; i++) {
					distance = Math.abs(nextCorridorObstacles[i].transform.position.x - this.transform.position.x);
					// There is an obstacle on the next corridor
					if (distance < Boilerplate.scene.unite && nextCorridorObstacles[i].walkable === false) {
						canMove = false;
						break;
					}
				}

				if(canMove === false) {
					return false;
				}
				// Get all players on that corridor
				var nextCorridorPlayers = nextCorridor.players
				// Push other player
				for (var i = 0, c = nextCorridorPlayers.length; i < c; i++) {
					if (Math.abs(nextCorridorPlayers[i].transform.position.x - this.transform.position.x) < Boilerplate.scene.unite) {
						// If player can crush the other in next corridor
						if (withCrush === true && nextCorridorPlayers[i].moveAllowed(direction, false) === true) {
							// Crush it !!
							nextCorridorPlayers[i].corridorId = nextCorridorPlayers[i].corridorId + dir;

							var SoundManager = Boilerplate.getManager('Sound');
							var Sound = SoundManager.conf.sounds['impact'];
							if (Sound !== undefined && Sound.object !== null) {
								Sound.object.play(false, false, 'sound');
							}
						} else {

							var SoundManager = Boilerplate.getManager('Sound');
							var Sound = SoundManager.conf.sounds['impact'];
							if (Sound !== undefined && Sound.object !== null) {
								Sound.object.play(false, false, 'sound');
							}
							// Damn, can't crush
							return false;
						}
					}
				}

				return true;
			},

			// Actions from bonus/malus
			// Can't move anymore
			lock : function(time, force) {
				if(this.isLocked === false || force === true) {
					Boilerplate.controller.portalRotation = 0;
					this.actionTimers['lock'] = +new Date();
					this.actionIntervals['lock'] = time;
					this.isLocked = true;
				}
			},
			// Active shield
			activeShield : function() {
				if(this.hasShield === false) {
					this.actionTimers['shield'] = +new Date();
					this.hasShield = true;
				}
			},
			// Active invisibility
			disappear : function() {
				if (this.isInvisible === false) {
					this.actionTimers['invisible'] = +new Date();
					this.isInvisible = true;
					this.invisibilityStep = .5;
					this.invisibilityAlpha = 1;
				}
			},
			desactiveShield : function() {
				if(this.hasShield === true) {
					// Play sound
					var SoundManager = Boilerplate.getManager('Sound');
					var Sound = SoundManager.conf.sounds['delete_shield'];
					if (Sound !== undefined && Sound.object !== null) {
						Sound.object.play(false, false, 'sound');
					}
					this.hasShield = false;
				}
			},
			// Switch player with the closest to the end or a random
			prepareSwitch : function() {
				var players = Boilerplate.getManager("PlayerWithGamepad").entities;
				var player = players.pickup();

				for(var i = 0, c = players.length; i < c; i++) {
					if(players[i].transform.position.x > this.transform.position.x &&
						players[i].transform.position.x > player.transform.position.x) {
						player = players[i];
					}
				}

				if(player.id === this.id && players.length > 1) {
					this.prepareSwitch();
				} else {
					this.actionTimers['switch'] = +new Date();
					player.actionTimers['switch'] = +new Date();

					this.switchList = player.switchList = [this, player];
					this.toSwitch = player.toSwitch = true;
				}
			},
			executeSwitch : function() {
				var player = this.switchList[1];
				var ax = this.transform.position.x,
					ay = this.transform.position.y,
					bx = player.transform.position.x,
					by = player.transform.position.y,
					aCorridorId = this.corridorId,
					bCorridorId = player.corridorId;

				player.corridorId = aCorridorId;
				player.transform.position.x = ax;
				player.transform.position.y = ay;

				this.corridorId = bCorridorId;
				this.transform.position.x = bx;
				this.transform.position.y = by;

				this.toSwitch = player.toSwitch = false;
				this.switchList = player.switchList = [];
			},

			executeAction: function(action, id) {

				// check primary or neutral
				if (id === this.id) {
					var type = 'bonus';
				} else {
					var type = 'malus';
				}

				switch (action[type]) {
					case 'backward' :
						this.backward(type);
						this.setFeedback(type);
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['backward'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						break;
					case 'forward' :
						this.forward(type);
						this.setFeedback(type);
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['forward'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						break;
					case 'invert' :
						this.lock(4);
						this.setFeedback(type);
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['exchange'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						break;
					case 'link':
						// TODO
					case 'switch':
						this.prepareSwitch();
						this.setFeedback(type);
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['exchange'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						break;
					case 'shield':
						this.activeShield();
						this.setFeedback(type);
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['shield'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						break;
					case 'invisibleOthers':
						Boilerplate.getManager('PlayerWithGamepad').disappearAll(this.id, type);
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['invisible_all'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						break;
					case 'invisible':
						this.disappear();
						this.setFeedback(type);
						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['invisible'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						break;
					default:
						break;
				}

			},

			// type = primary or neutral
			forward: function(type) {
				this.speedDirection = 1;
				this.changeSpeed(type);
			},

			// type = primary or neutral
			backward: function(type) {
				this.speedDirection = -1;
				this.changeSpeed(type);
			},

			changeSpeed: function(type) {
				// get the speed boost according to the type of item
				this.speed = rand(ConfItem.range[type]['min'], ConfItem.range[type]['max']) * 3;
				if (Math.ceil(this.speed) == ConfItem.range[type]['max'] && type === 'primary') {
					console.log('GREAT !');
				}

				// set next position
				if (this.nextPosition === null) {
					this.nextPosition.x = this.transform.position.x + (Math.ceil(this.speed / 2) * 10 * this.speedDirection);
				} else {
					this.nextPosition.x += this.transform.position.x + (Math.ceil(this.speed / 2) * 10 * this.speedDirection)
				}
			},

			// check if player is still playing or is out/winner
			checkPlayerStatus: function() {
				// player is out of the run
				if (this.transform.position.x < 0 || this.transform.position.y < 0 || this.transform.position.y > Boilerplate.scene.height) {
					this.status = Conf.status.OUT;
					this.toDelete = true;
					// add rank
					Boilerplate.getManager('PlayerWithGamepad').rank.push(this);
					// delete player
					Boilerplate.getManager('PlayerWithGamepad').deleteOne(this);
					// end the game if the last playing user is out
					if (!Boilerplate.getManager('PlayerWithGamepad').playersCount() > 0) {
						Boilerplate.getManager('PlayerWithGamepad').endGame();
					}
					return false
				}

				// player is winnner
				if (this.transform.position.x > ((Boilerplate.scene.width / 10) * 9)) {
					this.status = Conf.status.WINNER;
					Boilerplate.getManager('PlayerWithGamepad').endGame();
					return false;
				}
				return true;
			}
		}

		return PlayerWithGamepad;
	}
);