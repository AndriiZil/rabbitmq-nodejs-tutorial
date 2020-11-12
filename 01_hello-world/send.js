'use strict';

const amqp = require('amqplib');

async function sendMessage() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');

        const channel = await connection.createChannel();

        const queue = 'hello';

        const message = process.argv.slice(2).join(' ') || 'Hello World';

        await channel.assertQueue(queue, { durable: false });

        await channel.sendToQueue(queue, Buffer.from(message));

        console.log('[x] Sent %s', message);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500)

    } catch (err) {
        console.log(err);
    }
}

sendMessage().catch(e => console.log(e));