define([
    'messages/MessageQueueFactory',
    'loadBalancers/LoadBalancer'
], function(
    MessageQueueFactory,
    LoadBalancer
){
    "use strict";

    var id = 0;

    return{
        get: function(config){
            var queue = MessageQueueFactory.get();

            config.id = id++;

            return new LoadBalancer(queue, config);
        }
    };
});