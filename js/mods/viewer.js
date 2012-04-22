/* global define: false, require: false */

define( [ 'jquery', 'handlebars', 'libs/Iterator', 'libs/polyfills' ], function( $, Handlebars, Iterator ){
    'use strict';

    var wasSetup = false,
        tmpl;

    var v = Object.create( new Iterator() );

    v.options = {
        container: '#js-poststream',
        isLoadingClass: '.is-loading',
        isClearedClass: '.is-cleared',
        postsShown: 7,
        eventNamespace: '.viewer',
        nextEvent: 'next',
        prevEvent: 'prev',
        loadingEvent: 'loading',
        postTemplate: null
    };

    v.setup = function( cfg ){
        if ( wasSetup ){
            return this;
        }

        $.extend( v.options, cfg );

        if ( ! v.options.postTemplate ){
            v.options.postTemplate = $( '#tmpl-post' ).html();
        }

        tmpl = v.setTemplate( v.options.postTemplate );

        v.getPosts( v.options.postsShown, function( postData ) {
            v.addPosts( postData );
        });

        return this;
    };

    v.listen = function(){
        $( document ).on( 'keydown', function( e ){
            switch ( e.keyCode ){
                // Next: 74 = j, 40 = down arrow
                case 40:
                case 74:
                    e.preventDefault();
                    v.showNextPost();
                    break;

                // Prev: 75 = k, 38 = up arrow
                case 38:
                case 75:
                    e.preventDefault();
                    v.showPreviousPost();
                    break;
            }
        });
    };

    //this will be move into postmodel.js module
    v.makePost = function( count ){
        v.makePost.id = v.makePost.id + 1 || 1;
        var id = v.makePost.id,
            title = 'I am post number ' + id,
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

                var lines = lorem.slice( 0, v.makePost.random( 0, lorem.length - 1 ) );

                return lines.join( ' ' );
            })(),
            imageSrc = 'http://placekitten.com/580/' + ( v.makePost.random( 2, 12 ) * 100 );

        return {
            id: id,
            title: title,
            body: body,
            asset: {
                type: 'image',
                src: imageSrc
            }
        };
    };

    v.makePost.random = function ( from, to ){
        return Math.floor( Math.random() * ( to - from + 1 ) + from );
    };

    v.getPosts = function( count, callback ){
        setTimeout( function(){
            var postData = [];

            while ( count > 0 ){
                postData.push( v.makePost() );
                count -= 1;
            }

            callback( postData );
        } , 500 );
    };

    v.addPosts = function( postData ){
        var posts = [];

        $.each(postData, function( idx, post ){
            var postHtml = tmpl( post );
            posts.push( $( postHtml ).data( 'postHtml', postHtml ) );
        });

        v.add( posts, v.length );

        v.each( function( post, idx ){
            post.appendTo( '#js-poststream' );
        });
    };

    v.removePosts = function(){
        var $oldPosts = $( '.post' ).slice( 0, v.idx - v.options.postsShown );

        $oldPosts.each(function( idx, elem ){
            var $el = $( elem );

            $el.css( 'height', $el.outerHeight() + 'px' );
            $el.addClass( v.options.isClearedClass.replace( '.', '' ) );
            $el.empty();
        });
    };

    v.resurrectPosts = function(){
        var $clearedPostSlots = $( v.options.isClearedClass ).slice( v.idx - v.options.postsShown, v.idx ),
            posts = v.collection.slice( v.idx - v.options.postsShown, v.idx );

        $clearedPostSlots.each(function( idx, elem ){
            var $el = $( elem ),
                $post = $( posts[ idx ].data( 'postHtml' ) );
            $el.html( $post.html() );
            $el.removeClass( v.options.isClearedClass.replace( '.', '' ) );
        });
    };

    v.showNextPost = function(){
        v.next();
        v.setScrollPosition();

        if ( v.isLast( v.idx + 3 ) ){
            v.getPosts( v.options.postsShown, v.addPosts );
        }

        if ( v.idx % 21 === 0 ){
            v.removePosts( v.options.postsShown );
        }
    };

    v.showPreviousPost = function(){
        if ( v.isFirst() ){
            return;
        }

        v.prev();
        v.setScrollPosition();

        if ( v.has( v.idx - v.options.postsShown ) && v.get( v.idx - v.options.postsShown ).hasClass( v.options.isClearedClass.replace( '.', '' ) ) ){
            v.resurrectPosts();
        }
    };

    v.setScrollPosition = function(){
        $( document ).scrollTop( v.current().offset().top );
    };

    v.setTemplate = function( template ){
        return Handlebars.compile( template );
    };

    v.getTemplate = function(){
        return tmpl;
    };

    return v;
});
