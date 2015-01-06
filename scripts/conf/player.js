/**
 * Player configuration
 **/
define({
	runners : {
		'runner-0' : {
			sprite : "player/Knight_SpritSheet",

		},
		'runner-1' : {
			sprite : "player/Sprites_Cube_Face",

		},
		'runner-2' : {
			sprite : "player/Sprites_Flying_Rock",

		},
		'runner-3' : {
			sprite : "player/dragon",

		},
		'runner-4' : {
			sprite : "player/Sprites_Jelly"

		}
	},
	animByFrame : 7,
	animByFrameWithAcceleration : 2,
	animByFrameWithDeceleration : 10,
	spawn : 4,
	status: {
		// player is ... playing
		PLAYING: 'playing',
		// waiting for a user to connect
		WAITING: 'waiting',
		// out of screen
		OUT: 'out',
		// winneur
		WINNER: 'winner'
	}
});