import { Stack, App, StackProps } from '@aws-cdk/core'
import { LogGroup } from '@aws-cdk/aws-logs'
import {
  Cluster,
  TaskDefinition,
  Compatibility,
  NetworkMode,
  ContainerImage,
  LogDriver,
  FargateService,
} from '@aws-cdk/aws-ecs'

type ExtendedStackProps = StackProps & {
  name: string
  vpcID: string
  subnets: string[]
}

export class GrafanaStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const { name, vpcID, subnets } = props

    console.log(name, vpcID, subnets)

    const logGroup = new LogGroup(this, `${name}-log-group`, {
      logGroupName: '/ecs/grafana-fargate',
    })

    const ecsCluster = new Cluster(this, `${name}-fargate-cluster`, {
      clusterName: 'grafana-fargate-cluster',
    })

    const taskDefinition = new TaskDefinition(this, `${name}-task-definition`, {
      family: 'grafana-fargate-demo',
      compatibility: Compatibility.FARGATE,
      networkMode: NetworkMode.AWS_VPC,
      memoryMiB: '512',
      cpu: '256',
    })

    const container = taskDefinition.addContainer(`${name}-container`, {
      image: ContainerImage.fromRegistry('grafana/grafana'),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: LogDriver.awsLogs({ logGroup: logGroup, streamPrefix: 'dashboard' }),
    })

    container.addPortMappings({ containerPort: 3000 })

    new FargateService(this, `${name}-fargate-service`, {
      taskDefinition: taskDefinition,
      cluster: ecsCluster,
      serviceName: `${name}-service`,
      desiredCount: 1,
      assignPublicIp: true,
    })
  }
}
