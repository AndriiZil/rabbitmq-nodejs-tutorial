'use strict';

const amqp = require('amqplib');

async function receive() {

  try {
    const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

    const queue = 'task_queue';

    const channel = await connection.createChannel();

    // // Messages aren't lost after RabbitMQ quits or crashes
    await channel.assertQueue(queue, { durable: true });

    // Tells `RabbitMQ` not to give more than one message to a worker at a time
    await channel.prefetch(1);

    console.log(' [*] Waiting for messages in "%s". To exit press CTRL+C', queue);

    await channel.consume(queue, (msg) => {
      const secs = msg.content.toString().split('.').length - 1;

      console.log(' [x] Received "%s"', msg.content.toString());

      setTimeout(() => {
        console.log(' [x] Done');
        channel.ack(msg);

      }, secs * 1000);

      // false is manual acknowledgment mode, if you terminate a worker using CTRL+C while it was processing a message, nothing is lost.
    }, { noAck: false });
  } catch (err) {
    console.error(err);
  }

}

receive().catch(console.log);
