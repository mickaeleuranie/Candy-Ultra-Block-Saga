define(['lib/IIG'], function(IIG) {

	var IM = new IIG.ImageManager({
		path : 'assets/00_FINAL/'
	});

	
	IM.add('konami.png');
	IM.add('background.png');
	IM.add('background-no-anneaux.png');
	// Kubor
	IM.add('target.png');
	IM.add('rampe-haut.jpg');
	IM.add('rampe-bas.jpg');
	// Players
	IM.add('player/dragon.png');
	IM.add('player/Sprites_Cube_Face.png');
	IM.add('player/Sprites_Flying_Rock.png');
	IM.add('player/Knight_SpritSheet.png');
	IM.add('player/Sprites_Jelly.png');
	// Feedback
	IM.add('player/Sprites_Shield.png');
	IM.add('player/Blue_Portal.png');
	IM.add('player/Red_Portal.png');
	IM.add('player/bonus.png');
	IM.add('player/malus.png');	
	// Cubes
	IM.add('cube/tron-cube.png');
	IM.add('cube/CubeMario_Sprite.png');
	IM.add('cube/Sprites_PortalCube.png');
	IM.add('cube/Creeper_SpritSheet.png');
	// Obstacles
	IM.add('BG/Lava_Single.png');
	IM.add('BG/Lava_Tile.png');
	IM.add('BG/Lava_Tile_LeftEnd.png');
	IM.add('BG/Lava_Tile_RightEnd.png');
	IM.add('BG/Rock_Obstacle.png');
	IM.add('BG/Rock_Tile1.png');
	IM.add('BG/Rock_Tile2.png');
	IM.add('BG/Rock_Tile_LeftEnd.png');
	IM.add('BG/Rock_Tile_RightEnd.png');

	return IM;
});