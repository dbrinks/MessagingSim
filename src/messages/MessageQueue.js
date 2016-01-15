define([
    "core/Queue"
], function(
    Queue
){
    "use strict";

    var FIRST_ITEM = 0;

    function MessageQueue(){
        this._queue = new Queue();
    }

    MessageQueue.prototype = {
        add: function(message){
            this._queue.push(message);
        },

        take: function(tick){
            var message = this._queue[FIRST_ITEM];

            if(message){
                message.setPreviousTick(tick);
            }
            return message ? this._queue.shift() : undefined;
        },

        size: function(){
            return this._queue.length;
        },

        isMessageAvailable: function(tick){
            return this.size() && this._queue[FIRST_ITEM].isAvailable(tick);
        },

        peek: function(index){
            return this.size() > index ? this._queue[index] : undefined;
        },

        destroy: function(){
            this._queue = undefined;
        }
    };

    return MessageQueue;
});