/* jshint */
/*global define: false, require: false */
define( [ 'libs/eventer', 'libs/polyfills' ], function ( Eventer ) {
    var Model = function Model(){
        Eventer.call( this );
    };

    Model.prototype = Object.create( Eventer.prototype );
    Model.prototype.constructor = Model;

    Model.prototype.set = function( prop, val ){
        if ( ! this.hasOwnProperty( prop ) ){
            throw new Error( 'cannot set "' + prop + '" - ' + this.constructor.name + ' does not include that property' );
        }

        this[ prop ] = val;
        this.emit( 'update', { property: prop, value: val } );
        this.emit( 'update:' + prop, val );

        return this;
    };

    return Model;
});
