require.config({
    paths : {
        'jquery': 'libs/jquery',
        'handlebars': 'libs/handlebars-1.0.0.beta.6'
    }
});
require( [ 'jquery', 'handlebars', 'mods/viewer' ], function( $, Handlebars, viewer ){
    'use strict';


    window.viewer = viewer;

    viewer.setup().listen();
});

/*
 * Viewer:
 * + 
 *
 */
