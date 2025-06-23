# TSE - Research Report

This repository contains all code used to interact with the message brokers. Below you can find the chosen message brokers for this research and on which Raspberry the broker is hosted.

| Broker Name | Server Name | Web Interface |
|-|-|-|
| RabbitMQ | Lowtide | [amqp](https://amqp.stefankruik.com/dashboard) |
| Apache Kafka | Hightide | [kafka](https://kafka.stefankruik.com) |
| NATS | Springtide | [nats](https://nats.stefankruik.com) |

---

All message broker demo projects follow the same design. They are simple JavaScript pub/sub templates that record the time in MS between time sent and received. This data is written to a file for futher use. All tests are done in sets of 100 messages.
