'use strict';

const amqp = require('amqplib');

async function receive() {

    try {
        const connection = await amqp.connect('amqp://localhost:5672');

        const queue = 'hello';

        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });

        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

        await channel.consume(queue, (msg) => {
            console.log(' [x] Received %s', msg.content.toString());
        }, { noAck: true });
    } catch (err) {
        console.log(err);
    }

}

receive().catch(console.log);