/* jshint */
/*global define: false, require: false */
define( [ 'jquery', 'mods/model' ], function ( $, Model ) {
    var SponsoredPostModel = function(){
        if ( ! ( this instanceof SponsoredPostModel ) ){
            return new SponsoredPostModel();
        }

        Model.call( this );
        this.assetType = 'sponsoredpost';
    };

    SponsoredPostModel.prototype = Object.create( Model.prototype );
    SponsoredPostModel.prototype.constructor = SponsoredPostModel;

    return SponsoredPostModel;
});
