/*global define: false, require: false */

define( function(){
    'use strict';

    var _isArray = function( a ){
        return Object.prototype.toString.call( a ) === '[object Array]';
    };

    var It = function( collection ){
        if ( ! ( this instanceof It ) ){
            return It.apply( new It(), arguments );
        }

        if ( _isArray( arguments[ 0 ] ) ){
            this.collection = Array.prototype.slice.call( arguments[ 0 ] );
        } else {
            this.collection = Array.prototype.slice.call( arguments );
        }

        this.index = 0;
        this.length = this.collection.length;
        return this;
    };

    It.prototype = {
        // test methods - return bool
        has : function( index ){
            return index < this.length;
        },
        hasNext : function(){
            return ! this.isLast();
        },
        hasPrev : function(){
            return ! this.isFirst();
        },
        isFirst : function( index ){
            if ( typeof index === 'undefined' ){
                return this.isFirst( this.index );
            }
            return index === 0;
        },
        isLast : function( index ){
            if ( typeof index === 'undefined' ){
                return this.isLast( this.index );
            }
            return index === this.length - 1;
        },

        // iteration methods - return collection item(s)
        get : function( index ){
            return this.collection[ index ];
        },
        getNext : function(){
            var index = this.index + 1;

            if ( this.isLooping && ! this.hasNext() ){
                this.isLooping = false;
                index = 0;
            }

            return this.get( index );
        },
        getPrev : function(){
            var index = this.index - 1;

            if ( this.isLooping && ! this.hasPrev() ){
                this.isLooping = false;
                index = this.length - 1;
            }

            return this.get( index );
        },
        current : function(){
            return this.get( this.index );
        },
        next : function(){
            if ( this.hasNext() ){
                return this.setIndex( this.index + 1 ).current();
            }
            if  ( this.isLooping ) {
                this.isLooping = false;
                return this.first();
            }
            return null;
        },
        prev : function(){
            if ( this.hasPrev() ){
                return this.setIndex( this.index - 1 ).current();
            }
            if ( this.isLooping ){
                this.isLooping = false;
                return this.last();
            }
            return null;
        },
        first : function(){
            this.setIndex( 0 );
            return this.current();
        },
        last : function(){
            this.setIndex( this.length - 1 );
            return this.current();
        },

        // utility methods
        indexOf: function( item, fromIdx ){
            fromIdx = fromIdx || 0;
            fromIdx = fromIdx < 0 ? Math.max( 0, this.length + fromIdx ) : fromIdx;

            if ( Array.prototype.indexOf ) {
                return this.collection.indexOf( item, fromIdx );
            }

            for ( var i = fromIdx, l = this.length; i < l; i += 1 ){
                if ( item === this.collection[ i ] ){
                    return i;
                }
            }

            return -1;
        },
        setIndex : function( index ){
            if ( ! this.has( index ) ){
                throw new Error( 'index out of bounds - collection does not include that index' );
            }
            this.index = index;
            return this;
        },
        loop : function(){
            this.isLooping = true;
            return this;
        },
        each : function( callback, context ){
            var ctx;

            if ( typeof callback !== 'function' ){
                throw new Error( 'callback is of type ' + typeof callback + ' expected a function' );
            }

            if ( context ){
                ctx = context;
            }

            for ( var i = 0, l = this.length; i < l; i = i + 1 ){
                callback.call( ctx, this.collection[ i ], i );
            }
            return this;
        },

        // collection modification methods
        add : function( items, index ){
            if ( ! _isArray( items ) ){
                items = [ items ];
            }

            if ( typeof index === 'undefined' || ! this.has( index ) ){
                index = this.length;
            }
            for ( var i = 0, l = items.length; i < l; i = i + 1 ){
                this.collection.splice( index + i, 0, items[ i ] );
            }
            this.length = this.collection.length;
            return this;
        },
        remove : function( index ){
            if ( typeof index === 'number' ) {
                this.collection.splice( index, 1 );
            }
            this.length = this.collection.length;
            return this;
        },
        update : function( index, item ){
            if ( ! this.has( index ) ){
                throw new Error( 'index out of bounds - collection does not include that index' );
            }
            this.collection[ index ] = item;
            return this;
        },
        filter : function( filter ){
            var newCollection = [];
            for ( var i = 0, l = this.length; i < l; i = i + 1 ){
                if ( filter( this.collection[ i ] ) ){
                    newCollection.push( this.collection[ i ] );
                }
            }
            return new It( newCollection );
        }
    };

    // public api /////////////////////////////////////////////////////////////
    return It;
});
