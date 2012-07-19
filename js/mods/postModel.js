/* jshint */
/*global define: false, require: false */
define( [ 'libs/eventer' ], function ( Eventer ) {
    var PostModel = function( postData ){
        if ( ! ( this instanceof PostModel ) ){
            return new PostModel( postData );
        }

        Eventer.call( this );
        this.id = postData.id;
        this.title = postData.title;
        this.body = postData.body;
        this.url = postData.url;
        this.fbshares = '';
        this.asset = {
            height: postData.asset.height,
            width: postData.asset.width,
            type: postData.asset.type,
            src: postData.asset.src
        };
        this.isActive = true;
    };

    PostModel.prototype = new Eventer();

    PostModel.prototype.constructor = PostModel;

    PostModel.prototype.set = function( prop, val ){
        if ( ! this.hasOwnProperty( prop ) ){
            return this;
        }

        this[ prop ] = val;
        this.emit( 'update', { property: prop, value: val } );
        this.emit( 'update:' + prop, val );

        return this;
    };

    return PostModel;
});
