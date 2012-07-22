/* jshint */
/*global define: false, require: false */
define( [ 'jquery', 'libs/handlebars', 'mods/view', 'mods/ads' ], function ( $, Handlebars, View, ads ) {
    var SponsoredPostView = function( post, idx ){
        if ( ! ( this instanceof SponsoredPostView ) ){
            return new SponsoredPostView( post, idx );
        }

        View.call( this, post );
        this.tmpl = ads.buildSponsoredPostForStream;
        this.$el = $( this.tmpl() ).data( 'postIndex', idx );
        this.setup();
    };

    SponsoredPostView.prototype = Object.create( View.prototype );
    SponsoredPostView.prototype.constructor = SponsoredPostView;

    SponsoredPostView.prototype.setup = function(){
        ads.render( this.$el );
        this.$el.appendTo( '#js-poststream' );
        return this;
    };

    return SponsoredPostView;
});
