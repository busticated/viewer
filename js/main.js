require.config({
    paths : {
        'jquery': 'libs/jquery'
    }
});
require( [ 'jquery', 'mods/viewer', 'mods/postservice' ], function( $, viewer, postsrvc ){
    'use strict';

    postsrvc.setup();

    viewer.setup().listen();
});
