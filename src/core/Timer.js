define(function(){
    var _times = {};

    function now(){
        return new Date().getTime();
    }

    return {
        start: function(name){
            _times[name] = now();
        },

        end: function(name){
            var difference = now() - _times[name];

            delete _times[name];

            return difference;
        }
    };
});