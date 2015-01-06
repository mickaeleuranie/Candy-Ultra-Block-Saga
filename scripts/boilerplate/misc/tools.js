/**
 * Functions.js
 **/

/*RUNTIME LOOP*/
/************************************************************************************/
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback, elements) {
					window.setTimeout(callback, 1000/40);
				}
	})();
}

/*DEFINE ALIASES*/
/**********************************************************************************/
// querySelectorAll shortcut
function $(selector) {
	var qsa = document.querySelectorAll(selector);
	return (qsa.length === 1 ? qsa[0] : qsa);
}
// console.log shortcut
function log(m) {return console.log(m);}
// console.warn shortcut
function warn(m) {return console.warn(m);}
// log a todo
function todo(m) {return console.debug("[TODO] : "+m);}

/*STRINGS MANIPULATION*/
/************************************************************************************/
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};


/*CLASS MANIPULATION*/
/************************************************************************************/
// Check if element e has class c
function hasClass(e,c) {return e.className.match(new RegExp('(\\s|^)'+c+'(\\s|$)'));}
// Add class c to element e
function addClass(e,c) {
	if (e.length === undefined)
		e = [e];
	for (x in e)
		if (!isNaN(x))
			if (!this.hasClass(e[x],c))
				e[x].className = (e[x].className+" "+c).trim();
}
// Remove classe c from element e
function removeClass(e,c) {
	if (e.length === undefined)
		e = [e];
	for (x in e)
		if (!isNaN(x))
			if (hasClass(e[x],c))
				e[x].className=e[x].className.replace(new RegExp('(\\s|^)'+c+'(\\s|$)'),' ').trim();
}

/*FORM MANIPULATION*/
/************************************************************************************/
// Get selected option from a select input
function getSelected(s) {return s.options[s.selectedIndex];}

/*DEBUG CONSOLE*/
/**********************************************************************************/
// Print something in the HTML
function debug(message) {
	var line = document.createElement('p');
	line.textContent = message;
	$('#debug').childNodes[1].appendChild(line);
}

/*IM MANAGER*/
/************************************************************************************/
// Get name from filename (eg. image.png > image)
function getIMName(src) {return src.split('.')[0];}

/*ARRAY*/
/************************************************************************************/
// Pickup a random value into an Array
Array.prototype.pickup = Array.prototype.pickup || function(){return this[Math.floor(Math.random()*this.length)];}
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
Array.prototype.contains = Array.prototype.contains || function(value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return true;
        }
    }
    return false;
}
Array.prototype.shuffle = function(n)
{
	if(!n)
		n = this.length;
	if(n > 1) {
		var i = randi(0, n-1);
		var tmp = this[i];
		this[i] = this[n-1];
		this[n-1] = tmp;
		this.shuffle(n-1);
	}
}

/*OBJECT*/
/************************************************************************************/
// Convert object properties in a simple string
function o2s(obj) {
	var ret = [];
	for(var pname in obj) {
		ret.push(pname);
	}
	return '{'+ret.join(', ')+'}';
}
// Check if an object has a property
Object.prototype.has = Object.prototype.has || function(property, cbValue) {
	return this.hasOwnProperty(property) ? this[property] : cbValue;
}
// Print informations about object's properties
Object.prototype.help = Object.prototype.help || function(type) {
	var properties = [];

	for(var propertyName in this) {
		var propertyType = typeof this[propertyName];
		if(typeof properties[propertyType] == "undefined") {
			properties[propertyType] = [];
		}
		properties[propertyType].push(propertyName);
	}

	if(typeof type != "undefined") {
		type = type.toLowerCase();
		if(typeof properties[type] != "undefined") {
			log("Object has "+properties[type].length+" properties of type : "+type);
			for(var iP = 0, cP = properties[type].length; iP < cP; iP++) {
				log(" - "+properties[type][iP]);
			}
		}
		else {
			warn("There is no property of type : "+type);
		}
	}
	else {
		for(var propertyType in properties) {
			if(typeof properties[propertyType] != "object") {
				continue;
			}
			log("Object has "+properties[propertyType].length+" properties of type : "+propertyType);
			for(var iP = 0, cP = properties[propertyType].length; iP < cP; iP++) {
				log(" - "+properties[propertyType][iP]);
			}
		}
	}
}
// Get configuration for an objet
Object.prototype.configure = Object.prototype.configure || function(conf) {
	// Configure object according to configuration parameter
	for(property in conf) {
		var hasDefault = this._ !== undefined;
		// Exclude functions
		if(typeof conf[property] !== "function") {
			// Set a current property
			this[property] = conf[property];
			if(hasDefault === true && this._.contains(property) === true) {
				// Set a default property
				this["_"+property] = conf[property];
			}
		}
	}
}
// Check if f is a function
function isFunction(f) {
	var getType = {};
	return f && getType.toString.call(f) === '[object Function]';
}

