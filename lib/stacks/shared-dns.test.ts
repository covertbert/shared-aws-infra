import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { SharedDnsStack } from './shared-dns'

describe('SharedDnsStack', () => {
  const domainName = 'bertie.dev'

  const app = new cdk.App()

  const stack = new SharedDnsStack(app, 'TestDNS')

  it('creates a hosted zone with the correct records', () => {
    expectCDK(stack).to(
      haveResource('AWS::Route53::HostedZone', {
        Name: `${domainName}.`,
      }),
    )

    expectCDK(stack).to(haveResource('AWS::Route53::RecordSet'))
  })
})
