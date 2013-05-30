var looop = require( "./looop.js" ).looop;


var data = [];
for( var index = 0 ; index < 1000 ; index++ ){
	data.push( index );
}

var time = Date.now( );
looop( data,
	function( value, index, next ){
		//console.log( arguments );
		next( null, value + ":" + index );
	} )( {
		callback: function( error, results ){
			//console.log( results );
			console.log( results.length );
			console.log( "Duration: " + ( Date.now( ) - time ) );
		}
	} );

//console.log( "Duration: " + ( Date.now( ) - time ) );


/*data = data.map( function( value, key ){
	var dataX = [];
	for( var index = 0 ; index < 65000 ; index++ ){
		dataX.push( index );
	}
	return value + ":" + key;
} );*/

/*for( var index = 0 ; index < data.length ; index++ ){
	data[ index ] = data[ index ] + ":" + index;
}*/

//console.log( data );
//console.log( "Duration: " + ( Date.now( ) - time ) );