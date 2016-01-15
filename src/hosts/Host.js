define([
    'core/logging/Logger'
], function(
    Logger
){
    "use strict";

    var CORE_EMPTY = -1,
        NEXT_MESSAGE = 0;

    // Object.keys()

    function Host(messageQueue, config){
        this._processing = {};
        this._messageQueue = messageQueue;
        
        this.id = config.id;
        this._cores = config.cores;
    }

    Host.prototype = {
        _beginProcessingNextMessage: function(tick){
            var message = this._messageQueue.take(NEXT_MESSAGE);
            
            if(message){
                var processingComplete = tick + message.processingTime,
                    processing = this._processing[tick + message.processingTime]; // better name..

                if(processing){
                    this._processing[processingComplete].push(message);
                }else{
                    this._processing[processingComplete] = [message];

                    // Only need to register one action
                    EventBus.publish("register-clock-action", {
                        tick: processingComplete,
                        action: this.processMessage.bind(this)
                    });
                }

                Logger.activity(this.getName() + " will be done processing " + message.getName() + " at " + processingComplete);
            }
        },

        processMessage: function(tick){

        },

        getName: function(){
            return "Host-" + this.id;
        },

        addMessage: function(message){
            this._messageQueue.add(message);

            this._beginProcessingNextMessage();

            Logger.activity(message.getName() + " has been added to the queue of " + this.getName());
        },

        run: function(tick){
            var processingCount = Object.keys(this._processing).length,
                hasWork = this._messageQueue.size() || processingCount,
                completedMessages = this._processing[tick];

            if(completedMessages){
                for(var i = 0; i < completedMessages.length; i++){
                    var message = completedMessages[i];

                    this._beginProcessingNextMessage(tick);

                    Logger.activity(this.getName() + " has completed processing " + message.getName() + " at " + tick);
                    Logger.metric("message-completion-time", tick, {messageType: message.getType});
                }

                delete this._processing[tick];
            }else if(processingCount < this._cores){
                this._beginProcessingNextMessage(tick);
            }

            return !!hasWork;
        },

        destroy: function(){
            this._messageQueue.destroy();

            this._messageQueue = undefined;
            this._processing = undefined;
        }
    };

    return Host;
});
