import { Resource } from "sst";
import { Cluster } from "ioredis";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  const counter = await redis.incr("counter");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>Hit counter: {counter}</p>
      </main>
    </div>
  );
}
