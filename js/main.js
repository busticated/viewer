require.config({
    paths : {
        'jquery': 'libs/jquery'
    }
});
require( [ 'jquery', 'mods/mastercontrol', 'mods/appStatus', 'mods/viewer', 'mods/postservice', 'mods/ads' ], function( $, mc, status, viewer, postsrvc, ads ){
    'use strict';

    postsrvc.setup();

    viewer.setup().listen();

    ads.setup().listen();

    status.setup().listen();

    mc.emit( 'app-initialized' );
});
