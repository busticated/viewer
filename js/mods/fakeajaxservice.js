/* global define: false, require: false */

define( [ 'jquery', 'libs/sinon' ], function( $, sinon ){
    'use strict';

    var server = sinon.fakeServer.create();
    var random = function ( from, to ){
        return Math.floor( Math.random() * ( to - from + 1 ) + from );
    };
    var options = {
        endpoint: '/path/to/service',
        createResponse: $.noop
    };

   server.autoRespond = true;
   server.autoRespondAfter = random( 50, 1000 );

    var Fake = function( cfg ){
        if ( ! ( this instanceof Fake ) ){
            return new Fake();
        }

        this.options = $.extend( options, cfg );
        server.respondWith( this.options.endpoint, this.options.createResponse );
    };

    return Fake;
});
