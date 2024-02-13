import redis from 'redis';

const redisClient = redis.createClient({
    host: 'localhost',
    port: process.env.REDIS_SERVER_PORT || 6379
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

export default redisClient;
