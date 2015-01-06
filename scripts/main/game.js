define(['core/boilerplate', 'IM', 'lib/gamepad', 'menu.m', 'lib/leapmodule', 'sound.m', 'playerWithGamepad.m', 'item.m', 'corridor.m', 'kubor.m', 'background.m', 'obstacle.m'],
	function(Boilerplate, IM, GamepadManager, MenuManager, LeapModule, SoundManager, PlayerManager, ItemManager, CorridorManager, KuborManager, BackgroundManager, ObstacleManager) {

		/*Define 'core/boilerplate' dependency to access Boilerplate*/
		// Boilerplate.help();

	    var Game = function(Config) {
			/*Construct Game Controler*/
			this.stop = true;
			this.pause = false;
			this.gameOver = false;
			this.currentTime = +new Date();
			this.startButtonTimer = +new Date();
			this.secondsElapsed = 0;
			this.parent = Config.parent !== undefined ? Config.parent : false;
			this.status = this.parent.conf.status.WAITING;
			this.runners = new Array('runner-0', 'runner-1', 'runner-2', 'runner-3', 'runner-4');
			this.runnersAvailability = new Array(true, true, true, true, true);
			this.portalRotation = 0;
		}

		Game.prototype = {
			init : function() {
				var parent = this.parent;
				/*Initialize game managers*/
				// If configuration allow gamepad usage
				if(parent.conf.gamepad.enabled === true) {
					// Initialize as many pad as defined in the configuration
					GamepadManager.init(parent.conf.gamepad.count);
					GamepadManager.help();
				}

				// MenuManager.init('HTML');
				BackgroundManager.init(0);
				PlayerManager.init(parent.conf.gamepad.count);
				ItemManager.init(0);
				ObstacleManager.init(0);
				CorridorManager.init(parent.scene.height/parent.scene.unite - 1);
				MenuManager.init(0, 'HTML');
				SoundManager.init(0);
				KuborManager.init(1);

				// Register Events
				var input = parent.mInput;
				var canvas = parent.scene.canvas;

				// Init main theme
				SoundManager.conf.current_theme = SoundManager.conf.musics.theme_menu.object;
				SoundManager.conf.current_theme.play(SoundManager.conf.musics.theme_menu.fadeIn, SoundManager.conf.musics.theme_menu.loop, 'music');

				// Connect Leap Controller
				LeapModule.controller.connect();
			},
			update : function() {

				/* Update time */
				if (interval(this.currentTime, 1)) {
					this.currentTime = +new Date();
					this.secondsElapsed++;
				}

				if(this.parent.conf.verbose === true) {
					debug('Game is running since '+this.secondsElapsed+' seconds');
				}

				// If configuration allow gamepad usage
				if(this.parent.conf.gamepad.enabled === true) {
					// Update the manager
					GamepadManager.update();
				}

				/*Game loop - Update game managers*/
				PlayerManager.update();

				IM.update();

				if (!this.stop) {
					BackgroundManager.update();
					PlayerManager.update();
					ItemManager.update();
					CorridorManager.update();
					ObstacleManager.update();
					KuborManager.update();
				}
				MenuManager.update();

				// check game over
				if (this.gameover === true) {
					this.setStop(true);
					MenuManager.gameOver();
				}

				// Push start
				if (interval(this.startButtonTimer, 0.3) && MenuManager.getFirstController().controller.buttons.start) {

					if (this.stop === false ) {
						MenuManager.pauseGame();
					}
					else if (this.pause === true) {
						MenuManager.resumeGame();
					}

					this.startButtonTimer = +new Date();
				}

				// Check if players are ready
				if (MenuManager.playerSelectionMenuIsActive()) {
					var nbPlayers = MenuManager.currentPlayerSelectionMenu.id.replace(/players\-/, '');
					if (PlayerManager.areYouReady(nbPlayers)) {
						MenuManager.playGame();
					}
				}
			},
			render : function() {
				if (!this.stop) {
					Boilerplate.scene.ctx.clearRect(0, 0, Boilerplate.scene.width, Boilerplate.scene.height);
					// Render Scene
					BackgroundManager.render();
					CorridorManager.render();
					ObstacleManager.render();
					PlayerManager.render();
					KuborManager.render();
					ItemManager.render();
				}
				MenuManager.render();
			},
			renderKonami : function() {
				var konami = IM.getInstance("konami");
				Boilerplate.scene.ctx.drawImage(
					konami.data,
					0,
					Boilerplate.scene.height - konami.data.height
				);
			},
			setStop : function(stop) {
				this.stop = stop;
			},
			setPause : function(pause) {
				this.pause = pause;
			},
			setGameOver : function(gameover) {
				this.gameover = gameover;
			},
			gameOver : function() {
				this.stop = true;
			},
			hasPauseMenu : function() {
				return this.pauseMenu !== null;
			},
			checkRunnerAvailability : function(nextRunner) {
				// Get Runner ID
				var id = nextRunner.getAttribute('data-runner-id');
				return this.runnersAvailability[id];
			},
			updateRunnerAvailability : function(runner, value) {
				// Get Runner ID
				var id = runner.getAttribute('data-runner-id');
				this.runnersAvailability[id] = value;
			}
		}

		// Save Managers
		for(var iA = 0, cA = arguments.length; iA < cA; iA++) {
			// Get alias for argument
			var argument = arguments[iA];
			// Has model so is manager
			if(argument.model !== undefined) {
				var model = argument.model.prototype.name;
				Game.prototype[model+"Manager"] = argument;
			}
		}

		return Game;
	}
);