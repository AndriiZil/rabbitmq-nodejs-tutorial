'use strict';

const amqp = require('amqplib');

async function receive() {

    try {
        const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

        const queue = 'task_queue';

        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });

        await channel.prefetch(1);

        console.log(' [*] Waiting for messages in "%s". To exit press CTRL+C', queue);

        await channel.consume(queue, (msg) => {
            console.log('MSG', msg.content.toString());
            // const secs = msg.content.toString().split('.').length - 1;

            console.log(' [x] Received "%s"', msg.content.toString());

            setTimeout(() => {
                console.log(' [x] Done');
                channel.ack(msg);

            }, 2500);

        }, { noAck: false });
    } catch (err) {
        console.log(err);
    }

}

receive().catch(console.log);