/*OBJECT PROGRAMMING*/
/************************************************************************************/
// Combine 2 objects in a new one
// Do not overwrite A's property
function sum(objA, objB) {
	var obj = {};

	for(var prop in objA) {
		obj[prop] = objA[prop];
	}
	for(var prop in objB) {
		if(obj[prop] === undefined) {
			obj[prop] = objB[prop];
		}
	}

	return obj;
}

// Object A prototype extends properties of Object B prototype
function extendPrototype(objA, objB) {
	objA.prototype = sum(objA.prototype, objB.prototype);
}

/*STRING*/
/************************************************************************************/
function ucfirst(string) { return string.charAt(0).toUpperCase() + string.slice(1);}
function s(msg) { return msg;}
function p(single, plural, count) { return count > 1 ? plural : single;}
/*NUMERIC*/
/************************************************************************************/
// Check a variable is a number
function isNumber(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value == 'number') {
        return true;
    }
    return !isNaN(value - 0);
}
// Return a random value between 'a' and 'b'
function rand(a, b) {return a + Math.random() * (b - a);}
// Return a random integer between 'a' and 'b'
function randi(a, b) {return Math.round(a + Math.random() * (b - a));}
// Check for an interval
function interval(t, i) {return (+new Date() - t) / 1000 > i;}

/*PHYSICS*/
/************************************************************************************/
// Get distance from A[x,y] to B[x,y]
function distance(a, b) {
	return Math.sqrt((a.position.x-b.position.x)*(a.position.x-b.position.x) + (a.position.y-b.position.y)*(a.position.y-b.position.y));
}
// Detect collision between two objects' transform "a" and "b"
// Assuming object has a transform physic object
function collide(a, b, unit) {
	return !(
		b.position.x >= a.position.x + a.scale.x * unit ||
		b.position.x + b.scale.x * unit <= a.position.x ||
		b.position.y >= a.position.y + a.scale.y * unit ||
		b.position.y + b.scale.y * unit <= a.position.y
	);
}
// Move an object from o[x,y] to o.target[x,y]
// Assuming object has width,height,speed,target properties
function move(o) {
	// Get angle to target point
	var angle = Math.atan2(o.target.y - (o.y+o.height/2), o.target.x - (o.x+o.width/2));
	// Increment position to the target according to speed
	o.x += Math.cos(angle) * o.speed;
	o.y += Math.sin(angle) * o.speed;
}

/*GRAPHICS*/
/************************************************************************************/
// Draw rectangle
function drawRect(ctx,c,x,y,w,h) {
	// Set fill color
	ctx.fillStyle = c;
	// Draw a filled rectangle
	ctx.fillRect(x, y, w, h);
}
// Draw arc from [x,y], with r radius, from angle s to e
function drawArc(ctx,c,x,y,r,s,e,l) {
	// Create path
	ctx.beginPath();
	ctx.arc(x, y, r, s, e, false);
	ctx.closePath();
	// Set graphics & draw
	ctx.lineWidth = l;
	ctx.strokeStyle = c;
	ctx.stroke();
}
// Draw an ellipse
function drawEllipse(ctx,c,x,y,w,h) {
	// Set positions
	var k = .5522848,	  // kappa
		ox = (w / 2) * k, // control point offset horizontal
		oy = (h / 2) * k, // control point offset vertical
		xe = x + w,       // x-end
		ye = y + h,       // y-end
		xm = x + w / 2,   // x-middle
		ym = y + h / 2;   // y-middle
	// Create path
	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	ctx.closePath();
	// Set graphics & draw
	ctx.strokeStyle = c;
	ctx.stroke();
}
// Draw an ellipse starting to center
function drawEllipseByCenter(ctx,c,cx,cy,w,h) {
	drawEllipse(ctx, c, cx - w/2.0, cy - h/2.0, w, h);
}

function drawLine(ctx,ax,ay,bx,by) {
	ctx.beginPath();
	ctx.moveTo(ax, ay);
	ctx.lineTo(bx, by);
	ctx.stroke();
}