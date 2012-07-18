/* jshint */
/*global define: false, require: false, googletag: false */

//  For documentation on API for google ads service, see: http://support.google.com/dfp_premium/bin/answer.py?hl=en&answer=1650154

define(['jquery', 'mods/utils', 'libs/handlebars', 'mods/mastercontrol', 'libs/polyfills' ], function ( $, utils, Handlebars, mc ) {
    var slotTemplate = '<div id="{{id}}" class="{{cssClasses}}" data-adtype="{{type}}" data-adsize="{{size}}"></div>',
        activeSlots = {},
        _configs = {
            HasAsyncAds: true,
            ShowAds: true,
            SiteName: null,
            IsLoggedIn: false,
            SuperSitePrefix: 'ICHC'
        },
        _hasService = false,
        _service;

    //global GPT object
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];

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

    var render = function ( scope ) {
        var $ads = $( 'div.js-ad', $( scope || document ) ),
            type, size, id;

        $ads.each(function () {
            var $this = $( this );

            type = $this.data( 'adtype' );
            size = $this.data( 'adsize' );
            id = $this.attr( 'id' );

            getAd( type, size, id );
        });

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

    var getAd = function ( type, size, id ) {
        var adUnit = '/1025485/ca-pub-0766144451700556/' + type;

        googletag.cmd.push(function () {
            activeSlots[ id ] = googletag.defineSlot( adUnit, size, id ).addService( _service );
            requestAnimationFrame(function(){
                googletag.display( id );
            });
        });

        return this;
    };

    var refresh = function ( slot ) {
        googletag.cmd.push(function() {
            _service.refresh( slot ); //if slot is undefined, all ads on page are refreshed
        });

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

        return Mustache.render( slotTemplate, model );
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
        hasService: hasService,
        render: render,
        getSiteForTargeting: getSiteForTargeting,
        getPageForTargeting: getPageForTargeting,
        getAd: getAd,
        activeSlots: activeSlots,
        refresh: refresh,
        reload: reload,
        buildAdSlot: buildAdSlot,
        buildAdContainer: buildAdContainer,
        buildSkyScrapersForStream: buildSkyScrapersForStream,
        buildSponsoredPostForStream: buildSponsoredPostForStream
    };
});
