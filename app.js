require("./utils/amqpv100Connector.js");
var producer = require("./utils/amqpV100QueueProducer.js")
var reciever = require("./utils/amqpV100QueueConsumer.js");

module.exports = {
    sendData : producer,
    recieveData : reciever
}
