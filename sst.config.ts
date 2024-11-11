// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-nextjs-container",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc", { bastion: true });
    const redis = new sst.aws.Redis("MyRedis", { vpc });
    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    cluster.addService("MyService", {
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      link: [redis],
      dev: {
        command: "npm run dev",
      },
      transform: {
        service: {
          launchType: undefined,
          capacityProviderStrategies: [
            {
              capacityProvider: "FARGATE_SPOT",
              weight: 1,
            },
          ],
        },
      },
    });
  },
});
