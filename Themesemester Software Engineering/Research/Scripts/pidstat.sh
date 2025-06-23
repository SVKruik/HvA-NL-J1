#!/bin/bash

pgrep -f kafka
pgrep -f rabbitmq
pgrep -f nats

pidstat -p <PIDID> -r -u 1 <SECONDS> > stats.log
# pidstat -p 969 -r -u 1 10 > stats.log