var fs = require('fs');

module.exports = function(params) {
    return new Promise(function(resolve, reject) {
        var stream = global.activeMQConnect.receiver(params.recieverName).attach(params.queueName);
        if(!global.connectionState) {                                      
            return reject({success : false , msg : "Activemq server is down"}) // sending error response if activemq server is not up
        }
        stream.on('data',function(message) {      
            var temp = message.payload;
            var str = JSON.parse(temp.toString());
            message.done(); 
            return resolve({success : true, data : str});
        });    
    })
    
}







