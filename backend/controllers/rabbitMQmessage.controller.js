import asyncHandler from "express-async-handler";
import { connectToRabbitMQ } from "../microservices/rabbitmq.js";

const createHandler = (handler) => asyncHandler(handler);

// [POST] amqp://localhost:PORT/rabbitmq/publish
const publishHandler = createHandler(async (req, res) => {
  const { connection, channel } = await connectToRabbitMQ();
  await channel.assertQueue("my-queue");
  channel.sendToQueue("my-queue", Buffer.from(JSON.stringify(req.body)));
  res.send("Message has been published to RabbitMQ");
  await connection.close();
});

// [POST] amqp://localhost:PORT/rabbitmq/consume
const consumeHandler = createHandler(async (req, res) => {
  try {
    const { connection, channel } = await connectToRabbitMQ();
    await channel.assertQueue("my-queue");
    channel.consume("my-queue", (msg) => {
      console.log("Received message:", msg.content.toString());
      // Process the message here
      channel.ack(msg); // Acknowledge message delivery
    });
    res.send("Consuming messages from RabbitMQ");
  } catch (error) {
    console.error("Failed to consume messages:", error);
    res.status(500).send("Failed to consume messages from RabbitMQ");
  }
});

export { publishHandler as Publish, consumeHandler as Consume };
