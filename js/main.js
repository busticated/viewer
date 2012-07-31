require.config({
    paths : {
        'jquery': 'libs/jquery'
    }
});
require( [ 'jquery', 'mods/mastercontrol', 'mods/appStatus', 'mods/viewer', 'mods/postservice', 'mods/ads', 'mods/ads-rotator', 'mods/facebookShare', 'mods/performance-scroll', 'mods/performance-scroll2' ], function( $, mc, status, viewer, postsrvc, ads, adRotator, fbshare ){
    'use strict';

    postsrvc.setup();

    ads.setup().listen();
    adRotator.setup().listen();

    fbshare.listen();
    viewer.setup().listen();

    status.setup().listen();

    mc.emit( 'app-initialized' );
});
