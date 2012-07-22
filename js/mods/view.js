/* jshint */
/*global define: false, require: false */
define( [ 'jquery' ], function ( $ ) {
    var View = function View( model, template ){
        this.model = model;
        this.tmpl = template;
    };

    View.prototype = {
        setup: function(){
            return this;
        },
        render: function(){
            return this;
        },
        remove: function(){
            return this;
        },
        select: function(){
            return this;
        }
    };

    return View;
});
