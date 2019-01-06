define({

	/**************************************************
		State methods
	**************************************************/

	setState: function setState( state_name, instance, do_leave, do_enter ) {
		var do_leave = ( typeof do_leave !== 'undefined') ? do_leave : true,
			do_enter = ( typeof do_enter !== 'undefined') ? do_enter : true,
			has_leave = this.hasLeaveTransition( state_name, instance ),
			has_enter = this.hasEnterTransition( state_name, instance ),
			current_state = false;

		// Set current_state if one exists.
		if ( instance.active_states.length > 0 ) {
			current_state = instance.active_states[ instance.active_states.length - 1 ];
		}

		// Only switch states if the current_state and new state are different.
		if ( state_name !== current_state ) {
			// Do enter transition
			if ( has_enter === true && do_enter === true ) {
				// Push the state to the 'transitions' array.
				this.queueTransition( state_name, instance, 'enter' );
			}

			// Clear stack and set the new state
			instance.active_states = [ state_name ];

			// Do leave transition
			if ( current_state !== false && has_leave === true && do_leave === true ) {
				// Push the state to the 'transitions' array.
				this.queueTransition( current_state, instance, 'leave' );
			}
		}
		else {
			console.log( 'State change ignored. New and current state are the same.' );
		}
	},

	addState: function addState( state_name, instance, do_leave, do_enter ) {
		var do_leave = do_leave || true,
			do_enter = do_enter || true;
		// Do leave transition

		// Add a new state to the top of the stack
		instance.active_states.push( state_name );

		// Do leave transition

	},

	popState: function popState( instance, do_leave, do_enter ) {
		var do_leave = do_leave || true,
			do_enter = do_enter || true;

		if ( instance.active_states.length > 0 ) {
			// Do leave transition

			// Pop a state off the stack
			instance.active_states.pop( );

			// Do enter transition
		}
		else {
			console.log( 'You tried to pop a state when there were none. Fix this.' );
		}

	},

	/**************************************************
		Transition methods
	**************************************************/

	queueTransition: function queueTransition( state_name, instance, transition_name ) {
		instance.transitions.push( state_name + '_' + transition_name );
	},

	hasEnterTransition: function hasEnterTransition( state_name, instance ) {
		return ( typeof instance[ state_name + '_enter' ] === 'function' ) ? true : false;
	},

	hasLeaveTransition: function( state_name, instance ) {
		return ( typeof instance[ state_name + '_leave' ] === 'function' ) ? true : false;
	},

});