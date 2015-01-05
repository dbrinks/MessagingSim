define([
    "core/Timer",
    "core/logging/Logger",
],function(
    Timer, 
    Logger
){

    function SimulationEngine(SimulationEngine,
                                ClockFactory,
                                HostFactory,
                                MessageGeneratorFactory,
                                LoadBalancerFactory,
                                config){

        this._clock = ClockFactory.get();

        this._clusters = [];
        this._generators = [];

        for(var c = 0; c < config.clusterConfigurations.length; c++){
            var clusterConfig = config.clusterConfigurations[c],
                loadBalancerConfig = clusterConfig.loadBalancer;

            var loadBalancer = LoadBalancerFactory.get({
                consumeMessageType: clusterConfig.consumeMessageType,
                processingTime: loadBalancerConfig.processingTime
            });

            var hostConfigs = clusterConfig.hosts;

            for(var h = 0; h < hostConfigs.length; h++){
                var hostConfig = hostConfigs[h],
                    host = HostFactory.get(hostConfig);

                this._clock.addWatcher(host);

                loadBalancer.addHost(host);
            }

            this._clock.addWatcher(loadBalancer);

            this._clusters.push(loadBalancer);
        }

        for(var mg = 0; mg < config.messageConfigurations.length; mg++){
            var generatorConfig = config.messageConfigurations[mg];

            var generator = MessageGeneratorFactory.get(generatorConfig);

            this._clock.addWatcher(generator);
        }
    }

    SimulationEngine.prototype = {
        start: function(){
            Timer.start("simulation");
            this._clock.start();

            Logger.metric("simulation-real-time", Timer.end("simulation"));
            Logger.metric("simulation-time", this._clock.getTime());

            Logger.toConsole();
        },

        stop: function(){
            this._clock.stop();
        },

        destroy: function(){
            this._clock.destroy();
            Logger.clear();

            for(var c = 0; c < this._clusters.length; c++){
                this._clusters[c].destroy();
            }

            for(var g = 0; g < this._generators.length; g++){
                this._generators[g].destroy();
            }

            this._clock = undefined;
            this._clusters = undefined;
            this._generators = undefined;
        }
    };

    return SimulationEngine;
});