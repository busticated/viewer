/* jshint */
/*global define: false, require: false */
define( [ 'mods/model', 'libs/polyfills' ], function ( Model ) {
    'use strict';

    var PostModel = function PostModel( postData ){
        if ( ! ( this instanceof PostModel ) ){
            return new PostModel( postData );
        }

        Model.call( this );
        this.id = postData.id;
        this.title = postData.title;
        this.body = postData.body;
        this.url = postData.url;
        this.fbshares = '';
        this.assetType = postData.AssetType;
        this.asset = {
            height: postData.asset.height,
            width: postData.asset.width,
            type: postData.asset.type,
            src: postData.asset.src
        };
        this.isActive = true;
    };

    PostModel.prototype = Object.create( Model.prototype );
    PostModel.prototype.constructor = PostModel;

    return PostModel;
});
