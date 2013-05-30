var looop = function looop( set, loop, self ){
	/*
		set - either array or object (JSON)
		loop - the function to be looped
		self - the object to be binded to the loop

		The loop function should always accepts 3 parameters.
			1. value
			2. address
			3. next()
	*/
	return ( function( config ){
		set = config.set || set;
		loop = config.loop || loop;
		self = config.self || self;

		callback = config.callback || function( ){ };
		
		if( !loop || typeof loop != "function" ){
			throw new Error( "invalid loop procedure" );
		}
		if( !set || !Object.keys( set ).length || !set.length ){
			callback( null, null );
		}

		/*if( self && typeof self == "object" ){
			loop = loop.bind( self );
		}
		var hasError = false;
		loop = ( function( loop ){
			return ( function( ){
				if( hasError ) return;
				loop.apply( null, Array.prototype.slice.apply( arguments ) );
			} );
		} )( loop );*/

		var count = 0;
		if( set instanceof Array ){
			count = set.length;
		}else if( typeof set == "object" ){
			count = Object.keys( set ).length;
		}

		//console.log( "Count: " + count );

		var partition = Math.ceil( Math.sqrt( count ) );
		partition += Math.ceil( partition * .50 );
		var length = Math.ceil( count / partition );
		var overflow = Math.abs( count - ( partition * length ) ) - 1;

		//console.log( "Partition: " + partition );
		//console.log( "Length: " + length );
		//console.log( "Overflow: " + overflow );

		var results = [];
		var nextCount = 0;
		var next = function next( error, result ){
			results.push( result );
			nextCount++;
			if( nextCount >= count ){
				callback( null, results );
			}else if( error ){
				hasError = true;
				callback( error );
			}
			//console.log( nextCount );
		};

		var pickCount = 0;
		var pick = function pick( ){
			if( set instanceof Array ){
				//value, index
				return [ set.splice( 0, 1 )[ 0 ], pickCount++ ];
			}else if( typeof set == "object" ){
				//value, key
				for( var key in set ){
					var value = set[ key ];
					delete set[ key ];
					return [ value, key ];
				}
			}
		};

		var parts = 0;

		//console.log( loop.toString( ) );

		var process = "var data = pick( );"
			+ "var value = data[ 0 ];"
			+ "var reference = data[ 1 ];"
			+ loop.toString( )
				.replace( /^function\s+\w*\(.*\){/, "" )
				.replace( /}$/, "" )
				.replace( /index|key/g, "reference" );

		for( var index = 1 ; index <= length ; index++ ){
			parts = index % length;
			parts = partition + ( ( parts /= parts ) || ( 0 - overflow ) );

			//console.log( index + ":" + parts );

			/*eval( "process.nextTick( function( ){" 
					+ Array( parts ).join( "loop.apply( null, pick( ).concat( next ) );" )
				+ "} );" );*/
			//var _process = Array( parts ).join( process );
			//console.log( _process );
			eval( Array( parts ).join( process ) );
		}
	} );
};
exports.looop = looop;