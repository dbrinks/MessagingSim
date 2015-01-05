define([
    'messages/MessageQueue'
],function(
    MessageQueue
){
    "use strict";

    return {
        get: function(){
            return new MessageQueue();
        }
    };
});