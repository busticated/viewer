require.config({
    paths : {
        'jquery': 'libs/jquery'
    }
});
require( [ 'jquery', 'mods/mastercontrol', 'mods/appStatus', 'mods/viewer', 'mods/postservice', 'mods/ads', 'mods/ads-rotator', 'mods/facebookShare' ], function( $, mc, status, viewer, postsrvc, ads, adRotator, fbshare ){
    'use strict';

    postsrvc.setup();

    fbshare.listen();
    viewer.setup().listen();

    ads.setup().listen();
    adRotator.setup().listen();

    status.setup().listen();

    mc.emit( 'app-initialized' );
});
