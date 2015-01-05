define([
    "messages/Message"
],
function(
    Message
){
    "use strict";

    return {
        // pass maths to new message, return new message
        get: function(config){
            return new Message(config);
        }
    };
});