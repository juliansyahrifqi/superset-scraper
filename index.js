import amqp from "amqplib/callback_api"
import { doLogin } from "./test-superset";

(async() => {
  amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}`, {
    heartbeat: 10,
    heartbeatTimeout: 30,
  },
  async function(error0, connection) {
    if(error0) {
      throw error0;
    }
    
    connection.createChannel(function(error1, channel) {
      if(error1) {
        throw error1
      }
      
      const queue = "process_screenshot"
      const msg = JSON.stringify({
        chartUrl: ""
      })

      channel.assertQueue(queue, {
        durable: true,
      })

      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true
      });
    })
  })
})()