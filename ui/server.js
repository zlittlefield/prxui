'use strict';

var WebSocketServer = require( 'ws' )
    .Server;
// var http = require( 'http' );

// var server = http.createServer();
var wss = new WebSocketServer(
{
    path: '/prx',
    port: '9999'
} );
wss.binaryType = 'arraybuffer';

var CLIENTS = [];
var closed_ws = []
var id;
var total = 0;

wss.on( 'connection', function( ws )
{
    ws.binaryType = 'arraybuffer';
    id = total;
    total = total + 1
    console.log( 'connection is established : ' + id );
    CLIENTS[ id ] = ws;
    CLIENTS.push( ws );
    ws.on( 'message', function( data, flags )
    {
        for( var i = 0, cLength = CLIENTS.length; i < cLength; i++ )
        {
            if( CLIENTS[ i ] == ws ) continue;
            if( !closed_ws.includes( i ) ) CLIENTS[ i ].send( data );
        }
    } );
    ws.on( 'close', function()
    {
        console.log( 'Connection closed!' );
        closed_ws.push( id )
        delete CLIENTS[ id ];
    } );
    ws.on( 'error', function( e ) {} );
} );
// server.listen( 9999 );
console.log( 'WS Server started...' );