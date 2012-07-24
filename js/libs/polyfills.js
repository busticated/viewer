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

    // requestAnimationFrame()
    (function ( win ) {
        "use strict";

        var lastTime = 0,
            vendors = [ 'ms', 'moz', 'webkit', 'o' ],
            nameSpaceSuffix = 'AnimationFrame',
            vendor;

        for ( var x = 0; x < vendors.length && ! win.requestAnimationFrame; x += 1 ) {
            vendor = vendors[x];
            win.requestAnimationFrame = win[ vendor + 'Request' + nameSpaceSuffix ];
            win.cancelAnimationFrame = win[ vendor + 'Cancel' + nameSpaceSuffix ]  || win[ vendor + 'CancelRequest' + nameSpaceSuffix ];
        }

        if ( ! win.requestAnimationFrame ) {
            win.requestAnimationFrame = function( callback, element ) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
                    id = win.setTimeout( function () { callback( currTime + timeToCall ); }, timeToCall );

                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if ( ! win.cancelAnimationFrame ) {
            win.cancelAnimationFrame = function( id ) {
                win.clearTimeout( id );
            };
        }
    }(window));
});
