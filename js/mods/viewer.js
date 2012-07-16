/* global define: false, require: false */

define( [ 'jquery', 'libs/handlebars', 'libs/iterator', 'mods/mastercontrol', 'libs/polyfills', 'libs/waypoints' ], function( $, Handlebars, Iterator, mc ){
    'use strict';

    var wasSetup = false,
        tmpl;

    var v = Object.create( new Iterator() );

    v.options = {
        container: '#js-poststream',
        isLoadingClass: '.is-loading',
        isClearedClass: '.is-cleared',
        postTemplate: null,
        postsToRetrieve: 10,
        postsPerPage: 7,
        postsPerAdRotation: 3,
        activePostCount: 5,
        endpoint: '/posts/page/{{page}}/' // should be '/posts/{{count}}'
    };

    v.scrollState = {
        page: 1,
        postsViewed: 0
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

        v.getPosts( v.options.postsToRetrieve ).then( v.addPosts );

        window.posts = v;
        return this;
    };

    v.listen = function(){
        $( document )
            .on( 'keydown', function( e ){
                switch ( e.keyCode ){
                    // Next: 74 = j, 40 = down arrow
                    case 40:
                    case 74:
                        e.preventDefault();
                        v.hasNext() && v.setScrollPosition( v.getNext().$el.offset().top + 1 );
                        break;

                    // Prev: 75 = k, 38 = up arrow
                    case 38:
                    case 75:
                        e.preventDefault();
                        v.hasPrev() && v.setScrollPosition( v.getPrev().$el.offset().top - 1 );
                        break;
                }
            })
            .on( 'waypoint.reached', function( e, direction ){
                v.setIndex( $( e.target ).data( 'postIndex' ) );

                if ( direction === 'up' ){
                    v.showPreviousPost();
                } else {
                    v.showNextPost();
                }

                v.setCurrentPage( direction ).rotateAds();

                // mc.emit( 'status', {
                //     type: 'ok',
                //     msg: 'viewing post ',
                //     data: v.index + 1
                // });
            });

        return this;
    };

    v.currentPage = 1;

    v.getPosts = function( count ){
        var xhr = $.ajax({
            url: v.options.endpoint.replace( '{{page}}', v.currentPage )
        });

        return {
            then: function( callback ){
                xhr.success( callback );
                return this;
            }
        };
    };

    v.getActivePostsRange = function(){
        var count = Math.round( v.options.activePostCount / 2 );

        if ( v.index - count <= 0 ){
            return {
                start: 0,
                end: v.options.activePostCount
            };
        }

        return {
            start: v.index - count,
            end: v.index + count
        };
    };

    // todo:
    // + break this into "addOldPosts" & "addNewPosts" methods (or some such)
    // + figure out how to detect whether posts get added to the start (old posts) or end (new posts)
    // + there's probably a nicer way of iterating over only the newly added posts
    v.addPosts = function( postData ){
        var insertFrom = v.length,
            posts = [];

        $.each( postData, function( idx, post ){
            var postHtml = tmpl( post ),
                $el = $( postHtml );

            posts.push({
                $el: $el,
                html: postHtml,
                innerHtml: $el[ 0 ].innerHTML,
                id: $el.data( 'aid' ),
                render: function(){}
            });
        });

        v.add( posts, insertFrom );

        v.each( function( post, idx ){
            if ( idx >= insertFrom ){
                post.$el.data( 'postIndex', idx ).appendTo( '#js-poststream' ).waypoint();
            }
        });

        v.currentPage += 1;

        return this;
    };

    v.trimPostsAbove = function(){
        var activePosts = v.getActivePostsRange();

        if ( activePosts.start > 0 ){
            v.trimPosts( 0, activePosts.start );
        }

        return this;
    };

    v.trimPostsBelow = function(){
        var activePosts = v.getActivePostsRange();

        if ( v.length - activePosts.end > 0 ){
            v.trimPosts( activePosts.end, v.length - 1 );
        }

        return this;
    };

    v.trimPosts = function( from, to ){
        v.each(function( post, idx ){
            // looks like the act of checking a class causes a reflow...
            // use post.$el.data( 'isCleared' ) instead?
            // or store on the post object itself - e.g. post.isCleared = true;
            // - or - 
            // need to reduce the iterations somehow?
            if ( idx >= from && idx <= to && ! post.$el.hasClass( v.options.isClearedClass ) ){
                post.$el.height( post.$el.outerHeight() );
                post.$el.addClass( v.options.isClearedClass.replace( '.', '' ) );
                post.$el.empty();
            }
        });

        return this;
    };

    v.resurrectPosts = function(){
        var activePosts = v.getActivePostsRange();

        v.each(function( post, idx ){
            if ( idx >= activePosts.start && idx < activePosts.end && post.$el.hasClass( v.options.isClearedClass.replace( '.', '' ) ) ){
                post.$el.html( post.innerHtml );
                post.$el.removeClass( v.options.isClearedClass.replace( '.', '' ) );
            }
        });

        return this;
    };

    v.showNextPost = function(){
        if ( v.isLast( v.index + 3 ) ){
            v.getPosts( v.options.postsToRetrieve ).then( v.addPosts );
        }

        v.resurrectPosts();
        v.trimPostsAbove();

        return this;
    };

    v.showPreviousPost = function(){
        if ( v.isFirst() ){
            return;
        }

        v.resurrectPosts();
        v.trimPostsBelow();

        return this;
    };

    v.setScrollPosition = function( offset ){
        $( document ).scrollTop( offset );
        return this;
    };

    v.setTemplate = function( template ){
        tmpl = Handlebars.compile( template );
        return this;
    };

    v.getTemplate = function(){
        return tmpl;
    };

    v.setCurrentPage = function( direction ){
        if ( v.index && v.index % v.options.postsPerPage === 0 ){
            v.scrollState.page += direction === 'up' ? -1 : 1;
            mc.emit( 'pageChanged', v.scrollState.page );
        }
        return this;
    };

    v.getCurrentPage = function(){
        return v.scrollState.page;
    };

    // todo:
    // + way points fire twice when scrolling up(?) causing
    //   the index to increment inaccurately
    v.rotateAds = function(){
        var adIndex = v.scrollState.postsViewed += 1;
        if ( adIndex % v.options.postsPerAdRotation === 0 ){
            mc.emit( 'rotateAds' );
        }
        return this;
    };

    return v;
});
