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
                totalMessages: 2000, // total number to be created
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

        // Finish off the event before starting.  Avoids locking up the screen
        setTimeout(function(){
            currentSim = SimulationEngineFactory.get(configuration);

            currentSim.start();
        }, 1);
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

    - Refactor
        - Use descrete event simulation
            - Instead of constantly looping for EVERY tick, where we aren't doing anything
                for most ticks, just run for the ticks that we know have an action.
            - For UI purposes, we can set delays between events
                - 42 ticks until the next event? wait X amount of time
                    - Maybe t * m to calculate deplay?
                        - t = ticks
                        - m = milliseconds/tick
            - Clock is completely decoupled.
                - Events are fired to let the clock know that something needs to do work
                    at a predetermined time
                    - Message Generator - Calculates when the next message is sent if it still has messages.
                    - Load Balancer - Calculates when it can distribute a message when a message is added to its queue.
                    - Host - Calculates when the message will be done processing and subsequent message generated.

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
        - UI locks when it's a 'long' simulation
            - setTimeout... wooo...

    - Extensibility
        - Registration
            - Allow for the registration of additional types of Messages, Hosts, Loadbalancers, etv.
 */