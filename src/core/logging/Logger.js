define([
    'core/EventBus',
    'core/logging/ActivityLog',
    'core/logging/MetricsLog'
], function(
    EventBus,
    ActivityLog,
    MetricsLog
){
    var isLogging = false,
        isLoggingToConsole = true,
        isStreaming = false;

    EventBus.subscribe("toggle-logging", function(isDebugLogging){
        isLogging = isDebugLogging;

        _setLoggingStates();
    });

    EventBus.subscribe("toggle-streaming", function(isDebugStreaming){
        isLogging = isDebugStreaming;

        _setLoggingStates();
    });

    function _setLoggingStates(){
        ActivityLog.setIsLogging(isLogging);
        ActivityLog.setIsLoggingToConsole(isLoggingToConsole);
        ActivityLog.setIsStreaming(isStreaming);

        MetricsLog.setIsLogging(isLogging);
        MetricsLog.setIsLoggingToConsole(isLoggingToConsole);
        MetricsLog.setIsStreaming(isStreaming);
    }

    _setLoggingStates();

    return {
        activity: function(log){
            ActivityLog.log(log);
        },

        metric: function(name, value){
            MetricsLog.log(name, value);
        },

        toConsole: function(){
            ActivityLog.toConsole();
            MetricsLog.toConsole();
        },

        clear: function(){
            ActivityLog.clear();
            MetricsLog.clear();
        }
    };
});