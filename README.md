# RABBIT MQ TUTORIAL (using the amqp.node client) (`AMQP 0-9-1` protocol) FIFO Queue.

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