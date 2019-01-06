define( [ 'utils/utils.state'], function( state ) {
	'use strict';

	var Computer = class Computer {

		constructor( context, Ball ) {
			this.context = context;
			this._context_height = parseInt( this.context.canvas.style.height );
			this._context_width = parseInt( this.context.canvas.style.width );

			this._paddle_height = 100;
			this._paddle_thickness = 5;
			this._paddle_gutter_offset = this._context_width - 30;

			this._y_pos = ( this._context_height / 2 ) - ( this._paddle_height / 2 );
			this._center_pos = this._y_pos + ( this._paddle_height / 2 );

			this._velocity = 9;

			this._ball = Ball;
		}
		reset ( ) {
			this._y_pos = ( this._context_height / 2 ) - ( this._paddle_height / 2 );
			this._center_pos = this._y_pos + ( this._paddle_height / 2 );

			this._velocity = 9;
		}

		calcCenter( ) {
			this._center_pos = this._y_pos + ( this._paddle_height / 2 );
		}

		// Add lag fudge factor
		update ( ) {
			var diff;

			if ( this._ball._y_pos < this._center_pos && this._y_pos > 0 ) {
				diff = this._ball._y_pos - this._center_pos;

				// Move up
				this._y_pos += Math.min( this._velocity, diff);
				this._center_pos = this._y_pos + ( this._paddle_height / 2 );
			}
			else if ( this._ball._y_pos > this._center_pos && this._y_pos < ( this._context_height - this._paddle_height ) ) {
				diff = this._ball._y_pos - this._center_pos;

				// Movedown
				this._y_pos += Math.min( this._velocity, diff );
				this._center_pos = this._y_pos + ( this._paddle_height / 2 );
			}
		}

		// Add lag fudge factor
		render ( lag ) {
			var diff, starting_point;

			diff = this._ball._y_pos - this._center_pos;
			//console.log( this._y_pos * lag );

			this.context.beginPath( );

			// no extrapolation
			//this.context.moveTo( this._paddle_gutter_offset, this._y_pos );
			//this.context.lineTo( this._paddle_gutter_offset, ( this._y_pos + this._paddle_height ) );

			starting_point = ( this._y_pos + ( Math.min( this._velocity, diff) * lag ) );



			if ( starting_point < 0 ) {
				starting_point = 0;
			}
			else if ( starting_point > this._context_height - this._paddle_height ) {
				starting_point = this._context_height - this._paddle_height;
			}
			// with extrapolation
			this.context.moveTo( this._paddle_gutter_offset, starting_point );
			this.context.lineTo( this._paddle_gutter_offset, starting_point + this._paddle_height );
			//this.context.lineTo( this._paddle_gutter_offset, ( ( this._y_pos + ( Math.min( this._velocity, diff ) * lag ) ) + this._paddle_height ) );

			this.context.lineWidth = this._paddle_thickness;
			this.context.stroke();
		}
	} // end Player

	return Computer;
});