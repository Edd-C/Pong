define( [ 'vendor/jquery' ], function( ) {
	'use strict';

	var Player = class Player {

		constructor( context ) {
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

			this.bindListeners( );
		}

		reset( ) {
			this._y_pos = ( this._context_height / 2 ) - ( this._paddle_height / 2 );

			this._speed = 10;
		}

		bindListeners( ) {
			var self = this;

			// Listen for paddle controls
			$( document ).keydown( function( event ) {
				self._movement_keys[ event.keyCode ] = true;
			}).keyup( function( event ) {
				self._movement_keys[ event.keyCode ] = false;
			});
		}

		update ( ) {
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

		render ( lag ) {
			this.context.beginPath( );
			// Still need to add extraploation
			this.context.moveTo( this._paddle_gutter_offset, this._y_pos );
			this.context.lineTo( this._paddle_gutter_offset, ( this._y_pos + this._paddle_height ) );
			this.context.lineWidth = this._paddle_thickness;
			this.context.stroke();
		}
	} // end Player

	return Player;
});