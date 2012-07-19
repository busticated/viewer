/* global define: false, require: false */

define( [ 'jquery', 'libs/handlebars', 'libs/iterator', 'mods/mastercontrol', 'mods/postModel', 'mods/postView', 'libs/polyfills', 'libs/waypoints' ], function( $, Handlebars, Iterator, mc, PostModel, PostView ){
    'use strict';

    var wasSetup = false,
        tmpl;

    var v = Object.create( new Iterator() );

    v.options = {
        container: '#js-poststream',
        isLoadingClass: '.is-loading',
        postsToRetrieve: 10,
        postsPerPage: 7,
        postsPerAdRotation: 3,
        activePostCount: 7,
        lookAhead: 5,
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

        v.getPosts( v.options.postsToRetrieve ).then( v.addPosts );

        window.viewer = v;
        return this;
    };

    v.listen = function(){
        var timerId = null;

        mc.on( 'fb-sharecounts-available', function( shares ){
            for ( var i = 0, l = shares.length; i < l; i += 1 ){
                if ( typeof v.collection[ 'aid-' + shares[ i ].id ] === 'object' ){
                    v.collection[ 'aid-' + shares[ i ].id ].set( 'fbshares', shares[ i ].count );
                }
            }
        });

        $( document )
            // todo:
            // + fix these now that $el is on the view
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

                timerId && cancelAnimationFrame( timerId );
                timerId = requestAnimationFrame(function(){
                    if ( direction === 'up' ){
                        v.showPreviousPost();
                    } else {
                        v.showNextPost();
                    }
                });

                v.setCurrentPage( direction ).rotateAds();

                // mc.emit( 'status', {
                //     type: 'ok',
                //     msg: 'viewing post ',
                //     data: v.index + 1
                // });
            });

        return this;
    };

    // todo:
    // + need a more reliable way to track & handle failed page loads
    v.currentPage = 1;
    v.getPosts = function( count ){
        var deferred = $.Deferred(),
            xhr = $.ajax({
                url: v.options.endpoint.replace( '{{page}}', v.currentPage ),
                success: deferred.resolve
            });

        v.currentPage += 1;

        return deferred.promise();
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
    // + break into addPosts & displayPosts methods so that we can grab lots of posts
    //   at once but only display some subset of the collection we retreive
    // + if we don't know asset dimensions and set waypoint before asset loads,
    //   the waypoint's offset will be inaccurate - perhaps use
    //   post.$el.one( 'load', function(){ post.$el.waypoint() );
    //   but need to set in a closure.. or maybe just call $.waypoints( 'refresh' )
    //   at some appropriate time in the future?
    // + extract the .each() callback into a stand-alone method
    v.addPosts = function( rawPosts ){
        var insertFrom = v.length,
            newlyAddedPosts = [],
            post,
            postView;

        v.add( rawPosts, insertFrom );
        v.each( function( rawPost, idx ){
            if ( idx >= insertFrom ){
                post = new PostModel( rawPost );
                postView = new PostView( post, idx );

                v.collection[ 'aid-' + post.id ] = post;
                v.update( idx, post );
                newlyAddedPosts.push( post );
            }
        });

        mc.emit( 'iscroll-newcontentadded', newlyAddedPosts );

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
            if ( idx >= from && idx <= to && post.isActive ){
                post.set( 'isActive', false );
            }
        });

        return this;
    };

    v.resurrectPosts = function(){
        var activePosts = v.getActivePostsRange();

        v.each(function( post, idx ){
            if ( idx >= activePosts.start && idx < activePosts.end && ! post.isActive ){
                post.set( 'isActive', true );
            }
        });

        return this;
    };

    v.showNextPost = function(){
        if ( ! v.has( v.index + v.options.lookAhead ) ){
            v.getPosts( v.options.postsToRetrieve ).then( v.addPosts );
        }

        v.resurrectPosts();
        v.trimPostsAbove();

        return this;
    };

    v.showPreviousPost = function(){
        v.resurrectPosts();
        v.trimPostsBelow();

        return this;
    };

    v.setScrollPosition = function( offset ){
        $( document ).scrollTop( offset );
        return this;
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
    // + waypoints fire twice when scrolling up(?) causing
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
