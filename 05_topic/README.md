* We're going to use a topic exchange in our logging system. We'll start off with a working assumption that the routing 
keys of logs will have two words: "<facility>.<severity>".

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
