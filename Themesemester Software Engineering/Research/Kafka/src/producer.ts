import { Kafka, Producer } from "kafkajs"
import dotenv from "dotenv";
import { TseMessage } from "./types";
dotenv.config();

const kafka = new Kafka({
    clientId: 'tse-research-producer',
    brokers: [process.env.BROKER_URL as string]
});

const producer: Producer = kafka.producer();
const messageLimit: number = Number(process.env.MESSAGE_LIMIT);
const payload: TseMessage = {
    // message: "Hello World",
    // Uncomment the following lines to test with larger payloads
    message: {
        name: "Test Invoice",
        date: new Date().toISOString(),
        items: Array.from({ length: 100 }, (_, i) => ({
            item: `Item ${i + 1}`,
            quantity: Math.floor(Math.random() * 10) + 1,
            price: (Math.random() * 100).toFixed(2),
        })),
        total: (Math.random() * 1000).toFixed(2),
        client_name: "John Doe",
        client_address: "123 Main St, Anytown, USA",
        client_telephone: "555-1234",
        client_mail: "john@example.com"
    },
    timestamp: 0,
}

const run = async () => {
    await producer.connect();
    for (let i = 0; i < messageLimit; i++) {
        payload.timestamp = new Date().getTime();
        await producer.send({
            topic: process.env.TOPIC_NAME as string,
            messages: [
                { value: JSON.stringify(payload) },
            ],
        });
    }
    console.log(`Sent ${messageLimit} messages to ${process.env.TOPIC_NAME} topic.`);
    await producer.disconnect();
    process.exit(0);
}

run().catch(console.error);