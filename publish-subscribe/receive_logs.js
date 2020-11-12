const amqp = require('amqplib');

async function receiveLogs() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')

        const channel = await connection.createChannel();

        const exchange = 'logs';

        await channel.assertExchange(exchange, 'fanout', { durable: false });

        const q = await channel.assertQueue('', { exclusive: true });

        await channel.bindQueue(q.queue, exchange, '');

        await channel.consume(q.queue, (msg) => {
            if (msg.content) {
                console.log(' [x] %s', msg.content.toString());
            }
        }, {
            noAck: true
        });

    } catch (err) {
        console.log(err);
    }
}

receiveLogs().catch(console.log);
