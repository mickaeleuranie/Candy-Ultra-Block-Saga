define(['core/boilerplate', "core/manager", "menu"], function(Boilerplate, Manager, Menu) {
	var MenuManager = new Manager(Menu);

	MenuManager.cbInit = function(mode) {
		todo('Définir le mode de rendu CANVAS pour les menus');

		this.pControllers = new Array();
		this.pControllerTimer = +new Date();
		this.playerSelectionMenuIsActived = false;
		this.menuIsActivated = true;
		this.currentPlayerSelectionMenu = null;

		var playerWithGamepadManager = Boilerplate.getManager('PlayerWithGamepad');
		for (var i = 0; i < playerWithGamepadManager.entities.length; i++) {
			this.pControllers.push(playerWithGamepadManager.entities[i]);
		};

		this.displayMode = mode === 'CANVAS' ? mode : 'HTML';
	}

	MenuManager.caInit = function(mode) {
		switch (this.displayMode) {
			case 'HTML' :

				// Create Menu Container
				this.container = document.createElement('div');

				// Configure it
				this.container.id = 'menu_container';
				this.container.style.width = Boilerplate.scene.width+'px';
				this.container.style.height = Boilerplate.scene.height+'px';

				// Add it to page
				var body = document.getElementsByTagName("body")[0];
				body.appendChild(this.container);

				// Create Player Selection Container
				playerSelection =  document.createElement('div');

				// Configure it
				playerSelection.id = 'player_selection';
				playerSelection.style.width = '1600px';
				playerSelection.style.height = '760px';
				playerSelection.style.position = 'absolute';
				playerSelection.style.top = '50%';
				playerSelection.style.left = '50%';
				playerSelection.style.marginTop = (-768/2) + 'px';
				playerSelection.style.marginLeft = (-1600/2) + 'px';

				// Add it to page
				var body = document.getElementsByTagName("body")[0];
				body.appendChild(playerSelection);

				// Create rank container
				rank = document.createElement('div');

				// Configure it
				rank.id = 'player_rank';
				rank.style.width = Boilerplate.scene.width + 'px';
				rank.style.heigth = Boilerplate.scene.height + 'px';

				// Add it to page
				body.appendChild(rank);

			break;

			case 'CANVAS' :
			break;

			default :
		}

		this.addMenu('Main');
		this.addMenu('Player');
		this.addMenu('Scores');
		this.addMenu('Pause');
		this.addMenu('Gameover');
		this.switchToMenu('main_menu_0');
	}

	MenuManager.addMenu = function(name) {
		this.entities.push(this.create(name));
	}

	MenuManager.addPlayerSelectionMenu = function(id, nbPlayer) {
		// Table
		var container = document.createElement('table');
		container.id = 'players-'+nbPlayer;
		$('#'+id).appendChild(container);

		addClass($('#'+id), 'hide');
		addClass(container, 'hide');

		var row;
		for (var i = 1; i <= nbPlayer; i++) {
			// row
			if (i%2 === 1) {
				row = document.createElement('tr');
				row.style.height = Boilerplate.scene.height/(Math.ceil(nbPlayer/2))+'px';
			}

			// cell
			var td = document.createElement('td');
			td.id = container.id+'-player-'+i;
			addClass(td, 'step-0');

			// cell content
			var divPerso = document.createElement('div');
			addClass(divPerso, 'select-perso');
			var divName = document.createElement('div');
			addClass(divName, 'select-name');

			// characters artworks
			var artworks = Boilerplate.controller.runners;
			for (var iArt = 0; iArt < artworks.length; iArt++) {
				Boilerplate.controller.runnersAvailability[iArt] = true;

				var artwork = document.createElement('div');
				artwork.setAttribute('data-runner-id', iArt);
				addClass(artwork, 'artwork');
				addClass(artwork, 'artwork-'+artworks[iArt]);
				addClass(artwork, 'hide');

				if (iArt == i-1)
					addClass(artwork, 'current');

				divPerso.appendChild(artwork);
			};

			// input names
			var playerID = document.createElement('p');
			playerID.innerHTML = 'Player ' + i + ' : ';
			addClass(playerID, 'player-id');
			divName.appendChild(playerID);

			var nbLetters = 3;
			for (var l = 0; l < nbLetters; l++) {
				var letter = document.createElement('p');
				addClass(letter, 'letter');
				addClass(letter, 'letter-'+l);
				if (l === nbLetters-1)
					addClass(letter, 'last');
				letter.innerHTML = 'A';
				divName.appendChild(letter);
			};

			// Ready to rumble !
			var ready = document.createElement('p');
			ready.innerHTML = 'Ready !';
			addClass(ready, 'ready');

			// append child
			td.appendChild(divPerso);
			td.appendChild(divName);
			td.appendChild(ready);
			row.appendChild(td);

			// Special K
			if (i%2 === 0) {
				container.appendChild(row);
			}
			else if (i == nbPlayer) {
				td = document.createElement('td');
				addClass(td, 'disabled');
				row.appendChild(td);
				container.appendChild(row);
			}
		};

		// Cartouche
		var cartouche = document.createElement('p');
		addClass(cartouche, 'cartouche-title');
		container.appendChild(cartouche);
	}

	// Show rank for 4  possible players
	MenuManager.addRankMenu = function(id) {
		return true;
		var nbPlayer = 4;	// always 4 players
		// Table
		var container = document.createElement('table');
		container.id = 'rank-container';
		$('#'+id).appendChild(container);

		// get ranking
		var rank = Boilerplate.getManager('PlayerWithGamepad').rank;
		console.log(rank);
		console.log('rank');
		console.log(rank.length);

		addClass($('#'+id), 'hide');

		var row;
		for (var i = 1; i <= nbPlayer; i++) {
			// row
			if (i%2 === 1) {
				row = document.createElement('tr');
				row.style.height = Boilerplate.scene.height/(Math.ceil(nbPlayer/2))+'px';
			}
			console.log('1');

			// cell
			var td = document.createElement('td');
			td.id = container.id+'-rank-'+(i - 1);

			// cell content
			var divPerso = document.createElement('div');
			addClass(divPerso, 'rank-perso');
			var divName = document.createElement('div');
			addClass(divName, 'rank-name');

			console.log('2');
			// players
			var players = Boilerplate.getManager('PlayerWithGamepad').entities;
			// for (var iPlayer = 0; iPlayer < players.length; iPlayer++) {
			// Boilerplate.controller.runnersAvailability[iPlayer] = true;

			var artwork = document.createElement('div');
			artwork.setAttribute('data-runner-id', rank[i - 1]['selectedRunner']);
			artwork.setAttribute('id', 'runner-' + rank[i - 1]['id']);
			addClass(artwork, 'artwork');
			console.log();
			addClass(artwork, 'artwork-'+rank[i - 1]['selectedRunner']);

			addClass(artwork, 'current');

			divPerso.appendChild(artwork);
			// };

			// input names
			var playerID = document.createElement('p');
			playerID.setAttribute('id', 'player-rank-' + (i - 1));
			addClass(playerID, 'rank-id');
			divName.appendChild(playerID);

			console.log('3');
			// Ready to rumble !
			var ready = document.createElement('p');
			ready.innerHTML = 'Ready !';
			addClass(ready, 'ready');

			// append child
			td.appendChild(divPerso);
			td.appendChild(divName);
			td.appendChild(ready);
			row.appendChild(td);

			// Special K
			if (i%2 === 0) {
				container.appendChild(row);
			}
			else if (i == nbPlayer) {
				td = document.createElement('td');
				addClass(td, 'disabled');
				row.appendChild(td);
				container.appendChild(row);
			}
			console.log('4');
		};
		console.log('5');

		// Cartouche
		var cartouche = document.createElement('p');
		addClass(cartouche, 'cartouche-title');
		addClass(cartouche, 'cartouche-title-rank');
		container.appendChild(cartouche);
	}

	MenuManager.getMenu = function(id) {
		var i = 0;
		var menu = null;

		while (i < this.entities.length && menu === null) {
			if (this.entities[i].id === id)
				menu = this.entities[i];
			else
				i++;
		}

		return menu;
	}

	MenuManager.getActiveMenu = function() {
		var i = 0;
		var menu = null;

		while (i < this.entities.length && menu === null) {
			if (this.entities[i].active)
				menu = this.entities[i];
			else
				i++;
		}

		return menu;
	}

	MenuManager.switchToMenu = function(id) {
		switch (this.displayMode) {
			case 'HTML' :
				this.showTitleScreen();
				removeClass($('#'+this.container.id), 'hide');


				var i = 0;
				while (i < this.entities.length) {
					this.entities[i].active = false;
					i++;
				}

				var menu = this.getMenu(id);
				if (menu !== null)
					menu.switchTo();



			break;

			case 'CANVAS' :
			break;

			default :
		}
	}

	MenuManager.playGame = function() {
		this.hidePlayerSelectionScreen();
		this.hideRankScreen();
		Boilerplate.controller.setStop(false);
		this.menuIsActivated = false;
		Boilerplate.getManager('PlayerWithGamepad').initSprites();
		Boilerplate.getManager('PlayerWithGamepad').resetReady();
		this.hideMenu();

		SoundManager = Boilerplate.getManager('Sound');
		SoundManager.conf.current_theme.stop(false);
		Music = SoundManager.conf.musics['theme_game'];
		Music.object.play(true, true, 'music');
	}

	MenuManager.pauseGame = function() {
		Boilerplate.controller.setStop(true);
		Boilerplate.controller.setPause(true);
		this.switchToMenu('pause_menu_0');
	}

	MenuManager.resumeGame = function() {
		Boilerplate.controller.setStop(false);
		Boilerplate.controller.setPause(false);
		this.hideMenu();
	}

	MenuManager.gameOver = function() {
		Boilerplate.controller.setStop(true);
		Boilerplate.controller.setGameOver(false);
		Boilerplate.controller.setPause(false);
		this.switchToMenu('gameover_menu_0');
	}

	MenuManager.quitGame = function() {
		Boilerplate.controller.setStop(true);
		Boilerplate.controller.setPause(false);
		this.switchToMenu('main_menu_0');
	}

	MenuManager.hideMenu = function() {
		switch (this.displayMode) {
			case 'HTML' :
				addClass($('.menu_screen'), 'hide');
				addClass($('#'+this.container.id), 'hide');
				this.hideTitleScreen();
			break;

			case 'CANVAS' :
			break;

			default :
		}
	}

	MenuManager.hidePlayerSelectionScreen = function() {
		for (var i = 0; i < $('#player_selection').childNodes.length; i++) {
			addClass($('#player_selection').childNodes[i], 'hide');
		};
		addClass($('#player_selection'), 'hide');
		this.playerSelectionMenuIsActived = false;
	}

	MenuManager.hideTitleScreen = function() {
		addClass($('#title-screen-anim'), 'hide');
	}

	MenuManager.showTitleScreen = function() {
		removeClass($('#title-screen-anim'), 'hide');
	}

	MenuManager.playerSelection = function(id, nbPlayer) {
		removeClass($('#'+id), 'hide');
		removeClass($('#players-'+nbPlayer), 'hide');

		// Reset availability
		var artworks = Boilerplate.controller.runners;
		for (var iArt = 0; iArt < artworks.length; iArt++) {
			Boilerplate.controller.runnersAvailability[iArt] = true;
		};

		// Bind players
		for (var i = 0; i < nbPlayer; i++) {
			addClass($('#players-' + nbPlayer + '-player-' + (i+1) + ' .artwork'), 'hide');
			removeClass($('#players-' + nbPlayer + '-player-' + (i+1) + ' .artwork'), 'current');
			removeClass($('#players-' + nbPlayer + '-player-' + (i+1) + ' .artwork'), 'available');
			removeClass($('#players-' + nbPlayer + '-player-' + (i+1) + ' .artwork'), 'unavailable');
			if (i < Boilerplate.getManager('PlayerWithGamepad').entities.length) {
				// Global

				// Specific
				var artwork = $('#players-' + nbPlayer + '-player-' + (i+1) + ' .artwork')[i];
				removeClass(artwork, 'hide');
				addClass(artwork, 'current');
				Boilerplate.getManager('PlayerWithGamepad').entities[i].bindSelectScreen('players-'+nbPlayer+'-player-'+ (i+1));
			}
		};
		this.currentPlayerSelectionMenu = $('#players-'+nbPlayer);
		this.playerSelectionMenuIsActived = true;
	}

	MenuManager.playerSelectionMenuIsActive = function() {
		return this.playerSelectionMenuIsActived;
	}

	MenuManager.hideRankScreen = function() {
		for (var i = 0; i < $('#player_selection').childNodes.length; i++) {
			addClass($('#player_selection').childNodes[i], 'hide');
		};
		addClass($('#player_selection'), 'hide');
		this.rankMenuIsActived = false;
	}

	MenuManager.rank = function(id) {
		var nbPlayer = 4;
		removeClass($('#'+id), 'hide');
		removeClass($('#rank-container'), 'hide');

		// get players
		var players = Boilerplate.getManager('PlayerWithGamepad').entities;

		// get rank
		var rank = Boilerplate.getManager('PlayerWithGamepad').rank;

		console.log(rank.length);
		for (var i = 0; i < rank.length; i++) {
			var artwork = document.getElementById('rank-container-rank-' + (i));
			// removeClass($('#rank-container-rank-' + (i+1) + ' .artwork'), 'current');
			// removeClass($('#rank-container-rank-' + (i+1) + ' .artwork'), 'available');
			// removeClass($('#rank-container-rank-' + (i+1) + ' .artwork'), 'unavailable');

			playerID = document.getElementById('player-rank-' + (i));
			if(rank[i]['name'] == '') {
				var name = Boilerplate.getManager('PlayerWithGamepad').getRandomName();
				name.charAt(0).toUpperCase();
				var artworkDiv = document.getElementById('runner-' + rank[i]['id']);
				// removeClass(artworkDiv, 'artwork-runner-0');
				addClass(artworkDiv, 'artwork-' + rank[i]['selectedRunner']);

			} else {
				var name = rank[i]['name'];
			}
			console.log(playerID);
			playerID.innerHTML = 'rank ' + (i) + ' : ' + name;
			// if (i < Boilerplate.getManager('PlayerWithGamepad').entities.length) {
				// Global

			// Specific
			Boilerplate.getManager('PlayerWithGamepad').entities[i].bindSelectScreen('players-'+nbPlayer+'-rank-'+ (i));
			// }
		};
		this.currentRankMenu = $('#rank-container');
		this.rankMenuIsActived = true;
	}

	MenuManager.rankMenuIsActive = function() {
		return this.rankMenuIsActived;
	}

	MenuManager.menuIsActive = function() {
		return this.menuIsActivated;
	}

	MenuManager.changeArtwork = function(old, next) {
		// Hide current artwork
		addClass(old, 'hide');
		removeClass(old, 'current');
		// Show next artwork
		addClass(next, 'current');
		removeClass(next, 'hide');
	}

	MenuManager.getFirstController = function() {
		var c = this.pControllers.length > 0 ? this.pControllers[0] : null;
		return c;
	}

	MenuManager.cbUpdate = function() {

		if (interval(this.pControllerTimer, .2)) {

			if (!this.playerSelectionMenuIsActive() && !this.rankMenuIsActive() && this.menuIsActive()) {

				// Navigation
				if (this.getFirstController().controller.axes.left.y > 0 || this.getFirstController().controller.buttons.pad.bottom) {
					var menu = this.getActiveMenu();
					var nextButton = menu.getNextButton();
					menu.setSelectedButton(nextButton.id);
					this.pControllerTimer = +new Date();
				}
				else if (this.getFirstController().controller.axes.left.y < 0 || this.getFirstController().controller.buttons.pad.top) {
					var menu = this.getActiveMenu();
					var previousButton = menu.getPreviousButton();
					menu.setSelectedButton(previousButton.id);
					this.pControllerTimer = +new Date();
				}

				// Push A
				if (this.getFirstController().controller.buttons.face[0]) {
					var menu = this.getActiveMenu();
					var button = menu.getSelectedButton();
					this.getFirstController().controller.buttons.face[0] = false;
					this.pControllerTimer = +new Date();
					button.action();
				}

				// Push B
				if (this.getFirstController().controller.buttons.face[3] && this.getActiveMenu().hasReturn()) {
					var menu = this.getActiveMenu();
					var button = menu.returnButton;
					this.getFirstController().controller.buttons.face[3] = false;
					this.pControllerTimer = +new Date();
					button.action();
				}
			}
		}
	}

	MenuManager.functions = {
		SwitchToMenu : function() {
			var object = this.getAttribute === undefined ? $('#'+this.id) : this;
			var id = object.getAttribute('data-identifier');
			MenuManager.switchToMenu(id);
		},
		Play : function() { MenuManager.playGame(); },
		Pause : function() { MenuManager.pauseGame(); },
		Resume : function() { MenuManager.resumeGame(); },
		Gameover : function() { MenuManager.gameOver(); },
		Quit : function() { MenuManager.quitGame(); },
		PlayerSelection : function() {
			var object = this.getAttribute === undefined ? $('#'+this.id) : this;
			var id = object.getAttribute('data-identifier');
			var nbPlayer = object.getAttribute('data-players');
			MenuManager.playerSelection(id, nbPlayer);
		},
		Rank : function() {
			var object = this.getAttribute === undefined ? $('#'+this.id) : this;
			var id = object.getAttribute('data-identifier');
			MenuManager.rank(id);
		}
	};

	return MenuManager;
});