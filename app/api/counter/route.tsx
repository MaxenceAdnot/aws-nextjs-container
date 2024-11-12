import { Resource } from "sst";
import { Cluster } from "ioredis";

// Initialize Redis cluster
const redis = new Cluster(
  [
    {
      host: Resource.MyRedis.host,
      port: Resource.MyRedis.port,
    },
  ],
  {
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      tls: {},
      username: Resource.MyRedis.username,
      password: Resource.MyRedis.password,
    },
  }
);

export async function GET(): Promise<Response> {
  try {
    // Increment the counter
    const counter = await redis.incr("counter");

    // Return the updated counter value
    return new Response(JSON.stringify({ counter }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error incrementing counter:", error);
    return new Response(
      JSON.stringify({ error: "Failed to increment counter" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(): Promise<Response> {
  try {
    // Reset the counter
    await redis.del("counter");

    // Return the updated counter value
    return new Response(JSON.stringify({ counter: 0 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error resetting counter:", error);
    return new Response(JSON.stringify({ error: "Failed to reset counter" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}