#!/bin/bash

# Record the CPU and memory usage of all containers in a CSV file
# Applicable for Dockerized message brokers

while true; do
    stats=$(docker stats --no-stream --format "table {{.Name}},{{.CPUPerc}},{{.MemUsage}}")
    echo "$stats"
    echo "$stats" >>resources.csv
done
