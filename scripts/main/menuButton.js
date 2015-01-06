define(['core/boilerplate'],
	function(Boilerplate) {
		var MenuButton = function(Conf, Menu) {

			this.id = null;
			this.selected = false;
			this.active = false;
			this.action = null;

			this.id = Conf.id;

			var button = document.createElement('div');
			addClass(button, 'btn');
			button.id = this.id;
			button.innerHTML = Conf.text;
			$('#'+Menu.id).appendChild(button);

			// Action
			var action = Conf.action;
			if (isFunction(action))
				button.onclick = action;
			else
				button.onclick = Menu.parent.functions[action];
			this.action = button.onclick;

			// Data
			if (Conf.data) {
				for (x in Conf.data) {
					if (!isFunction(Conf.data[x]))
						button.setAttribute('data-'+x, Conf.data[x]);
				}
			}

			// Gestion du bouton retour
			if (Conf.text === 'Return')
				Menu.returnButton = this;

			// Gestion du menu des joueurs
			if (Conf.action === 'PlayerSelection') {
				var id = Conf.data['identifier'];
				var nbPlayer = Conf.data['players'];

				Boilerplate.getManager('Menu').addPlayerSelectionMenu(id, nbPlayer);
			}

			// Gestion du classement des joueurs
			if (Conf.action === 'Rank') {
				var id = Conf.data['identifier'];

				Boilerplate.getManager('Menu').addRankMenu(id);
			}

			this.init = function(id) {};
		};

		MenuButton.prototype = {
			name : "MenuButton",
			update : function() {
				// Update Menu Button objects
			},
			render : function() {
				// Render Menu Button
			},
			setActive : function() {
				this.active = true;
				addClass($('#'+this.id), 'active');
			},
			unsetActive : function() {
				this.active = false;
				removeClass($('#'+this.id), 'active');
			},
			setSelected : function() {
				this.selected = true;
				removeClass($('.selected'), 'selected');
				addClass($('#'+this.id), 'selected');
			},
			unsetSelected : function() {
				this.selected = false;
				removeClass($('#'+this.id), 'selected');
			}
		};

		return MenuButton;

	}
);