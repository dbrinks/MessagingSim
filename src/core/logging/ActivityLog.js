define([
    'core/EventBus'
],function(
    EventBus
){

    var _log = [],
        isLogging = false,
        isLoggingToConsole = false,
        isStreaming = false;

    function _toConsole(log){
        console.log(log);
    }

    return {
        setIsLoggingToConsole: function(isLoggingToConsoleParam){
            isLoggingToConsole = isLoggingToConsoleParam;
        },
        
        setIsLogging: function(isLoggingParam){
            isLogging = isLoggingParam;
        },

        setIsStreaming: function(isStreamingParam){
            isStreaming = isStreamingParam;
        },

        log: function(activity){
            if(isLogging){
                _log.push(activity);
            }

            if(isStreaming){
                _toConsole(activity);
            }
        },

        toConsole: function(){
            if(isLoggingToConsole){
                _toConsole(_log);
            }
        },

        clear: function(){
            _log = [];
        }
    };
});