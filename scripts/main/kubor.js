define(['conf/kubor', 'core/boilerplate', 'lib/leapmodule', 'lib/input', 'IM'],
	function(Conf, Boilerplate, LeapModule, Input, IM) {
		var Kubor = function() {

			// Initialize Kubor
			this.init = function() {
				// Define a physic element with default values
				this.transform = {
					position : {
						x: Boilerplate.scene.width/2,
						y: Boilerplate.scene.height/2
					},
					scale : {
						x: 1,
						y: 1
					},
					rotation : 0
				}
				// Contiendra la transform.position de la frame d'avant (pour calculer la distance entre les 2 points et en déduire si on arrête le mouvement)
				this.lastTransform = { position : { x : 0, y : 0 } };

				this.color = "rgba(255,0,0,.8)";
				this.img = IM.getInstance('target');
				this.platformTop = IM.getInstance('rampe-haut');
				this.platformBottom = IM.getInstance('rampe-bas');

				// Gauge
				this.gauge = {
					transform : {
						position : {
							x : null,
							y : null
						},
						scale : {
							x: 1,
							y: 1
						},
					},
					rotation : 0,
					radius : Conf.radius,
					capacity : 0
				};
				this.gaugeTimer = 0;
				this.gaugeCorridor = null;
				this.gaugeCanFillAgain = false;

				// Select items area
				this.selectArea = {
					transform : {
						position 	: 	{ x : Boilerplate.scene.width - Boilerplate.scene.width*.1, y : 0 },
						scale 		: 	{ x : 1, y : 1 },
					},
					width		: 	Boilerplate.scene.width*.1,
					height 		: 	Boilerplate.scene.height,
					rotation 	: 	0,
					color		: 	Conf.selectArea.color
				};

				this.itemSelector = null;
				this.itemUp = this.pickItemRandomlyAndPositionTo('up');
				this.itemDown = this.pickItemRandomlyAndPositionTo('down');

				this.corridorSelected = null;
			}
		}

		Kubor.prototype = {

			pickItemRandomlyAndPositionTo : function(updown, corridorId) {
				// old function
				// var idItem = randi(0, Boilerplate.getManager('Item').actions.length-1);
				// var bonusmalus = Boilerplate.getManager('Item').actions[ idItem ];
				// var action = Math.random() > 0.5 ? bonusmalus['bonus'] : bonusmalus['malus'];
				var idItem = randi(0, Boilerplate.getManager('Item').actions.length - 1);
				var action = Boilerplate.getManager('Item').actions[idItem];

				// Ajout de cet item avec un status 'mobile : false' car au début, il ne fait pas partie de la piste
				var item = Boilerplate.getManager('Item').addOne(action, idItem, corridorId);
				var scale = Boilerplate.scene.scale(item.transform);
				item.transform.position.x = this.selectArea.transform.position.x + this.selectArea.width*.575 - scale.x*.5;

				if (updown === 'up') {
					item.transform.position.y = this.selectArea.transform.position.y + this.selectArea.height*.25 - scale.y*.5;
				}
				else if (updown === 'down') {
					item.transform.position.y = this.selectArea.transform.position.y + (this.selectArea.height*.25)*3 - scale.y*.5;
				}
				item.mobile = false;

				return item;
			},

			name : "Kubor",
			update : function() {

				/**
				 * Update de la position de Kubor via la paume de la main (et la souris)
				**/

				var pos = Input.mouse;

				var lastPosX = this.transform.position.x;
				var lastPosY = this.transform.position.y;

				this.lastTransform.position.x = lastPosX;
				this.lastTransform.position.y = lastPosY;

				this.transform.position.x = pos.x;
				this.transform.position.y = pos.y;

				var hand, handPos;
				if (LeapModule.connected) {
					if (LeapModule.frame && LeapModule.frame.hands.length > 0) {
						//for (var i = 0, c = LeapModule.frame.hands.length; i < c; i++) {
							hand = LeapModule.frame.hands[0];
							handPos = LeapModule.getCoords(hand.stabilizedPalmPosition);

							this.lastTransform.position.x = lastPosX;
							this.lastTransform.position.y = lastPosY;

							this.transform.position.x = handPos.x;
							this.transform.position.y = handPos.y;
						//}
					}
				}

				var corridorObject = Boilerplate.getManager('Corridor').getByPosition( this.gauge.transform.position.y );
				
				if (corridorObject && this.itemSelector)
					corridorObject.selected = true;

				// Si la distance entre ce poitn et le dernier est < à 3, c'est qu'on ne bouge plus kubor, donc on peut lancer le timer de la jauge
				if (distance(this.lastTransform, this.transform) < 3) {
					this.updateGauge();
				}
				else {
					this.gaugeTimer = Boilerplate.controller.currentTime;
					this.gauge.capacity = Math.PI*2;
					this.gaugeCanFillAgain = true;
				}

			/*	if (this.itemSelector)
					this.updateGauge();
				else {
					this.gaugeTimer = Boilerplate.controller.currentTime;
					this.gauge.capacity = Math.PI*2;
					this.gaugeCanFillAgain = true;
				}*/

				this.gauge.transform.position.x = this.transform.position.x;
				this.gauge.transform.position.y = this.transform.position.y;


				/**
				 * Vérification de l'action tap (ou souris click) pour sélectionner l'item 'haut' ou 'bas'
				**/

				if ((LeapModule.connected && LeapModule.frame && LeapModule.frame.gestures[0] && LeapModule.frame.gestures[0].type === 'keyTap') ||
					Input.mouse.click) {

					if (this.transform.position.x > this.selectArea.transform.position.x &&
						this.transform.position.x < this.selectArea.transform.position.x + this.selectArea.width) {

						var SoundManager = Boilerplate.getManager('Sound');
						var Sound = SoundManager.conf.sounds['clic'];
						if (Sound !== undefined && Sound.object !== null) {
							Sound.object.play(false, false, 'sound');
						}
						

						// Tap dans la zone haute...
						if (this.transform.position.y > this.selectArea.transform.position.y &&
							this.transform.position.y < this.selectArea.transform.position.y + this.selectArea.height * .5) {

							var scale = Boilerplate.scene.scale(this.itemUp.transform);

							this.itemUp.transform.position.x = this.selectArea.transform.position.x + this.selectArea.width*.575 - scale.x*.5 - 19;
							this.itemDown.transform.position.x = this.selectArea.transform.position.x + this.selectArea.width*.575 - scale.x*.5;
							this.itemSelector = this.itemUp;
							this.itemSelector.from = 'up';

						}
						// Tap dans la zone basse...
						else if (this.transform.position.y > this.selectArea.transform.position.y + this.selectArea.height * .5 &&
								 this.transform.position.y < this.selectArea.height) {

							var scale = Boilerplate.scene.scale(this.itemDown.transform);

							this.itemDown.transform.position.x = this.selectArea.transform.position.x + this.selectArea.width*.575 - scale.x*.5 - 19;
							this.itemUp.transform.position.x = this.selectArea.transform.position.x + this.selectArea.width*.575 - scale.x*.5;
							this.itemSelector = this.itemDown;
							this.itemSelector.from = 'down';
						}

					}
				}

			},

			updateGauge : function() {
				
				/**
				 * PLUS BESOIN !!!
				 * Vérification si la jauge est dans un corridor depuis un certain temps. Si c'est le cas, on peut lancer le timer d'update de la jauge
				**/
				/*
				// Changement de corridor
				if (this.gaugeCorridor != corridorObject) {

					this.gaugeTimer = Boilerplate.controller.currentTime;
					this.gauge.capacity = Math.PI*2;
					this.gaugeCanFillAgain = true;

					this.gaugeCorridor = corridorObject;
				}*/

				// Remplissage de la jauge
				if (this.gaugeCanFillAgain && this.itemSelector && interval(this.gaugeTimer, Conf.gaugeTimeBeforeLaunch)) {
					this.fillGauge();
				}

				// Si la jauge n'est plus dans la zone de jeu mais dans la zone de sélection, on remet les paramètres d'update à 0
				if (this.transform.position.x > this.selectArea.transform.position.x) {
					this.gaugeTimer = Boilerplate.controller.currentTime;
					this.gauge.capacity = Math.PI*2;
					this.gaugeCanFillAgain = true;
				}

			},

			fillGauge : function() {
				/**
				 * Remplissage automatique de la jauge
				**/

				// La jauge ne s'augmente que si on est dans la zone de jeu (et non dans la zone de sélection)
				if (this.transform.position.x < this.selectArea.transform.position.x) {
					this.gauge.capacity -= Conf.gaugeFillSpeed;

					if (this.gauge.capacity <= 0) {

						this.gaugeTimer = Boilerplate.controller.currentTime;

						/*var corridorObject = Boilerplate.getManager('Corridor').getByPosition( this.gauge.transform.position.y );

						if (null !== corridorObject) {
							Boilerplate.getManager('Item').addOne( corridorObject );
						}*/

						var corridorObject = Boilerplate.getManager('Corridor').getByPosition( this.gauge.transform.position.y );

						if (null !== corridorObject) {
							// this.itemSelector.mobile.x = this.selectArea.
							if (this.itemSelector) {
								// console.log(this.itemSelector);
								this.itemSelector.mobile = true;
								// Redéfinition du x et du y en fonction du corridor sélectionné
								var scaleItem = Boilerplate.scene.scale(this.itemSelector.transform);

								this.itemSelector.transform.position.x = this.gauge.transform.position.x; //this.selectArea.transform.position.x - scaleItem.x;
								this.itemSelector.transform.position.y = corridorObject.transform.position.y + 7.5;
								this.itemSelector.corridorId = corridorObject.id;

								// On va en redéfinir un autre au pif
								if ('up' === this.itemSelector.from) {
									// On n'a plus besoin de cet item en tant que 'selector' dans notre kubor
									this.itemSelector = undefined;
									this.itemUp = this.pickItemRandomlyAndPositionTo('up', corridorObject.id);
								}
								else if ('down' === this.itemSelector.from) {
									// On n'a plus besoin de cet item en tant que 'selector' dans notre kubor
									this.itemSelector = undefined;
									this.itemDown = this.pickItemRandomlyAndPositionTo('down', corridorObject.id);
								}
							}
						}

						this.gaugeTimer = Boilerplate.controller.currentTime;
						this.gauge.capacity = Math.PI*2;
						this.gaugeCanFillAgain = false;
					}
				}

			},

			render : function() {
				this.renderSelectArea();
				// this.renderItems();

				var scale = Boilerplate.scene.scale(this.transform);
				var x = this.transform.position.x,
					y = this.transform.position.y;

				Boilerplate.scene.ctx.save();
				Boilerplate.scene.ctx.translate(x, y);
			  	Boilerplate.scene.ctx.rotate( this.transform.rotation * (Math.PI / 180) );
			  	Boilerplate.scene.ctx.translate(-x, -y);

			  	// Rendering des la position des doigts
			  	// try { this.renderIndicators(); } catch(e) {}

				// Rendering gauge evolution radius
				if (this.gaugeCanFillAgain && this.itemSelector && interval(this.gaugeTimer, Conf.gaugeTimeBeforeLaunch)) {
				  	Boilerplate.scene.ctx.fillStyle = Conf.color;
					Boilerplate.scene.ctx.beginPath();
					Boilerplate.scene.ctx.moveTo(this.gauge.transform.position.x, this.gauge.transform.position.y);
					Boilerplate.scene.ctx.arc(
						this.gauge.transform.position.x,
						this.gauge.transform.position.y,
						this.gauge.radius,
						0,
						this.gauge.capacity,
						true
					);
					Boilerplate.scene.ctx.fill();
					Boilerplate.scene.ctx.closePath();
				}

				// Rendering image target
				Boilerplate.scene.ctx.globalAlpha = (this.itemSelector ? 1 : .5);
				Boilerplate.scene.ctx.drawImage(this.img.data, this.gauge.transform.position.x - scale.x*.5, this.gauge.transform.position.y - scale.y*.5);
				Boilerplate.scene.ctx.globalAlpha = 1;

				Boilerplate.scene.ctx.restore();
			},

			renderSelectArea : function() {

				var positionTopX = this.selectArea.transform.position.x;
				var positionBottomX = this.selectArea.transform.position.x;

				if (this.itemSelector) {
					if (this.itemSelector.from === 'up')
						positionTopX -= 38;
					else if (this.itemSelector.from === 'down')
						positionBottomX -= 38
				}

				Boilerplate.scene.ctx.drawImage(this.platformTop.data, positionTopX, this.selectArea.transform.position.y);
				Boilerplate.scene.ctx.drawImage(this.platformBottom.data, positionBottomX, this.selectArea.transform.position.y + this.selectArea.height * .5);

				// Boilerplate.scene.ctx.fillStyle = this.selectArea.color;
				// Boilerplate.scene.ctx.fillRect(
				// 	this.selectArea.transform.position.x,
				// 	this.selectArea.transform.position.y,
				// 	this.selectArea.width,
				// 	this.selectArea.height
				// );
				// // Diviseur de la zone
				// Boilerplate.scene.ctx.lineWidth = 5;
				// Boilerplate.scene.ctx.strokeStyle = '#000';
				// Boilerplate.scene.ctx.beginPath();
				// Boilerplate.scene.ctx.moveTo(
				// 	this.selectArea.transform.position.x,
				// 	this.selectArea.transform.position.y + this.selectArea.height - this.selectArea.height * .5
				// );
				// Boilerplate.scene.ctx.lineTo(
				// 	this.selectArea.transform.position.x + this.selectArea.width,
				// 	this.selectArea.transform.position.y + this.selectArea.height - this.selectArea.height * .5
				// );
				// Boilerplate.scene.ctx.stroke();
				// Boilerplate.scene.ctx.closePath();
				// Boilerplate.scene.ctx.lineWidth = 1;

			},

			renderItems : function() {

				// Item selector
				if (this.itemSelector) {
					var scale = Boilerplate.scene.scale(this.itemSelector.transform);

					if (this.itemSelector.from === 'up') {
						drawRect(
							Boilerplate.scene.ctx,
							'rgba(0, 0, 0, 1)',
							this.selectArea.transform.position.x,
							this.selectArea.transform.position.y,
							this.selectArea.width,
							this.selectArea.height - this.selectArea.height * .5
							/*this.itemSelector.transform.position.x,
							this.itemSelector.transform.position.y,
							scale.x,
							scale.y*/
						);
					}
					else if (this.itemSelector.from === 'down') {
						drawRect(
							Boilerplate.scene.ctx,
							'rgba(0, 0, 0, 1)',
							this.selectArea.transform.position.x,
							this.selectArea.transform.position.y + this.selectArea.height * .5,
							this.selectArea.width,
							this.selectArea.height
							/*this.itemSelector.transform.position.x,
							this.itemSelector.transform.position.y,
							scale.x,
							scale.y*/
						);
					}
				}
			},

			renderIndicators : function() {

				if (!LeapModule.frame) {
					throw new Error('No frame caught');
				}

				// Browsing all hands
				var hand, handPos, finger, fingerPos;

				for( var i=0; i < LeapModule.frame.hands.length; i++ ) {
					hand = LeapModule.frame.hands[i];

					// Getting 2D palm position
					handPos = LeapModule.getCoords( hand.stabilizedPalmPosition );

					// Drawing the palm
					Boilerplate.scene.ctx.strokeStyle = "#0f0";
					Boilerplate.scene.ctx.beginPath();
					Boilerplate.scene.ctx.arc(handPos.x, handPos.y, 25, 0, Math.PI*2);
					Boilerplate.scene.ctx.closePath();
					Boilerplate.scene.ctx.stroke();

					// Browsing fingers in one hand
					for( var j = 0; j < hand.fingers.length; j++ ) {
						finger = hand.fingers[j];

						// Getting 2D finger position
						fingerPos = LeapModule.getCoords( finger.stabilizedTipPosition );

						// Drawing the finger
						Boilerplate.scene.ctx.strokeStyle = "#0f0";
						Boilerplate.scene.ctx.beginPath();
						Boilerplate.scene.ctx.arc(fingerPos.x, fingerPos.y, 10, 0, Math.PI*2);
						Boilerplate.scene.ctx.closePath();
						Boilerplate.scene.ctx.stroke();
					}
				}
			}
		}

		return Kubor;
	}
);