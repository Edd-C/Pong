define( [ 'utils/utils.state'], function( state ) {
	'use strict';

	var Ball = class Ball {

		constructor( context ) {
			this._context = context;
			this._context_height = parseInt( this._context.canvas.style.height );
			this._context_width = parseInt( this._context.canvas.style.width );

			// movement
			this._speed = 9;
			this._acceleration = 0.003;

			this._x_vel;
			this._y_vel;

			this._direction = -1; // 1 == right; -1 == left;

			this._angle = 30;

			this._x_pos = this._context_width / 2;
			this._y_pos = this._context_height / 2;

			this._prev_x;
			this._prev_y;

			this.active_states = [ ];

			state.setState( 'play', this );
		}


		/**************************************************
			State methods
		**************************************************/

		play_state( ) {
			var vel = this.getVelocity( this._angle );

			this._prev_x = this._x_pos;
			this._prev_y = this._y_pos;
			this.accelerate( );

			this._x_pos += vel.x;
			this._y_pos -= vel.y;
		}

		/**************************************************
			State helper methods
		**************************************************/

		reset ( ) {
			// movement
			this._speed = 9;
			this._acceleration = 0.003;

			this._direction = -1; // 1 == right; -1 == left;

			this._angle = 30;

			this._x_pos = this._context_width / 2;
			this._y_pos = this._context_height / 2;
		}


		/**************************************************
			Movement methods
		**************************************************/

		switchDirection( ) {
			this._direction *= -1;
		}

		getVelocity( angle ) {
			var angle = this.toDegrees( angle ),
				vel = {
					x: null,
					y: null
				};

			vel.y = this._speed * ( Math.sin( angle ) );
			vel.x = this._speed * ( Math.cos( angle ) );

			return vel;
		}

		toDegrees ( angle ) {
			return angle * ( Math.PI / 180 );
		}

		reflectionAngle ( i ) {
			this._angle = i - this._angle;
		}

		accelerate ( ) {
			if ( Math.sign( this._speed) === 1 ) {
				this._speed = ( this._speed + this._acceleration ) * 1.001;
			}
			else {
				this._speed -= this._acceleration;
			}
		}


		/**************************************************
			Game loop methods
		**************************************************/

		update( ) {
			// If there is a state on the stack
			if ( this.active_states.length >= 1 ) {
				// Run the method assocaited with the active_state on the top of the stack.
				this[ this.active_states[ this.active_states.length - 1 ] + '_state' ]( );
			}
		}

		render ( lag ) {
			var vel = this.getVelocity( this._angle );

			this._context.beginPath();
			this._context.arc( this._x_pos + ( vel.x * lag ), this._y_pos - ( vel.y * lag ), 10, 0, 2 * Math.PI );
			this._context.stroke
			this._context.fillStyle = "black";
			this._context.fill();
		}
	} // end Player

	return Ball;
});