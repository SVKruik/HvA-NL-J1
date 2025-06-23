#!/bin/bash

docker pull apache/kafka:4.0.0

docker run -d --name kafka-broker-1 \
    -p 9110:9092 \
    -e KAFKA_NODE_ID=1 \
    -e KAFKA_PROCESS_ROLES=broker,controller \
    -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
    -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \
    -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://rpi-h.ucg.com:9110 \
    -v kafka-data:/var/lib/kafka/data \
    apache/kafka:4.0.0

# 4222: Client connections
# 6222: Routing connections
# 8222: Web Dashboard
