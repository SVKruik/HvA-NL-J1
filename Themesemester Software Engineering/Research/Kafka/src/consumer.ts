import { Kafka, Consumer } from "kafkajs"
import dotenv from "dotenv";
import { TseMessage, TseRecording } from "./types";
import fs from "fs";
dotenv.config();

const kafka = new Kafka({
    clientId: 'tse-research-consumer',
    brokers: [process.env.BROKER_URL as string]
});

const consumer: Consumer = kafka.consumer({ groupId: process.env.GROUP_ID as string });
const writeBuffer: Array<TseRecording> = [];
const messageLimit: number = Number(process.env.MESSAGE_LIMIT);

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.TOPIC_NAME as string, fromBeginning: false });

    let i = 0;
    await consumer.run({
        eachMessage: async ({ message }) => {
            i++;
            const receivalDate: number = new Date().getTime();
            const rawMessage = message.value?.toString() || "";
            const payload = JSON.parse(rawMessage) as TseMessage;
            const size = Buffer.byteLength(rawMessage, "utf8");

            writeBuffer.push({
                id: i,
                sent: payload.timestamp,
                received: receivalDate,
                difference: receivalDate - payload.timestamp,
                size: size,
            });

            if (i >= messageLimit) {
                console.log(`Received ${messageLimit} ${writeBuffer[0].size} byte messages, recording data to file...`);
                fs.writeFileSync("output.csv", "#,Sent,Received,Difference\n");
                writeBuffer.forEach((record) => fs.appendFileSync("output.csv", `${record.id},${record.sent},${record.received},${record.difference}\n`));

                console.log("Data recorded to output.csv");
                console.log("Exiting consumer...");
                consumer.stop();
                consumer.disconnect();
                setTimeout(() => {
                    process.exit(0);
                }, 1000);
            }
        },
    });
}

run().catch(console.error);