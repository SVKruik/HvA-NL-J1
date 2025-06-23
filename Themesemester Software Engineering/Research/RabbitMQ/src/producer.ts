import dotenv from "dotenv";
import { Channel } from "amqplib";
import { createChannel } from "./connect";
import { TseMessage } from "./types";
dotenv.config();
const messageLimit: number = Number(process.env.MESSAGE_LIMIT);

async function produce() {
    const connection: Channel = await createChannel();
    if (!connection) throw new Error("Connection failed");

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

    connection.assertExchange(process.env.EXCHANGE_NAME as string, "direct", { durable: false });
    for (let i = 0; i < messageLimit; i++) {
        payload.timestamp = new Date().getMilliseconds();
        connection.publish(process.env.EXCHANGE_NAME as string, process.env.ROUTING_KEY as string, Buffer.from(JSON.stringify(payload)));
    }

    setTimeout(() => {
        console.log(`Sent ${messageLimit} messages to ${process.env.EXCHANGE_NAME} exchange.`);
        connection.close();
        process.exit(0);
    }, 500);
}

produce().catch((error) => console.error("Error sending message:", error));
