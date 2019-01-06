define( [ 'utils/utils.canvas', 'utils/utils.time', 'utils/utils.state', 'player', 'computer', 'ball', 'vendor/fpsmeter' ], function( canvasUtils, timeUtils, state, Player, Computer, Ball ) {
	'use strict';

	var Game = class Game {

		constructor( w, h, audio ) {
			var MS_PER_UPDATE = 13,
				self = this;

			// Viewport height and width
			this._w = w;
			this._h = h;

			// Container to append the canvas to
			this.container = document.getElementById( 'container' );
			this.controls_container = document.getElementById( 'controls' );

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
			this._entities.push( this._ball, this._paddle_1, this._paddle_2 );

			// Audio stuff
			this._audio = audio;


			this._control_keys = { };

			// Init states
			this._states = [ ];

			state.set_state( 'play', this, false, false );

			this.active_state = {
				name: function( ) {
					return state.get_active_state( self );
				},
				method_name: function( ) {
					return state.get_active_state( self ) + '_state';
				}
			};

			// Init score
			this._score = {
				p1: 0,
				p2: 0
			}

			this.create_controls( );

			this.bind_listeners( );

			this.run( MS_PER_UPDATE);
		}

		/**************************************************
			Controls
		**************************************************/

		create_controls( ) {
			var pause_btn, play_btn, pause_text, play_text,
				self = this;

			// Create play button
			play_btn = document.createElement( "button" );
			play_btn.onclick = function( ) {
				state.set_state( 'play', self );
			}
			play_text = document.createTextNode( "Play" );
			play_btn.appendChild( play_text );

			this.controls_container.appendChild( play_btn );

			// Create pause button
			pause_btn = document.createElement( "button" );
			pause_btn.onclick = function( ) {
				state.set_state( 'paused', self );
			}
			pause_text = document.createTextNode( "Pause" );
			pause_btn.appendChild( pause_text );

			this.controls_container.appendChild( pause_btn );
		}

		bind_listeners( ) {
			var self = this;

			// Listen for paddle controls
			$( document ).keydown( function( event ) {
				self._control_keys[ event.keyCode ] = true;
			}).keyup( function( event ) {
				self._control_keys[ event.keyCode ] = false;
			});
		}

		/**************************************************
			State methods
		**************************************************/

		play_state( ) {
			var i, count;

			//console.log( this._control_keys );

			if ( this._control_keys[ 80 ] === true ) {
				state.add_state( 'paused', this );
			}

			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				this._entities[ i ].update( );
			}

			this.checkCollision( );
		}

		paused_state( ) {
			// Beacsue this is in the update loop is spams and toggles pause too quick. Need to control this better. Timeout? Something.
			if ( this._control_keys[ 80 ] === true ) {
				state.pop_state( this );
			}
		}

		/**************************************************
			Transition methods
		**************************************************/

		paused_enter( ) {
			var i, count;

			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				//this._entities[ i ]._states.push( 'pause' );
				state.add_state( 'paused', this._entities[ i ] );
			}
		}

		paused_leave( ) {
			var i, count;

			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				//this._entities[ i ]._states.push( 'pause' );
				state.pop_state( this._entities[ i ] );
			}
		}

		play_enter( ) {

		}

		play_leave( ) {

		}


		/**************************************************
			State helper methods
		**************************************************/

		reset( ) {
			var i, count;
			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				this._entities[ i ].reset( );
			}
		}


		/**************************************************
			Collision methods
		**************************************************/

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
				this._ball.reflection_angle( 360 );
				this._audio.HitWall.play( ).catch( function( e ) {
					console.log( 'HitWall Error');
				});
			}
			// Hit right
			else if ( b2_x >= this._context_width ) {
				this._score.p1 += 1;
				this._audio.Lose.play( ).catch(function( ) {
					console.log( 'Lose Error');
				});

				this.reset( );
			}
			// Hit left
			else if (  b2_x <= 0 ) {
				this._score.p2 += 1;
				this._audio.Lose.play( ).catch(function( ) {
					console.log( 'Lose Error');
				});

				this.reset( );

				//this.set_state( 'pause' );
			}

			if ( p1_intersect === true && this._ball._direction === 1  ) {
				this._ball.reflection_angle( 180 );
				this._ball.switch_direction( );
				this._audio.Edd.play( ).catch(function( ) {
					console.log( 'Edd Error');
				});
			}

			if ( p2_intersect === true && this._ball._direction === -1  ) {
				this._ball.reflection_angle( 180 );
				this._ball.switch_direction( );
				this._audio.Kathleen1.play( ).catch(function( ) {
					console.log( 'Kathleen1 Error');
				});
			}
		}


		/**************************************************
			Audio methods
		**************************************************/

		playPaddleHitAudio ( ) {
			this._audio[ this._audio_clip_pointer ].play();

			if ( this._audio_clip_pointer === ( this._audio_clip_total - 1 ) ) {
				this._audio_clip_pointer = 0;
			}
			else {
				this._audio_clip_pointer++;
			}
		}


		/**************************************************
			Score methods
		**************************************************/

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


		/**************************************************
			Loop, update, render core methods
		**************************************************/

		run ( MS_PER_UPDATE ) {
			var current, elapsed, loop,
				previous = timeUtils.timestamp( ), // 113
				lag = 0.0,
				fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '90%', right: '95%' }),
				self = this;

			// Play entrance sound. Not reliable. Still need to add a "mute/play sound" button from a game menu. Need a game menu first though :P
			// Chrome has restrictions on auto-playing sounds without user input / consent.
			this._audio.Christine.play( ).catch(function( ) {
				console.log( 'Christine Error');
			});

			// The main game loop.
			loop = function ( ) {
				// Track FPS
				fpsmeter.tickStart( );

					current = timeUtils.timestamp( );
					elapsed = current - previous;
					previous = current;
					lag += elapsed;

					// Never run update more than once per MS_PER_UPDATE ( in our case 13ms ).
					while ( lag >= MS_PER_UPDATE ) {
						// This is a fixed timestep update. All vector values are increase in a linear fasion. Ie. Every tick, no matter how long has
						// passed increases the values by the same amounnt. Since we keep track of the lag, we use it in render( ) for extrapolation
						self.update( );
						lag -= MS_PER_UPDATE;
					}

					// Render entites and pass in lag for extrapolation. This create smoother motion. It does introduce the possibilty for the extrapolation
					// to be wrong sometime. This is typically less noticable than the constant studdery movement we get without it though. Set lag to 0 if you want
					// to see the difference.
					self.render( lag / MS_PER_UPDATE );

					// The benifit of running a game loop this way is:
					// 1) The game will run at the same speed no matter the quality of the clients machine.
					// 2) The results are deterministic because even with lag, the number of update( ) ticks are the same, which avoids floating point calc errors.
					// 3) If the client has a fast machine, they are not penalized by a fixed time step and can render several times between updates using extrapolation
					//    which gives them increased FPS.
					// 4) If the cleint has a slower machine they can skip renders (drop frames) but this give the CPU time to catch up by not being forced to render after
					//    every update if they are behind. The danger is when the update takes consisently more than MS_PER_UPDATE (13ms) and they never catch up.

				// Track FPS
				fpsmeter.tick();

				// Loop infinitely.
				requestAnimationFrame( loop );
			}

			// Kickoff game loop. Runs once.
			requestAnimationFrame( loop );
		}

		update( ) {
			if ( this._states.length >= 1 && typeof this[ this._states[ this._states.length - 1 ] + '_state' ] === 'function' ) {
				// Run the method assocaited with the active_state on the top of the stack.
				this[ this.active_state.method_name( ) ]( );
			}
		}

		render( lag ) {
			var i, count;

			// This prevents extrapolation on all entities while the game state is paused. Will cause shuttering when game is pause and entities are not otherwise.
			lag = ( this.active_state.name( ) === 'play' ) ? lag : 0;

			// Clear canvas befor repainting
			this.context.clearRect( 0, 0, this._w, this._h );

			// Draw scores
			this.render_score( );

			// Draw entities
			for ( i = 0, count = this._entities.length; i < count; i++ ) {
				this._entities[ i ].render( lag );
			}
		}
	} // end Game

	return Game;
});