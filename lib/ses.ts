import { Stack, App, StackProps } from '@aws-cdk/core'
import { ReceiptRuleSet } from '@aws-cdk/aws-ses'
import { S3, Sns, EmailEncoding } from '@aws-cdk/aws-ses-actions'
import { Bucket } from '@aws-cdk/aws-s3'
import { Topic } from '@aws-cdk/aws-sns'
import { EmailSubscription } from '@aws-cdk/aws-sns-subscriptions'

type ExtendedProps = StackProps & {
  forwardingAddress: string
}

export class SESStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedProps) {
    super(scope, id, props)

    const BUCKET_NAME = `${id}-emails`

    const emailForwardingTopic = new Topic(this, 'EmailForwarding', {
      displayName: 'EmailForwarding',
      topicName: `${id}-email-forwarding`,
    })
    emailForwardingTopic.addSubscription(new EmailSubscription(props.forwardingAddress))

    const bucket = new Bucket(this, 'SESBucket', {
      bucketName: BUCKET_NAME,
    })

    new ReceiptRuleSet(this, 'SESRuleSet', {
      receiptRuleSetName: `${id}-rule-set`,
      rules: [
        {
          enabled: true,
          receiptRuleName: `${id}-s3-rule`,
          actions: [
            new S3({
              bucket,
              objectKeyPrefix: 'emails/',
            }),
            new Sns({ encoding: EmailEncoding.UTF8, topic: emailForwardingTopic }),
          ],
        },
      ],
    })
  }
}
