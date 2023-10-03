const amqp = require('amqplib');

async function emitLog() {
  try {
    const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

    const channel = await connection.createChannel();

    const exchange = 'logs';
    const msg = process.argv.slice(2).join(' ') || 'Hello world';

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    // The empty string as second parameter means that we don't want to send the message to any specific queue.
    // We want only to publish it to our 'logs' exchange.
    await channel.publish(exchange, '', Buffer.from(msg));

    console.log(' [x] Sent "%s"', msg);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error(err);
  }
}

emitLog().catch(console.log);
