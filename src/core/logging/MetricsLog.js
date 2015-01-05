define([
    'core/EventBus'
],function(
    EventBus
){
    var _log = {},
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

        log: function(name, value, extraProperties){
            var metricObj = {
                value: value, 
                properties: extraProperties
            };

            // I know this looks weird, but not having an array when 
            // there's only one item makes it easier to read the metric
            // when it's logged to console.
            if(_log[name] && _log[name] instanceof Array){
                _log[name].push(metricObj);
            }else if(_log[name]){
                _log[name] = [_log[name], metricObj];
            }else{
                _log[name] = metricObj;
            }

            if(isStreaming){
                _toConsole({ name: name, value: value});
            }
        },

        toConsole: function(){
            if(isLoggingToConsole){
                window.logs = _log;
                _toConsole(_log);
            }
        },

        clear: function(){
            _log = {};   
        }
    };
});
