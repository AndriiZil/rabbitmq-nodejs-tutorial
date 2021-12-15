const ampq = require('amqplib');
const amqp = require('amqplib');

async function emitLog() {
    try {
        const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

        const channel = await connection.createChannel();

        const exchange = 'logs';
        const msg = process.argv.slice(2).join(' ') || 'Hello world';

        await channel.assertExchange(exchange, 'fanout', { durable: false });

        await channel.publish(exchange, '', Buffer.from(msg));

        console.log(' [x] Sent "%s"', msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (err) {
        console.log(err);
    }
}

emitLog().catch(console.log);