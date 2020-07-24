
module.exports = function(params) {
    return new Promise(function(resolve, reject) {
        if(!global.connectionState) {                                      
           return reject({success : false, msg : "Activemq server is down"}) // sending error response if activemq server is not up
        }
        var payload = Buffer.from(JSON.stringify(params.message));
        var message = { 
            payload : payload,
            target: {
                header: {
                    durable: params.durable || true,
                    priority: params.priority || 3,
                    ttl: params.ttl || null
                },
            },
            done: () => {
                return resolve({success : true});
            },
            failed: (err) => {
                return reject({success : false, msg : "Error in genereting message"});
            }
        }       
        //Data to be write in message broker
        const stream = global.activeMQConnect.sender(params.senderName).attach(params.queueName);
        stream.write(message); 
        stream.end();
    })
}







