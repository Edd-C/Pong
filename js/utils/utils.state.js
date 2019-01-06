define({

	/**************************************************
		State methods
	**************************************************/

	set_state: function set_state( state_name, instance, do_leave, do_enter ) {
		this.change_state( state_name, instance, do_leave, do_enter, 'set' );
	},

	add_state: function add_state( state_name, instance, do_leave, do_enter ) {
		this.change_state( state_name, instance, do_leave, do_enter, 'add' );
	},

	change_state: function change_state( state_name, instance, do_leave, do_enter, type ) {
		var do_leave = ( typeof do_leave !== 'undefined') ? do_leave : true,
			do_enter = ( typeof do_enter !== 'undefined') ? do_enter : true,
			current_state = false,
			has_leave, has_enter;

		// Set current_state if one exists.
		if ( instance._states.length > 0 ) {
			current_state = instance._states[ instance._states.length - 1 ];
		}

		// Only switch states if the current_state and new state are different.
		if ( state_name !== current_state ) {
			// Do leave transition
			has_leave = this.has_transition( current_state, instance, 'leave' );

			if ( current_state !== false && has_leave === true && do_leave === true ) {
				// Resolve the leave transition
				this.resolve_transition( current_state, instance, 'leave' );
			}

			if ( type === 'set' ) {
				// Clear stack and set the new state
				instance._states = [ state_name ];
			}
			else if ( type = 'add' ) {
				// Append new state to existing states
				instance._states.push( state_name );
			}

			// Do enter transition
			has_enter = this.has_transition( state_name, instance, 'enter' );

			if ( has_enter === true && do_enter === true ) {
				// Resolve the enter transition
				this.resolve_transition( state_name, instance, 'enter' );
			}
		}
		else {
			console.log( 'State change ignored. New and current state are the same.' );
		}
	},

	pop_state: function pop_state( instance, do_leave, do_enter ) {
		var do_leave = ( typeof do_leave !== 'undefined') ? do_leave : true,
			do_enter = ( typeof do_enter !== 'undefined') ? do_enter : true,
			leave_state_name, enter_state_name, has_leave, has_enter;

		if ( instance._states.length > 0 ) {
			// Do leave transition
			leave_state_name = instance._states[ instance._states.length - 1 ];
			has_leave = this.has_transition( leave_state_name, instance, 'leave' );

			if ( has_leave === true && do_leave === true ) {
				// Resolve the leave transition
				this.resolve_transition( leave_state_name, instance, 'leave' );
			}

			// Pop a state off the stack
			instance._states.pop( );

			// Do enter transition
			enter_state_name = instance._states[ instance._states.length - 1 ];
			has_enter = this.has_transition( enter_state_name, instance, 'enter' );

			if ( instance._states.length > 0 && has_enter === true && do_enter === true ) {
				// Resolve the enter transition
				this.resolve_transition( enter_state_name, instance, 'enter' );
			}
		}
		else {
			console.log( 'You tried to pop a state when there were none. Fix this.' );
		}
	},


	/**************************************************
		State helper methods
	**************************************************/

	get_active_state: function get_active_state( instance ) {
		var active_state;

		if ( instance._states.length > 0 ) {
			active_state = instance._states[ instance._states.length - 1 ];
		}
		else {
			active_state = null;
		}

		return active_state;
	},

	has_state: function has_state( state_name, instance ) {
		return ( typeof instance[ state_name ] === 'function' ) ? true : false;
	},


	/**************************************************
		Transition methods
	**************************************************/

	has_transition: function has_transition( state_name, instance, transition_name ) {
		return ( typeof instance[ state_name + '_' + transition_name ] === 'function' ) ? true : false;
	},

	resolve_transition: function resolve_transition( state_name, instance, transition_name ) {
		instance[ state_name + '_' + transition_name ]( );
	}
});