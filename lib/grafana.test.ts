import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { GrafanaStack } from './grafana'

describe('CertificatesStack', () => {
  const app = new cdk.App()
  const stack = new GrafanaStack(app, 'certificates', { name: 'grafana-test' })

  it('creates a log group with the correct config', () => {
    expectCDK(stack).to(
      haveResource('AWS::Logs::LogGroup', {
        LogGroupName: '/ecs/grafana-fargate',
        RetentionInDays: 731,
      }),
    )
  })

  it('creates an ECS cluster', () => {
    expectCDK(stack).to(haveResource('AWS::ECS::Cluster'))
  })

  it('creates task definition', () => {
    expectCDK(stack).to(haveResource('AWS::ECS::TaskDefinition'))
  })
})
