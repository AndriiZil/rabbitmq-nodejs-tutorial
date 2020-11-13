### Routing RabbitMQ

* We will use a direct exchange instead. The routing algorithm behind a direct exchange is simple - a message goes 
to the queues whose binding key exactly matches the routing key of the message.

* In order to listen the direct queue type: 
```
    node receive_logs_direct.js warning error info
```
* or

```
    node receive_logs_direct.js warning
```
* or

```
    node receive_logs_direct.js warning error
```

* or

```
    node receive_logs_direct.js info
```
* The queue will listen messages provided after "receive_logs_direct.js"

* In order to send the direct message to the queue type: 

```
    node emit_log_direct.js error
```

* or

```
    node emit_log_direct.js warning
```

* or

```
    node emit_log_direct.js info
```

* Info message also will send by default if we don't type any direct queue before the message
