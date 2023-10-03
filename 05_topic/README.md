### Topics

## Topic exchange

* We're going to use a topic exchange in our logging system. We'll start off with a working assumption that the routing 
keys of logs will have two words: "<facility>.<severity>".
* When a queue is bound with "#" (hash) binding key - it will receive all the messages, 
regardless of the routing key - like in fanout exchange.
* When special characters "*" (star) and "#" (hash) aren't used in bindings, the topic exchange will behave just like a direct one.

* In receive_logs_topic.js file type:
```
    node receive_logs_topic.js "#"
```
* To receive all logs from the facility "kern" type:

```
    node receive_logs_topic.js "kern.*"
```
* Or if you want to hear only about "critical" logs type:
```
    receive_logs_topic.js "*.critical"
```
* To emit a log with a routing key "kern.critical" type:
```
    node emit_log_topic.js "kern.critical" "A critical kernel error"
```
```
    * (star) can substitute for exactly one word.
    # (hash) can substitute for zero or more words.
```
