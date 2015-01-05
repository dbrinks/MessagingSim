define(function(){
    "use strict";

    function Message(config){
        this.id = config.id;
        this.type = config.type;
        this._createdOn = config.createdOn;

        this.processingTime = config.processingTime;
        this._previousTick = config.createdOn;
    }

    Message.prototype = {
        getName: function(){
            return "Message-" + this.id;
        },

        isAvailable: function(tick){
            return this._previousTick !== tick;
        },

        setPreviousTick: function(tick){
            this._previousTick = tick;  
        }
    };

    return Message;
});
