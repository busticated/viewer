(function( factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( factory );
    } else {
        factory();
    }
})( function () {
    'use strict';

    if ( !Object.create ) {
        Object.create = function ( o ) {
            if ( arguments.length > 1 ) {
                throw new Error( 'Object.create polyfill only accepts the first parameter.' );
            }
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
});
