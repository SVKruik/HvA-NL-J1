import amqp from "amqplib";
import dotenv from "dotenv";
import { Channel } from "amqplib";
dotenv.config();

export async function createChannel(): Promise<Channel> {
    return await (await amqp.connect({
        "hostname": process.env.BROKER_HOST,
        "port": Number(process.env.BROKER_PORT),
        "username": process.env.BROKER_USER,
        "password": process.env.BROKER_PASSWORD,
        "vhost": process.env.BROKER_VHOST,
    })).createChannel();
}