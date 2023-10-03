const amqp = require('amqplib');

async function receiveLogs() {
  try {
    const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

    const channel = await connection.createChannel();

    const exchange = 'logs';

    await channel.assertExchange(exchange, 'fanout', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });

    console.log('QUEUE', q);
    /**
     * {
     *   queue: 'amq.gen-WzA94hHqioco9wqtn8W8rg',
     *   messageCount: 0,
     *   consumerCount: 0
     * }
     */

    await channel.bindQueue(q.queue, exchange, ''); // "" - binding key ignored

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
