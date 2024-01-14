# Work Queues

### Important options
1. `noAck`
2. `durable`
3. `persistent`
4. `prefetch`

- This concept is especially useful in web applications where it's impossible to handle a complex task during a short HTTP request window.
- By default it's `Round-robin` dispatching

#### Message acknowledgment

* With our current code (`{ noAck: true }`), once `RabbitMQ` delivers a message to the consumer, it immediately marks it for deletion. 
In this case, if you terminate a worker, you lose the message it was just processing. The messages that were dispatched 
to this particular worker but were not yet handled are also lost.
* Manual consumer acknowledgments have been turned off in previous examples. It's time to turn them on using
the `{noAck: false}` option and send a proper acknowledgment from the worker, once we're done with a task.

* When RabbitMQ quits or crashes it will forget the queues and messages unless you tell it not to. Two things are required 
to make sure that messages aren't lost: we need to mark both the `queue` and `messages` as `durable`.
First, we need to make sure that the queue will survive a RabbitMQ node restart. In order to do so, we need to declare it as `durable`.

#### Message durability

* This `durable` option change needs to be applied to both the `producer` and `consumer` code.
At this point we're sure that the task_queue `queue` won't be lost even if `RabbitMQ` restarts. Now we need to mark our 
messages as `persistent` - by using the persistent option `Channel.sendToQueue` takes. Marking messages as `persistent` 
doesn't fully guarantee that a message won't be lost.

* `RabbitMQ` doesn't allow you to redefine an existing queue with different parameters (`{ durable: true }`) and will return an error 
to any program that tries to do that

#### Fair dispatch

* For example in a situation with two workers, when all odd messages are heavy and even messages are light, 
one worker will be constantly busy and the other one will do hardly any work.
* In order to defeat that we can use the `prefetch` method with the value of `1`. This tells `RabbitMQ` not to give more than 
one message to a worker at a time. Or, in other words, don't dispatch a new message to a worker until it has processed 
and acknowledged the previous one. Instead, it will dispatch it to the next worker that is not still busy.

* Using message acknowledgments and prefetch you can set up a work queue. The durability options let the tasks survive 
even if RabbitMQ is restarted.
* More info about send options here http://www.squaremobius.net/amqp.node/channel_api.html#channel_sendToQueue
