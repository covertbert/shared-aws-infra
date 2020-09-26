import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { Route53Stack } from '../lib'

describe('Route53Stack', () => {
  it('creates the correct CloudFormation template', () => {
    const app = new cdk.App()

    const stack = new Route53Stack(app, 'route-53')

    expectCDK(stack).to(
      haveResource('AWS::Route53::HostedZone', {
        Name: 'bertie.dev.',
      }),
    )

    expectCDK(stack).to(
      haveResource('AWS::Route53::RecordSet', {
        Name: 'www.bertie.dev.',
        Type: 'A',
        AliasTarget: {
          DNSName: 'd1o1jqyrcd342e.cloudfront.net',
          HostedZoneId: 'Z2FDTNDATAQYW2',
        },
        HostedZoneId: {
          Ref: 'BertieDevZone2892EEB1',
        },
      }),
    )

    expectCDK(stack).to(
      haveResource('AWS::Route53::RecordSet', {
        Name: 'bertie.dev.',
        Type: 'A',
        AliasTarget: {
          DNSName: 'www.bertie.dev',
          HostedZoneId: {
            Ref: 'BertieDevZone2892EEB1',
          },
        },
        HostedZoneId: {
          Ref: 'BertieDevZone2892EEB1',
        },
      }),
    )
  })
})
