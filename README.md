# RABBIT MQ TUTORIAL (using the amqp.node client) (`AMQP 0-9-1` protocol) FIFO Queue.

## Licence

![License](https://img.shields.io/badge/License-MIT-blue.svg)

## Technologies

![image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![image](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white)
![image](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

- The latest docker image for 14.01.2024 (`rabbitmq:3.13.0-rc.4-management-alpine`)

1. [Hello World](01_hello-world/README.md)
2. [Work Queues](02_work-queues/README.md)
3. [Publish Subscribe (fanout exchange)](03_publish-subscribe/README.md)
4. [Routing (direct exchange)](04_routing/README.md)
5. [Topic (topic exchange)](05_topic/README.md)
6. [Headers (headers exchange)](06_headers/README.md)
7. [RPC](07_rpc/README.md)

### Exchanges
* There are a few exchange types available: `direct`, `topic`, `headers` and `fanout`.

### In order to run in docker without `docker-compose.yml`
```
    docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    or
    docker run --name rabbitmq -p 5672:5672 rabbitmq
```

### We can use `docker-compose.yml` in order to create RabbitMQ container with `management UI` on port 15672.
* In case if we not provide username and password in the docker-compose.yml it will be guest guest
```
    docker exec -it <container id> bash
```
* Check users list type:
```
    rabbitmqctl list_users
```
* In case if we provide `RABBITMQ_DEFAULT_USER` and `RABBITMQ_DEFAULT_PASS` In connection string type:
```
    'amqp://<RABBITMQ_DEFAULT_USER>:<RABBITMQ_DEFAULT_PASS>@localhost:5672'
```
* or another one
```
    const opt = { credentials: require('amqplib').credentials.plain('user', 'password') };
    amqp.connect('amqp://localhost', opt, (err, conn) => {});
```
* In order to check messages and queues inside `RabbitMQ` broker type:
```
    sudo rabbitmqctl list_queues
```

* In order to check unacknowledged messages type: 
```
    rabbitmqctl list_queues name messages_ready messages_unacknowledged
```
* In order to list exchanges type:
```
    sudo rabbitmqctl list_exchanges
```
* Listing bindings
```
    rabbitmqctl list_bindings
```
### Queue Properties
* In AMQP 0-9-1, the broker can generate a unique queue name on behalf of an app. To use this feature, pass an empty string as the queue name argument
* Name
* Durable (the queue will survive a broker restart)
* Exclusive (used by only one connection and the queue will be deleted when that connection closes)
* Auto-delete (queue that has had at least one consumer is deleted when last consumer unsubscribes)
* Arguments (optional; used by plugins and broker-specific features such as message TTL, queue length limit, etc)
* When auto-delete or exclusive queues use well-known (static) names, in case of client disconnection and immediate 
reconnection there will be a natural race condition between RabbitMQ nodes that will delete such queues and recovering 
clients that will try to re-declare them. This can result in client-side connection recovery failure or exceptions, 
and create unnecessary confusion or affect application availability.
* To declare a quorum queue set the `x-queue-type` queue argument to quorum (the default is classic). 
This argument must be provided by a client at queue declaration time; it cannot be set or changed using a policy. 
This is because policy definition or applicable policy can be changed dynamically but queue type cannot.
It must be specified at the time of declaration. Declaring a queue with an `x-queue-type` argument set to quorum 
will declare a quorum queue with up to five replicas (default replication factor), one per each cluster node.
### Message Example
```
    {
      "fields": {
        "consumerTag": "amq.ctag-7FvCsTIc7yYWVED154HCHA",
        "deliveryTag": 1,
        "redelivered": false,
        "exchange": "",
        "routingKey": "task_queue"
      },
      "properties": {
        "headers": {},
        "deliveryMode": 2
      },
      "content": {
        "type": "Buffer",
        "data": [
          72,
          101,
          108,
          108,
          111,
          32,
          87,
          111,
          114,
          108,
          100
        ]
      }
    }
```
* Routing key should not be more than 255 bytes.
