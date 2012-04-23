/* global define: false, require: false */

define( [ 'jquery', 'sinon' ], function( $, sinon ){
    'use strict';

    var server = sinon.fakeServer.create();
    var random = function ( from, to ){
        return Math.floor( Math.random() * ( to - from + 1 ) + from );
    };
    var options = {
        endpoint: '/path/to/service',
        minResponseTime: 50,
        maxResponseTime: 500,
        createResponse: $.noop
    };

    var Fake = function( cfg ){
        if ( ! ( this instanceof Fake ) ){
            return new Fake();
        }

        this.options = $.extend( options, cfg );
        server.respondWith( this.options.endpoint, this.options.createResponse );

        this.respond = function(){
            setTimeout(function(){
                server.respond();
            }, random( this.options.minResponseTime, this.options.maxResponseTime ) );
        };
    };

    return Fake;
});
