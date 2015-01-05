define([
    'core/EventBus',
    'core/logging/Logger',
    'core/helpers/MathHelper'
], function(
    EventBus,
    Logger,
    MathHelper
){
    "use strict";

    function MessageGenerator(messageFactory, config){
        this.id = config.id;

        this._messageType = config.messageType;
        this._totalMessages = config.totalMessages;
        this._messagesEmitted = 0;
        this._newMessageId = 0;

        this._messageFactory = messageFactory;

        this._minProcessingTime = config.processingTime - config.processingVariation;
        this._maxProcessingTime = config.processingTime + config.processingVariation;

        this._minEmissionWait = config.frequency - config.frequencyVariation;
        this._maxEmissionWait = config.frequency + config.frequencyVariation;

        this._calculateNextMessageEmission();
    }

    MessageGenerator.prototype = {
        _generateMessageConfig: function(tick){

            return {
                id: this._messageType + "-" + (this._newMessageId++),
                processingTime: MathHelper.getRandomNumberInInterval(
                                    this._minProcessingTime, this._maxProcessingTime),
                type: this._messageType,
                createdOn: tick
            };
        },

        _calculateNextMessageEmission: function(tick){
            var waitTime = MathHelper.getRandomNumberInInterval(this._minEmissionWait, this._maxEmissionWait);
            this._nextEmission = (tick || 0) + waitTime;

            // Double check to ensure we don't get hung up...
            if(this._nextEmission < tick){
                this._nextEmission  = tick + 1;
            }
        },

        getName: function(){
            return "Generator-" + this.id;
        },

        run: function(tick){
            var messagesRemaining = this._totalMessages !== this._messagesEmitted;

            if(!messagesRemaining){
                return false;
            }

            if(this._nextEmission === tick){
                var message = this._messageFactory.get(this._generateMessageConfig(tick));

                Logger.activity(message.getName() + " has been emitted by " + this.getName());

                EventBus.publish(this._messageType + ":created", message);

                this._calculateNextMessageEmission(tick);
                this._messagesEmitted++;
            }

            if(!messagesRemaining){
                Logger.activity(this.getName() + " has emitted " + this._totalMessages + " messages");
            }

            return messagesRemaining;
        },

        destroy: function(){
            // not much to do!
        }
    };

    return MessageGenerator;
});