/**
 * Item configuration
 **/
define({
	// define number of different items to generate
	number: 4,
	sprites : [
		"cube/tron-cube",
		"cube/CubeMario_Sprite",
		"cube/Sprites_PortalCube",
		"cube/Creeper_SpritSheet"
	],
	// define couple bonus/malus
	items: [
		{
			bonus: 'forward',
			malus: 'backward'
		},
		{
			bonus: 'shield',
			malus: 'invert'
		},
		{
			bonus: 'link',
			malus: 'switch'
		},
		{
			bonus: 'invisibleOthers',
			malus: 'invisible'
		}
	],
	range: {
		bonus: {
			min: 4,
			max: 10
		},
		malus: {
			min: 4,
			max: 10
		}
	}
	// // define different actions
	// items: {
	// 	bonus: [
	// 		{
	// 			name: 'shield'
	// 		},
	// 		{
	// 			name: 'speedUp'
	// 		}
	// 	],
	// 	malus: [
	// 		{
	// 			name: 'slowDown'
	// 		},
	// 		{
	// 			name: 'invert'
	// 		},
	// 		{
	// 			name: 'invisible'
	// 		}
	// 	],
	// 	neutral: [
	// 		{
	// 			name: 'switch'
	// 		},
	// 		{
	// 			name: 'link'
	// 		}
	// 	]
	// },
	// // define values range for primary (bonus/malus) and neutral items
	// range: {
	// 	primary: {
	// 		min: 6,
	// 		max: 10
	// 	},
	// 	neutral: {
	// 		min: 1,
	// 		max: 5
	// 	}
	// }
});