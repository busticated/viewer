/* jshint */
/*global define: false, require: false */
define( [ 'jquery', 'libs/handlebars', 'mods/view', 'libs/polyfills' ], function ( $, Handlebars, View ) {
    'use strict';

    var tmpl = Handlebars.compile( $( '#tmpl-post' ).html() );

    var PostView = function PostView( post, idx ){
        if ( ! ( this instanceof PostView ) ){
            return new PostView( post, idx );
        }

        View.call( this, post, tmpl );
        var self = this;
        this.$el = $( this.tmpl( this.model ) ).data( 'postIndex', idx );
        this.innerHtml = this.$el[ 0 ].innerHTML;
        this.isClearedClass = 'is-cleared';
        this.waypointOffset = 0;

        this.model.on( 'update:isActive', function( isActive ){
            if( isActive ){
                self.render();
            } else {
                self.remove();
            }
        });
        this.model.on( 'update:fbshares', function(){
            self.render();
        });
        this.model.on( 'selected', function( nudge ){
            self.select( nudge );
        });

        this.setup();
    };

    PostView.prototype = Object.create( View.prototype );
    PostView.prototype.constructor = PostView;

    PostView.prototype.setup = function(){
        this.$el.appendTo( '#js-poststream' ).waypoint({ offset: this.waypointOffset });
        this.$el.data( 'postModel', this.model );
        return this;
    };

    PostView.prototype.render = function(){
        this.innerHtml = $( this.tmpl( this.model ) )[ 0 ].innerHTML;
        this.$el.html( this.innerHtml );
        this.$el.removeClass( this.isClearedClass );
        return this;
    };

    PostView.prototype.remove = function(){
        var height = this.$el.outerHeight();

        this.$el.empty();
        this.$el.css( 'minHeight', height );
        this.$el.addClass( this.isClearedClass );
    };

    PostView.prototype.select = function( nudge ){
        $( document ).scrollTop( this.$el.offset().top + nudge );
        return this;
    };

    return PostView;
});
