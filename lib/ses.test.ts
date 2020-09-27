import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { SESStack } from '../lib'

describe('SESStack', () => {
  it('creates the correct CloudFormation template', () => {
    const app = new cdk.App()

    const stack = new SESStack(app, 'bertie-blackman-ses', { env: { region: 'us-east-1' } })

    expectCDK(stack).to(haveResource('AWS::S3::Bucket'))
    expectCDK(stack).to(haveResource('AWS::S3::BucketPolicy'))
    expectCDK(stack).to(haveResource('AWS::SES::ReceiptRule'))
  })
})
