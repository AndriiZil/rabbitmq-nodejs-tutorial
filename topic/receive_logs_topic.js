const amqp = require('amqplib');

async function receiveLogTopic() {
    try {
        const args = process.argv.slice(2);

        if (!args.length) {
            console.log('Usage: receive_logs_topic.js <facility>.<severity>');
            process.exit(1);
        }

        const connection = await amqp.connect('amqp://localhost:5672');

        const channel = await connection.createChannel();

        const exchange = 'topic_logs';

        await channel.assertExchange(exchange, 'topic', { durable: false });

        const q = await channel.assertQueue('', { exclusive: false });

        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        for (let key of args) {
            await channel.bindQueue(q.queue, exchange, key);
        }

        await channel.consume(q.queue, (msg) => {
            console.log('" [x] %s: "%s""', msg.fields.routingKey, msg.content.toString());
        }, {
            noAck: true
        });

    } catch (err) {
        console.log(err);
    }
}

receiveLogTopic().catch(console.log);