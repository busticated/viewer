require.config({
    paths : {
        'jquery': 'libs/jquery',
        'handlebars': 'libs/handlebars-1.0.0.beta.6'
    }
});
require( [ 'jquery', 'mods/viewer' ], function( $, viewer ){
    'use strict';

    viewer.setup().listen();
});
