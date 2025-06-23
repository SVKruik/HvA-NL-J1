import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'tse-research-setup',
    brokers: ['rpi-h.ucg.com:9110'],
});

const admin = kafka.admin();

async function setup() {
    await admin.connect();
    await admin.createTopics({
        topics: [
            {
                topic: 'tse-research-kafka',
                numPartitions: 1,
                replicationFactor: 1,
            },
        ],
    });

    await admin.disconnect();
}

setup().catch(console.error);