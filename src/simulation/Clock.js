define([
    'core/EventBus'
],function(
    EventBus
){
    "use strict";
    
    function Clock(){
        this._tock = 0;
        this._watchers = [];
        this._continue = true;
    }

    Clock.prototype = {
        _tick: function(){
            var hasMoreWork = false;

            for(var i = 0, len = this._watchers.length; i < len; i++){
                hasMoreWork = this._watchers[i].run(this._tock) || hasMoreWork;
            }

            this._continue = hasMoreWork;
        },

        getTime: function(){
            return this._tock;
        },

        addWatcher: function(watcher){
            this._watchers.push(watcher);
        },

        start: function(){
            while(this._continue){
                this._tick();
                this._tock++;
            }
        },

        stop: function(){
            this._continue = false;
        },

        destroy: function(){
            this._continue = false; 

            this._watchers = undefined; 
        }
    };

    return Clock;

});