import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

import { generateSecret } from "./apple";
import { containerRegistry } from "./config";

const config = new pulumi.Config();
const env = pulumi.getStack();
const imageTag = process.env.DEPLOY_COMMIT_TAG || "latest";
const changedNextjs = process.env.CHANGED_NEXTJS === "true" || false;
const changedIngest = process.env.CHANGED_INGEST === "true" || false;
const changedDatabase = process.env.CHANGED_DB === "true" || false;
const isProd = env === "production";

const domains = config.requireObject<string[]>("domains");
const replicas = config.requireNumber("nextjsReplicas");

const projectCloudSql = new gcp.projects.Service(
  `probable-cloudsql-api-${env}`,
  {
    service: "sqladmin.googleapis.com",
    project: gcp.config.project,
  },
);

const gsa = new gcp.serviceaccount.Account(`probable-service-account-${env}`, {
  accountId: `probable-sa-${env}`,
  project: gcp.config.project,
});

const privateVpc = new gcp.compute.Network(`probable-vpc-${env}`, {
  autoCreateSubnetworks: false,
});

const privateSubnet = new gcp.compute.Subnetwork(`probable-subnet-${env}`, {
  ipCidrRange: "10.0.0.0/24",
  region: "us-west1",
  network: privateVpc.id,
});

const privateIpAddress = new gcp.compute.GlobalAddress(
  `probable-private-ip-address-${env}`,
  {
    purpose: "VPC_PEERING",
    addressType: "INTERNAL",
    prefixLength: 16,
    network: privateVpc.id,
  },
);

const privateVpcConnection = new gcp.servicenetworking.Connection(
  `probable-vpc-connection-${env}`,
  {
    network: privateVpc.id,
    service: "servicenetworking.googleapis.com",
    reservedPeeringRanges: [privateIpAddress.name],
  },
);

const pgDatabaseInstance = new gcp.sql.DatabaseInstance(
  `probable-db-instance-pg-${env}`,
  {
    name: `probable-db-instance-pg-${env}`,
    databaseVersion: "POSTGRES_17",
    region: "us-west1",
    settings: {
      tier: "db-f1-micro",
      activationPolicy: isProd ? "ALWAYS" : "NEVER",
      availabilityType: isProd ? "REGIONAL" : "ZONAL",
      ipConfiguration: {
        ipv4Enabled: false,
        privateNetwork: privateVpc.id,
      },
      backupConfiguration: {
        enabled: isProd ? true : false,
        location: "us-east1",
      },
      diskType: isProd ? "PD_SSD" : "PD_HDD",
    },
  },
  { dependsOn: [privateVpcConnection] },
);

const databaseUser = new gcp.sql.User(`probable-db-user-${env}`, {
  name: `probable-db-user-${env}`,
  instance: pgDatabaseInstance.name,
  password: config.requireSecret("databasePassword"),
});

const database = new gcp.sql.Database(`probable-db-${env}`, {
  name: `probable-db-${env}`,
  instance: pgDatabaseInstance.name,
  charset: "utf8",
});

export const clusterProvider = new k8s.Provider(`probable-pitchers-${env}`, {
  kubeconfig: process.env.KUBECONFIG,
});

export const namespace = new k8s.core.v1.Namespace(
  `probable-${env}`,
  {},
  { provider: clusterProvider },
);

const namespaceName = namespace.metadata.name;

const ksa = new k8s.core.v1.ServiceAccount(
  `probable-gke-service-account-${env}`,
  {
    metadata: {
      name: `probable-gke-service-account-${env}`,
      namespace: namespaceName,
    },
  },
  { provider: clusterProvider },
);

