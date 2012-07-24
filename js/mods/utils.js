/* jshint */
/*global define: false, require: false */
define(function () {
    var addScript = function (cfg) {
        var doc = window.document,
            isSSL = doc.location.protocol === 'https:' ? true : false,
            t = 'script',
            el = doc.createElement(t),
            slot = doc.getElementsByTagName(t)[0];

        if ( !cfg.path ) {
            return false;
        }

        cfg = cfg || {};
        cfg.http = cfg.http || '//';
        cfg.https = cfg.https || cfg.http;
        el.id = cfg.id || '';
        el.className = cfg.className || 'chz-script';
        el.async = cfg.async === false ? false : true;
        el.src = ( isSSL ? cfg.https : cfg.http ) + cfg.path;
        slot.parentNode.insertBefore(el, slot);

        return el;
    };

    //note: not a *real* guid... but reasonably unique given our usage
    //credit: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    var makeGUID = function () {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
            var r = Math.random() * 16 | 0,
                            v = c == 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        });

        return guid;
    };

    // public api /////////////////////////////////////////////////////////////
    return {
        addScript: addScript,
        makeGUID: makeGUID
    };
});
