'use strict';

const amqp = require('amqplib');

async function consume() {
  try {
    const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');
    const channel = await connection.createChannel();

    const exchangeName = 'headers_exchange';
    const queueName = 'myQueue';

    // Declare the headers exchange
    await channel.assertExchange(exchangeName, 'headers', { durable: false });

    // Declare the queue
    await channel.assertQueue(queueName, { durable: false });

    // Consumer: Receive messages from the queue
    channel.consume(queueName, (msg) => {
      console.log('MSG:', msg);
      /**
       * MSG: {
       *   fields: {
       *     consumerTag: 'amq.ctag-px3tOXDWoFiQUU-Lq6saCw',
       *     deliveryTag: 1,
       *     redelivered: false,
       *     exchange: 'headers_exchange',
       *     routingKey: ''
       *   },
       *   properties: {
       *     contentType: undefined,
       *     contentEncoding: undefined,
       *     headers: {
       *       'content-type': 'application/json',
       *       'custom-header': 'important'
       *     },
       *     deliveryMode: undefined,
       *     priority: undefined,
       *     correlationId: undefined,
       *     replyTo: undefined,
       *     expiration: undefined,
       *     messageId: undefined,
       *     timestamp: undefined,
       *     type: undefined,
       *     userId: undefined,
       *     appId: undefined,
       *     clusterId: undefined
       *   },
       *   content: <Buffer 49 6d 70 6f 72 74 61 6e 74 20 6d 65 73 73 61 67 65 20 77 69 74 68 20 63 75 73 74 6f 6d 20 68 65 61 64 65 72>
       * }
       */
      console.log(`Received: ${msg.content.toString()}`);
      channel.ack(msg); // Acknowledge the message
    });
  } catch (err) {
    console.error(err);
  }
}

consume().catch(console.error);
