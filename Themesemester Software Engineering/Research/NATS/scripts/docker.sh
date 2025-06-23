#!/bin/bash

docker pull nats:latest

docker run -d --name nats-broker-1 \
    -p 4222:4222 \
    -p 6222:6222 \
    -p 9109:8222 \
    -v /home/svkruik/Documents/GitHub/nats-server.conf:/etc/nats/nats-server.conf \
    nats:latest \
    -c /etc/nats/nats-server.conf

# 4222: Client connections
# 6222: Routing connections
# 8222: Web Dashboard
