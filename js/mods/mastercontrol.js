/* global define: false, require: false */

define( [ 'jquery', 'libs/eventer', 'libs/polyfills' ], function( $, Eventer ){
    'use strict';

    var mc = Object.create( new Eventer() );

    return mc;
});
