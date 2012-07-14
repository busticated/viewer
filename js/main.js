require.config({
    paths : {
        'jquery': 'libs/jquery'
    }
});
require( [ 'jquery', 'mods/masterControl', 'mods/appStatus', 'mods/viewer', 'mods/postservice' ], function( $, mc, status, viewer, postsrvc ){
    'use strict';

    postsrvc.setup();

    viewer.setup().listen();

    status.setup().listen();

    mc.emit( 'app-initialized' );
});
