/* global define: false, require: false */

define( [ 'mods/fakeajaxservice', 'mods/fakePostData' ], function( Fakejax, fakePostData ){
    'use strict';

    var makePost = function(){
        var idx = random( 0, fakePostData.length - 1 ),
            rawPost = fakePostData[ idx ],
            id = rawPost.AssetId,
            title = rawPost.Title,
            body = rawPost.Description,
            imageSrc = rawPost.Url,
            imageHeight = rawPost.Height,
            imageWidth = rawPost.Width;

        if ( rawPost.AssetType !== 0 || rawPost.Height === 0 ){
            return makePost();
        }

        return {
            id: id,
            title: title,
            body: body,
            asset: {
                type: 'image',
                src: imageSrc,
                height: imageHeight,
                width: imageWidth
            }
        };
    };

    var random = function ( from, to ){
        return Math.floor( Math.random() * ( to - from + 1 ) + from );
    };

    var setup = function(){
        var srvc = new Fakejax({
            endpoint: /posts\/page\/(\d+)/,
            createResponse: function( xhr, page ){
                var postCount = 7,
                    postData = [],
                    endId = postCount * page,
                    id = postCount * ( page - 1 );

                while ( id < endId ){
                    id += 1;
                    postData.push( makePost( id ) );
                }

                xhr.respond(
                    200,
                    { "Content-Type": "application/json" },
                    JSON.stringify( postData )
                );
            }
        });

        return srvc;
    };

    return {
        setup: setup
    };
});
