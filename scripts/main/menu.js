define(['core/boilerplate', 'conf/menu', 'menuButton'],
	function(Boilerplate, Configuration, MenuButton) {
		var Menu = function() {

			this.id = '';
			this.active = false;
			this.menu_name = '';
			this.mode = '';
			this.conf = null;
			this.parent = null;
			this.returnButton = null;
			this.buttons = new Array();

			this.init = function(Manager, Menu) {
				this.parent = Manager;
				this.mode = Manager.displayMode === 'CANVAS' ? Manager.displayMode : 'HTML';
				this.menu_name = Menu;
				this.conf = Configuration.menus[this.menu_name] !== undefined ? Configuration.menus[this.menu_name] : null;

				if (this.mode === 'HTML') {
					for (var i = this.conf.screens.length - 1; i >= 0; i--) {
						this.html(this.conf.id, i, this.conf.screens[i]);						
					}
				}
				else if (this.mode === 'CANVAS') {
					this.canvas();
				}
			}

			this.html = function(ID, Step, Screen) {
				var menu = document.createElement('div');
				// Id 
				menu.id = ID+'_'+Step;
				this.id = menu.id;
				addClass(menu, ID);
				addClass(menu, 'menu_screen');
				// Title
				var title = document.createElement('h1');
				title.innerHTML = Screen.name === undefined ? this.conf.name : Screen.name;
				// Class
				addClass(title, 'title');
				menu.appendChild(title);

				this.parent.container.appendChild(menu);

				for (var i = 0; i < Screen.buttons.length; i++) {
					this.buttons.push(new MenuButton(Screen.buttons[i], this));
				};
			}
			
			this.canvas = function() {
			}
		}

		Menu.prototype = {
			name : "Menu",
			update : function() {
				if(Boilerplate.conf.verbose === true) {
					// debug(this.menu_name+' Menu is running - Mode '+this.mode);
				}

				// Update Menu objects
			},
			render : function() {
				// Render Menu
			},

			switchTo : function() {
				addClass($('.menu_screen'), 'hide');
				removeClass($('#'+this.id), 'hide');

				if (this.buttons.length > 0)
					this.buttons[0].setSelected();

				this.active = true;
			},

			getButton : function(id) {
				var i = 0;
				var button = null;

				while (i < this.buttons.length && button === null) {
					if (this.buttons[i].id === id)
						button = this.buttons[i];
					else
						i++;
				}

				return button;
			},

			getPreviousButton : function() {
				var i = 0;
				var button = null;

				while (i < this.buttons.length && button === null) {
					if (this.buttons[i].selected) {
						button = this.buttons[i];
					}
					else {
						i++;
					}
				}

				i--;

				if ( i < 0 )
					button = this.buttons[this.buttons.length-1];
				else
					button = this.buttons[i];

				return button;
			},

			getNextButton : function() {
				var i = 0;
				var button = null;

				while (i < this.buttons.length && button === null) {
					if (this.buttons[i].selected) {
						button = this.buttons[i];
					}
					else {
						i++;
					}
				}

				i++;

				if ( i >= this.buttons.length)
					button = this.buttons[0];
				else
					button = this.buttons[i];

				return button;				
			},

			getSelectedButton : function() {
				var i = 0;
				var button = null;

				while (i < this.buttons.length && button === null) {
					if (this.buttons[i].selected)
						button = this.buttons[i];
					else
						i++;
				}

				return button;
			},

			setSelectedButton : function(id) {
				var oldButton = this.getSelectedButton();
				var newButton = this.getButton(id);

				oldButton.unsetSelected();
				newButton.setSelected();
			},

			hasReturn : function() {
				return this.returnButton !== null;
			}
		}

		return Menu;
	}
);