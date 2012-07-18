/* global define: false, require: false */

define( [ 'jquery', 'libs/sinon' ], function( $, sinon ){
    'use strict';

    var random = function ( from, to ){
        return Math.floor( Math.random() * ( to - from + 1 ) + from );
    };
    var options = {
        endpoint: '/path/to/service',
        createResponse: $.noop
    };

    var Fake = function( cfg ){
        var self;

        if ( ! ( this instanceof Fake ) ){
            return new Fake();
        }

        self = this;
        this.options = $.extend( options, cfg );
        this.server = sinon.fakeServer.create();

        this.server.useFilters = true;
        this.server.autoRespond = true;
        this.server.autoRespondAfter = random( 50, 1000 );

        sinon.fakeServer.xhr.useFilters = true;
        sinon.fakeServer.xhr.addFilter(function( method, url ){
            return self.filterRequest( url );
        });


        this.server.respondWith( this.options.endpoint, this.options.createResponse );
    };

    Fake.prototype.filterRequest = function( url ){
        return ! this.options.endpoint.test( url );
    };

    return Fake;
});
