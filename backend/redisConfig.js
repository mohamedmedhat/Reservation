import redis from 'redis';

const redisClient = redis.createClient({
    host: 'localhost', // Redis server host
    port: process.env.REDIS_SERVER_PORT // Redis server port
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

export default redisClient;
