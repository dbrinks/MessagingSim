define([
    'core/EventBus'
],function(
    EventBus
){
    "use strict";

    var MS_PER_TICK = 10;

    function Clock(){
        this._tock = 0;
        this._watchers = [];
        this._continue = true;

        this._actions = {};
        this._tickQueue = [];

        this._bindEvents();
    }

    Clock.prototype = {

        _bindEvents: function(){
            EventBus.subscribe("register-clock-action", this.registerEvent.bind(this));
        },

        registerEvent: function(event){
            var registeredEvent = this._actions[event.tick];

            if(registeredEvent){
                registeredEvent.push(event.action);
            }else{  
                this._actions[event.tick] = [event.action];
                this._tickQueue.push(event.tick);

                // definitely a more efficient way of doing this.  
                // But this works for now
                this._tickQueue = this._tickQueue.sort();
            }
        },

        startDES: function(){
            var tick = this._tickQueue.shift(),
                actions = this._actions[tick];

            var callback = function(){
                console.log("run after " + (tick * MS_PER_TICK));
            };

            for(var i = 0; i < actions.length; i++){
                setTimeout(callback, tick * MS_PER_TICK);
            }

            delete this._actions[tick];
        },

        nextTime: function(time){
            var actions = this._actions[time];

            for(var i = 0; i < actions.length; i++){
                actions[i]();
            }

            delete this._actions[time];
        },

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