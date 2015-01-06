/**
 * Menu configuration
 **/
define({
	// Define differents menus
	menus : {
		Main : {
			id : 'main_menu',
			name : '',
			// Define different(s) screen(s) of menu
			screens : [
				{
					buttons: [
						{
							id : 'main_menu_play',
							text : 'Play',
							action : 'Play',
							// action : 'SwitchToMenu',
							data : {
								identifier : 'player_menu_0'
							}
						},
						{
							id : 'main_menu_scores',
							text : 'Highscores',
							action : 'SwitchToMenu',
							data : {
								identifier : 'scores_menu_0'
							}
						},
						{
							id : 'main_menu_exit',
							text : 'Exit',
							action : function() { log('Exit'); }
						}
					]
				}
			]
		},
		Player : {
			id : 'player_menu',
			name : '',
			// Define different(s) screen(s) of menu
			screens : [
				{
					buttons: [
						{
							id : 'player_menu_two',
							text : '2 players',
							action : 'PlayerSelection',
							data : {
								identifier : 'player_selection',
								players : '2'
							}
						},
						{
							id : 'player_menu_three',
							text : '3 players',
							action : 'PlayerSelection',
							data : {
								identifier : 'player_selection',
								players : '3'
							}
						},
						{
							id : 'player_menu_four',
							text : '4 players',
							action : 'PlayerSelection',
							data : {
								identifier : 'player_selection',
								players : '4'
							}
						},
						{
							id : 'player_menu_return',
							text : 'Return',
							action : 'SwitchToMenu',
							data : {
								identifier : 'main_menu_0'
							}
						}
					]
				}
			]
		},
		Scores : {
			id : 'scores_menu',
			name : '',
			// Define different(s) screen(s) of menu
			screens : [
				{
					buttons: [
						{
							id : 'settings_menu_return',
							text : 'Return',
							action : 'SwitchToMenu',
							data : {
								identifier : 'main_menu_0'
							}
						}
					]
				}
			]
		},
		Pause : {
			id : 'pause_menu',
			name : '',
			// Define different(s) screen(s) of menu
			screens : [
				{
					buttons: [
						{
							id : 'pause_menu_resume',
							text : 'Resume',
							action : 'Resume'
						},
						{
							id : 'pause_menu_quit',
							text : 'Quit',
							action : 'Quit'
						}
					]
				}
			]
		},
		Gameover : {
			id : 'gameover_menu',
			name : '',
			// Define different(s) screen(s) of menu
			screens : [
				{
					buttons: [
						{
							id : 'view_rank',
							text : 'Rank',
							action : 'Rank',
							data : {
								identifier : 'player_rank'
							}
						},
						{
							id : 'retry_game',
							text : 'Try again',
							action : 'Play'
						},
						{
							id : 'pause_menu_quit',
							text : 'Quit',
							action : 'Quit'
						}
					]
				}
			]
		},
	}
});