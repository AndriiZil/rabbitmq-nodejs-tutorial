const amqp = require('amqplib');

async function RPCClient() {
    try {
        const args = process.argv.slice(2);

        if (!args.length) {
            console.log('Usage: rpc_client.js num');
            process.exit(1);
        }

        const connection = await amqp.connect('amqp://myuser:mypassword@localhost:5672');

        const channel = await connection.createChannel();

        const q = await channel.assertQueue('', { exclusive: true });

        const correlationId = generateUuid();
        const num = parseInt(args[0]);

        console.log(' [x] Requesting fib(%d)', num);

        await channel.consume(q.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
                console.log(' [.] Got %s', msg.content.toString());

                setTimeout(() => {
                    connection.close();
                    process.exit(0);
                }, 500)
            }
        }, {
            noAck: true
        });

        await channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), { correlationId, replyTo: q.queue });

    } catch (err) {
        console.log(err);
    }
}

function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

RPCClient().catch(console.log);