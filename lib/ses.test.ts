import { expect as expectCDK, haveResourceLike, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { SESStack } from '../lib'

describe('SESStack', () => {
  const stackName = 'fun-test-ses'
  const forwardingAddress = 'nala@beans.com'

  const app = new cdk.App()

  const stack = new SESStack(app, stackName, {
    env: { region: 'us-east-1' },
    forwardingAddress,
  })

  it('creates an SNS topic with the correct subscription', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::SNS::Topic', {
        DisplayName: 'EmailForwarding',
        TopicName: `${stackName}-email-forwarding`,
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::SNS::Subscription', {
        Protocol: 'email',
        Endpoint: forwardingAddress,
      }),
    )
  })

  it('creates an S3 bucket with the correct name and policy attached', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::S3::Bucket', {
        BucketName: `${stackName}-emails`,
      }),
    )
    expectCDK(stack).to(haveResource('AWS::S3::BucketPolicy'))
  })

  it('creates a receipt rule with the correct action', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::SES::ReceiptRule', {
        Rule: {
          Actions: [
            {
              S3Action: {},
            },
            {
              SNSAction: {},
            },
          ],
        },
      }),
    )
  })
})
