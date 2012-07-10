require.config({
    paths : {
        'jquery': 'libs/jquery'
    }
});
require( [ 'jquery', 'mods/masterControl', 'mods/viewer', 'mods/postservice' ], function( $, mc, viewer, postsrvc ){
    'use strict';

    postsrvc.setup();

    viewer.setup().listen();

    mc.emit( 'app-initialized' );
});
