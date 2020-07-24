
var express         = require('express');
var app             = express();
const { Client }    = require('@sap/xb-msg-amqp-v100');
var bodyParser      = require('body-parser')
var activeMQConnect = null;
var connectionState = false;
var reconnectCount  = 1;
var xsenv           = require("@sap/xsenv");
var maxReconnectCount = process.env.MAX_RECONNECT_COUNT;
var timeInterval    = process.env.RECONNECTION_INTERVAL;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
xsenv.loadEnv();

function setOptions() {
    console.log("<<< Inside setOptions method---")
    var creds = xsenv.serviceCredentials({ tag: 'messaging-service', name : "activemq"});
    console.log(creds);
    var temp = creds.url.split("//");
    var temp1 = temp[1].split(":");
    
    var options = {};
    // options.net = {
    //     host : "localhost",//temp1[0],
    //     port : 5672//Number(temp1[1])
    // };
    // console.log("options is--",options)
    // options.sasl = {
    //     mechanism: 'PLAIN',
    //     user: 'guest',
    //     password: 'guest'
    // }
    options.uri = "amqp://guest:guest@localhost:5672/"
//    options.uri = "amqps://SBSS_94664083198069529098739878420781041771857328856586610606370495111:Wx5-zYJkIYE9V6u5L.zhUNnrUVVbe8VfWZCtgdtPwV-aCmheRPddcvE.F-KO.R0vR3tUzCtFPXwY6HCddzE77CC1KkL91kY8aQyqGcd.8fMMvnBOT-4dB2R2CuN7-ENp@gcl0139.wdf.sap.corp:51024/"

    return options;
}
global.activeMQConnect  =  null;
global.connectionState  =  false;

global.activeMQConnect = new Client(setOptions());
global.activeMQConnect.connect();

// Events to handle connect\disconnect\error
global.activeMQConnect.on('connected',(destination, peerInfo) => {
    console.log('<<<< connected with--', peerInfo.description);
    console.log("<<<< destination is--",destination) //can be greater than 0 if multiple URIs are defined
    //Setting below variable to handle reconnection
    global.connectionState = true;
    reconnectCount = 1;

})

//In case of error,It will trigger disconnect error
.on('error', (error) => {
    console.log("<<<< Inside error--",error.message);
})

.on('reconnecting', (destination) => {
    console.log('<<<< reconnecting, using destination--',destination);
    global.connectionState = true;
    console.log("<<<< state in reconnecting--",global.connectionState)

})

//In case of disconnect,It will try to reconnect
.on('disconnected', (hadError, byBroker, statistics) => {
    console.log('<<<< disconnected --',hadError,byBroker,statistics);
    reconnectCount++;
    global.connectionState = false;
    console.log("<<<< state in disconnected--",global.connectionState,reconnectCount)

    if(!global.connectionState && reconnectCount<maxReconnectCount) {
        var retryConnection = setInterval(function() {
            global.activeMQConnect.connect();
            if(global.connectionState || reconnectCount>maxReconnectCount) {
                console.log("<<<<--clearing setInterval-->>>>",reconnectCount)
                clearInterval(retryConnection);
            }
        },timeInterval)
    }
})

