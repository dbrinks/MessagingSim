define([
    'simulation/SimulationEngine',
    'simulation/ClockFactory',
    'hosts/HostFactory',
    'messageGenerators/MessageGeneratorFactory',
    'loadBalancers/LoadBalancerFactory'
], function(
    SimulationEngine,
    ClockFactory,
    HostFactory,
    MessageGeneratorFactory,
    LoadBalancerFactory
){
    return {
        get: function(config){
            return new SimulationEngine(SimulationEngine,
                                        ClockFactory,
                                        HostFactory,
                                        MessageGeneratorFactory,
                                        LoadBalancerFactory,
                                        config);
        }
    };
});