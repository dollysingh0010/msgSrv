var activeMq = require("./app.js")

//Sample to call message producer
var message = {
    message : {
        name : "user",
        age  : 15,
        city : "Bangalore"
    },
    senderName : "test",
    queueName  : "queue1",
    priority   : 6,
    ttl        :100000000,
    durable    : true
}

setTimeout(function() {
    activeMq.sendData(message).then(function(msgRes) {
        console.log("Message publish successfully",msgRes);
    }).catch(function(err) {
        console.log("error is in produceMessages method--->",err);
    })    
},5000)

//Sample to call consumer method
var params = {
    recieverName : "test",
    queueName    : "queue1"
}

setTimeout(function(){
    activeMq.recieveData(params).then(function(msgRes) {
        console.log("Message consumed successfully",msgRes);
    }).catch(function(err) {
        console.log("error is in consume method--->",err);
        
    })    
},7000)


