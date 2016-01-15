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
            var tick = event.tick,
                action = event.action,
                registeredEvent = this._actions[tick];

            if(registeredEvent){
                registeredEvent.push(action);
            }else{  
                this._actions[tick] = [action];

                if(this._tickQueue.indexOf(tick) === -1){
                    this._tickQueue.push(tick);

                    this._tickQueue = this._tickQueue.sort();
                }
            }
        },

        startDES: function(){
            var tick = this._tickQueue.shift(),
                actions = this._actions[tick];

            for(var i = 0; i < actions.length; i++){
                setTimeout(actions[i], tick * MS_PER_TICK);
            }

            this._actions[tick] = null;
        },

        nextTime: function(time){
            var actions = this._actions[time];

            for(var i = 0; i < actions.length; i++){
                actions[i]();
            }

            this._actions[time] = null;
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