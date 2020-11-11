'use strict';

const amqp = require('amqplib');

async function sendMessage() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');

        const channel = await connection.createChannel();

        const queue = 'task_queue';
        const msg = process.argv.slice(2).join(' ') || 'Hello World';

        await channel.assertQueue(queue, { durable: true });

        await channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });

        console.log('[x] Sent %s', msg);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500)

    } catch (err) {
        console.log(err);
    }
}

sendMessage().catch(e => console.log(e));