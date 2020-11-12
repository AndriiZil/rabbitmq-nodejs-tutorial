const amqp = require('amqplib');

async function sendLogTopic() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');

        const channel = await connection.createChannel();

        const exchange = 'topic_logs';
        const args = process.argv.slice(2);
        const key = (args.length > 0) ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || 'Hello World';

        await channel.assertExchange(exchange, '05_topic', { durable: false });

        await channel.publish(exchange, key, Buffer.from(msg));

        console.log('" [x] Sent %s:"%s""', key, msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (err) {
        console.log(err);
    }
}

sendLogTopic().catch(console.log);