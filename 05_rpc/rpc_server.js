const amqp = require('amqplib');

async function RPCServer() {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');

        const channel = await connection.createChannel();

        const queue = 'rpc_queue';

        await channel.assertQueue(queue, { durable: false });

        await channel.prefetch(1);

        console.log(' [x] Awaiting RPC requests');

        await channel.consume(queue, async (msg) => {

            const n = parseInt(msg.content.toString());

            console.log(' [.] fib(%d)', n);

            const r = fibonacci(n);

            await channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
                correlationId: msg.properties.correlationId
            });

            await channel.ack(msg);
        });

    } catch (err) {
        console.log(err);
    }
}

function fibonacci(n) {
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}

RPCServer().catch(console.log);