pulumi
  .all([gsa.email, gsa.name, gsa.member, ksa.metadata.name, namespaceName])
  .apply(([email, gsaName, member, ksaName, namespaceName]) => {
    const gsaAnnotation = new k8s.core.v1.ServiceAccountPatch(
      `probable-gke-service-account-annotation-${env}`,
      {
        metadata: {
          namespace: namespaceName,
          name: ksaName,
          annotations: {
            "iam.gke.io/gcp-service-account": email,
          },
        },
      },
      { provider: clusterProvider },
    );

    const ksaIamMember = new gcp.serviceaccount.IAMMember(
      `probable-gke-service-account-iam-${env}`,
      {
        serviceAccountId: gsaName,
        role: "roles/iam.workloadIdentityUser",
        member: pulumi.concat(
          `serviceAccount:`,
          gcp.config.project,
          ".svc.id.goog[",
          namespaceName,
          "/",
          ksa.metadata.name,
          "]",
        ),
      },
    );

    const gsaIamMember = new gcp.projects.IAMMember(
      `probable-gcp-service-account-iam-${env}`,
      {
        project: gcp.config.project!,
        role: "roles/cloudsql.admin",
        member: member,
      },
    );
  });

export const regcred = new k8s.core.v1.Secret(
  `probable-regcred-${env}`,
  {
    metadata: {
      namespace: namespaceName,
    },
    type: "kubernetes.io/dockerconfigjson",
    stringData: {
      ".dockerconfigjson": pulumi
        .all([
          containerRegistry.host,
          containerRegistry.user,
          containerRegistry.password,
          containerRegistry.email,
        ])
        .apply(([server, username, password, email]) => {
          return JSON.stringify({
            auths: {
              [server]: {
                auth: Buffer.from(username + ":" + password).toString("base64"),
                username: username,
                email: email,
                password: password,
              },
            },
          });
        }),
    },
  },
  { provider: clusterProvider },
);

const dbcred = new k8s.core.v1.Secret(
  `probable-dbcred-${env}`,
  {
    metadata: {
      namespace: namespaceName,
    },
    type: "Opaque",
    data: pulumi
      .all([databaseUser.name, databaseUser.password, database.name])
      .apply(([username, password, databaseName]) => ({
        username: btoa(username),
        password: btoa(password!),
        database: btoa(databaseName),
        databaseUrl: btoa(
          `postgres://${username}:${password}@127.0.0.1:5432/${databaseName}`,
        ),
      })),
  },
  { provider: clusterProvider },
);

const migrationLabels = { app: `probable-migration-${env}` };

