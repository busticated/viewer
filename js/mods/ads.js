/* jshint */
/*global define: false, require: false, googletag: false */

//  For documentation on API for google ads service, see: http://support.google.com/dfp_premium/bin/answer.py?hl=en&answer=1650154

define(['jquery', 'mods/utils', 'libs/handlebars', 'mods/mastercontrol', 'libs/polyfills' ], function ( $, utils, Handlebars, mc ) {
    var slotTemplate = '<div id="{{id}}" class="{{cssClasses}}" data-adtype="{{type}}" data-adsize="{{size}}"></div>',
        tmpl = Handlebars.compile( slotTemplate ),
        activeSlots = {},
        _configs = {
            HasAsyncAds: true,
            ShowAds: true,
            SiteName: 'iscrollproto',
            IsLoggedIn: false,
            SuperSitePrefix: 'ICHC'
        },
        _hasService = false,
        _service;

    //global GPT object
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];

    var NETWORK_CODE = '1025485'
    var PUBLISHER_CODE = 'ca-pub-0766144451700556';
    var SLUG = '/' + NETWORK_CODE + '/' + PUBLISHER_CODE + '/';

    var setup = function () {
        if ( !_configs.HasAsyncAds || !_configs.ShowAds ) {
            return this;
        }

        googletag.cmd.push(function () {
            _service = googletag.pubads();
            _service
                .setTargeting( 'site', getSiteForTargeting() )
                .setTargeting( 'page', getPageForTargeting() )
                .setTargeting( 'registered', getRegisteredState() )
                .collapseEmptyDivs();

            //if ( ! _configs.HasIScroll ) {
            //_service.enableSingleRequest();
            //}

            googletag.enableServices();
            _hasService = true;
        });

        utils.addScript({
            id: "chz-ads-gptasync",
            http: "//",
            path: "www.googletagservices.com/tag/js/gpt.js"
        });

        return this;
    };

    var listen = function(){
        mc.on( 'ads.addsponsoredpost', function( target ){
            var $spost = $( buildSponsoredPostForStream() ).appendTo( target );
            render( $spost );
        });

        return this;
    };

    var render = function ( $scope ) {
        var slots = getSlots( $scope );

        for ( var i = 0, l = slots.length; i < l; i += 1 ){
            fetch( slots[ i ].type, slots[ i ].size, slots[ i ].id );
        }

        return this;
    };

    var reload = function ( sitename, scope ) {
        window.googletag = null;
        window.googletag = window.googletag || {};
        $( '#chz-ads-gptasync' ).remove();
        setup( sitename );
        render( scope );
        return this;
    };

    var getSiteForTargeting = function () {
        return ( _configs.SiteName || 'cheezburger' ).toLowerCase().split( ' ' ).join( '' ).substring( 0, 10 );
    };

    var getPageForTargeting = function () {
        return window.location.pathname.substring( 0, 40 ).replace( /\//g, '_' );
    };

    var getRegisteredState = function () {
        return ( _configs.IsLoggedIn ? '1' : '0' );
    };

    var getSlots = function( $scope ){
        var $ads = $( 'div.js-ad', $scope || document ),
            adSlots = [],
            $ad;

        $ads.each(function ( idx, item ) {
            $ad = $( item );

            adSlots.push({
                id: $ad.attr( 'id' ),
                type: $ad.data( 'adtype' ),
                size: $ad.data( 'adsize' )
            });
        });

        return adSlots;
    };

    var fetch = function ( type, size, id ) {
        var init = function(){
            var slot;

            type = setUniqueSlotType( type );
            slot = googletag.defineSlot( SLUG + type, size, id );

            slot.addService( _service );
            slot.setTargeting( 'site', getSiteForTargeting() );
            slot.setTargeting( 'page', getPageForTargeting() );
            slot.setTargeting( 'registered', getRegisteredState() );

            activeSlots[ type ] = slot;

            requestAnimationFrame(function(){
                googletag.display( id );
            });
        };

        googletag.cmd.push( init );

        return this;
    };

    var setUniqueSlotType = function( type ){
        var count, name;

        if ( typeof activeSlots[ type ] === 'undefined' ){
            return type;
        }

        count = +(type.replace(/.+\D/i, '')) + 1;
        name = type.replace(/\d+$/i, '');

        if ( name.charAt( name.length - 1 ) !== '_' ){
            name = name + '_';
        }

        return setUniqueSlotType( name + count );
    };

    var refresh = function ( $scope ) {
        var slots = getSlots( $scope ),
            ads = [],
            doRefresh;

        for ( var i = 0, l = slots.length; i < l; i += 1 ){
            ads.push( activeSlots[ slots[ i ].type ] );
        }

        googletag.cmd.push(function(){ _service.refresh( ads ) });

        return this;
    };

    var hasService = function () {
        return _hasService;
    };

    var buildAdSlot = function ( cssClasses, slotName, size, suffix ) {
        slotName = slotName || '_';
        suffix = typeof suffix === 'undefined' ? '' : suffix;

        var model = {
            id: 'ad-' + utils.makeGUID(),
            cssClasses: cssClasses,
            type: _configs.SuperSitePrefix + slotName + suffix,
            size: size
        };

        return tmpl( model );
    };

    var buildAdContainer = function () {
        var adGroup = [
            '<div class="ad-container">',
                Array.prototype.join.call( arguments, '' ),
            '</div>'
        ];

        return adGroup.join( '' );
    };

    var buildSkyScrapersForStream = function () {
        return buildAdContainer(
            buildAdSlot( 'js-ad ad-left ad-skyscraper', 'TEST_160_LEFT_BTFISCROLL_', '[[160, 600],[300,600]]', 'ROS' ),
            buildAdSlot( 'js-ad ad-right ad-skyscraper', 'TEST_160_RIGHT_BTFISCROLL_', '[[160, 600],[300,600]]', 'ROS' )
        );
    };

    var buildSponsoredPostForStream = function () {
        return buildAdContainer(
            buildAdSlot( 'js-ad ad-sponsored-post', 'TEST_SPOST_', '[[500, 550],[500, 330],[500, 400]]', 'ROS' )
        );
    };

    var fetchSiteSkinCSS = function () {
        var $iframe = $( '#ad-siteskin > iframe' ).first().contents();
        var style = $iframe.find( '#site-skin-css' );
        return style;
    };
    var fetchSiteSkinClickThrough = function () {
        var $iframe = $( '#ad-siteskin > iframe' ).first().contents();
        var link = $iframe.find( '#site-skin-clickthru' ).data( 'clickthru_link' );
        return link;
    };

    window.__siteSkinExecute = function () {
        var toAppend = fetchSiteSkinCSS();
        var link = fetchSiteSkinClickThrough();
        $( 'body' ).append( toAppend );
        $( 'body' ).click(function( e ) {
            if ( e.target.id.toLowerCase() === 'content_stream' || e.target.id.toLowerCase() === 'ad-siteskin' || e.target.id.toLowerCase() === 'carousel' ) {
                window.location.href = link;
            }
        });
    };

    // public api /////////////////////////////////////////////////////////////
    return {
        setup: setup,
        listen: listen,
        hasService: hasService,
        render: render,
        getSiteForTargeting: getSiteForTargeting,
        getPageForTargeting: getPageForTargeting,
        getSlots: getSlots,
        fetch: fetch,
        activeSlots: activeSlots,
        refresh: refresh,
        reload: reload,
        buildAdSlot: buildAdSlot,
        buildAdContainer: buildAdContainer,
        buildSkyScrapersForStream: buildSkyScrapersForStream,
        buildSponsoredPostForStream: buildSponsoredPostForStream
    };
});
