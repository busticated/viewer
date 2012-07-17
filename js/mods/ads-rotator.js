/* global define: false, require: false */

define( [ 'jquery', 'mods/mastercontrol' ], function( $, mc ){
    'use strict';

    var a = {};

    a.options = {
        container: '#js-poststream',
        tmpl: [
            '<div class="ad-container">',
                '<div id="js-adgroup-01" class="ad-group ad-group-a is-visible">',
                    '<div id="ad-01" class="js-ad ad ad-left ad-skyscraper" data-adtype="ICHCTEST_160_LEFT_BTFISCROLL_ROS" data-adsize="[[160, 600],[300,600]]"></div>',
                    '<div id="ad-02" class="js-ad ad ad-right ad-skyscraper" data-adtype="ICHCTEST_160_RIGHT_BTFISCROLL_ROS" data-adsize="[[160, 600],[300,600]]"></div>',
                '</div>',
                '<div id="js-adgroup-02" class="ad-group ad-group-b">',
                    '<div id="ad-03" class="js-ad ad ad-left ad-skyscraper" data-adtype="ICHCTEST_160_LEFT_BTFISCROLL_ROS" data-adsize="[[160, 600],[300,600]]"></div>',
                    '<div id="ad-04" class="js-ad ad ad-right ad-skyscraper" data-adtype="ICHCTEST_160_RIGHT_BTFISCROLL_ROS" data-adsize="[[160, 600],[300,600]]"></div>',
                '</div>',
            '</div>'
        ].join( '' ),
        debounceBy: 1000
    };


    a.setup = function(){
        $( a.options.container ).prepend( a.options.tmpl );

        return this;
    };

    a.listen = function(){
        mc.on( 'rotateAds', a.rotateAds );

        return this;
    };

    a.rotateAds = function(){
        a.rotateAds.__timer && clearTimeout( a.rotateAds.__timer );

        a.rotateAds.__timer = setTimeout(function(){
            $( '#js-adgroup-01, #js-adgroup-02' ).toggleClass( 'is-visible' );
        }, a.options.debounceBy );

        return this;
    };

    return a;
});
