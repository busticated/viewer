/* jshint */
/*global define: false, require: false */
define( [ 'jquery', 'libs/handlebars' ], function ( $, Handlebars ) {
    var tmpl, $el, postHtml;

    var Post = function( postData, idx ){
        if ( ! ( this instanceof Post ) ){
            return new Post();
        }

        if ( ! tmpl ){
            tmpl = Handlebars.compile( $( '#tmpl-post' ).html() );
        }

        postHtml = tmpl( postData );
        $el = $( postHtml ).data( 'postIndex', idx );

        this.id = postData.id;
        this.url = postData.url;
        this.$el = $el;
        this.html = postHtml;
        this.innerHtml = $el[ 0 ].innerHTML;
        this.isClearedClass = 'is-cleared';
    };

    Post.prototype = {
        isActive: function(){
            return ! this.$el.hasClass( this.isClearedClass );
        },
        render: function(){
            this.$el.html( this.innerHtml );
            this.$el.removeClass( this.isClearedClass );
            return this;
        },
        remove: function(){
            this.$el.height( this.$el.outerHeight() );
            this.$el.addClass( this.isClearedClass );
            this.$el.empty();
            return this;
        }
    };

    return Post;
});
