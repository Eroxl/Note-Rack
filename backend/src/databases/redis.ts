import redis from 'redis';

const client = redis.createClient();

console.log('test');

export default client;
