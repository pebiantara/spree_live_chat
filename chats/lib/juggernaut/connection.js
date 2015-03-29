var util    = require("util");
var Client  = require("./client");
var redis   = require("redis");
var Channel = require("./channel");

Connection = module.exports = require("./klass").create();

Connection.include({
  init: function(stream){
    this.stream     = stream;
    this.session_id = this.stream.id;
    this.client     = Client.inst(this);

    this.stream.on("message", this.proxy(this.onmessage));
    this.stream.on("disconnect", this.proxy(this.ondisconnect));
  },
  
  onmessage: function(data){
    util.log("Received: " + data);
    
    try {
      var message = Message.fromJSON(data);
    
      switch (message.type){
        case "subscribe":
          this.client.subscribe(message.getChannel());
        break;
        case "unsubscribe":
          this.client.unsubscribe(message.getChannel());
        break;
        case "meta":
          this.client.setMeta(message.data);
        break;
        case "event":
          this.client.event(message.data);
        break;
        case "publish":
          Channel.publish(message);
        break;
        case "online":
          c = redis.createClient();
          c.sadd('online_users:'+message.data.tenant, JSON.stringify(message.data));
          key = "online_users:"+message.data.tenant;
          c.smembers(key, function(error, data){
            message.data = data;
            Channel.publish(message);
          });
        break;
        case "online_users":
          c = redis.createClient();
          key = "online_users:"+message.data.tenant;
          c.smembers(key, function(error, data){
            message.data = data;
            Channel.publish(message);
          });
        break;
        case "disconnect":
          c = redis.createClient();
          c.srem("online_users:"+message.data.tenant, JSON.stringify(message.data));
          key = "online_users:"+message.data.tenant;
          c.smembers(key, function(error, data){
            message.data = data;
            Channel.publish(message);
          });
        break;
        default:
          throw "Unknown type"
      }
    } catch(e) { 
      util.error("Error!");
      util.error(e);
      return; 
    }
  },
  
  ondisconnect: function(){
    this.client.disconnect();
  },
  
  write: function(message){
    if (typeof message.toJSON == "function")
      message = message.toJSON();
    this.stream.send(message);
  }
});