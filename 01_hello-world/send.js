'use strict';

const amqp = require('amqplib');

async function sendMessage() {
    try {
        // Connection to the server
        const opts = { credentials: amqp.credentials.plain('myuser', 'mypassword' )} // TODO env file docker-compose

        const connection = await amqp.connect('amqp://localhost:5672', opts);

        // Creating a channel
        const channel = await connection.createChannel();

        // idempotent queue
        const queue = 'hello';

        const message = process.argv.slice(2).join(' ') || 'Hello World';

        await channel.assertQueue(queue, { durable: false });

        await channel.sendToQueue(queue, Buffer.from(message));

        console.log('[x] Sent %s', message);

        setTimeout(() => {
            // Close the connection
            connection.close();
            // Exit
            process.exit(0);
        }, 500)

    } catch (err) {
        console.log(err);
    }
}

sendMessage().catch(e => console.log(e));