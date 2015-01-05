define([
    "simulation/Clock"
],
function(
    Clock
){
    "use strict";
    
    return { 
        get: function(){
            return new Clock();
        }
    };
});