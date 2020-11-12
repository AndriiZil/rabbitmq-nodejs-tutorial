* Manual consumer acknowledgments have been turned off in previous examples. It's time to turn them on using
the {noAck: false} option and send a proper acknowledgment from the worker, once we're done with a task.

* This durable option change needs to be applied to both the producer and consumer code.
  At this point we're sure that the task_queue queue won't be lost even if RabbitMQ restarts. Now we need to mark our 
  messages as persistent - by using the persistent option Channel.sendToQueue takes.

* In order to defeat that we can use the prefetch method with the value of 1. This tells RabbitMQ not to give more than 
one message to a worker at a time. Or, in other words, don't dispatch a new message to a worker until it has processed 
and acknowledged the previous one. Instead, it will dispatch it to the next worker that is not still busy.

* Using message acknowledgments and prefetch you can set up a work queue. The durability options let the tasks survive 
even if RabbitMQ is restarted.