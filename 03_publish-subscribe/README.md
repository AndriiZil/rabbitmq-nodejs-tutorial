### Subscribe/Publish

* The `fanout` exchange is very simple. As you can probably guess from the name, it just broadcasts all the messages it 
receives to all the queues it knows. And that's exactly what we need for our logger.
* Firstly, whenever we connect to Rabbit we need a fresh, empty queue. To do this we could create a queue with a random name, 
or, even better - let the server choose a random queue name for us.
* Secondly, once we disconnect the consumer the queue should be automatically deleted.
* When the connection that declared it closes, the queue will be deleted because it is declared as exclusive.
* The messages will be lost if no queue is bound to the exchange yet, but that's okay for us; if no consumer is 
listening yet we can safely discard the message.