import { Redis } from 'ioredis';
const script = `
local ttl = redis.call("TTL", KEYS[1])
if ttl > 0 then
    redis.call("SET", KEYS[1], ARGV[1])
    redis.call("EXPIRE", KEYS[1], ttl)
else
    redis.call("SET", KEYS[1], ARGV[1])
end
return ttl
`;
export const preserveTTLOnUpdateForRedis = async (
  client: Redis,
  key: string,
  value: string,
) => {
  return await client.eval(script, 1, key, value);
};
