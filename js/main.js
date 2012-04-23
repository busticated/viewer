require.config({
    paths : {
        'jquery': 'libs/jquery',
        'handlebars': 'libs/handlebars-1.0.0.beta.6',
        'sinon': 'libs/sinon-1.3.4'
    }
});
require( [ 'jquery', 'mods/viewer', 'mods/postservice' ], function( $, viewer, postsrvc ){
    'use strict';

    postsrvc.setup();

    viewer.setup().listen();
});
