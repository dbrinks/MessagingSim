require([
    'simulation/SimulationEngineFactory'
],
function(
    SimulationEngineFactory
){

    var currentSim;


    // provided by UI configuration
    var configuration = {
        clusterConfigurations: [
            {
                consumeMessageType: "one", // listens for these messages
                emitMessageType: "two", // creates new message with this type
                loadBalancer: {
                    processingTime: 1, // how many ticks to redirect a message?
                    memory: 256 // not currently used
                },
                hosts: [
                    { 
                        cores: 4, // not currently used
                        memory: 256 // not currently used
                    }
                ]
            }
        ],
        messageConfigurations: [
            {
                messageType: "one", // key corresponds to messageType
                totalMessages: 200, // total number to be created
                frequency: 5, // new one every 5 
                frequencyVariation: 3, // how often the messages are created
                processingTime: 10, // 10 ticks to complete
                processingVariation: 2 // +/- 2 ticks to processing time
            }
        ]
    };

    var start = document.getElementById("start-sim"),
        stop = document.getElementById("stop-sim"),
        reset = document.getElementById("reset-sim");

    start.addEventListener("click", function(){
        if(currentSim){
            currentSim.destroy();
        }
        currentSim = SimulationEngineFactory.get(configuration);

        currentSim.start();
    }, false);

    stop.addEventListener("click", function(){
        if(currentSim){
            currentSim.stop();
        }
    }, false);

    reset.addEventListener("click", function(){
        if(currentSim){
            currentSim.destroy();

            currentSim = undefined;
        }
    }, false);

});

/*

TODOs:
    - UI
        - Very basic debug UI 
            - would be nice so I don't have ot keep using console.log
        - Simulation customization components
        - UI animations (Canvas?)

    - Simulation
        - Add host emit messaging
            - Optinal
            - Host may emit another message, or it may just be a consumer
        - Add host memory capacity
            - When X messages are in queue, it's full.
            - Responds to LB with a NOPE.
            - LB must try to assign it to another host.
        - Add max messages in flight
            - Eh, maybe..
        - Add better metrics logging
            - Should be able to work on a set of data
                - Provide categories that a metric belongs to
                - Can then call sum, avg, total, etc on those sets.
            - Realtime metrics logging. 
                - MetricsLog has 2 dependencies
                    - ConsoleLogger
                        - Outputs to console...
                        - ActivityLog can take advantage as well
                    - MetricsStreamer
                        - Watches for logs, updates the UI

    - Performance
        - Hosts don't watch the clock. Register hosts with a clock watcher
            - Reduces the number of clock watchers to one
            - Host clock watcher will get all hosts who are done processing at a certain tick and tell them to get the next message

    - Extensibility
        - Registration
            - Allow for the registration of additional types of Messages, Hosts, Loadbalancers, etv.
 */