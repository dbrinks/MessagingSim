define([
    'messages/MessageQueueFactory',
    'hosts/Host'
],function(
    MessageQueueFactory,
    Host
){
    "use strict";
    var id = 0;
    
    return { 
        // provide all variables via params, do any maths, pass maths to new Host, return new Host
        get: function (config){
            var queue = MessageQueueFactory.get();

            config.id = id++;

            return new Host(queue, config);
        }
    };
});