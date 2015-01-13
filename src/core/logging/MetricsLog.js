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

        setIsStreaming: function(isStreamParam){
            isStreaming = isStreamParam;
        },

        log: function(name, value){
            var metric = { name: name, value: value};

            _log.push(metric);

            if(isStreaming){
                _toConsole(metric);
            }
        },

        toConsole: function(){
            if(isLoggingToConsole){
                window.logs = _log;
                _toConsole(_log);
            }
        },

        clear: function(){
            _log = [];   
        }
    };
});
