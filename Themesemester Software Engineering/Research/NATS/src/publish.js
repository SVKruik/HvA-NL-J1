import { connect, StringCodec } from 'nats';
import dotenv from "dotenv";
dotenv.config();

const nc = await connect({ servers: process.env.NATS_SERVER, token: process.env.NATS_TOKEN });
const sc = StringCodec();
const messageLimit = Number(process.env.MESSAGE_LIMIT);

const payload = JSON.stringify({
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
    timestamp: new Date().getMilliseconds(),
});

// for (let i = 0; i < messageLimit; i++) {
//     nc.publish(process.env.NATS_TOPIC, sc.encode(payload));
// }

// Heavy load test
// 6000 messages per minute
// 100 messages per second
let i = 0;
setInterval(() => {
    i++;
    nc.publish(process.env.NATS_TOPIC, sc.encode(payload));
    console.log(`Sent message ${i} to ${process.env.NATS_TOPIC} topic.`);
}, 10);

// console.log(`Sent ${messageLimit} messages to ${process.env.NATS_TOPIC} topic.`);
// await nc.drain();
