define(['core/boilerplate', 'leap'], function(Boilerplate, Leap) {

	var leapmodule = {
		plugged : false,
		connected : false,
		controller : null,
		frame : null
	};

	leapmodule.controller = new Leap.Controller({
		frameEventName : 'animationFrame',
		enableGestures : true
	});
	
	// Controller has been connected to the websocket server
	leapmodule.controller.on( 'connect' , function() {
		leapmodule.connected = true;

		console.info('leapmodule.js - device is connected to websocket server');
	});

	// Leap device has been connected
	leapmodule.controller.on( 'deviceConnected' , function() {
		leapmodule.plugged = true;

		console.info('leapmodule.js - device plugged');
	});

	// Leap device has been disconnected
	leapmodule.controller.on( 'deviceDisconnected' , function() {
		leapmodule.plugged = false;

		console.info('leapmodule.js - device unplugged');
	});

	// Each frame captured by the device is saved into the leapmodule.frame property
	leapmodule.controller.on('frame', function(frame) {
		leapmodule.frame = frame;
	});

	var iBox, top, left, x, y, coords = {};
	// Function to call to get convert 3D coords to 2D ones, to draw them on a canvas
	leapmodule.getCoords = function( leapPos ) {

		if (!leapPos instanceof Array/* || leapPos.length !== 3*/)
			throw new Error('leapmodule - parameter `leapPos` seems not correct');

		// Find the origin of the leap interaction box
		iBox = leapmodule.frame.interactionBox;

		if (!iBox)
			throw new Error('leapmodule - couldn\'t fetch the LEAP interaction box');

		// To get the top and left, we simply define a variable that is the interaction box, find its center in the y position: iBox.center[1] and add half its size in the y axis: iBox.size[1]/2. The exact same thing can be done in order to determine the left side of the interaction area. However to get the left side we need to subtract half of the box size, because the Leap Coordinate system x-axis vector points to the right.
		top = iBox.center[1] + iBox.size[1] * .5;
		left = iBox.center[0] - iBox.size[0] * .5;

		// Now that we've found the left and top parts of the coordinate system, we can write the Leap Position in terms of this new origin by just subtracting it from the Leap Position:
		x = leapPos[0] - left;
		y = leapPos[1] - top;

		// Scaling properly to the canvas
		x /= iBox.size[0];
		y /= iBox.size[1];

		x *= Boilerplate.scene.canvas.width;
		y *= Boilerplate.scene.canvas.height;

		coords = {
			x : x * .7,
			y : -y
		};

		return coords;

	}

	return leapmodule;

});