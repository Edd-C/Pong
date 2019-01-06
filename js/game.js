define( [ 'utils/utils.canvas', 'utils/utils.time', 'player', 'computer', 'ball', 'vendor/fpsmeter' ], function( canvasUtils, timeUtils, Player, Computer, Ball ) {
	'use strict';

	var Game = class Game {

		constructor( w, h, audio ) {
			var MS_PER_UPDATE = 13;

			this._w = w;
			this._h = h;

			//this.config = config || { };

			// Instantiate an empty state object
			this.state = { };
			this._state = 'play';

			this.container = document.getElementById( 'container' );

			// Generate a canvas and store it as our viewport
			this.viewport = canvasUtils.generateCanvas( w, h );
			this.viewport.id = "gameViewport"; // give the canvas an ID for easy CSS/JS targeting

			// Get and store the canvas context as a global
			this.context = this.viewport.getContext( '2d' );
			this._context_height = parseInt( this.context.canvas.style.height );
			this._context_width = parseInt( this.context.canvas.style.width );

			// Append our viewport into a container in the dom
			this.container.insertBefore( this.viewport, this.container.firstChild );

			// Setup entites
			this._ball = new Ball( this.context );

			this._paddle_1 = new Player( this.context );
			this._paddle_2 = new Computer( this.context, this._ball );

			this._entities = [ ];
			this._entities.push( this._paddle_1, this._paddle_2, this._ball );

			// Audio stuff
			this._audio = audio;

			this._score = {
				p1: 0,
				p2: 0
			}

			//this._countdown_initial_time;

			this.run( MS_PER_UPDATE);
		}

		countdown( elapsed ) {
			var self = this;
			this._state = 'pause';

			// 3
			setTimeout( function () { ( function( ) {

				// 2
				setTimeout( function () { ( function( ) {

					// 1
					setTimeout( function ( ) { ( function( ) {

						// go
						setTimeout( function ( ) { ( function( ) {
							self._state = 'play';
							console.log('go');
						})(); }, 1000);

						console.log('1');
					})(); }, 1000);

					console.log('2');
				})(); }, 1000);

				console.log('3');
			})(); }, 1000);



		}

		intersects ( a, b, c, d, p, q, r, s ) {
			var det, gamma, lambda;

			det = ( c - a ) * ( s - q ) - ( r - p ) * ( d - b );

			if ( det === 0 ) {
 				return false; // no intersect
			}
			else {
				// further determine if interesct exists
				lambda = ( ( s - q ) * ( r - a ) + ( p - r ) * ( s - b ) ) / det;
				gamma = ( ( b - d ) * ( r - a ) + ( c - a ) * ( s - b ) ) / det;

				return ( 0 < lambda && lambda < 1 ) && ( 0 < gamma && gamma < 1 );
			}
		}

		checkCollision ( ) {
			var p1_top_x, p1_top_y, p1_bot_x, p1_bot_y,
				p2_top_x, p2_top_y, p2_bot_x, p2_bot_y,
				b1_x, b1_y, b2_x, b2_y,
				p1_intersect, p2_intersect
				self = this;

			p1_top_x = this._paddle_1._paddle_gutter_offset;
			p1_top_y = this._paddle_1._y_pos;
			p1_bot_x = this._paddle_1._paddle_gutter_offset;
			p1_bot_y = this._paddle_1._y_pos + this._paddle_1._paddle_height;

			p2_top_x = this._paddle_2._paddle_gutter_offset;
			p2_top_y = this._paddle_2._y_pos;
			p2_bot_x = this._paddle_2._paddle_gutter_offset;
			p2_bot_y = this._paddle_2._y_pos + this._paddle_2._paddle_height;

			b1_x = this._ball._prev_x;
			b1_y = this._ball._prev_y;
			b2_x = this._ball._x_pos;
			b2_y = this._ball._y_pos;

			p1_intersect = this.intersects( p1_top_x, p1_top_y, p1_bot_x, p1_bot_y, b1_x, b1_y, b2_x, b2_y );

			p2_intersect = this.intersects( p2_top_x, p2_top_y, p2_bot_x, p2_bot_y, b1_x, b1_y, b2_x, b2_y );

			// Hit bottom or top
			if ( b2_y >= this._context_height || b2_y <= 0 ) {
				this._ball.reflectionAngle( 360 );
				this._audio.HitWall.play( ).catch( function( e ) {
					console.log( 'HitWall Error');
				});
			}
			// Hit right
			else if ( b2_x >= this._context_width ) {
				this._score.p1 += 1;
				this._state = 'scored';
				this._audio.Lose.play( ).catch(function( ) {
					console.log( 'Lose Error');
				});

				//this.reset( );
			}
			// Hit left
			else if (  b2_x <= 0 ) {
				this._score.p2 += 1;
				this._state = 'scored';
				this._audio.Lose.play( ).catch(function( ) {
					console.log( 'Lose Error');
				});

				this.reset( );
			}

			if ( p1_intersect === true && this._ball._direction === 1  ) {
				this._ball.reflectionAngle( 180 );
				this._ball.switchDirection( );
				this._audio.Edd.play( ).catch(function( ) {
					console.log( 'Edd Error');
				});
			}

			if ( p2_intersect === true && this._ball._direction === -1  ) {
				this._ball.reflectionAngle( 180 );
				this._ball.switchDirection( );
				this._audio.Kathleen1.play( ).catch(function( ) {
					console.log( 'Kathleen1 Error');
				});
			}
		}

		playPaddleHitAudio ( ) {
			this._audio[ this._audio_clip_pointer ].play();

			if ( this._audio_clip_pointer === ( this._audio_clip_total - 1 ) ) {
				this._audio_clip_pointer = 0;
			}
			else {
				this._audio_clip_pointer++;
			}
		}

		run ( MS_PER_UPDATE ) {
			this._audio.Christine.play( ).catch(function( ) {
				console.log( 'Christine Error');
			});

			var current, elapsed, loop,
				previous = timeUtils.timestamp( ), // 113
				lag = 0.0,
				fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '90%', right: '95%' }),
				self = this;


			loop = function ( ) {

				fpsmeter.tickStart( );

					if ( self._state === 'play' ) {
						current = timeUtils.timestamp( );
						elapsed = current - previous;
						previous = current;
						lag += elapsed;


						while ( lag >= MS_PER_UPDATE ) {
							self.update( );
							lag -= MS_PER_UPDATE;
						}

						self.render( lag / MS_PER_UPDATE );
					}
					else if ( self._state === 'scored' ) {
						console.log( 'scored' );
					}


				fpsmeter.tick();

				requestAnimationFrame( loop );
			}

			requestAnimationFrame( loop );


		}

		update( ) {
			var i, count;

			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				this._entities[ i ].update( );
			}

			this.checkCollision( );
		}

		render( lag ) {
			var i, count;

			this.context.clearRect( 0, 0, this._w, this._h );

			this.render_score( );

			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				this._entities[ i ].render( lag );
			}
		}

		reset( ) {
			var i, count;
			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				this._entities[ i ].reset( );
			}
			this._state = 'play';
		}

		render_score ( ) {
			// Center line
			this.context.beginPath( );
			this.context.moveTo( this._context_width / 2, 0 );
			this.context.lineTo( this._context_width / 2, this._context_height );
			this.context.lineWidth = this._paddle_thickness;
			this.context.lineWidth = 1;
			this.context.stroke();

			// Player 1
			this.context.font = "30px Arial";
			this.context.textAlign = "end";
			this.context.fillText( this._score.p1 + " ", ( this._context_width / 2 ), 50 );

			// Player 2
			this.context.font = "30px Arial";
			this.context.textAlign = "start";
			this.context.fillText( " " + this._score.p2, ( this._context_width / 2 ), 50 );

		}

	} // end Game

	return Game;
});