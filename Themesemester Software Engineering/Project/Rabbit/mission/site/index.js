import "dotenv/config";
import { connect } from 'amqplib';
import { exec } from 'child_process';
console.log("Started Rabbit Deployer...");

// Setup Channel
const channel = await (await connect({
    "protocol": "amqp",
    "hostname": process.env.AMQP_HOST,
    "port": parseInt(process.env.AMQP_PORT),
    "username": process.env.AMQP_USERNAME,
    "password": process.env.AMQP_PASSWORD
})).createChannel();
if (!channel) throw new Error("Channel is not created");

// Setup Consumer
const directExchange = await channel.assertExchange("unicast-products", "direct", { durable: false });
const directQueue = await channel.assertQueue("", { exclusive: true });
channel.bindQueue(directQueue.queue, directExchange.exchange, "Rabbit");

// Consume Messages
channel.consume(directQueue.queue, (message) => {
    channel.ack(message);
    const messageContent = JSON.parse(message.content.toString());

    switch (messageContent.task) {
        case "Deploy":
            handleDeploy(messageContent);
            break;
        default:
            console.error("Invalid task");
    }
}, { noAck: false });

// Handlers
function handleDeploy(messageContent) {
    if (process.platform === "linux" && messageContent.content) {
        const environment = messageContent.content.env;
        if (!["dev", "test", "prod"].includes(environment)) return console.error("Invalid environment");

        console.log("Deploying Rabbit...");
        exec(`sh deploy_${environment}.sh`, (error, stdout, _stderr) => {
            console.log(stdout);
            if (error) console.error(error);
        });
    } else console.log("Unsupported configuration. Skipping deploy.");
}