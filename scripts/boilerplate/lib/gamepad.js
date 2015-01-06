define(["core/boilerplate", "core/manager"], function(Boilerplate, Manager) {

	// Define Gamepad object
	var Gamepad = function() {
		// Reference to the real array from gamepad api
		this.pad = undefined;
		// Flag if gamepad is really connected
		this.connected = false;
		// Index to do the ... konami code !!!
		this.iKonami = 0;
		// Define two axes with horizontal and vertical input
		this.axes = {
			left : {x : 0, y : 0},
			right : {x : 0, y : 0}
		}
		// Define 16 buttons
		this.buttons = {
			// 4 action buttons (AXBY, croix-carré-rond-triangle, etc.)
			face : [false,false,false,false],
			// Buttons on the back of the pad
			shoulder : {
				// LEFT
				left : {
					button : false,
					trigger : false
				},
				// RIGHT
				right : {
					button : false,
					trigger : false
				}
			},
			// SELECT
			select : false,
			// START
			start : false,
			// STICKS
			stick : {
				left : false,
				right : false
			},
			// D-pad (directionnal cross)
			pad : {
				top : false,
				bottom : false,
				left : false,
				right : false
			}
		}

		// Initialize a gamepad
		this.init = function() {
		}

		// Update a gamepad
		this.update = function() {

			// If the pad is deconnected
			if(this.connected === false) {
				// Can't do anything
				return;
			}

			// Get axes
			this.getAxes();
			this.getButtons();
			
			this.getKonami(this.iKonami);	
		}
	}

	Gamepad.prototype = {
		name : "Gamepad",
		// Get axes for one pad
		getAxes : function() {
			// LEFT AXIS
			// Get horizontal input if over dead zone
			this.axes.left.x = ( Math.abs(0 - this.pad.axes[0]) > GamepadManager.dead) ? this.pad.axes[0] : 0;
			// Get vertical input if over dead zone
			this.axes.left.y = ( Math.abs(0 - this.pad.axes[1]) > GamepadManager.dead) ? this.pad.axes[1] : 0;
			// RIGHT AXIS
			// Get horizontal input if over dead zone
			this.axes.right.x = ( Math.abs(0 - this.pad.axes[2]) > GamepadManager.dead * 2) ? this.pad.axes[2] : 0;
			// Get vertical input if over dead zone
			this.axes.right.y = ( Math.abs(0 - this.pad.axes[3]) > GamepadManager.dead * 2) ? this.pad.axes[3] : 0;
		},
		// Get buttons for one pad
		getButtons : function() {
			this.isPressed = false;

			// 4 action buttons (AXBY, croix-carré-rond-triangle, etc.)
			this.buttons.face[0] = this.pad.buttons[0] === 1;
			this.buttons.face[1] = this.pad.buttons[2] === 1;
			this.buttons.face[2] = this.pad.buttons[3] === 1;
			this.buttons.face[3] = this.pad.buttons[1] === 1;

			// Buttons on the back of the pad
			// LEFT
			this.buttons.shoulder.left.button = this.pad.buttons[4] === 1;
			this.buttons.shoulder.left.trigger = this.pad.buttons[6] === 1;
			// RIGHT
			this.buttons.shoulder.right.button = this.pad.buttons[5] === 1;
			this.buttons.shoulder.right.trigger = this.pad.buttons[7] === 1;

			// Select button on the face
			this.buttons.select = this.pad.buttons[8] === 1;
			// Start button on the face
			this.buttons.start = this.pad.buttons[9] === 1;

			// Press stick
			this.buttons.stick.left = this.pad.buttons[10] === 1;
			this.buttons.stick.right = this.pad.buttons[11] === 1;

			// D-pad
			this.buttons.pad.top = this.pad.buttons[12] === 1;
			this.buttons.pad.bottom = this.pad.buttons[13] === 1;
			this.buttons.pad.left = this.pad.buttons[14] === 1;
			this.buttons.pad.right = this.pad.buttons[15] === 1;				
		},
		getKonami : function(index) {

			var continueKonami = false;

			if(index !== undefined) {
				this.iKonami = index;
			}

			switch(this.iKonami) {
				// ↑↑↓↓←→←→BA
				case 0 : if(this.buttons.pad.top === true) continueKonami = true; break;
				case 1 : if(this.buttons.pad.top === true) continueKonami = true; break;
				case 2 : if(this.buttons.pad.bottom === true) continueKonami = true; break;
				case 3 : if(this.buttons.pad.bottom === true) continueKonami = true; break;
				case 4 : if(this.buttons.pad.left === true) continueKonami = true; break;
				case 5 : if(this.buttons.pad.right === true) continueKonami = true; break;
				case 6 : if(this.buttons.pad.left === true) continueKonami = true; break;
				case 7 : if(this.buttons.pad.right === true) continueKonami = true; break;
				case 8 : if(this.buttons.face[3] === true) continueKonami = true; break;
				case 9 : if(this.buttons.face[0] === true) continueKonami = true; break;
				// Show the squirrel !!
				case 10: Boilerplate.konami = +new Date() + 250;
					this.iKonami = 0;
			}

			if(continueKonami === true) {
				this.iKonami ++
			}
		}
	}

	// Define Gamepad object
	var GamepadManager = new Manager(Gamepad);

	// Before initialization
	GamepadManager.cbInit = function() {
		// Get reference of method to get gamepads
		navigator.getGamepads = navigator.webkitGetGamepads || navigator.webkitGamepads;
	}
	// After initialization
	GamepadManager.caInit = function() {		
		// Save number of pads from configuration
		GamepadManager.count = GamepadManager.entities.length;

		// Define dead zone
		GamepadManager.dead = 0.15;
	}
	// Before update
	GamepadManager.cbUpdate = function() {
		// Get pads which are connected
		var pads = [],
			gamepads = navigator.getGamepads();

		// For each entity
		for(var i = 0, c = this.entities.length; i < c; i++) {
			// Reference to real gamepad from api
			this.entities[i].pad = gamepads[i];
			this.entities[i].connected = gamepads[i] !== undefined;

			if(this.entities[i].connected === true) {
				pads.push("Pad "+(i+1));
			}
		}

		// Need debug ?
		if(Boilerplate.conf.verbose === true) {
			// Show pads connected
			debug("Pads : " + pads.length + "/" + this.count + " connected ["+pads.toString()+"]");
		}
	}

	GamepadManager.help = function() {
		log("##############");
		log("GAMEPAD README");
		log("##############");
		log("Get axis with : axes.'left/right'.'dimension' (eg. axes.left.x = [-1,1])");
		log("List of buttons :");
		log(" - face.[0,1,2,3]");
		log(" - shoulder.'left/right'.'button/trigger'");
		log(" - shoulder.'left/right'.'button/trigger'");
		log(" - select");
		log(" - start");
		log(" - stick.'left/right'");
		log(" - pad.'top/bottom/left/right'");
		log("Axis are analogics, buttons are binary")
		log("##############");
	}

	return GamepadManager;
});