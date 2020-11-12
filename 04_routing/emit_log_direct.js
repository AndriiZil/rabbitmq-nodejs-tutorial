const amqp = require('amqplib');

async function sendLogDirect() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')

        const channel = await connection.createChannel();

        const exchange = 'direct_logs';

        const args = process.argv.slice(2);

        const msg = args.slice(1).join(' ') || 'Hello World';
        const severity = (args.length > 0) ? args[0] : 'info';

        await channel.assertExchange(exchange, 'direct', { durable: false });

        await channel.publish(exchange, severity, Buffer.from(msg));

        console.log(' [x] Sent %s: "%s"', severity, msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500)
    } catch (err) {
        console.log(err);
    }
}

sendLogDirect().catch(console.log);
