/* jshint */
/*global define: false, require: false */
define(['jquery'], function ($) {
    'use strict';
    
    var timeoutIntervalMS = 15; 

    var o = {};

    o._listeners = [];

    o.__scrollLatency = {};

    o.now = function () {
        return +(new Date());
    };

    o.listen = function () {
        
        var self = this;

        $(window).scroll(function() {
            self.lastScrolled = self.now();
            if (!self.isCollectingScrollLatency) {
                self.isCollectingScrollLatency = true;
                self.lastRanScrollLatencyCollection = self.now();
                setTimeout(function() {
                    $.each(self._listeners, function(index,listener){ listener.onStart();});
                    self.collectScrollLatency();
                }, timeoutIntervalMS);
            }
        });
        
        self.addListener({
            onStart: function () { self.resetScrollLatency(); },
            onLatencyObserved: function (value) { self.setScrollLatency(value); },
            onFinish: function () {
                 self.logScrollLatency();
            }
        });

        return this;
    };

    o.isCollectingScrollLatency = false;

    o.addListener = function (listener) {
        o._listeners.push(listener);  
    };

    o.hasStoppedScrolling = function() {
        return this.now() - this.lastScrolled > 500;
    };

    o.collectScrollLatency = function() {
        var self = this,
            latency = self.now() - self.lastRanScrollLatencyCollection;

        self.lastRanScrollLatencyCollection = self.now();
        $.each(self._listeners, function (index, listener) { listener.onLatencyObserved(latency); });

        if (self.hasStoppedScrolling()){
            self.isCollectingScrollLatency = false;
            $.each(self._listeners, function (index, listener) { listener.onFinish(); });
        } else {
            setTimeout(function () {
                self.collectScrollLatency();
            }, timeoutIntervalMS);
        }
    };

    o.getScrollLatency = function() {
        return this.__scrollLatency;
    };

    o.setScrollLatency = function(latency) {
        var data = this.__scrollLatency;

        if (typeof data.count === 'undefined') {
            data = this.resetScrollLatency().__scrollLatency;
        }
        
        data.count++;
        data.sum += latency;
        data.sumOfSquares += latency * latency;

        var lotLatency = Math.log(latency);
        data.logSum += lotLatency;
        data.logSumOfSquares += lotLatency * lotLatency;

        return this;
    };

    o.resetScrollLatency = function() {
        this.__scrollLatency = {
            count: 0,
            sum: 0,
            sumOfSquares: 0,
            logSum: 0,
            logSumOfSquares: 0
        };

        return this;
    };

    o.logScrollLatency = function() {
        if (JSON) {
            window._ba.push(['_trackScrollLatency', JSON.stringify(this.__scrollLatency)]);
        }

        return this;
    };

    o.addPercentileListener = function () {
        
        var tally = [];

        var listener = {
            onStart: function () { },
            onLatencyObserved: function (value) { tally.push(value); },
            onFinish: function () { },
            getResults: function () {
                tally.sort(function (a, b) { return a - b });
                var result = [];
                
                if (tally.length > 0) {
                    result.push(tally[Math.floor(0.5 * tally.length)]);
                    result.push(tally[Math.floor(0.95 * tally.length)]);
                    result.push(tally[Math.floor(0.98 * tally.length)]);
                    result.push(tally[tally.length - 1]);
                }
                
                return result;
            }
        };

        o.addListener(listener);
        
        return listener;
    };

    return o;
});