const migrationJob = new k8s.batch.v1.Job(
  migrationLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      activeDeadlineSeconds: 20 * 60,
      backoffLimit: 3,
      parallelism: 1,
      completions: 1,
      template: {
        spec: {
          restartPolicy: "OnFailure",
          imagePullSecrets: [{ name: regcred.metadata.apply((m) => m.name) }],
          serviceAccountName: ksa.metadata.apply((m) => m.name),
          containers: [
            {
              name: migrationLabels.app,

              image: `ghcr.io/tmlamb/probable-migration:${
                changedDatabase ? imageTag : "latest"
              }`,
              env: [
                {
                  name: "DATABASE_URL",
                  valueFrom: {
                    secretKeyRef: {
                      name: dbcred.metadata.apply((m) => m.name),
                      key: "databaseUrl",
                    },
                  },
                },
              ],

              command: ["sh", "-c"],
              args: [
                "pnpm run push && pnpm run migrate; curl -s http://localhost:9091/quitquitquit",
              ],

              resources: {
                requests: {
                  cpu: isProd ? "100m" : "50m",
                  memory: isProd ? "512Mi" : "256Mi",
                  "ephemeral-storage": "1Gi",
                },
                limits: {
                  cpu: isProd ? "100m" : "50m",
                  memory: isProd ? "512Mi" : "256Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
            },
            {
              name: "cloudsql-proxy",
              image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
              args: [
                "--private-ip",
                "--port=5432",
                pgDatabaseInstance.connectionName,
                "--quitquitquit",
                "--exit-zero-on-sigterm",
              ],
              securityContext: {
                runAsNonRoot: true,
              },
              resources: {
                requests: {
                  cpu: isProd ? "25m" : "5m",
                  memory: isProd ? "64Mi" : "32Mi",
                  "ephemeral-storage": "1Gi",
                },
                limits: {
                  cpu: isProd ? "25m" : "5m",
                  memory: isProd ? "64Mi" : "32Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    provider: clusterProvider,
  },
);

const seedLabels = { app: `probable-seed-${env}` };

const seedJob = new k8s.batch.v1.CronJob(
  seedLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 0 1 2,3,4 *",
      jobTemplate: {
        spec: {
          activeDeadlineSeconds: 20 * 60,
          backoffLimit: 3,
          parallelism: 1,
          completions: 1,
          template: {
            spec: {
              restartPolicy: "OnFailure",
              imagePullSecrets: [
                { name: regcred.metadata.apply((m) => m.name) },
              ],
              serviceAccountName: ksa.metadata.apply((m) => m.name),
              containers: [
                {
                  name: seedLabels.app,

                  image: `ghcr.io/tmlamb/probable-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "DATABASE_URL",
                      valueFrom: {
                        secretKeyRef: {
                          name: dbcred.metadata.apply((m) => m.name),
                          key: "databaseUrl",
                        },
                      },
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "teams,pitchers,migrations",
                    },
                    {
                      name: "BASE_API_URL",
                      value: config.requireSecret("baseApiUrl"),
                    },
                    {
                      name: "EXPO_API_URL",
                      value: config.requireSecret("expoApiUrl"),
                    },
                  ],

                  command: ["sh", "-c"],
                  args: [
                    "tsx apps/ingest/src/index.ts; curl -s http://localhost:9091/quitquitquit",
                  ],

                  resources: {
                    requests: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                    limits: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
                {
                  name: "cloudsql-proxy",
                  image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
                  args: [
                    "--private-ip",
                    "--port=5432",
                    pgDatabaseInstance.connectionName,
                    "--quitquitquit",
                    "--exit-zero-on-sigterm",
                  ],
                  securityContext: {
                    runAsNonRoot: true,
                  },
                  resources: {
                    requests: {
                      cpu: isProd ? "25m" : "5m",
                      memory: isProd ? "64Mi" : "32Mi",
                      "ephemeral-storage": "1Gi",
                    },
                    limits: {
                      cpu: isProd ? "25m" : "5m",
                      memory: isProd ? "64Mi" : "32Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProvider,
    dependsOn: [migrationJob],
  },
);

const playerLabels = { app: `probable-player-${env}` };

const playerJob = new k8s.batch.v1.CronJob(
  playerLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 6 * 2,3,4,5,6,7,8,9,10,11,12 *",
      jobTemplate: {
        spec: {
          activeDeadlineSeconds: 20 * 60,
          backoffLimit: 3,
          parallelism: 1,
          completions: 1,
          template: {
            spec: {
              restartPolicy: "OnFailure",
              imagePullSecrets: [
                { name: regcred.metadata.apply((m) => m.name) },
              ],
              serviceAccountName: ksa.metadata.apply((m) => m.name),
              containers: [
                {
                  name: playerLabels.app,

                  image: `ghcr.io/tmlamb/probable-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "DATABASE_URL",
                      valueFrom: {
                        secretKeyRef: {
                          name: dbcred.metadata.apply((m) => m.name),
                          key: "databaseUrl",
                        },
                      },
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "pitchers,games",
                    },
                    {
                      name: "BASE_API_URL",
                      value: config.requireSecret("baseApiUrl"),
                    },
                    {
                      name: "EXPO_API_URL",
                      value: config.requireSecret("expoApiUrl"),
                    },
                  ],

                  command: ["sh", "-c"],
                  args: [
                    "tsx apps/ingest/src/index.ts; curl -s http://localhost:9091/quitquitquit",
                  ],

                  resources: {
                    requests: {
                      cpu: isProd ? "100m" : "50m",
                      memory: isProd ? "512Mi" : "256Mi",
                      "ephemeral-storage": "1Gi",
                    },
                    limits: {
                      cpu: isProd ? "100m" : "50m",
                      memory: isProd ? "512Mi" : "256Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
                {
                  name: "cloudsql-proxy",
                  image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
                  args: [
                    "--private-ip",
                    "--port=5432",
                    pgDatabaseInstance.connectionName,
                    "--quitquitquit",
                    "--exit-zero-on-sigterm",
                  ],
                  securityContext: {
                    runAsNonRoot: true,
                  },
                  resources: {
                    requests: {
                      cpu: isProd ? "25m" : "5m",
                      memory: isProd ? "64Mi" : "32Mi",
                      "ephemeral-storage": "1Gi",
                    },
                    limits: {
                      cpu: isProd ? "25m" : "5m",
                      memory: isProd ? "64Mi" : "32Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProvider,
    dependsOn: [migrationJob],
  },
);

const notifyLabels = { app: `probable-notify-${env}` };

const notifyJob = new k8s.batch.v1.CronJob(
  notifyLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0,30 * * 2,3,4,5,6,7,8,9,10,11,12 *",
      jobTemplate: {
        spec: {
          activeDeadlineSeconds: 20 * 60,
          backoffLimit: 3,
          parallelism: 1,
          completions: 1,
          template: {
            spec: {
              restartPolicy: "OnFailure",
              imagePullSecrets: [
                { name: regcred.metadata.apply((m) => m.name) },
              ],
              serviceAccountName: ksa.metadata.apply((m) => m.name),
              containers: [
                {
                  name: notifyLabels.app,

                  image: `ghcr.io/tmlamb/probable-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "DATABASE_URL",
                      valueFrom: {
                        secretKeyRef: {
                          name: dbcred.metadata.apply((m) => m.name),
                          key: "databaseUrl",
                        },
                      },
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "games,notifications",
                    },
                    {
                      name: "BASE_API_URL",
                      value: config.requireSecret("baseApiUrl"),
                    },
                    {
                      name: "EXPO_API_URL",
                      value: config.requireSecret("expoApiUrl"),
                    },
                  ],

                  command: ["sh", "-c"],
                  args: [
                    "tsx apps/ingest/src/index.ts; curl -s http://localhost:9091/quitquitquit",
                  ],

                  resources: {
                    requests: {
                      cpu: isProd ? "100m" : "50m",
                      memory: isProd ? "512Mi" : "256Mi",
                      "ephemeral-storage": "1Gi",
                    },
                    limits: {
                      cpu: isProd ? "100m" : "50m",
                      memory: isProd ? "512Mi" : "256Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
                {
                  name: "cloudsql-proxy",
                  image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
                  args: [
                    "--private-ip",
                    "--port=5432",
                    pgDatabaseInstance.connectionName,
                    "--quitquitquit",
                    "--exit-zero-on-sigterm",
                  ],
                  securityContext: {
                    runAsNonRoot: true,
                  },
                  resources: {
                    requests: {
                      cpu: isProd ? "25m" : "5m",
                      memory: isProd ? "64Mi" : "32Mi",
                      "ephemeral-storage": "1Gi",
                    },
                    limits: {
                      cpu: isProd ? "25m" : "5m",
                      memory: isProd ? "64Mi" : "32Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProvider,
    dependsOn: [migrationJob],
  },
);

const appleClientSecret = pulumi
  .all([
    config.requireSecret("appleTeamId"),
    config.requireSecret("appleKeyId"),
    config.requireSecret("applePrivateKey"),
    config.requireSecret("appleServiceId"),
  ])
  .apply(([teamId, keyId, privateKey, clientId]) =>
    generateSecret({ teamId, keyId, privateKey, clientId }),
  );

const appLabels = { app: `probable-nextjs-${env}` };

const appDeployment = new k8s.apps.v1.Deployment(
  appLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      strategy: {
        type: "RollingUpdate",
        rollingUpdate: {
          maxSurge: 1,
          maxUnavailable: 1,
        },
      },
      selector: { matchLabels: appLabels },
      replicas: replicas,
      template: {
        metadata: { labels: appLabels },
        spec: {
          imagePullSecrets: [{ name: regcred.metadata.apply((m) => m.name) }],
          serviceAccountName: ksa.metadata.apply((m) => m.name),
          containers: [
            {
              name: appLabels.app,
              image: `ghcr.io/tmlamb/probable-nextjs:${
                changedNextjs ? imageTag : "latest"
              }`,

              ports: [{ name: "http", containerPort: 3000 }],
              resources: {
                requests: {
                  cpu: isProd ? "25m" : "5m",
                  memory: isProd ? "256Mi" : "128Mi",
                },
                limits: {
                  cpu: isProd ? "100m" : "50m",
                  memory: isProd ? "512Mi" : "256Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
              livenessProbe: {
                httpGet: { path: "/api/health", port: "http" },
              },
              readinessProbe: {
                httpGet: { path: "/signin", port: "http" },
              },
              env: [
                {
                  name: "DATABASE_URL",
                  valueFrom: {
                    secretKeyRef: {
                      name: dbcred.metadata.apply((m) => m.name),
                      key: "databaseUrl",
                    },
                  },
                },
                {
                  name: "AUTH_GOOGLE_ID",
                  value: config.requireSecret("authGoogleClientId"),
                },
                {
                  name: "AUTH_GOOGLE_SECRET",
                  value: config.requireSecret("authGoogleClientSecret"),
                },
                {
                  name: "AUTH_APPLE_BUNDLE_ID",
                  value: config.requireSecret("appleClientId"),
                },
                {
                  name: "AUTH_APPLE_SERVICE_ID",
                  value: config.requireSecret("appleServiceId"),
                },
                {
                  name: "AUTH_APPLE_SECRET",
                  value: appleClientSecret,
                },
                {
                  name: "BETTER_AUTH_SECRET",
                  value: config.requireSecret("betterAuthSecret"),
                },
                {
                  name: "BETTER_AUTH_URL",
                  value: config.requireSecret("betterAuthUrl"),
                },
              ],
            },
            {
              name: "cloudsql-proxy",
              image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
              args: [
                "--private-ip",
                "--port=5432",
                pgDatabaseInstance.connectionName,
              ],
              securityContext: {
                runAsNonRoot: true,
              },
              resources: {
                limits: {
                  cpu: isProd ? "25m" : "5m",
                  memory: isProd ? "64Mi" : "32Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    provider: clusterProvider,
    dependsOn: [migrationJob],
  },
);

const appHpa = new k8s.autoscaling.v2.HorizontalPodAutoscaler(
  `probable-hpa-${env}`,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      scaleTargetRef: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        name: appDeployment.metadata.apply((m) => m.name),
      },
      minReplicas: replicas,
      maxReplicas: isProd ? 3 : 1,
      metrics: [
        {
          type: "Resource",
          resource: {
            name: "cpu",
            target: {
              type: "Utilization",
              averageUtilization: 80,
            },
          },
        },
      ],
    },
  },
  { provider: clusterProvider },
);

const armorPolicy = new gcp.compute.SecurityPolicy(
  `probable-armor-policy-${env}`,
  {
    description: "Rate limiting policy for the application",
    rules: [
      {
        action: "rate_based_ban",
        priority: 1000,
        match: {
          versionedExpr: "SRC_IPS_V1",
          config: {
            srcIpRanges: ["*"],
          },
        },
        rateLimitOptions: {
          conformAction: "allow",
          exceedAction: "deny(429)",
          rateLimitThreshold: {
            count: 200,
            intervalSec: 60,
          },
          banDurationSec: 300,
        },
        description: "Rate limit requests from any single IP",
      },
      {
        action: "allow",
        priority: 2147483647,
        match: {
          versionedExpr: "SRC_IPS_V1",
          config: {
            srcIpRanges: ["*"],
          },
        },
      },
    ],
  },
);

// Config for API, SSR pages, etc. (NO CACHING, BUT WITH SECURITY)
const defaultBackendConfig = new k8s.apiextensions.CustomResource(
  `probable-default-backend-config-${env}`,
  {
    apiVersion: "cloud.google.com/v1",
    kind: "BackendConfig",
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      cdn: {
        enabled: false, // Disable CDN for default traffic
      },
      securityPolicy: {
        name: armorPolicy.name, // Apply security to the main entrypoint
      },
    },
  },
  { provider: clusterProvider },
);

// Config for Next.js optimized images
const imageBackendConfig = new k8s.apiextensions.CustomResource(
  `probable-image-backend-config-${env}`,
  {
    apiVersion: "cloud.google.com/v1",
    kind: "BackendConfig",
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      cdn: {
        enabled: true,
        cachePolicy: {
          includeHost: true,
          includeProtocol: true,
          queryStringWhitelist: ["url", "w", "q"],
        },
      },
    },
  },
  { provider: clusterProvider },
);

// Config for static assets (JS, CSS, etc.)
const staticBackendConfig = new k8s.apiextensions.CustomResource(
  `probable-static-backend-config-${env}`,
  {
    apiVersion: "cloud.google.com/v1",
    kind: "BackendConfig",
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      cdn: {
        enabled: true,
        // Cache for one year, as filenames have hashes
        clientTtl: 31536000,
        defaultTtl: 31536000,
      },
    },
  },
  { provider: clusterProvider },
);

// Default service for API and pages
const appServiceDefault = new k8s.core.v1.Service(
  `${appLabels.app}-default`,
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        "cloud.google.com/backend-config": pulumi.interpolate`{"default": "${defaultBackendConfig.metadata.name}"}`,
      },
    },
    spec: {
      ports: [{ port: 80, targetPort: 3000 }],
      selector: appLabels,
    },
  },
  { provider: clusterProvider },
);

// Service for Next.js images
const appServiceImage = new k8s.core.v1.Service(
  `${appLabels.app}-image`,
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        "cloud.google.com/backend-config": pulumi.interpolate`{"default": "${imageBackendConfig.metadata.name}"}`,
      },
    },
    spec: {
      ports: [{ port: 80, targetPort: 3000 }],
      selector: appLabels,
    },
  },
  { provider: clusterProvider },
);

// Service for static assets
const appServiceStatic = new k8s.core.v1.Service(
  `${appLabels.app}-static`,
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        "cloud.google.com/backend-config": pulumi.interpolate`{"default": "${staticBackendConfig.metadata.name}"}`,
      },
    },
    spec: {
      ports: [{ port: 80, targetPort: 3000 }],
      selector: appLabels,
    },
  },
  { provider: clusterProvider },
);

const ipAddress = new gcp.compute.GlobalAddress(`probable-address-${env}`, {
  project: gcp.config.project,
  addressType: "EXTERNAL",
});

const managedCertificate = new k8s.apiextensions.CustomResource(
  `probable-certificate-${env}`,
  {
    apiVersion: "networking.gke.io/v1",
    kind: "ManagedCertificate",
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      domains: [...domains],
    },
  },
  {
    provider: clusterProvider,
  },
);

const httpsRedirect = new k8s.apiextensions.CustomResource(
  `probable-https-redirect-${env}`,
  {
    apiVersion: "networking.gke.io/v1beta1",
    kind: "FrontendConfig",
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      redirectToHttps: {
        enabled: true,
        responseCodeName: "MOVED_PERMANENTLY_DEFAULT",
      },
    },
  },
  {
    provider: clusterProvider,
  },
);

const ingress = new k8s.networking.v1.Ingress(
  `probable-ingress-${env}`,
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        "kubernetes.io/ingress.class": "gce",
        "kubernetes.io/ingress.global-static-ip-name": ipAddress.name,
        "networking.gke.io/managed-certificates":
          managedCertificate.metadata.apply((m) => m.name),
        "networking.gke.io/v1beta1.FrontendConfig":
          httpsRedirect.metadata.apply((m) => m.name),
      },
    },
    spec: {
      rules: [
        ...domains.map((domain) => {
          const rule = {
            host: domain,
            http: {
              paths: [
                {
                  path: "/_next/image",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: appServiceImage.metadata.name,
                      port: { number: 80 },
                    },
                  },
                },
                // Rule for static assets
                {
                  path: "/_next/static",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: appServiceStatic.metadata.name,
                      port: { number: 80 },
                    },
                  },
                },
                // Default catch-all rule (MUST BE LAST)
                {
                  path: "/*",
                  pathType: "ImplementationSpecific",
                  backend: {
                    service: {
                      name: appServiceDefault.metadata.name,
                      port: { number: 80 },
                    },
                  },
                },
              ],
            },
          };
          return rule;
        }),
      ],
    },
  },
  {
    provider: clusterProvider,
  },
);
