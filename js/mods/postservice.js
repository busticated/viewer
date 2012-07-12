/* global define: false, require: false */

define( [ 'mods/fakeajaxservice' ], function( Fakejax ){
    'use strict';

    var makePost = function( id ){
        var title = 'I am post number ' + id,
            body = (function(){
                var lorem = [
                    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
                    'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                    'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                    'Contrary to popular belief, Lorem Ipsum is not simply random text.',
                    'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
                    'Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
                    'Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.',
                    'This book is a treatise on the theory of ethics, very popular during the Renaissance.',
                    'The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'
                ];

                var lines = lorem.slice( 0, random( 0, lorem.length - 1 ) );

                return lines.join( ' ' );
            })(),
            imageWidth = 580,
            imageHeight = ( random( 2, 12 ) * 100 ),
            imageSrc = 'http://placekitten.com/' + imageWidth + '/' + imageHeight;

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
