require.config({
    paths : {
        'jquery': 'libs/jquery',
        'handlebars': 'libs/handlebars-1.0.0.beta.6'
    }
});
require( [ 'jquery', 'handlebars', 'mods/iterator' ], function( $, Handlebars, Iterator ){
    'use strict';

    var post = {
        title: 'hello world!',
        body: 'i am a fake post'
    };

    var tmpl = Handlebars.compile( $('#tmpl-post').html() );

    $('body').append( tmpl( post ) );
});
