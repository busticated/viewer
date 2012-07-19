/* jshint */
/*global define: false, require: false */
define( [ 'jquery', 'libs/handlebars' ], function ( $, Handlebars ) {
    var tmpl, $el, postHtml;

    var PostView = function( post, idx ){
        if ( ! ( this instanceof PostView ) ){
            return new PostView( post, idx );
        }

        if ( ! tmpl ){
            tmpl = Handlebars.compile( $( '#tmpl-post' ).html() );
        }

        var self = this;
        this.model = post;
        this.$el = $( tmpl( this.model ) ).data( 'postIndex', idx );
        this.innerHtml = this.$el[ 0 ].innerHTML;
        this.isClearedClass = 'is-cleared';

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
        this.model.on( 'selected', function( offset ){
            self.select( offset );
        });

        this.setup();
    };

    PostView.prototype = {
        setup: function(){
            this.$el.appendTo( '#js-poststream' ).waypoint();
            return this;
        },
        render: function(){
            if (typeof this.model === 'undefined' ){
                debugger;
            }
            this.innerHtml = $( tmpl( this.model ) )[ 0 ].innerHTML;
            this.$el.html( this.innerHtml );
            this.$el.removeClass( this.isClearedClass );
            return this;
        },
        remove: function(){
            this.$el.height( this.$el.outerHeight() );
            this.$el.addClass( this.isClearedClass );
            this.$el.empty();
            return this;
        },
        select: function( offset ){
            $( document ).scrollTop( this.$el.offset().top + offset );
            return this;
        }
    };

    return PostView;
});
