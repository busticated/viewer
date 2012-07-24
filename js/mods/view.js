/* jshint */
/*global define: false, require: false */
define( [ 'jquery' ], function ( $ ) {
    'use strict';

    var View = function View( model, template ){
        if ( ! ( this instanceof View ) ){
            return new View( model, template );
        }

        this.model = model;
        this.tmpl = template;
    };

    View.prototype.setup = $.noop;
    View.prototype.render = $.noop;
    View.prototype.remove = $.noop;
    View.prototype.select = $.noop;

    return View;
});
