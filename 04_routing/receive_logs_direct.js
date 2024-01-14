'use strict';

const amqp = require('amqplib');

async function receiveLogDirect() {
  try {
    const args = process.argv.slice(2);

    if (!args.length) {
      console.log('Usage: receive_logs_direct.js [info] [warning] [error]');
      process.exit(1);
    }

    const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

    const channel = await connection.createChannel();
    const exchange = 'direct_logs';

    await channel.assertExchange(exchange, 'direct', { durable: false });

    const q = await channel.assertQueue('', { exclusive: true });

    console.log(' [*] Waiting for logs. To exit press CTRL+C');

    const requests = args.map((severity) => {
      console.log(' [x] Received %s:', severity);
      // "severity" - it's a "binding key"
      return channel.bindQueue(q.queue, exchange, severity);
    });

    await Promise.all(requests);

    await channel.consume(q.queue, (msg) => {
      console.log(' [x] %s: "%s"', msg.fields.routingKey, msg.content.toString());
    }, {
      noAck: true
    });

  } catch (err) {
    console.error(err);
  }
}

receiveLogDirect().catch(console.error);
