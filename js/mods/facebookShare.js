/* jshint */
/*global define: false, require: false */
define(['jquery', 'mods/mastercontrol' ], function ( $, mc ) {

    var f = {};

    f.options = {
        btnSelector: '.js-fbshare-btn',
        countSelector: '.js-fbshare-count',
        shareUrlAttr: 'posturl',
        actionAttr: 'eventaction',
        eventName: 'share',
        eventNamespace: '.fbbtn',
        setupCompleteEvent: 'countsAdded',
        showCounts: true
    };

    f.ROOT_URL = 'http://cheezburger.com/';

    f.setup = function ( cfg ) {
        $.extend( f.options, cfg );

        return this;
    };

    f.listen = function () {
        var $doc = $(document);

        $doc.on( 'click' + f.options.eventNamespace, f.options.btnSelector, function ( e ) {
            e.preventDefault();
            var $this = $( this );
            var url = $this.data( f.options.shareUrlAttr );

            //fire share event
            $( document ).trigger( f.options.eventName + f.options.eventNamespace, {
                url: $this.data( f.options.shareUrlAttr ),
                action: $this.data( f.options.actionAttr ) || 'share-start'
            });
        });

        mc.on( 'iscroll.newcontentadded', function( posts ){
            var countsNeeded = [];

            $.each( posts, function( key, post ){
                countsNeeded.push( post.url );
            });

            f.getCounts( countsNeeded ).then(function( counts ){
                f.updatePosts( counts, posts );
            });
        });

        return this;
    };

    f.getCounts = function ( idsToRetrieve ) {
        var deferred = $.Deferred(),
            fbUrl = 'http://graph.facebook.com/?ids=',
            xhr;

        $.each( idsToRetrieve, function ( key, val ) {
            fbUrl += encodeURIComponent( val ) + ',';
        });

        xhr = $.ajax({
            url: fbUrl.slice( 0, -1 ),
            dataType: 'jsonp',
            success: deferred.resolve
        });

        return deferred.promise();
    };

    f.broadcastCounts = function ( counts ){
        var shares = [];

        $.each( counts, function( key, val ){
            shares.push({
                id: val.id.match(/\d+$/)[0],
                url: val.id,
                count: f.formatCount( val.shares )
            });
        });

        mc.emit( 'fbshare.countsavailable', shares );

        return this;
    };

    f.updatePosts = function( counts, posts ){
        var post, count;
        for ( var i = 0, l = posts.length; i < l; i += 1 ){
            post = posts[ i ];
            count = f.formatCount( counts[ f.ROOT_URL + post.id ].shares );
            post.set( 'fbshares', count );
        }

        return this;
    };

    f.formatCount = function ( shareCount ) {
        var number;

        if ( isNaN( shareCount ) ) {
            number = '0';
        } else {
            number = parseInt( shareCount, 10 );
            number = number >= 1000 ? ( number / 1000 ).toFixed( 1 ) + "k" : number;
        }

        return number.toString();
    };

    return f;
});
