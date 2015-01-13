define(function(){
    var _times = {};

    function _now(){
        return new Date().getTime();
    }

    return {
        start: function(name){
            _times[name] = _now();
        },

        end: function(name){
            var difference = _now() - _times[name];

            delete _times[name];

            return difference;
        }
    };
});