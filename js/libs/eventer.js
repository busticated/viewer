/*global define: false, require: false */

define(function(){
    'use strict';

    var Eventer = function(){
        if ( ! ( this instanceof Eventer ) ){
            return new Eventer();
        }

        this.eventCache = {};
    };

    //add an event and callback
    Eventer.prototype.on = function( eventName, callback ){
        var self = this;
        if ( ! this.eventCache[ eventName ] ) {
            this.eventCache[ eventName ] = [];
        }

        this.eventCache[ eventName ].push( callback );

        //simple version - just return an event object
        //return [ eventName, callback ];

        //fancy version wrap 'off' in closure to enable
        //easier access, create 'do' method to trigger
        //only this callback
        return {
            _handle : [ eventName, callback ],
            off : function(){
                self.off( [ eventName, callback ] );
            },
            run : function( data ){
                callback( data );
            }
        };
    };

    //remove callback and event if appropriate
    //todo: remove all handlers if argument is a string?
    Eventer.prototype.off = function( eventHandle ){
        var eventName = eventHandle[ 0 ];

        if ( ! this.eventCache[ eventName ] ){
            return;
        }

        for ( var i = 0; i < eventCache[ eventName ].length; i = i + 1 ) {
            if ( this.eventCache[ eventName ][ i ] === eventHandle[ 1 ] ){
                this.eventCache[ eventName ].splice( i, 1 );
            }
        }
    };

    Eventer.prototype.emit = function( eventName, data ){
        if ( ! this.eventCache[ eventName ] ){
            return;
        }

        for ( var i = 0; i < this.eventCache[ eventName ].length; i = i + 1 ) {
            this.eventCache[ eventName ][ i ].call( this, data );
        }
    };

    Eventer.prototype.__getEventCache = function() {
        return this.eventCache;
    };

    // public api /////////////////////////////////////////////////////////////
    return Eventer;
});
