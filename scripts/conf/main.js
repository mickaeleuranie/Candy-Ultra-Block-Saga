/**
 * Default configuration
 **/
define({
	// Configure scene
	scene: {
		id		: 'scene',
		width 	: 1600,
		height	: 756,
		unite	: 84
	},
	// Configure gamepad support
	gamepad: {
		enabled : true && (!!navigator.webkitGetGamepads || !!navigator.webkitGamepads),
		count : 4
	},
	verbose: false,
	status: {
		// player is ... playing
		RUNNING: 'running',
		// gameover
		GAMEOVER: 'gameover',
		// pause
		PAUSE: 'pause',
	}
});