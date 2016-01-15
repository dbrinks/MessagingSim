define(function(){
    "use strict";
    
    var FIRST_ITEM = 0;

    var Queue = function(){
        this._internal = [];
    };

    Queue.prototype = {
        next: function(){
            return this._internal.shift();
        },

        push: function(value){
            return this._internal.push(value);
        },

        size: function(){
            return this._internal.length;
        },

        peek: function(){
            return this._internal[FIRST_ITEM];
        }
    };

    return Queue;
});