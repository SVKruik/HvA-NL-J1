import { Message, Replies } from "amqplib";
import dotenv from "dotenv";
import { Channel } from "amqplib";
import { createChannel } from "./connect";
import fs from "fs";
import { TseMessage, TseRecording } from "./types";
dotenv.config();

const writeBuffer: Array<TseRecording> = [];
const messageLimit: number = Number(process.env.MESSAGE_LIMIT);

async function consume() {
    const connection: Channel = await createChannel();
    if (!connection) throw new Error("Connection failed");

    connection.assertExchange(process.env.EXCHANGE_NAME as string, "direct", { durable: false });
    const queue: Replies.AssertQueue = await connection.assertQueue("", { exclusive: true });
    await connection.bindQueue(queue.queue, process.env.EXCHANGE_NAME as string, process.env.ROUTING_KEY as string);

    let i = 0;
    console.log("Waiting for messages in queue:", queue.queue);
    await connection.consume(queue.queue, (message: Message | null) => {
        const receivalDate: number = new Date().getMilliseconds();

        if (message) {
            i++;
            const payload: TseMessage = JSON.parse(message.content.toString());
            const size = Buffer.byteLength(message.content.toString(), "utf8");
            writeBuffer.push({
                id: i,
                sent: payload.timestamp,
                received: receivalDate,
                difference: receivalDate - payload.timestamp,
                size: size,
            });
            connection.ack(message);
        }

        if (i >= messageLimit) {
            console.log(`Received ${messageLimit} ${writeBuffer[0].size} byte messages, recording data to file...`);
            fs.writeFileSync("output.csv", "#,Sent,Received,Difference\n");
            writeBuffer.forEach((record) => fs.appendFileSync("output.csv", `${record.id},${record.sent},${record.received},${record.difference}\n`));

            connection.close();
            process.exit(0);
        }
    }, { noAck: false });
}

consume().catch((error) => console.error("Error receiving message:", error));
