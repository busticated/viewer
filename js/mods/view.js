/* jshint */
/*global define: false, require: false */
define( [ 'jquery' ], function ( $ ) {
    var View = function View( model, template ){
        this.model = model;
        this.tmpl = template;
    };

    View.prototype = {
        setup: $.noop,
        render: $.noop,
        remove: $.noop,
        select: $.noop
    };

    return View;
});
