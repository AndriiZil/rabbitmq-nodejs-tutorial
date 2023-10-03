'use strict';

const amqp = require('amqplib');

async function receive() {

  try {
    // Create connection to the server
    const opts = {credentials: amqp.credentials.plain('myuser', 'mypassword')} // TODO env file docker-compose

    const connection = await amqp.connect('amqp://localhost:5672', opts);

    // Queue
    const queue = 'hello';

    // Channel
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

    await channel.consume(queue, (msg) => {
      console.log(' [x] Received %s', msg.content.toString());
    }, { noAck: true });
  } catch (err) {
    console.error(err);
  }

}

receive().catch(console.log);
