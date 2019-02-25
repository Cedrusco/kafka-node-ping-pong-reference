#!/bin/bash

cd /home/kafka/kafka/bin

# Delete topics
./kafka-topics.sh --zookeeper localhost:2181 --delete --topic pong
./kafka-topics.sh --zookeeper localhost:2181 --delete --topic ping

# Create topics
./kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic ping
./kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic pong