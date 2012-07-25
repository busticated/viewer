/* global define: false, require: false */

define( [ 'jquery', 'mods/mastercontrol', 'mods/ads', 'mods/utils' ], function( $, mc, ads, utils ){
    'use strict';

    var a = {};

    a.options = {
        container: '#js-poststream',
        tmpl: [
            '<div class="ad-container ad-rotator">',
                '<div id="js-adgroup-01" class="ad-group ad-group-a is-visible">',
                    '<div id="ad-skyscraper-01" class="js-ad ad ad-left ad-skyscraper" data-adtype="ICHCTEST_160_LEFT_BTFISCROLL_ROS_0" data-adsize="[[160, 600],[300,600]]"></div>',
                    '<div id="ad-skyscraper-02" class="js-ad ad ad-right ad-skyscraper" data-adtype="ICHCTEST_160_RIGHT_BTFISCROLL_ROS_0" data-adsize="[[160, 600],[300,600]]"></div>',
                '</div>',
                '<div id="js-adgroup-02" class="ad-group ad-group-b">',
                    '<div id="ad-skyscraper-03" class="js-ad ad ad-left ad-skyscraper" data-adtype="ICHCTEST_160_LEFT_BTFISCROLL_ROS_1" data-adsize="[[160, 600],[300,600]]"></div>',
                    '<div id="ad-skyscraper-04" class="js-ad ad ad-right ad-skyscraper" data-adtype="ICHCTEST_160_RIGHT_BTFISCROLL_ROS_1" data-adsize="[[160, 600],[300,600]]"></div>',
                '</div>',
            '</div>'
        ].join( '' ),
        debounceBy: 1000
    };

    a.setup = function(){
        $( a.options.container ).prepend( a.options.tmpl );
        ads.render( $( '#js-adgroup-01, #js-adgroup-02' ) );

        return this;
    };

    a.listen = function(){
        mc.on( 'ads.rotate', a.rotateAds );

        return this;
    };

    a.rotateAds = function(){
        var $scope;

        a.rotateAds.__timer && clearTimeout( a.rotateAds.__timer );

        a.rotateAds.__timer = setTimeout(function(){
            $scope = $( '#js-adgroup-01, #js-adgroup-02' ).toggleClass( 'is-visible' ).not( '.is-visible' );
            ads.refresh( $scope );
        }, a.options.debounceBy );

        return this;
    };

    return a;
});
