define([
    'core/EventBus',
    'core/logging/Logger'
],function(
    EventBus,
    Logger
){
    "use strict";

    /*
        Super simple: sends messages to the hosts in order of registration
     */
    function LoadBalancer(messageQueue, config){
        this._hosts = [];
        this._currentHost = 0;

        this._messageQueue = messageQueue;
        this._consumeMessageType = config.consumeMessageType;
        this.id = config.id;

        this._bindEvents();
    }

    LoadBalancer.prototype = {
        _bindEvents: function(){
            EventBus.subscribe(this._consumeMessageType + ":created", this.addMessage.bind(this));
        },

        isDistributable: function(tick){
            return this._hosts.length && this._messageQueue.isMessageAvailable(tick);
        },

        addHost: function(host){
            this._hosts.push(host);
        },

        getName: function(){
            return "LoadBalancer-" + this.id;
        },

        addMessage: function(message){
            this._messageQueue.add(message);

            Logger.activity(message.getName() + " was added to the queue of " + this.getName());
        },
        
        run: function(tick){
            var isDistributable = this.isDistributable(tick);

            if(this.isDistributable(tick)) { 
                var message = this._messageQueue.take(tick),
                    host = this._hosts[this._currentHost++];

                Logger.activity(this.getName() + " has sent " + message.getName() + " to " + host.getName());
                host.addMessage(message);

                if(this._currentHost === this._hosts.length){
                    this._currentHost = 0;
                }
            }

            return isDistributable;
        },

        destroy: function(){
            for(var i = 0; i < this._hosts.length; i++){
                this._hosts[i].destroy();
            }

            this._hosts = undefined;
        }
    };

    return LoadBalancer;
});