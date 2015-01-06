/**
 * Sound configuration
 **/
define({
	// Define different musics and sounds
	current_theme : null,
	musics: {
		theme_menu : {
			object 	: null,
			track 	: 'sounds/menu',
			format 	: ['ogg'],
			loop 	: true,
			fadeIn 	: true
		},
		theme_game : {
			object 	: null,
			track 	: 'sounds/ambiance',
			format 	: ['ogg'],
			loop 	: true,
			fadeIn 	: true
		}
	},
	sounds: {
		bonus : {
			object 	: null,
			track 	: 'sounds/bonus_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		clic : {
			object 	: null,
			track 	: 'sounds/clic_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		malus : {
			object 	: null,
			track 	: 'sounds/malus_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		forward : {
			object 	: null,
			track 	: 'sounds/acceleration_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		shield : {
			object 	: null,
			track 	: 'sounds/shield_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		delete_shield : {
			object 	: null,
			track 	: 'sounds/delete_shield_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		exchange : {
			object 	: null,
			track 	: 'sounds/exchange_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		impact : {
			object 	: null,
			track 	: 'sounds/impact_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		invisible : {
			object 	: null,
			track 	: 'sounds/invisibilite_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		invisible_all : {
			object 	: null,
			track 	: 'sounds/invisibilite_commune_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
		backward : {
			object 	: null,
			track 	: 'sounds/ralentissement_01_01',
			format 	: ['ogg'],
			loop 	: false,
			fadeIn 	: false
		},
	}
});