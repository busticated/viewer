/* jshint */
/*global define: false, require: false */
define( [ 'jquery', 'libs/handlebars', 'mods/postView' ], function ( $, Handlebars, PostView ) {
    var SponsoredPostView = function( post, idx ){
        if ( ! ( this instanceof SponsoredPostView ) ){
            return new SponsoredPostView( post, idx );
        }

        PostView.apply( this, [ post, idx ] );
    };

    SponsoredPostView.prototype = Object.create( PostView.prototype );
    SponsoredPostView.prototype.constructor = SponsoredPostView;

    return SponsoredPostView;
});
