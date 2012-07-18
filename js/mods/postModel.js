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

        this.$el = $el;
        this.html = postHtml;
        this.innerHtml = $el[ 0 ].innerHTML;
        this.id = postData.id;
        this.render = function(){};
    };

    return Post;
});
