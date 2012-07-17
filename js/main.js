require.config({
    paths : {
        'jquery': 'libs/jquery'
    }
});
require( [ 'jquery', 'mods/mastercontrol', 'mods/appStatus', 'mods/viewer', 'mods/postservice', 'mods/ads-rotator' ], function( $, mc, status, viewer, postsrvc, adRotator ){
    'use strict';

    postsrvc.setup();

    viewer.setup().listen();

    adRotator.setup().listen();

    status.setup().listen();

    mc.emit( 'app-initialized' );
});
