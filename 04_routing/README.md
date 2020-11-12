### Routing RabbitMQ

* We will use a direct exchange instead. The routing algorithm behind a direct exchange is simple - a message goes 
to the queues whose binding key exactly matches the routing key of the message.
