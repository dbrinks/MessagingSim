define(function(){
    "use strict";

    var FIRST_ITEM = 0;

    function MessageQueue(){
        this._internalQueue = [];
    }

    MessageQueue.prototype = {
        add: function(message){
            this._internalQueue.push(message);
        },

        take: function(tick){
            var message = this._internalQueue[FIRST_ITEM];

            if(message){
                message.setPreviousTick(tick);
            }
            return message ? this._internalQueue.shift() : undefined;
        },

        size: function(){
            return this._internalQueue.length;
        },

        isMessageAvailable: function(tick){
            return this.size() && this._internalQueue[FIRST_ITEM].isAvailable(tick);
        },

        peek: function(index){
            return this.size() > index ? this._internalQueue[index] : undefined;
        },

        destroy: function(){
            this._internalQueue = undefined;
        }
    };

    return MessageQueue;
});