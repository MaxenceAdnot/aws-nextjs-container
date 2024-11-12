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

    const service = cluster.addService("MyService", {
      loadBalancer: {
        ports: [{ listen: "443/https", forward: "3000/http" }],
        domain: {
          name: "nextjs-redis.sandbox-sst.rstck.in",
        },
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

    if (!$dev) {
      // Never in development cause the loadbalancer is not created
      const loadBalancer = service.nodes.loadBalancer;
      new aws.lb.Listener("http-listener", {
        loadBalancerArn: loadBalancer.arn,
        port: 80,
        protocol: "HTTP",
        defaultActions: [
          {
            type: "redirect",
            redirect: {
              port: "443",
              protocol: "HTTPS",
              statusCode: "HTTP_301",
            },
          },
        ],
      });
    }
  },
});
