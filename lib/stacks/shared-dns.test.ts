import { expect as expectCDK, haveResource, stringLike } from '@aws-cdk/assert'
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
  })

  it('contains an MX record for personal email', () => {
    expectCDK(stack).to(
      haveResource('AWS::Route53::RecordSet', {
        Name: 'bertie.dev.',
        Type: 'MX',
        HostedZoneId: {
          Ref: stringLike('BertieDevZone*'),
        },
        ResourceRecords: ['10 in1-smtp.messagingengine.com', '20 in2-smtp.messagingengine.com'],
        TTL: '1800',
      }),
    )
  })

  it('contains an TXT record for personal email', () => {
    expectCDK(stack).to(
      haveResource('AWS::Route53::RecordSet', {
        Name: 'bertie.dev.',
        Type: 'TXT',
        HostedZoneId: {
          Ref: stringLike('BertieDevZone*'),
        },
        ResourceRecords: ['"v=spf1 include:spf.messagingengine.com ?all"'],
        TTL: '1800',
      }),
    )
  })
})
