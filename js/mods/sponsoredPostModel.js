/* jshint */
/*global define: false, require: false */
define( [ 'jquery', 'mods/postModel' ], function ( $, PostModel ) {
    var SponsoredPostModel = function( postData ){
        if ( ! ( this instanceof SponsoredPostModel ) ){
            return new SponsoredPostModel( postData );
        }

        PostModel.call( this, postData );
        this.assetType = 'sponsoredpost';
    };

    SponsoredPostModel.prototype = Object.create( PostModel.prototype );
    SponsoredPostModel.prototype.constructor = SponsoredPostModel;

    SponsoredPostModel.prototype.set = function( prop, val ){
        if ( ! this.hasOwnProperty( prop ) ){
            return this;
        }

        this[ prop ] = val;
        this.emit( 'update', { property: prop, value: val } );
        this.emit( 'update:' + prop, val );

        return this;
    };

    return SponsoredPostModel;
});
