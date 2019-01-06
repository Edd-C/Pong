define( [ 'utils/utils.state', 'vendor/jquery' ], function( state ) {
	'use strict';

	var Player = class Player {

		constructor( context ) {
			var self = this;

			this.context = context;
			this._context_height = parseInt( this.context.canvas.style.height );
			this._context_width = parseInt( this.context.canvas.style.width );

			this._paddle_height = 100;
			this._paddle_thickness = 5;
			this._paddle_gutter_offset = 30;

			this._y_pos = ( this._context_height / 2 ) - ( this._paddle_height / 2 );

			this._speed = 10;
			this._is_moving = false;

			this._movement_keys = { };

			this._states = [ ];

			state.set_state( 'play', this );

			this.active_state = {
				name: function( ) {
					return state.get_active_state( self );
				},
				method_name: function( ) {
					return state.get_active_state( self ) + '_state';
				}
			};

			this.bind_listeners( );
		}

		/**************************************************
			State methods
		**************************************************/

		play_state( ) {
			if ( this._movement_keys[ 38 ] && this._y_pos > 0 || this._movement_keys[ 87 ] && this._y_pos > 0 ) {
				this._y_pos -= this._speed;
				this._is_moving = true;
			}
			else if ( this._movement_keys[ 40 ] && this._y_pos < parseInt( this.context.canvas.style.height ) - this._paddle_height || this._movement_keys[ 83 ]
				&& this._y_pos < parseInt( this.context.canvas.style.height ) - this._paddle_height ) {
				this._y_pos += this._speed;
				this._is_moving = true;
			}
			else {
				this._is_moving = false;
			}
		}

		/**************************************************
			Transition methods
		**************************************************/


		/**************************************************
			State helper methods
		**************************************************/

		reset( ) {
			this._y_pos = ( this._context_height / 2 ) - ( this._paddle_height / 2 );

			this._speed = 10;
		}


		/**************************************************
			Movement methods
		**************************************************/

		bind_listeners( ) {
			var self = this;

			// Listen for paddle controls
			$( document ).keydown( function( event ) {
				self._movement_keys[ event.keyCode ] = true;
			}).keyup( function( event ) {
				self._movement_keys[ event.keyCode ] = false;
			});
		}


		/**************************************************
			Game loop methods
		**************************************************/

		update ( ) {
			// If there is a state on the stack
			if ( this._states.length >= 1 && state.has_state( this.active_state.method_name( ), this ) ) {
				// Run the method assocaited with the active_state on the top of the stack.
				this[ this.active_state.method_name( ) ]( );
			}
		}

		render ( lag ) {
			this.context.beginPath( );
			// Still need to add extraploation. Do I?
			this.context.moveTo( this._paddle_gutter_offset, this._y_pos );
			this.context.lineTo( this._paddle_gutter_offset, ( this._y_pos + this._paddle_height ) );
			this.context.lineWidth = this._paddle_thickness;
			this.context.stroke( );
		}
	} // end Player

	return Player;
});