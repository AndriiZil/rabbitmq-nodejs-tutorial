const amqp = require('amqplib');

async function receiveLogDirect() {
    try {
        const args = process.argv.slice(2);

        if (!args.length) {
            console.log('Usage: receive_logs_direct.js [info] [warning] [error]');
            process.exit(1);
        }

        const connection = await amqp.connect('amqp://localhost:5672');

        const channel = await connection.createChannel();

        const exchange = 'direct_logs';

        const q = await channel.assertQueue('', { exclusive: true });

        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        for (let severity of args) {
            console.log(severity);
            await channel.bindQueue(q.queue, exchange, severity);
        }

        await channel.consume(q.queue, (msg) => {
            console.log(' [x] %s: "%s"', msg.fields.routingKey, msg.content.toString());
        }, {
            noAck: true
        });

    } catch (err) {
        console.log(err);
    }
}

receiveLogDirect().catch(console.log);