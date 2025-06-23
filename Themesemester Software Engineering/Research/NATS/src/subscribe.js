import { connect, StringCodec } from 'nats';
import dotenv from "dotenv";
import fs from 'fs';
dotenv.config();

const nc = await connect({ servers: process.env.NATS_SERVER, token: process.env.NATS_TOKEN });
const sc = StringCodec();
const messageLimit = Number(process.env.MESSAGE_LIMIT);
const sub = nc.subscribe(process.env.NATS_TOPIC);
const writeBuffer = [];

console.log(`Listening for messages on "${process.env.NATS_TOPIC}"...`);
(async () => {
    let i = 0;

    for await (const m of sub) {
        i++;
        const receivalDate = new Date().getMilliseconds();
        const rawMessage = sc.decode(m.data);
        const payload = JSON.parse(rawMessage);
        const size = Buffer.byteLength(rawMessage, "utf8");

        // writeBuffer.push({
        //     id: i,
        //     sent: payload.timestamp,
        //     received: receivalDate,
        //     difference: receivalDate - payload.timestamp,
        //     size: size,
        // });

        console.log(`Received message ${i}`);

        // if (i >= messageLimit) {
        //     console.log(`Received ${messageLimit} ${writeBuffer[0].size} byte messages, recording data to file...`);
        //     fs.writeFileSync("output.csv", "#,Sent,Received,Difference\n");
        //     writeBuffer.forEach((record) => fs.appendFileSync("output.csv", `${record.id},${record.sent},${record.received},${record.difference}\n`));

        //     await nc.drain();
        //     process.exit(0);
        // };
    }
})();
