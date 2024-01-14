### Routing RabbitMQ (direct)

## Direct exchange

* A binding is a relationship between an exchange and a queue. This can be simply read as: the queue is interested 
in messages from this exchange.

* The routing algorithm behind a `direct` exchange is simple - a message goes to the queues whose `binding key` 
exactly matches the `routing key` of the message.

* In order to listen the direct queue type:
```bash
    node receive_logs_direct.js warning error info
```
* or
```bash
    node receive_logs_direct.js warning
```
* or
```bash
    node receive_logs_direct.js warning error
```
* or
```bash
    node receive_logs_direct.js info
```

#### Emmiting messages

* The queue will listen messages provided after "receive_logs_direct.js"

* In order to send the direct message to the queue type:
```bash
    node emit_log_direct.js error
```
* or
```bash
    node emit_log_direct.js warning
```
* or
```bash
    node emit_log_direct.js info
```
* Info message also will be send by default if we don't type any direct queue before the message
