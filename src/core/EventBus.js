define(function(){
    "use strict";
    
    var listeners = {};

    return {
        publish: function(name){
            var args = Array.prototype.slice.call(arguments, 1),
                listenerList = listeners[name];

            if(listenerList && listenerList.length){
                var length = listenerList.length,
                    i = 0;

                while(i < length){
                    listenerList[i].apply(null, args); // what to do with scope..
                    i++;
                }
            }
        },

        subscribe: function(name, callback){
            if(listeners[name]){
                listeners[name].push(callback);
            }else{
                listeners[name] = [callback];
            }
        },

        clear: function(){
            listeners = {};
        }
    };
});