define({

	/**************************************************
		State methods
	**************************************************/

	set_state: function set_state( state_name, instance, do_leave, do_enter ) {
		var do_leave = ( typeof do_leave !== 'undefined') ? do_leave : true,
			do_enter = ( typeof do_enter !== 'undefined') ? do_enter : true,
			has_leave = this.has_leave_transition( state_name, instance ),
			has_enter = this.has_enter_transition( state_name, instance ),
			current_state = false;

		// Set current_state if one exists.
		if ( instance._states.length > 0 ) {
			current_state = instance._states[ instance._states.length - 1 ];
		}

		// Only switch states if the current_state and new state are different.
		if ( state_name !== current_state ) {
			// Do enter transition
			if ( has_enter === true && do_enter === true ) {
				// Push the state to the 'transitions' array.
				this.queue_transition( state_name, instance, 'enter' );
			}

			// Clear stack and set the new state
			instance._states = [ state_name ];

			// Do leave transition
			if ( current_state !== false && has_leave === true && do_leave === true ) {
				// Push the state to the 'transitions' array.
				this.queue_transition( current_state, instance, 'leave' );
			}
		}
		else {
			console.log( 'State change ignored. New and current state are the same.' );
		}
	},

	add_state: function add_state( state_name, instance, do_leave, do_enter ) {
		var do_leave = do_leave || true,
			do_enter = do_enter || true;
		// Do leave transition

		// Add a new state to the top of the stack
		instance._states.push( state_name );

		// Do leave transition

	},

	pop_state: function pop_state( instance, do_leave, do_enter ) {
		var do_leave = do_leave || true,
			do_enter = do_enter || true;

		if ( instance._states.length > 0 ) {
			// Do leave transition

			// Pop a state off the stack
			instance._states.pop( );

			// Do enter transition
		}
		else {
			console.log( 'You tried to pop a state when there were none. Fix this.' );
		}

	},

	get_active_state: function get_active_state( ) {
		var active_state;

		if ( this._states.length > 0 ) {
			active_state = this._states[ this._states.length - 1 ];
		}
		else {
			active_state = null;
		}

		return active_state;
	},

	/**************************************************
		Transition methods
	**************************************************/

	queue_transition: function queue_transition( state_name, instance, transition_name ) {
		instance.transitions.push( state_name + '_' + transition_name );
	},

	has_enter_transition: function has_enter_transition( state_name, instance ) {
		return ( typeof instance[ state_name + '_enter' ] === 'function' ) ? true : false;
	},

	has_leave_transition: function( state_name, instance ) {
		return ( typeof instance[ state_name + '_leave' ] === 'function' ) ? true : false;
	},

});