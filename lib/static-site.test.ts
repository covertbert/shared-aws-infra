import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { StaticSiteStack } from '../lib'

describe('StaticSiteStack', () => {
  it('creates a CloudFormation template with the correct resources', () => {
    const app = new cdk.App()

    const stack = new StaticSiteStack(app, 'test-site')

    expectCDK(stack).to(haveResource('AWS::S3::Bucket'))
    expectCDK(stack).to(haveResource('AWS::S3::BucketPolicy'))
    expectCDK(stack).to(haveResource('AWS::CloudFront::Distribution'))
    expectCDK(stack).to(haveResource('AWS::CloudFront::CloudFrontOriginAccessIdentity'))
  })
})
