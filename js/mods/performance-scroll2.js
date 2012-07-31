/* jshint */
/*global define: false, require: false */
define(['jquery'], function ($) {
    'use strict';

    var testInterval = 25;
    var testDuration = 0;

    var recording = [];
    var o = {};
    var listening = false;

    o.now = function () {
        return +(new Date());
    };

    o.listen = function () {

        if (listening)
            return;

        listening = true;

        var self = this;

        setInterval(function () {
            var start = self.now();

            setTimeout(function () {
                var end = self.now();
                recording.push(end - start);
            });
        }, testInterval);
        return this;
    };

    o.getResults = function () {

        recording.sort(function (a, b) { return a - b });
        var result = {};

        if (recording.length > 0) {
            result.percentile50 = recording[Math.floor(0.5 * recording.length)];
            result.percentile75 = recording[Math.floor(0.75 * recording.length)];
            result.percentile95 = recording[Math.floor(0.95 * recording.length)];
            result.percentile98 = recording[Math.floor(0.98 * recording.length)];
            result.max = recording[recording.length - 1];
        }

        return result;
    };

    return o;
});