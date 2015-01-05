define([
    'messages/MessageFactory',
    'messageGenerators/MessageGenerator'
],function(
    MessageFactory,
    MessageGenerator
){
    "use strict";

    var id = 0;
    
    return {
        get: function(config){
            config.id = id++;

            return new MessageGenerator(MessageFactory, config);
        }
    };
});