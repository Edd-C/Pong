define( [ 'Game' ], function( Game ) {


	function hasAudio() {
		var audio = document.createElement('audio');

		if (audio && audio.canPlayType) {
			var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"'),
				mp3 = audio.canPlayType('audio/mpeg;'),
				wav = audio.canPlayType('audio/wav; codecs="1"'),
				m4a = audio.canPlayType( 'audio/aac;' );

			return {
				/* Note:
					'probably': The specified media type appears to be playable.
					'maybe': Cannot tell if the media type is playable without playing it.
					'' (empty string): The specified media type definitely cannot be played.
				*/

				ogg: (ogg === 'probably') || (ogg === 'maybe'),
				mp3: (mp3 === 'probably') || (mp3 === 'maybe'),
				wav: (wav === 'probably') || (wav === 'maybe'),
				m4a: (m4a === 'probably') || (m4a === 'maybe')

			};
		}

		return false;
	}

	function loadSounds( names, callback ) {
		var n,name,
			result = { },
			count  = names.length,
			canplay = function( ) { if ( --count == 0 ) callback( result ); };

		for ( n = 0 ; n < names.length ; n++ ) {
			name = names[ n ];
			result[ name ] = document.createElement( 'audio' );
			result[ name ].addEventListener( 'canplay', canplay, false );
			result[ name ].src = "audio/" + name + ".m4a";
		}

	}

	var SOUNDS = [ 'Christine', 'Edd', 'Kathleen1', 'Kathleen2', 'HitWall', 'Lose' ];

	function run( sounds ) {
		// game loop goes here, during which we can...
		//sounds.zap.play();
		//audio.Christine.play( );


	}

	function startGame( audio ) {
		console.log( 'loaded' );

		new Game( 1000, 400, audio );
	}

	loadSounds( SOUNDS, startGame );


 	//var Game = new Game( 1000, 400 );

});

