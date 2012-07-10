/* global define: false, require: false */

define( [ 'jquery', 'libs/handlebars', 'libs/Iterator', 'mods/mastercontrol', 'libs/polyfills', 'libs/waypoints' ], function( $, Handlebars, Iterator, mc ){
    'use strict';

    var wasSetup = false,
        wasKeyedEvent = false,
        tmpl;

    var v = Object.create( new Iterator() );

    v.options = {
        container: '#js-poststream',
        isLoadingClass: '.is-loading',
        isClearedClass: '.is-cleared',
        postTemplate: null,
        postsToretrieve: 10,
        postsShown: 7,
        eventNamespace: '.viewer',
        nextEvent: 'next',
        prevEvent: 'prev',
        loadingEvent: 'loading',
        endpoint: '/posts/page/{{page}}/' // should be '/posts/{{count}}'
    };

    v.setup = function( cfg ){
        if ( wasSetup ){
            return this;
        }

        $.extend( v.options, cfg );

        if ( ! v.options.postTemplate ){
            v.options.postTemplate = $( '#tmpl-post' ).html();
        }

        v.setTemplate( v.options.postTemplate );

        v.getPosts( v.options.postsToretrieve, v.addPosts );

        return this;
    };

    v.listen = function(){
        $( document )
            .on( 'keydown', function( e ){
                wasKeyedEvent = true;
                switch ( e.keyCode ){
                    // Next: 74 = j, 40 = down arrow
                    case 40:
                    case 74:
                        e.preventDefault();
                        v.showNextPost();
                        v.setScrollPosition();
                        break;

                    // Prev: 75 = k, 38 = up arrow
                    case 38:
                    case 75:
                        e.preventDefault();
                        v.showPreviousPost();
                        v.setScrollPosition();
                        break;
                }
            })
            .on( 'waypoint.reached', function( e, direction ){
                if ( wasKeyedEvent ){
                    wasKeyedEvent = false;
                    return;
                }

                v.setIdx( $( e.target ).data( 'postIdx' ) );

                if ( direction === 'up' ){
                    v.showPreviousPost();
                } else {
                    v.showNextPost();
                }
            });

        return this;
    };

    v.currentPage = 1;

    v.getPosts = function( count, callback ){
        var xhr = $.ajax({
            url: v.options.endpoint.replace( '{{page}}', v.currentPage )
        });
        xhr.success( callback );

        return this;
    };

    // todo:
    // + break this into "addOldPosts" & "addNewPosts" methods (or some such)
    // + figure out how to detect whether posts get added to the start (old posts) or end (new posts)
    // + there's probably a nicer way of iterating over only the newly added posts
    v.addPosts = function( postData ){
        var insertFrom =  v.length,
            posts = [];

        $.each( postData, function( idx, post ){
            var postHtml = tmpl( post );
            posts.push( $( postHtml ).data( 'postHtml', postHtml ) );
        });

        v.add( posts, insertFrom );

        v.each( function( post, idx ){
            if ( idx >= insertFrom ){
                post.data( 'postIdx', idx ).appendTo( '#js-poststream' ).waypoint();
            }
        });

        v.currentPage += 1;

        return this;
    };

    v.removePosts = function(){
        var $oldPosts = $( '.post' ).slice( 0, v.idx - v.options.postsShown );

        $oldPosts.each(function( idx, elem ){
            var $el = $( elem );

            $el.css( 'height', $el.outerHeight() + 'px' );
            $el.addClass( v.options.isClearedClass.replace( '.', '' ) );
            $el.empty();
        });

        return this;
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

        return this;
    };

    v.showNextPost = function(){
        v.next();

        if ( v.isLast( v.idx + 3 ) ){
            v.getPosts( v.options.postsShown, v.addPosts );
        }

        if ( v.idx % ( v.options.postsShown * 3 ) === 0 ){
            v.removePosts( v.options.postsShown );
        }

        return this;
    };

    v.showPreviousPost = function(){
        if ( v.isFirst() ){
            return;
        }

        v.prev();

        if ( v.has( v.idx - v.options.postsShown ) && v.get( v.idx - v.options.postsShown ).hasClass( v.options.isClearedClass.replace( '.', '' ) ) ){
            v.resurrectPosts();
        }

        return this;
    };

    v.setScrollPosition = function(){
        $( document ).scrollTop( v.current().offset().top );
        return this;
    };

    v.setTemplate = function( template ){
        tmpl = Handlebars.compile( template );
        return this;
    };

    v.getTemplate = function(){
        return tmpl;
    };

    return v;
});
