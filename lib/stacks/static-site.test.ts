import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { StaticSiteStack } from './'

describe('StaticSiteStack', () => {
  const stackName = 'test-site'
  const recordName = 'www'
  const domainName = 'example.dev'
  const fullDomain = [recordName, domainName].join('.')

  const app = new cdk.App()

  const stack = new StaticSiteStack(app, stackName, {
    recordName: 'www',
    domainName: 'example.dev',
    certificateARN:
      'arn:aws:acm:us-east-1:515213366596:certificate/904b7400-ca9a-4f45-8f77-91deccfd79c1',
  })

  it('creates an S3 bucket with the correct policy', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::S3::Bucket', {
        BucketName: `${stackName}-artifacts`,
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetBucket*', 's3:GetObject*', 's3:List*'],
            },
          ],
        },
      }),
    )
  })

  it('creates a CloudFront distribution with the correct OAI', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          Aliases: [domainName, fullDomain],
        },
      }),
    )
    expectCDK(stack).to(haveResource('AWS::CloudFront::CloudFrontOriginAccessIdentity'))
  })

  it('creates a hosted zone with the correct records', () => {
    expectCDK(stack).to(
      haveResource('AWS::Route53::HostedZone', {
        Name: `${domainName}.`,
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::Route53::RecordSet', {
        Name: `${fullDomain}.`,
        Type: 'A',
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::Route53::RecordSet', {
        Name: `${domainName}.`,
        Type: 'A',
      }),
    )

    expectCDK(stack).to(haveResource('AWS::Route53::RecordSet'))
  })
})
