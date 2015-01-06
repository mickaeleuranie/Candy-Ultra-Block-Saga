/*Define require configuration paths*/
requirejs.config({
	"paths"	: {
		"core"			: "../boilerplate/core",
		"lib"			: "../boilerplate/lib",
		"misc"			: "../boilerplate/misc",
		"conf"			: "../conf",
		"leap"			: "../boilerplate/lib/leap/leap-0.2.2.min",
		"lib/leapmodule": "../boilerplate/lib/leapmodule",
		"lib/IIG"		: "../boilerplate/lib/IIG",
        "buzz"      	: "../boilerplate/lib/buzz",
	},
	"shim" : {
		"leap" : {
			exports : "Leap"
		},
		"lib/leapmodule" : {
			deps : ['leap']
		},
		"lib/IIG" : {
			exports : 'IIG'
		},
		"IM" : { // Image Manager renvoyé par IIG.ImagesManager()
			deps : ['lib/IIG']
		},
        buzz    :   {
            exports     : "buzz",
            deps        : []
        }
	}
});

/*Main page*/
require(['core/boilerplate', 'IM', 'game'], function (Boilerplate, IM, Game) {
	
	// Une fois tous les assets graphiques chargés, on lance le jeu !
	IM.loadAll(function() {
		// Initialize boilerplate
		Boilerplate.init(Game);
	});

});