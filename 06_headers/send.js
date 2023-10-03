'use strict';

const amqp = require('amqplib');

async function send() {
  try {
    const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');
    const channel = await connection.createChannel();

    const exchangeName = 'headers_exchange';
    const queueName = 'myQueue';

    // Declare the headers exchange
    await channel.assertExchange(exchangeName, 'headers', { durable: false });

    // Declare the queue
    await channel.assertQueue(queueName, { durable: false });

    // Define the headers criteria for routing
    const headers = {
      'content-type': 'application/json',
      'x-match': 'all', // 'all' or 'any' (matching criteria)
      'custom-header': 'important',
    };
    /**
     * Define headers criteria for routing, specifying that messages should match all headers specified
     * ('x-match': 'all') and have a 'custom-header' with the value 'important.'
     */

    // Bind the queue to the exchange with the headers criteria
    await channel.bindQueue(queueName, exchangeName, '', headers);

    // Producer: Send a message with matching headers
    const message = 'Important message with custom header';
    const properties = {
      headers: {
        'content-type': 'application/json',
        'custom-header': 'important',
      },
    };

    channel.publish(exchangeName, '', Buffer.from(message), properties);
    console.log(`Sent: ${message}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error(err);
  }
}

send().catch(console.error);
