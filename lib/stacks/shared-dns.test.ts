import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { SharedDnsStack } from '.'

describe('SharedDnsStack', () => {
  const recordName = 'www'
  const domainName = 'example.dev'
  const fullDomain = [recordName, domainName].join('.')

  const app = new cdk.App()

  const stack = new SharedDnsStack(app, 'TestDNS', {
    recordName: 'www',
    domainName: 'example.dev',
    certificateARN:
      'arn:aws:acm:us-east-1:515213366596:certificate/904b7400-ca9a-4f45-8f77-91deccfd79c1',
  })

  it('creates a hosted zone with the correct records', () => {
    expectCDK(stack).to(
      haveResource('AWS::Route53::HostedZone', {
        Name: `${domainName}.`,
      }),
    )

    expectCDK(stack).to(haveResource('AWS::Route53::RecordSet'))
  })
})
