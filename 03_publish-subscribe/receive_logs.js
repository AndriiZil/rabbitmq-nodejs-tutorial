'use strict';

const amqp = require('amqplib');

async function receiveLogs() {
  try {
    const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

    const channel = await connection.createChannel();

    const exchange = 'logs';

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    /**
     * Whenever we connect to Rabbit we need a fresh, empty queue. To do this we could create a queue with a random name,
     * or, even better - let the server choose a random queue name for us.
     *
     * Once we disconnect the consumer the queue should be automatically deleted.
     * In the amqp.node client, when we supply queue name as an empty string, we create a non-durable queue with a generated name:
     */
    const q = await channel.assertQueue('', { exclusive: true });

    console.log('QUEUE', q);
    /**
     * {
     *   queue: 'amq.gen-WzA94hHqioco9wqtn8W8rg',
     *   messageCount: 0,
     *   consumerCount: 0
     * }
     */

    /**
     * That relationship between exchange and a queue is called a binding.
     */
    await channel.bindQueue(q.queue, exchange, ''); // "" - binding key ignored
    /**
     * routing key is ignored for "fanout" exchanges
     */

    console.log('[x] Start subscribing the messages...');

    await channel.consume(q.queue, (msg) => {
      if (msg.content) {
        console.log(' [x] %s', msg.content.toString());
      }
    }, {
      noAck: true
    });

  } catch (err) {
    console.error(err);
  }
}

receiveLogs().catch(console.log);
