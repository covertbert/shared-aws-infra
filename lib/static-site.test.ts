import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { StaticSiteStack } from '../lib'

describe('StaticSiteStack', () => {
  it('creates a CloudFormation template with the correct resources', () => {
    const app = new cdk.App()

    const stack = new StaticSiteStack(app, 'test-site', {
      recordName: 'www',
      domainName: 'example.dev',
      certificateARN:
        'arn:aws:acm:us-east-1:515213366596:certificate/904b7400-ca9a-4f45-8f77-91deccfd79c1',
    })

    expectCDK(stack).to(
      haveResourceLike('AWS::S3::Bucket', {
        BucketName: 'test-site-artifacts',
      }),
    )

    expectCDK(stack).to(haveResource('AWS::S3::BucketPolicy'))

    expectCDK(stack).to(
      haveResourceLike('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          Aliases: ['example.dev', 'www.example.dev'],
        },
      }),
    )

    expectCDK(stack).to(haveResource('AWS::CloudFront::CloudFrontOriginAccessIdentity'))

    expectCDK(stack).to(
      haveResource('AWS::Route53::HostedZone', {
        Name: 'example.dev.',
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::Route53::RecordSet', {
        Name: 'www.example.dev.',
        Type: 'A',
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::Route53::RecordSet', {
        Name: 'example.dev.',
        Type: 'A',
      }),
    )
  })
})
